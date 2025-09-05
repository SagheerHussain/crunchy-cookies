import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../Button";

export default function GiftIdeasSection({ en_title, ar_title, items = [], className = "" }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  console.log("items", items)

  return (
    <section className={`py-10 ${className}`}>
      <div className="custom-container">
        {/* Title */}
        <div className="flex md:flex-row flex-col items-center justify-between mb-10">
          <h2 className="text-center text-[1.3rem] md:text-[1.5rem] lg:text-[1.8rem] xl:text-[2.5rem] tracking-wide text-primary">
            {isAr ? ar_title : en_title}
          </h2>
          <Button label={`${isAr ? "شاهد المزيد" : "See more"}`} href="/filters/chocolate" />
        </div>

        {/* Gradient container */}
        <div
          className="rounded-[35px] py-10 px-0"
          style={{
            background:
              "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
          }}
        >
          {/* white-ish overlay for the soft look */}
          <div className="rounded-[35px]">
            {/* Items row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 place-items-center">
              {items.map((it) => (
                <Link key={it.id} to={``} className="flex flex-col items-center group">
                  {/* circular badge behind image */}
                  <div className="h-[150px] w-[150px] bg-[#f0e9df] rounded-full flex items-center justify-center">
                    <img
                      src={it.image}
                      alt={isAr ? it.ar_title : it.en_title}
                      className="transition-transform duration-200 rounded-full"
                      loading="lazy"
                    />
                  </div>

                  {/* caption */}
                  <p className={`font-medium text-primary text-center mt-4 ${isAr ? "text-[24px]" : "text-[20px] "}`}>
                    {isAr ? it.ar_title : it.en_title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
