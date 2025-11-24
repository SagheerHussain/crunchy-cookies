import React, { useEffect, useState } from "react";
import { TbTruckDelivery, TbMapPin } from "react-icons/tb";
import { PiGlobeHemisphereWestLight, PiShoppingBagBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const countries = ["Qatar"];

export default function Topbar() {
  const { t, i18n } = useTranslation("translation");
  const [selected, setSelected] = useState("Qatar");
  const [user, setUser] = useState(null);

  // sync html dir
  useEffect(() => {
    const dir = t("dir") || "ltr";
    document.documentElement.dir = dir;
  }, [i18n.language, t]);

  // read user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setUser(null);
        return;
      }

      const parsed = JSON.parse(raw);

      // backend ne jo structure dikhaya:
      // { token: "...", user: { firstName, lastName, ... } }
      const u = parsed.user || parsed;

      if (u && (u.firstName || u.firstname)) {
        setUser(u);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      setUser(null);
    }
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const firstName =
    user?.firstName ||
    user?.firstname ||
    ""; // safe fallback

  return (
    <nav className="top_navigation_bar py-4 bg-light_gray w-full">
      <div className="custom-container mx-auto px-4">
        <div className="flex items-center justify-between py-3 text-sm">
          {/* Left feature items */}
          <ul className="md:flex items-center gap-8 text-neutral-600">
            <li className="flex items-center gap-2">
              <TbTruckDelivery className="text-[18px] text-primary" />
              <span className="text-[16px]">
                {t("topBar.expressDelivery")}
              </span>
            </li>
            <li className="flex items-center gap-2 md:py-0 py-1">
              <TbMapPin className="text-[18px] text-primary" />
              <span className="text-[16px]">
                {t("topBar.address")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <PiShoppingBagBold className="text-[18px] text-primary" />
              <span className="text-[16px]">
                {t("topBar.premium")}
              </span>
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex md:flex-row flex-col items-center gap-3">
            {/* Language pill */}
            <button
              onClick={() =>
                changeLanguage(i18n.language === "ar" ? "en" : "ar")
              }
              className="flex items-center bg-primary_light_mode gap-2 rounded-full px-4 py-2 text-[15px] text-neutral-700 shadow-sm"
            >
              <span>
                {i18n.language === "ar" ? "English" : "العربية"}
              </span>
              <PiGlobeHemisphereWestLight
                className="text-[18px]"
                style={{ color: "#0FB4BB" }}
              />
            </button>

            {/* User / Login */}
            {user ? (
              <div className="px-2 py-1 md:px-4 md:py-2 rounded-full bg-primary_light_mode text-primary text-[12px] md:text-[15px] shadow-sm">
                {i18n.language === "ar"
                  ? `مرحباً، ${firstName}`
                  : `Hello, ${firstName}`}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-2 py-1 md:px-4 md:py-2 rounded-full bg-transparent text-primary border border-primary/40 text-[12px] md:text-[15px] hover:bg-primary_light_mode transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
