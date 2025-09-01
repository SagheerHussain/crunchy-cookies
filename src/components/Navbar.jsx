import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import MenuListBox from "./MenuListBox";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

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
    const GAP = 8;           // 8px gap under button

    // clamp left so panel stays inside viewport
    const maxLeft = window.innerWidth - PANEL_WIDTH - 16; // 16px margin
    const left = Math.min(r.left + window.scrollX, Math.max(16, maxLeft));
    const top  = r.bottom + window.scrollY + GAP;

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
        <div className="flex items-center justify-between py-4">
          {/* Left cluster */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Menu button (anchor) */}
            <button
              ref={btnRef}
              type="button"
              onClick={openMenu}
              className="relative border-b border-primary_light_mode flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <FiMenu className="text-[18px] text-primary" />
              <span className="hidden sm:inline text-black font-medium">Menu</span>
            </button>

            {/* Search pill */}
            <div className="border-b border-primary_light_mode hidden md:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A] w-[200px] xl:w-[320px]">
              <FiSearch className="text-[18px] text-primary" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none placeholder:text-black placeholder:font-medium"
              />
            </div>
          </div>

          {/* Center logo */}
          <h1 className="lg:text-[1.5rem] xl:text-4xl 2xl:text-5xl text-primary">
            CRUNCHY COOKIES
          </h1>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border-b border-primary_light_mode hidden sm:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <PiShoppingCartSimpleLight className="text-[20px] text-primary" />
              <span className="text-black font-medium">Cart</span>
            </button>

            <button
              type="button"
              className="border-b border-primary_light_mode hidden sm:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <FiHeart className="text-[18px] text-primary" />
              <span className="text-black font-medium">Favorites</span>
            </button>

            <button
              type="button"
              className="border-b border-primary_light_mode flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <FiUser className="text-[18px] text-primary" />
              <span className="text-black font-medium">Member</span>
            </button>
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
          {/* anchored panel (fixed) */}
          <div
            className="fixed z-50"
            style={{ top: pos.top, left: pos.left }}
            role="dialog"
            aria-label="Menu"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuListBox onClose={() => setMenuOpen(false)} />
          </div>
        </>
      )}
    </nav>
  );
}
