import React, { useEffect, useState } from "react";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MenuListBox from "./MenuListBox";
import BottomNavigation from "./BottomNavigation";

const CART_KEY = "cart";

export default function Navbar() {
  const { t } = useTranslation("translation");
  const dir = t("dir") || "ltr";
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ---------- helpers ---------- */
  const readCartCount = () => {
    try {
      const arr = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  };

  /* ---------- dir sync ---------- */
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  /* ---------- monkey-patch: fire custom event on same-tab updates ---------- */
  useEffect(() => {
    const _setItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      _setItem.apply(this, arguments);
      if (key === CART_KEY) {
        window.dispatchEvent(new Event("cart:updated"));
      }
    };
    return () => {
      localStorage.setItem = _setItem;
    };
  }, []);

  /* ---------- hydrate on mount ---------- */
  useEffect(() => {
    setCartCount(readCartCount());
  }, []);

  /* ---------- also refresh on route change (fallback) ---------- */
  useEffect(() => {
    setCartCount(readCartCount());
  }, [location.pathname]);

  /* ---------- listen to cross-tab + custom events ---------- */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY) setCartCount(readCartCount());
    };
    const onCustom = () => setCartCount(readCartCount());

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onCustom);
    };
  }, []);

  /* ---------- active states for buttons (only style) ---------- */
  const isCart = location.pathname.includes("cart");
  const isWishlist = location.pathname.includes("wishlist");
  const isMember = location.pathname.includes("member");

  return (
    <nav className="navbar py-4 relative">
      <div className="custom-container px-4">
        <div className="flex items-center lg:justify-between md:justify-between justify-center lg:gap-0 gap-4 py-4">
          {/* Left cluster */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative border-b border-primary_light_mode flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A]"
              aria-label={t("navbar.menu")}
            >
              <FiMenu className="text-[18px] text-primary" />
              <span className="hidden sm:inline text-black font-medium">
                {t("navbar.menu")}
              </span>
            </button>

            {/* Search pill */}
            <div className="border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A] w-[200px] xl:w-[320px]">
              <FiSearch className="text-[18px] text-primary" />
              <input
                type="text"
                placeholder={t("navbar.search")}
                className="w-full bg-transparent outline-none placeholder:text-black placeholder:font-medium"
                aria-label={t("navbar.search")}
              />
            </div>
          </div>

          {/* Center logo */}
          <Link to={`/`} className="lg:me-0 md:me-16">
            <h1 className="text-[1.3rem] md:text-[2rem] lg:text-[1.5rem] xl:text-4xl 2xl:text-5xl text-primary uppercase">
              {t("logo")}
            </h1>
          </Link>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* CART with square badge (always when count > 0) */}
            <Link
              to={`/cart/29421784161`}
              className={`${
                isCart ? "bg-primary" : "bg-transparent"
              } relative overflow-visible border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.cart")}
            >
              {/* Badge */}
              {cartCount > 0 && (
                <span
                  className={[
                    "absolute",
                    dir === "rtl" ? "-top-2 -left-2" : "-top-2 -right-2",
                    "min-w-[18px] h-[18px] px-[3px]",
                    "rounded-md text-[10px] leading-[18px] font-semibold",
                    // keep badge visible regardless of active route
                    "bg-primary text-white border border-white/70 shadow-sm",
                    "text-center pointer-events-none z-10",
                  ].join(" ")}
                  aria-label={`${cartCount} ${t("navbar.items") || "items"}`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}

              <PiShoppingCartSimpleLight
                className={`text-[20px] ${
                  isCart ? "text-white" : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  isCart ? "text-white" : "text-black"
                }`}
              >
                {t("navbar.cart")}
              </span>
            </Link>

            <Link
              to={`/wishlist/29421784161`}
              className={`${
                isWishlist ? "bg-primary" : "bg-transparent"
              } border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.favorite")}
            >
              <FiHeart
                className={`text-[18px] ${
                  isWishlist ? "text-white" : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  isWishlist ? "text-white" : "text-black"
                }`}
              >
                {t("navbar.favorite")}
              </span>
            </Link>

            <Link
              to={`/member/29421784161`}
              className={`${
                isMember ? "bg-primary" : "bg-transparent"
              } border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.member")}
            >
              <FiUser
                className={`text-[18px] ${
                  isMember ? "text-white" : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  isMember ? "text-white" : "text-black"
                }`}
              >
                {t("navbar.member")}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Drawer + Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <MenuListBox
              key="drawer"
              dir={dir}
              onClose={() => setMenuOpen(false)}
              onLinkClick={() => setMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="md:hidden block">
        <BottomNavigation />
      </div>
    </nav>
  );
}
