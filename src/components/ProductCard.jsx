import React, { useEffect, useState } from "react";
import Button from "./Button";
import { FiHeart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CART_KEY = "cart";

const ProductCard = ({ data, product }) => {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar" ? "ar" : "en";
  const [isLiked, setIsLiked] = useState(false);

  // --- Cart state kept in React, hydrated from localStorage on mount
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const initial = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(Array.isArray(initial) ? initial : []);
    } catch {
      setCart([]);
    }
  }, []);

  // Sync if cart changes (this keeps localStorage updated)
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Optional: listen to updates from other tabs/windows
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

  const inCart = cart.some((p) => String(p._id) === String(product._id));

  const handleAddToCart = (id) => {
    // Prefer using 'product' directly instead of re-finding from data
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

  return (
    <div className="relative bg-primary_light_mode rounded-[35px] border-[1px] border-primary/30 flex flex-col items-center transition-shadow duration-300 p-4">
      {/* NOTE: make sure you consistently use _id vs id everywhere */}
      <Link to={`/gift-detail/${product?._id}`} className="w-full">
        <img
          src={product?.featuredImage}
          alt={product?.en_title}
          className="w-full h-[300px] object-cover rounded-[35px] mb-3"
        />
      </Link>

      <div className="absolute top-[calc(100%-92%)] right-[calc(100%-92%)]">
        <button
          className="bg-white p-2 rounded-full"
          onClick={() => setIsLiked(!isLiked)}
        >
          {!isLiked ? (
            <FiHeart size={20} className="text-primary" />
          ) : (
            <FaHeart size={20} className="text-primary" />
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
          }  mt-1`}
        >
          {/* {langClass === "en"
            ? product.en_title.slice(0, 30)
            : product.ar_title.slice(0, 25)}{" "}
          {product.en_title.length > 30 || product.ar_title.length > 30
            ? "..."
            : ""} */}
            {product?.title}
        </h5>

        <div className="card-content-btn flex justify-end">
          {inCart ? (
            <Button
              onClick={() => handleRemoveFromCart(product._id)}
              label={`${langClass === "ar" ? "إزالة من السلة" : "Remove From Cart"}`}
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
