import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { TbTruckDelivery, TbMapPin } from "react-icons/tb";
import { PiGlobeHemisphereWestLight, PiShoppingBagBold } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const countries = ["Qatar"];

export default function Topbar() {
  const { t, i18n } = useTranslation("translation");
  const [selected, setSelected] = useState("Qatar");

  // keep <html dir> in sync with language
  useEffect(() => {
    const dir = (t("dir")) || "ltr";
    document.documentElement.dir = dir;
  }, [i18n.language, t]);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <nav className="top_navigation_bar py-4 bg-light_gray w-full">
      <div className="custom-container mx-auto px-4">
        <div className="flex items-center justify-between py-3 text-sm">
          {/* Left feature items */}
          <ul className="md:flex items-center gap-8 text-neutral-600">
            <li className="flex items-center gap-2">
              <TbTruckDelivery className="text-[18px] text-primary" />
              <span className="text-[16px]">{t("topBar.expressDelivery")}</span>
            </li>
            <li className="flex items-center gap-2 md:py-0 py-1">
              <TbMapPin className="text-[18px] text-primary" />
              <span className="text-[16px]">{t("topBar.address")}</span>
            </li>
            <li className="flex items-center gap-2">
              <PiShoppingBagBold className="text-[18px] text-primary" />
              <span className="text-[16px]">{t("topBar.premium")}</span>
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Delivery Dropdown */}
            {/* <Menu as="div" className="relative">
              <Menu.Button className="bg-primary_light_mode flex items-center gap-2 rounded-full px-4 py-2 text-[15px] text-neutral-700 shadow-sm focus:outline-none">
                <span>{i18n.language === "ar" ? "التوصيل إلى" : "Delivery to"} {selected}</span>
                <FiChevronDown className="text-[18px]" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg focus:outline-none z-50">
                  <div className="px-2 py-2">
                    {countries.map((place) => (
                      <Menu.Item key={place}>
                        {({ active }) => (
                          <button
                            onClick={() => setSelected(place)}
                            className={`${active ? "bg-gray-100" : ""} block w-full text-left px-2 py-2 text-sm text-neutral-700 rounded-md`}
                          >
                            {place}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu> */}

            {/* Language pill */}
            <button
              onClick={() => changeLanguage(i18n.language === "ar" ? "en" : "ar")}
              className="flex items-center bg-primary_light_mode gap-2 rounded-full px-4 py-2 text-[15px] text-neutral-700 shadow-sm"
            >
              <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
              <PiGlobeHemisphereWestLight className="text-[18px]" style={{ color: "#0FB4BB" }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
