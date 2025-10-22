// ProductCard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCartFlag } from "../context/CartContext";

// wishlist hooks (unchanged)
import { useWishlist } from "../hooks/wishlist/useWishlistQuery";
import {
  useAddWishlist,
  useDeleteWishlist,
} from "../hooks/wishlist/useWishlistMutation";

// cart hooks (NEW)
import { useCartByUser } from "../hooks/cart/useCart";
import {
  useAddItemToCart,
  useRemoveItemFromCart,
} from "../hooks/cart/useCartMutation";

const ProductCard = ({ data, product }) => {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar" ? "ar" : "en";

  const { setUpdate } = useCartFlag();

  const [user, setUser] = useState(null);

  // ---- animated toast state ----
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastInRef = useRef(null);
  const toastOutRef = useRef(null);

  const showToast = (msg) => {
    if (toastInRef.current) clearTimeout(toastInRef.current);
    if (toastOutRef.current) clearTimeout(toastOutRef.current);

    setToastMsg(msg);
    setToastShow(true); // slide in

    // stay 3s, then slide out; clear text after animation
    toastInRef.current = setTimeout(() => {
      setToastShow(false);
      toastOutRef.current = setTimeout(() => setToastMsg(""), 350);
    }, 3000);
  };

  // Load logged-in user from sessionStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("user"));
      if (stored?.user) setUser(stored.user);
    } catch {}
  }, []);

  const userId = user?._id;

  /* --------------------------- Wishlist logic --------------------------- */
  const { data: wishlistRes } = useWishlist(userId);
  const wishlistItems = wishlistRes?.data || [];
  const isLiked = useMemo(
    () =>
      wishlistItems.some(
        (w) => String(w?.product?._id) === String(product?._id)
      ),
    [wishlistItems, product?._id]
  );
  const { mutateAsync: addWishlist, isPending: addPending } =
    useAddWishlist(userId);
  const { mutateAsync: deleteWishlist, isPending: delPending } =
    useDeleteWishlist(userId);

  const handleToggleWishlist = async () => {
    if (!userId) {
      showToast(
        langClass === "ar"
          ? "الرجاء تسجيل الدخول لقائمة الرغبات"
          : "Please login to use wishlist"
      );
      return;
    }
    try {
      if (isLiked) {
        await deleteWishlist({ user: userId, product: product?._id });
        setUpdate((u) => !u);
        showToast(
          langClass === "ar"
            ? "تمت الإزالة من المفضلة"
            : "Removed from wishlist"
        );
      } else {
        await addWishlist({ user: userId, product: product?._id });
        setUpdate((u) => !u);
        showToast(
          langClass === "ar" ? "أضيفت إلى المفضلة" : "Added to wishlist"
        );
      }
    } catch {
      showToast(
        langClass === "ar" ? "حدث خطأ، حاول مجددًا" : "Something went wrong"
      );
    }
  };

  /* ----------------------------- Cart logic ---------------------------- */
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
    const id = String(product?._id);
    return cartItems.some(
      (it) => String(it?.product?._id ?? it?.product) === id
    );
  }, [cartItems, product?._id]);

  const { mutateAsync: addItemToCart, isPending: addItemPending } =
    useAddItemToCart();
  const { mutateAsync: removeItemFromCart, isPending: removeItemPending } =
    useRemoveItemFromCart();

  const handleAddToCart = async () => {
    if (!userId) {
      showToast(
        langClass === "ar"
          ? "الرجاء تسجيل الدخول لإضافة إلى السلة"
          : "Please login to add to cart"
      );
      return;
    }
    try {
      await addItemToCart({ user: userId, product: product._id, qty: 1 });
      setUpdate((u) => !u);
      showToast(langClass === "ar" ? "أُضيفت إلى السلة" : "Added to cart");
    } catch {
      showToast(
        langClass === "ar"
          ? "تعذر الإضافة، حاول مرة أخرى"
          : "Could not add, try again"
      );
    }
  };

  const handleRemoveFromCart = async () => {
    if (!userId) return;
    try {
      await removeItemFromCart({ user: userId, productId: product._id });
      setUpdate((u) => !u);
      showToast(langClass === "ar" ? "أُزيلت من السلة" : "Removed from cart");
    } catch {
      showToast(
        langClass === "ar"
          ? "تعذر الإزالة، حاول مرة أخرى"
          : "Could not remove, try again"
      );
    }
  };

  const resolvingCart = cartLoading || cartFetching;
  const btnDisabled = resolvingCart || addItemPending || removeItemPending;

  const safeTitleEn = product?.title || "";
  const safeTitleAr = product?.ar_title || "";

  // helper (robust to ids or populated objects)
  const hasEnoughTypeStock = useMemo(() => {
    const carry = Number(product?.totalPieceCarry || 0);

    // if no types on the product, don't block the sale
    if (!Array.isArray(product?.type) || product.type.length === 0) return true;

    // if types are populated, they have remainingStock; if not, treat as OK
    return product.type.some((t) => {
      const rem = Number(
        (t && typeof t === "object" ? t.remainingStock : null) ?? Infinity
      );
      return rem > carry;
    });
  }, [product?.type, product?.totalPieceCarry]);

  const isOutOfStock =
    (data?.stockStatus || product?.stockStatus) === "out_of_stock";

  const canAddToCart = !isOutOfStock && hasEnoughTypeStock;

  return (
    <div className="relative bg-primary_light_mode rounded-[35px] border-[1px] border-primary/30 flex flex-col items-center transition-shadow duration-300 p-4">
      {/* animated toast */}
      {toastMsg && (
        <div
          className={[
            "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
            toastShow
              ? "bottom-8 translate-y-0 opacity-100"
              : "bottom-0 translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toastMsg}
          </div>
        </div>
      )}

      <Link to={`/gift-detail/${product?._id}`} className="w-full">
        <img
          src={product?.featuredImage}
          alt={product?.title}
          className="w-full h-[300px] object-cover rounded-[35px] mb-3"
        />
      </Link>

      <div className="absolute top-[calc(100%-92%)] right-[calc(100%-92%)]">
        <button
          className="bg-white p-2 rounded-full disabled:opacity-60"
          onClick={handleToggleWishlist}
          disabled={addPending || delPending}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLiked ? (
            <FaHeart size={20} className="text-primary" />
          ) : (
            <FiHeart size={20} className="text-primary" />
          )}
        </button>
      </div>

      <div className="card-content w-full">
        <p className="text-primary font-medium text-lg flex items-center">
          Qar <span className="text-2xl ps-2">{product?.price}</span>
        </p>

        <h5
          className={`text-black ${
            langClass === "ar" ? "text-[18px]" : "text-[14px]"
          } mt-1`}
        >
          {langClass === "en"
            ? safeTitleEn.slice(0, 30)
            : safeTitleAr.slice(0, 25)}{" "}
          {safeTitleEn.length > 30 || safeTitleAr.length > 30 ? "..." : ""}
        </h5>

        <div className="card-content-btn flex justify-end">
          {resolvingCart ? (
            <Button
              disabled
              label={langClass === "ar" ? "جاري التحقق..." : "Checking..."}
              isBgColor={true}
            />
          ) : canAddToCart ? (
            inCart ? (
              <Button
                onClick={handleRemoveFromCart}
                disabled={btnDisabled}
                label={
                  langClass === "ar" ? "إزالة من السلة" : "Remove From Cart"
                }
                bgColor="bg-red-500 hover:bg-red-600"
                isBgColor={true}
              />
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={btnDisabled}
                label={langClass === "ar" ? "أضف إلى السلة" : "Add to cart"}
              />
            )
          ) : (
            <Button
              disabled
              label={langClass === "ar" ? "إنتهى من المخزن" : "Out Of Stock"}
              isBgColor={true}
            />
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard;
