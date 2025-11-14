import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MenuListBox from "./MenuListBox";
import BottomNavigation from "./BottomNavigation";
import { getCartLength } from "../api/cart";
import { useCartFlag } from "../context/CartContext";
import { searchProducts } from "../api/products"; // ✅ NEW

const CART_KEY = "cart";

export default function Navbar() {
  const { t } = useTranslation("translation");
  const { i18n } = useTranslation();

  const isArabic = i18n.language === "ar"

  const dir = t("dir") || "ltr";
  const location = useLocation();
  const navigate = useNavigate();

  const { update } = useCartFlag();
  const { user } = JSON.parse(sessionStorage.getItem("user")) || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Search state
  const [q, setQ] = useState("");
  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Cart Length via API (server-side cart)
  useEffect(() => {
    (async () => {
      const res = await getCartLength(user?._id);
      setCartCount(res?.data?.distinct || 0);
    })();
  }, [location.pathname, update, user?._id]);

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

  /* ---------- Search: click outside to close ---------- */
  useEffect(() => {
    const onDocClick = (e) => {
      if (!panelRef.current || !inputRef.current) return;
      if (
        panelRef.current.contains(e.target) ||
        inputRef.current.contains(e.target)
      )
        return;
      setOpenSearchPanel(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  /* ---------- Search: debounced fetch with cancel ---------- */
  useEffect(() => {
    setSearchError("");

    if (!q.trim()) {
      setSearchResults([]);
      setOpenSearchPanel(false);
      abortRef.current?.abort?.();
      return;
    }

    const t = setTimeout(async () => {
      abortRef.current?.abort?.();
      const controller = new AbortController();
      abortRef.current = controller;

      setSearchLoading(true);
      try {
        const data = await searchProducts(q, {
          limit: 8,
          signal: controller.signal,
        });
        setSearchResults(data?.items || []);
        setOpenSearchPanel(true);
      } catch (err) {
        // ignore aborts
        if (err?.name !== "CanceledError" && err?.message !== "canceled") {
          console.error(err);
          setSearchError("Failed to search. Try again.");
          setOpenSearchPanel(true);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 350); // debounce

    return () => clearTimeout(t);
  }, [q]);

  /* ---------- Search: keyboard handling ---------- */
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter" && q.trim()) {
      setOpenSearchPanel(false);
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
    if (e.key === "Escape") {
      setOpenSearchPanel(false);
      inputRef.current?.blur();
    }
  };

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

            {/* Search pill + Dropdown */}
            <div className="relative w-[200px] xl:w-[320px]">
              <div className="border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A]">
                <FiSearch className="text-[18px] text-primary" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t("navbar.search")}
                  className="w-full bg-transparent outline-none placeholder:text-black placeholder:font-medium"
                  aria-label={t("navbar.search")}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  onFocus={() => q.trim() && setOpenSearchPanel(true)}
                />
              </div>

              {/* Results dropdown */}
              <AnimatePresence>
                {openSearchPanel && (
                  <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 mt-2 w-full hidden lg:block"
                  >
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                      {/* Loading */}
                      {searchLoading && (
                        <div className="px-4 py-3 text-sm text-neutral-500">
                          {t("search.loading") || "Searching…"}
                        </div>
                      )}

                      {/* Error */}
                      {!searchLoading && searchError && (
                        <div className="px-4 py-3 text-sm text-red-600">
                          {searchError}
                        </div>
                      )}

                      {/* Results */}
                      {!searchLoading && !searchError && (
                        <>
                          {searchResults.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-neutral-600">
                              {"No items found"}
                            </div>
                          ) : (
                            <ul className="max-h-[360px] overflow-auto divide-y divide-neutral-100">
                              {searchResults.map((p) => (
                                <li key={p._id}>
                                  <Link
                                    to={`/gift-detail/${p._id}`}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50"
                                    onClick={() => setOpenSearchPanel(false)}
                                  >
                                    {/* thumbnail */}
                                    <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
                                      {p?.featuredImage ? (
                                        <img
                                          src={p.featuredImage}
                                          alt={p.title}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                                          IMG
                                        </div>
                                      )}
                                    </div>
                                    {/* text */}
                                    <div className="min-w-0">
                                      <div className="truncate font-medium text-sm text-neutral-900">
                                        {isArabic ? p.ar_title : p.title}
                                      </div>
                                      <div className="truncate text-xs text-neutral-500">
                                        {(p?.currency || "QAR") +
                                          " " +
                                          Number(
                                            p?.price || 0
                                          ).toLocaleString()}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Footer: view all */}
                          {searchResults.length > 0 && (
                            <div className="px-4 py-2 bg-neutral-50 text-right">
                              <Link
                                to={`/filters/q/${encodeURIComponent(
                                  q.trim()
                                )}`}
                                onClick={() => setOpenSearchPanel(false)}
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                {"View all results"}
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {/* CART */}
            <Link
              to={`/cart/${user?._id}`}
              className={`${
                isCart ? "bg-primary" : "bg-transparent"
              } relative overflow-visible border-b border-primary_light_mode hidden lg:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]`}
              aria-label={t("navbar.cart")}
            >
              {cartCount > 0 && (
                <span
                  className={[
                    "absolute",
                    dir === "rtl" ? "-top-2 -left-2" : "-top-2 -right-2",
                    "min-w-[18px] h-[18px] px-[4px]",
                    "rounded-full text-[10px] leading-[18px] font-semibold",
                    "bg-black text-white border border-white/70 shadow-sm",
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
              to={`/wishlist/${user?._id}`}
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
              to={`/member/${user?._id}/profile`}
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
