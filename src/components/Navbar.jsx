import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import MenuListBox from "./MenuListBox";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { t, i18n } = useTranslation("translation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const location = useLocation();
  console.log(location.pathname);

  // keep document direction in sync with language (dir comes from translations)
  useEffect(() => {
    const dir = t("dir");
    document.documentElement.dir = dir;
  }, [i18n.language, t]);

  // lock scroll when open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  // calc position under the Menu button
  const placeMenu = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const PANEL_WIDTH = 352; // ~22rem
    const GAP = 8;

    const maxLeft = window.innerWidth - PANEL_WIDTH - 16; // 16px margin
    const left = Math.min(r.left + window.scrollX, Math.max(16, maxLeft));
    const top = r.bottom + window.scrollY + GAP;
    setPos({ top, left });
  };

  const openMenu = () => {
    placeMenu();
    setMenuOpen(true);
  };

  // keep anchored on resize/scroll while open
  useEffect(() => {
    if (!menuOpen) return;
    const onScroll = () => placeMenu();
    const onResize = () => placeMenu();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar py-4 relative">
      <div className="custom-container px-4">
        <div className="flex items-center lg:justify-between md:justify-between lg:gap-0 gap-4 py-4">
          {/* Left cluster */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Menu button (anchor) */}
            <button
              ref={btnRef}
              type="button"
              onClick={openMenu}
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
            <Link to={`/cart/29421784161`}
              type="button"
              className={`${location.pathname.includes("cart") ? "bg-primary" : "bg-transparent"} border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.cart")}
            >
              <PiShoppingCartSimpleLight className={`text-[20px] ${location.pathname.includes("cart") ? "text-white" : "text-primary"}`} />
              <span className={`font-medium ${location.pathname.includes("cart") ? "text-white" : "text-black"}`}>{t("navbar.cart")}</span>
            </Link>

            <Link to={`/wishlist/29421784161`}
              type="button"
              className={`${location.pathname.includes("wishlist") ? "bg-primary" : "bg-transparent"} border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.favorite")}
            >
              <FiHeart className={`text-[18px] ${location.pathname.includes("wishlist") ? "text-white" : "text-primary"}`} />
              <span className={`font-medium ${location.pathname.includes("wishlist") ? "text-white" : "text-black"}`}>
                {t("navbar.favorite")}
              </span>
            </Link>

            <Link to={`/member/29421784161`}
              type="button"
              className={`${location.pathname.includes("member") ? "bg-primary" : "bg-transparent"} border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A] ${location.pathname.includes("member") ? "bg-primary" : "bg-transparent"}`}
              aria-label={t("navbar.member")}
            >
              <FiUser className={`text-[18px] ${location.pathname.includes("member") ? "text-white" : "text-primary"}`} />
              <span className={`font-medium ${location.pathname.includes("member") ? "text-white" : "text-black"}`}>
                {t("navbar.member")}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop + anchored panel */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="fixed z-50"
            style={{ top: pos.top, left: pos.left }}
            role="dialog"
            aria-label={t("navbar.menu")}
            onClick={(e) => e.stopPropagation()}
          >
            {/* If MenuListBox also needs translations,
                call useTranslation inside it or pass t/i18n as props */}
            <MenuListBox onClose={() => setMenuOpen(false)} />
          </div>
        </>
      )}
    </nav>
  );
}
