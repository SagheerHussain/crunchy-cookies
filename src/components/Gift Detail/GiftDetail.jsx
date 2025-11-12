// client/src/pages/GiftDetail/GiftDetail.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { TbShoppingCart } from "react-icons/tb";
import FrequentlyBuyGifts from "./FrequentlyBuyGifts";
import { useTranslation } from "react-i18next";
import { useGiftDetail } from "../../hooks/products/useProducts";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useCartFlag } from "../../context/CartContext";

// cart hooks
import { useCartByUser } from "../../hooks/cart/useCart";
import {
  useAddItemToCart,
  useRemoveItemFromCart,
} from "../../hooks/cart/useCartMutation";
import Button from "../Button";

const ProductDetail = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { id } = useParams();
  const { setUpdate } = useCartFlag();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const imgWrapRef = useRef(null);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  // toast
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastVariant, setToastVariant] = useState("success"); // "success" | "login"
  const toastInRef = useRef(null);
  const toastOutRef = useRef(null);

  const LENS_SIZE = 160;
  const ZOOM = 2.2;

  const { data: product, isLoading } = useGiftDetail(id);

  // user id from sessionStorage
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("user"));
      if (stored?.user?._id) setUserId(stored.user._id);
    } catch {
      setUserId(null);
    }
  }, []);

  // cart state
  const {
    data: cartRes,
    isLoading: cartLoading,
    isFetching: cartFetching,
  } = useCartByUser(userId);

  const cartItems = useMemo(
    () =>
      cartRes?.data?.items && Array.isArray(cartRes.data.items)
        ? cartRes.data.items
        : [],
    [cartRes]
  );

  const inCart = useMemo(() => {
    const pid = String(product?._id || "");
    return cartItems.some(
      (it) => String(it?.product?._id ?? it?.product) === pid
    );
  }, [cartItems, product?._id]);

  const { mutateAsync: addItemToCart, isPending: addPending } =
    useAddItemToCart();
  const { mutateAsync: removeItemFromCart, isPending: removePending } =
    useRemoveItemFromCart();

  const resolvingCart = cartLoading || cartFetching;
  const mainBtnDisabled = resolvingCart || addPending || removePending;

  // Toast helper (3s, slide from bottom)
  const showToast = (msg, variant = "success") => {
    if (toastInRef.current) clearTimeout(toastInRef.current);
    if (toastOutRef.current) clearTimeout(toastOutRef.current);

    setToast(msg);
    setToastVariant(variant);
    setToastShow(true);

    toastInRef.current = setTimeout(() => {
      setToastShow(false);
      toastOutRef.current = setTimeout(() => setToast(""), 350);
    }, 3000);
  };

  // magnifier handlers
  const handleMouseEnter = () => setIsMagnifying(true);
  const handleMouseLeave = () => setIsMagnifying(false);
  const handleMouseMove = (e) => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const half = LENS_SIZE / 2;
    setLensPos({
      x: Math.max(half, Math.min(relX, rect.width - half)),
      y: Math.max(half, Math.min(relY, rect.height - half)),
    });
  };
  const backgroundSize = (wrap) =>
    wrap
      ? `${wrap.clientWidth * ZOOM}px ${wrap.clientHeight * ZOOM}px`
      : "auto";
  const backgroundPosition = `${-(lensPos.x * ZOOM - LENS_SIZE / 2)}px ${-(
    lensPos.y * ZOOM -
    LENS_SIZE / 2
  )}px`;

  // derived product fields
  const title = isAr ? product?.ar_title || product?.title : product?.title;
  const priceNumber = Number(
    typeof product?.price === "number"
      ? product.price
      : product?.price?.sale || 0
  );
  const priceText = `${
    product?.currency || "QAR"
  } ${priceNumber.toLocaleString()}`;
  const imageUrls =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.map((img) => img?.url).filter(Boolean)
      : product?.featuredImage
      ? [product.featuredImage]
      : [];
  const htmlDescription = isAr
    ? product?.ar_description || product?.description || ""
    : product?.description || product?.ar_description || "";
  const stockText = `${product?.remainingStocks ?? 0} ${
    isAr ? "متوفر" : "in stock"
  }`;
  const categoryText =
    product?.categories?.[0]?.[isAr ? "ar_name" : "name"] ||
    product?.type?.[isAr ? "ar_name" : "name"] ||
    (isAr ? "فئة" : "Category");
  const conditionText = product?.condition || (isAr ? "جديد" : "new");
  const arrangements = Array.isArray(product?.arrangements)
    ? product.arrangements
    : [];

  // stock logic for type-based
  const hasEnoughTypeStock = useMemo(() => {
    const carry = Number(product?.totalPieceCarry || 0);
    if (!Array.isArray(product?.type) || product.type.length === 0) return true;
    return product.type.some((t) => {
      const rem = Number(
        (t && typeof t === "object" ? t.remainingStock : null) ?? Infinity
      );
      return rem > carry;
    });
  }, [product?.type, product?.totalPieceCarry]);

  const isOutOfStock = product?.stockStatus === "out_of_stock";
  const canAddToCart = !isOutOfStock && hasEnoughTypeStock;

  // cart handlers
  const handleAddToCart = async () => {
    // ✅ login check first
    if (!userId) {
      showToast(
        isAr
          ? "الرجاء تسجيل الدخول لاستخدام عربة التسوق"
          : "Please login to use cart",
        "login"
      );
      return;
    }

    if (!product?._id) return;

    await addItemToCart({ user: userId, product: product._id, qty: 1 });
    setUpdate((u) => !u);
    showToast(isAr ? "أُضيفت إلى السلة" : "Added to cart", "success");
  };

  const handleRemoveFromCart = async () => {
    if (!userId || !product?._id) return;
    await removeItemFromCart({ user: userId, productId: product._id });
    setUpdate((u) => !u);
    showToast(isAr ? "أُزيلت من السلة" : "Removed from cart", "success");
  };

  /* ================= RENDER ================= */

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="custom-container">
          <div className="flex items-center justify-center h-64">
            <ClipLoader color="#0fb4bb" size={50} />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-10">
        <div className="custom-container">
          <div className="text-center text-red-600">Product not found.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      {/* Bottom toast (green for success, black for login) */}
      {toast && (
        <div
          className={[
            "fixed left-1/2 bottom-0 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
            toastShow
              ? "bottom-8 translate-y-0 opacity-100"
              : "bottom-0 translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div
            className={`text-white text-sm px-4 py-2 rounded-full shadow-lg ${
              toastVariant === "login"
                ? "bg-black"
                : "bg-green-600"
            }`}
          >
            {toast}
          </div>
        </div>
      )}

      <div className="custom-container">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Images + magnifier */}
          <div className="relative md:w-1/2 xl:w-[40%]">
            <div
              ref={imgWrapRef}
              className="relative w-full rounded-xl h-[500px] overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {imageUrls[activeImgIndex] ? (
                <img
                  src={imageUrls[activeImgIndex]}
                  alt="Product"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-primary/60">
                  No image
                </div>
              )}

              {isMagnifying && imageUrls[activeImgIndex] && (
                <div
                  className="pointer-events-none rounded-full border border-white/70 shadow-xl"
                  style={{
                    position: "absolute",
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    top: `${lensPos.y - LENS_SIZE / 2}px`,
                    left: `${lensPos.x - LENS_SIZE / 2}px`,
                    backgroundImage: `url(${imageUrls[activeImgIndex]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: backgroundSize(imgWrapRef.current),
                    backgroundPosition,
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.3)",
                    backdropFilter: "blur(0.5px)",
                  }}
                />
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="grid grid-cols-3 gap-3">
                  {imageUrls.map((image, index) => (
                    <div className="relative" key={index}>
                      <img
                        src={image}
                        alt={`Additional Product ${index + 1}`}
                        className={`${
                          activeImgIndex === index
                            ? "border-2 border-primary"
                            : ""
                        } rounded-lg object-cover lg:w-[80px] lg:h-[80px] h-[60px] cursor-pointer w-[60px]`}
                        onClick={() => setActiveImgIndex(index)}
                      />
                      <div
                        className={`absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg ${
                          activeImgIndex === index ? "" : "hidden"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 mt-4 md:mt-0 md:w-1/2 xl:w-[60%]">
            <div className="flex items-center justify-between">
              <h5 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary">
                {title}
              </h5>
              <p className="lg:text-md xl:text-3xl font-semibold text-primary">
                {priceText}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-2">
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <CiDeliveryTruck size={18} className="text-primary" />
                {stockText}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <IoLocationOutline size={18} className="text-primary" />
                {categoryText}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <MdOutlineWorkspacePremium size={18} className="text-primary" />
                {isAr ? "الحالة:" : "Condition:"} {conditionText}
              </span>
            </div>

            <div className="description-filled-box mt-6">
              <h5 className="text-white bg-primary inline-block rounded-lg px-4 py-2 text-xs mb-4">
                {isAr ? "وصف" : "Description"}
              </h5>
              <div
                className="text-black text-sm prose max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              {product?.note && (
                <p className="text-sm mt-4">
                  <span className="font-medium text-primary">
                    {isAr ? "ملاحظة:" : "Note:"}
                  </span>{" "}
                  {product.note}
                </p>
              )}
            </div>

            {arrangements.length > 0 && (
              <div className="mt-4 text-gray-600">
                <h6 className="font-medium text-xl mb-4">
                  {isAr
                    ? "يتضمن الترتيب:"
                    : "Arrangement Includes:"}
                </h6>
                <ul className="list-disc pl-5">
                  {arrangements.map((a, idx) => (
                    <li key={idx} className="text-black text-sm mb-2">
                      {isAr ? a?.ar || a?.en || a : a?.en || a?.ar || a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product?.sku && (
              <div className="sku mt-6">
                <h5 className="font-medium text-primary text-xl">
                  {product.sku}
                </h5>
              </div>
            )}

            {/* ACTION BUTTONS (Buy Now & Preview Removed) */}
            <div className="flex xl:w-1/2 items-center gap-4 mt-4">
              {resolvingCart ? (
                <button
                  className="border border-primary bg-primary_light_mode text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2 opacity-60"
                  disabled
                >
                  <ClipLoader size={18} color="#0fb4bb" />
                  {isAr ? "جاري التحقق..." : "Checking..."}
                </button>
              ) : canAddToCart ? (
                inCart ? (
                  <button
                    onClick={handleRemoveFromCart}
                    disabled={mainBtnDisabled}
                    className="border text-white bg-red-500 hover:bg-red-600 border-red-500 text-center font-medium py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2"
                  >
                    <TbShoppingCart size={20} />
                    {isAr ? "إزالة من السلة" : "Remove From Cart"}
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={mainBtnDisabled}
                    className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2"
                  >
                    <TbShoppingCart size={20} />
                    {isAr ? "إضافة إلى السلة" : "Add to Cart"}
                  </button>
                )
              ) : (
                <Button
                  disabled
                  label={isAr ? "إنتهى من المخزن" : "Out Of Stock"}
                  isBgColor={true}
                />
              )}
            </div>
          </div>
        </div>

        {product?.suggestedProducts?.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl text-primary">
              {isAr
                ? "المنتجات الأكثر شراءًا معاً"
                : "Frequently Bought Together"}
            </h3>
            <div className="mt-4 border border-primary rounded-3xl">
              <FrequentlyBuyGifts
                data={product}
                product={product?.suggestedProducts}
                userId={userId}
                onToast={showToast}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
