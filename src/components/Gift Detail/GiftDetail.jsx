// client/src/pages/GiftDetail/GiftDetail.jsx
import React, { useState, useRef } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { BsBagCheck } from "react-icons/bs";
import { TbShoppingCart } from "react-icons/tb";
import FrequentlyBuyGifts from "./FrequentlyBuyGifts";
import { useTranslation } from "react-i18next";
import { useGiftDetail } from "../../hooks/products/useProducts";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const ProductDetail = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { id } = useParams();

  // ✅ All hooks are called unconditionally and before any early returns
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const imgWrapRef = useRef(null);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const LENS_SIZE = 160;
  const ZOOM = 2.2;

  const { data: product, isLoading } = useGiftDetail(id);

  // Early returns are fine AFTER all hooks
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

  // ------- Derived fields from API -------
  const title = isAr ? product?.ar_title || product?.title : product?.title;
  const priceNumber = Number(product?.price || 0);
  const priceText = `${
    product?.currency || ""
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

  // ------- Magnifier handlers -------
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

  return (
    <section className="py-10">
      <div className="custom-container">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Images */}
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
                {isAr ? "الحالة: " : "Condition: "}
                {conditionText}
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
                <h6
                  className="font-medium text-xl mb-4"
                  style={{ color: "#000 !important" }}
                >
                  {isAr ? "يتضمن الترتيب:" : "Arrangement Includes:"}
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

            <div className="flex xl:w-1/2 items-center justify-center gap-4 mt-4">
              <button className="bg-primary border border-primary hover:border-primary/80 hover:bg-primary/80 text-center w-1/2 font-medium text-white py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
                <BsBagCheck size={20} />
                {isAr ? "شراء الآن" : "Buy Now"}
              </button>
              <button className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
                <TbShoppingCart size={20} />
                {isAr ? "إضافة إلى السلة" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-3xl text-primary">
            {isAr
              ? "المنتجات الأكثر شراءًا معاً"
              : "Frequently Bought Together"}
          </h3>
          <div className="mt-4 border border-primary rounded-3xl">
            <FrequentlyBuyGifts />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
