import React from "react";
import {
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

export default function Navbar() {
  return (
    <header className="header py-4">
      <div className="custom-container px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left cluster: Menu + Search */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Menu button */}
            <button
              type="button"
              className="border-b border-primary_light_mode flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <FiMenu className="text-[18px] text-primary" />
              <span className="hidden sm:inline text-black font-medium">Menu</span>
            </button>

            {/* Search pill */}
            <div
              className="border-b border-primary_light_mode hidden md:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-neutral-700 shadow-sm ring-1 ring-[#0FB4BB1A] w-[200px] xl:w-[320px]"
            >
              <FiSearch className="text-[18px] text-black" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none placeholder:text-black placeholder:font-medium"
              />
            </div>
          </div>

          {/* Center logo */}
    
            <h1
              className="lg:text-[1.5rem] xl:text-4xl 2xl:text-5xl text-primary"
            >
              CRUNCHY COOKIES
            </h1>

          {/* Right cluster: Cart + Favorites + Member */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border-b border-primary_light_mode hidden sm:flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm ring-1 ring-[#0FB4BB1A]"
            >
              <PiShoppingCartSimpleLight
                className="text-[20px] text-primary"
              />
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
              className="border-b border-primary_light_mode flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-black shadow-sm"
            >
              <FiUser className="text-[18px] text-primary" />
              <span className="text-black font-medium">Member</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
