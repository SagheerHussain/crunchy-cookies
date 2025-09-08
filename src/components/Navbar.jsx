import React, { useEffect, useState } from "react";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MenuListBox from "./MenuListBox";
import BottomNavigation from "./BottomNavigation";

export default function Navbar() {
  const { t, i18n } = useTranslation("translation");
  const dir = t("dir") || "ltr";
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // sync document dir with i18n
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(() => {
    if (menuOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // lock scroll
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";

      // reserve space for scrollbar to avoid layout shift
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      // reset everything
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

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
            <Link
              to={`/cart/29421784161`}
              className={`${
                location.pathname.includes("cart")
                  ? "bg-primary"
                  : "bg-transparent"
              } border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.cart")}
            >
              <PiShoppingCartSimpleLight
                className={`text-[20px] ${
                  location.pathname.includes("cart")
                    ? "text-white"
                    : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  location.pathname.includes("cart")
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("navbar.cart")}
              </span>
            </Link>

            <Link
              to={`/wishlist/29421784161`}
              className={`${
                location.pathname.includes("wishlist")
                  ? "bg-primary"
                  : "bg-transparent"
              } border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.favorite")}
            >
              <FiHeart
                className={`text-[18px] ${
                  location.pathname.includes("wishlist")
                    ? "text-white"
                    : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  location.pathname.includes("wishlist")
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("navbar.favorite")}
              </span>
            </Link>

            <Link
              to={`/member/29421784161`}
              className={`${
                location.pathname.includes("member")
                  ? "bg-primary"
                  : "bg-transparent"
              } border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.member")}
            >
              <FiUser
                className={`text-[18px] ${
                  location.pathname.includes("member")
                    ? "text-white"
                    : "text-primary"
                }`}
              />
              <span
                className={`font-medium ${
                  location.pathname.includes("member")
                    ? "text-white"
                    : "text-black"
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
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
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
