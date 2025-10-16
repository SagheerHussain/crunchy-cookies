import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useWishlist } from "../hooks/wishlist/useWishlistQuery";
import {
  useAddWishlist,
  useDeleteWishlist,
} from "../hooks/wishlist/useWishlistMutation";

const CART_KEY = "cart";

const ProductCard = ({ data, product }) => {

  console.log("wishlist", product);

  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar" ? "ar" : "en";

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  // Load logged-in user from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.user) setUser(stored.user);
    } catch {}
  }, []);

  // Cart hydrate/persist
  useEffect(() => {
    try {
      const initial = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(Array.isArray(initial) ? initial : []);
    } catch {
      setCart([]);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          const next = JSON.parse(e.newValue || "[]");
          setCart(Array.isArray(next) ? next : []);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const userId = user?._id;

  // Fetch wishlist for current user
  const { data: wishlistRes } = useWishlist(userId);
  const wishlistItems = wishlistRes?.data || [];

  // Is this product liked?
  const isLiked = useMemo(
    () =>
      wishlistItems.some(
        (w) => String(w?.product?._id) === String(product?._id)
      ),
    [wishlistItems, product?._id]
  );

  // Mutations
  const { mutateAsync: addWishlist, isPending: addPending } =
    useAddWishlist(userId);
  const { mutateAsync: deleteWishlist, isPending: delPending } =
    useDeleteWishlist(userId);

  // toast helper
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 1800);
  };

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
        await deleteWishlist({ user: userId, product: product?._id }); // body
        showToast(
          langClass === "ar"
            ? "تمت الإزالة من المفضلة"
            : "Removed from wishlist"
        );
      } else {
        await addWishlist({ user: userId, product: product?._id });
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

  const inCart = cart.some((p) => String(p._id) === String(product._id));

  const handleAddToCart = (id) => {
    const item =
      product && String(product._id) === String(id)
        ? product
        : data?.find((p) => String(p._id) === String(id));
    if (!item) return;

    setCart((prev) => {
      const idx = prev.findIndex((p) => String(p._id) === String(id));
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: (next[idx].qty ?? 1) + 1 };
        return next;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((p) => String(p._id) !== String(id)));
  };

  const safeTitleEn = product?.title || "";
  const safeTitleAr = product?.ar_title || "";

  return (
    <div className="relative bg-primary_light_mode rounded-[35px] border-[1px] border-primary/30 flex flex-col items-center transition-shadow duration-300 p-4">
      {/* toast */}
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">
          {toastMsg}
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
          {inCart ? (
            <Button
              onClick={() => handleRemoveFromCart(product._id)}
              label={`${
                langClass === "ar" ? "إزالة من السلة" : "Remove From Cart"
              }`}
              bgColor="bg-red-500 hover:bg-red-600"
              isBgColor={true}
            />
          ) : (
            <Button
              onClick={() => handleAddToCart(product._id)}
              label={`${langClass === "ar" ? "أضف إلى السلة" : "Add to cart"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
