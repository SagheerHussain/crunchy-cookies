import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom"

// IMPORTANT: Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

export default function GiftMomentsCarousel({ en_title, ar_title, items = [], onItemClick }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const cardBg =
    "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 50%, #f6b4001f 100%)";

  const label = (it) => (isAr ? it.ar_title : it.en_title);

  return (
    <section className="py-8" dir={isAr ? "rtl" : "ltr"}>
      <div className="custom-container">
        {/* Title + custom nav */}
        <div className="relative mb-10">
          <h2 className="lg:text-[1.8rem] xl:text-[2.5rem] text-primary">
            {isAr ? ar_title : en_title}
          </h2>
          <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "left-0" : "right-0"} flex gap-3`}>
            <button
              ref={prevRef}
              className="cc-navbtn grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary hover:bg-primary/70 text-white shadow"
              aria-label="Previous"
            >
              {isAr ? <FiChevronRight size={30} /> : <FiChevronLeft size={30} />}
            </button>
            <button
              ref={nextRef}
              className="cc-navbtn grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary hover:bg-primary/70 text-white shadow"
              aria-label="Next"
            >
              {isAr ? <FiChevronLeft size={30} /> : <FiChevronRight size={30} />}
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, A11y]}
          // Make it a horizontal row
          direction="horizontal"
          // visible slides per breakpoint
          // slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3.2, spaceBetween: 22 },
            1024: { slidesPerView: 4.2, spaceBetween: 24 },
            1280: { slidesPerView: 5.2, spaceBetween: 24 },
            1440: { slidesPerView: 6, spaceBetween: 24 },
          }}
          spaceBetween={24}
          // move ONE slide each time
          slidesPerGroup={1}
          speed={500}
          grabCursor
          watchOverflow
          loop={true}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="overflow-hidden"
        >
          {items.map((it) => (
            <SwiperSlide key={it.id}>
              <Link
                to={``}
                className="block w-full"
              >
                <div
                  className="rounded-[35px] border-[1px] border-black/20 p-4 flex flex-col items-center h-full"
                  style={{ background: cardBg }}
                >
                  <div className="rounded-full flex items-center justify-center">
                    <img
                      src={it.image}
                      alt={label(it)}
                      className="rounded-full object-contain transition-transform duration-200 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className={`mt-4 font-medium text-[#02A8B5] text-center ${isAr ? "text-[24px]" : "text-[20px] "}`}>
                    {label(it)}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
