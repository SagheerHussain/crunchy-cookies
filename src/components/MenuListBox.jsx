import React from "react";
import {
  AiOutlineClose,
  AiOutlineRight,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineInfoCircle,
  AiOutlinePhone,
  AiOutlineGift,
  AiOutlineLogout,
  AiOutlineLeft,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MenuListBox({ onClose }) {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  const items = [
    {
      en_label: "Cart",
      ar_label: "عربة",
      to: "/cart/295428429752",
      icon: <AiOutlineShoppingCart className="text-cyan-700" />,
    },
    {
      en_label: "Favorites",
      ar_label: "المفضلة",
      to: "/wishlist/295428429752",
      icon: <AiOutlineHeart className="text-cyan-700" />,
    },
    {
      en_label: "About us",
      ar_label: "معلومات عنا",
      to: "/about",
      icon: <AiOutlineInfoCircle className="text-cyan-700" />,
    },
    {
      en_label: "Contact us",
      ar_label: "اتصل بنا",
      to: "/contact",
      icon: <AiOutlinePhone className="text-cyan-700" />,
    },
    {
      en_label: "Order History",
      ar_label: "تاريخ الطلبات",
      to: "/order-history/413143151",
      icon: <AiOutlineGift className="text-cyan-700" />,
    },
  ];

  return (
    <aside className="w-[22rem] max-w-[92vw] p-2">
      <div
        className="relative rounded-2xl border border-primary bg-cyan-50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        style={{
          borderTopRightRadius: "15px",
          borderBottomRightRadius: "15px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-6">
          <h2 className="text-2xl text-primary">
            {langClass ? "قائمة طعام" : "Menu"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-white text-black shadow border border-cyan-100 w-8 h-8"
            aria-label="Close"
          >
            <AiOutlineClose className="text-base" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3 px-4 pb-8 pt-2">
          {items.map((it) => (
            <Link to={it.to} key={it.label}>
              <div className="w-full rounded-xl border border-primary/30 bg-white/60 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-700">
                    {/* <span className="text-[18px]">{it.icon}</span> */}
                    <span className="font-medium text-lg">
                      {langClass ? it.ar_label : it.en_label}
                    </span>
                  </div>
                  {langClass ? (
                    <AiOutlineLeft className="text-primary" />
                  ) : (
                    <AiOutlineRight className="text-primary" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mx-6 mb-4 text-start">
          <button
            type="button"
            className="inline-flex items-center justify-start gap-2 rounded-xl bg-red-700 hover:bg-red-800 px-4 py-2 font-medium text-white shadow-md"
          >
            <AiOutlineLogout className="text-xl" />
            <span className="text-lg">
              {langClass ? "تسجيل الخروج" : "Log out"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
