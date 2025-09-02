import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { PiGlobeHemisphereWestLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import playStore from "/images/play.webp";
import appGallary from "/images/gallary.png";
import appStore from "/images/store.png";
import paypal from "/images/gateway/3.webp";
import applePay from "/images/gateway/1.png";
import visa from "/images/gateway/2.webp";
import mastercard from "/images/gateway/4.png";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const countries = ["Qatar"];

const Footer = () => {
  const { t, i18n } = useTranslation("translation"); // make sure namespace is "common"
  const [selected, setSelected] = useState("Qatar");

  // keep document direction in sync with language
  useEffect(() => {
    const dir = t("dir");
    document.documentElement.dir = dir;
  }, [i18n.language, t]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // dir is handled by effect above
  };

  // ----- i18n sections -----
  const explore = t("footer.explore", { returnObjects: true });

  const knowUs = t("footer.knowUs", { returnObjects: true });

  const customerService = t("footer.customerService", { returnObjects: true });

  const copyright = t("footer.copyright");

  return (
    <footer className="bg-black text-white py-10 mt-20">
      <div className="custom-container">
        <div className="flex justify-between gap-8">
          {/* Brand + controls */}
          <div className="w-[40%] flex flex-col justify-between">
            <h1 className={`text-primary ${i18n.language === "ar" ? "lg:text-4xl xl:text-5xl 2xl:text-6xl" : "lg:text-[1.5rem] xl:text-4xl 2xl:text-4xl"}`}>
              {t("logo")}
            </h1>

            <div className="flex items-center gap-4">
              {/* Country select */}
              {/* <Menu as="div" className="relative">
                <Menu.Button className="bg-[#0fb5bb50] flex items-center gap-2 rounded-[10px] px-4 py-2 text-[15px] text-white font-medium shadow-sm focus:outline-none">
                  <span>
                    {i18n.language === "ar" ? "التوصيل إلى" : "Delivery to"} {selected}
                  </span>
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
                className="flex items-center bg-[#0fb5bb50] gap-2 rounded-[10px] px-8 py-2 text-[15px] text-white font-medium shadow-sm"
              >
                <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
                <PiGlobeHemisphereWestLight className="text-[18px]" style={{ color: "#0FB4BB" }} />
              </button>
            </div>
          </div>

          {/* Link columns */}
          <div className="w-[60%]">
            <div className="grid grid-cols-3 gap-10">
              {/* Explore */}
              <div>
                <h5 className="text-lg xl:text-xl font-semibold text-primary mb-4">{explore.title}</h5>
                <ul>
                  {explore.links.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="text-white xl:text-lg inline-block mb-3 hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Know us */}
              <div>
                <h5 className="text-lg xl:text-xl font-semibold text-primary mb-4">{knowUs.title}</h5>
                <ul>
                  {knowUs.links.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="text-white xl:text-lg inline-block mb-3 hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer service */}
              <div>
                <h5 className="text-lg xl:text-xl font-semibold text-primary mb-4">{customerService.title}</h5>
                <ul>
                  {customerService.links.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="text-white xl:text-lg inline-block mb-3 hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stores + payments */}
        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center justify-between gap-4">
            <img src={playStore} className="w-[120px] rounded-[10px]" alt="Google Play" />
            <img src={appGallary} className="w-[120px] rounded-[10px]" alt="AppGallery" />
            <img src={appStore} className="w-[120px] rounded-[10px]" alt="App Store" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <img src={paypal} className="w-[60px] h-[40px] object-contain rounded-[5px] bg-white" alt="PayPal" />
            <img src={applePay} className="w-[60px] h-[40px] object-contain rounded-[5px] bg-white" alt="Apple Pay" />
            <img src={visa} className="w-[60px] h-[40px] object-contain rounded-[5px] bg-white" alt="Visa" />
            <img src={mastercard} className="w-[60px] h-[40px] object-contain rounded-[5px] bg-white" alt="Mastercard" />
          </div>
        </div>

        <hr className="border-white/20 mt-8" />

        {/* Copyright + socials */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-white font-medium">{copyright}</p>
          <div className="flex items-center gap-4">
            <Link to=""><FaLinkedinIn className="hover:text-primary transition-all duration-200 text-[24px]" /></Link>
            <Link to=""><FaFacebookF className="hover:text-primary transition-all duration-200 text-[24px]" /></Link>
            <Link to=""><FaInstagram className="hover:text-primary transition-all duration-200 text-[24px]" /></Link>
            <Link to=""><FaYoutube className="hover:text-primary transition-all duration-200 text-[24px]" /></Link>
            <Link to=""><FaXTwitter className="hover:text-primary transition-all duration-200 text-[24px]" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
