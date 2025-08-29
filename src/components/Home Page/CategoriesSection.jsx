import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Reusable strip component
 * props:
 *  - title: { en: string, ar: string }
 *  - items: [{ id, name_en, name_ar, image }]
 *  - className?: extra wrapper classes
 */
export default function GiftIdeasSection({ title, items = [], className = "" }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className={`py-20 ${className}`}>
      <div className="custom-container">
        {/* Title */}
        <h2 className="text-center text-3xl xl:text-[2.5rem] tracking-wide text-primary mb-10">
          {title}
        </h2>

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
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 place-items-center">
              {items.map((it) => (
                <li key={it.id} className="flex flex-col items-center">
                  {/* circular badge behind image */}
                  <div className="rounded-full flex items-center justify-center">
                    <img
                      src={it.image}
                      alt={isAr ? it.name_ar : it.name_en}
                      className="transition-transform duration-200 scale-75"
                      loading="lazy"
                    />
                  </div>

                  {/* caption */}
                  <p className="text-[20px] font-medium text-primary text-center">
                    {isAr ? it.name_ar : it.name_en}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
