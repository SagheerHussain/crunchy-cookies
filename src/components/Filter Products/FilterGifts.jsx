import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { IoFilter } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductCard from "../ProductCard";

import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { products, allOccasions } from "../../lib/filterpageData";

const uniq = (arr) => Array.from(new Set(arr));

export default function FilterableFlowerGrid() {

    const { i18n } = useTranslation();
    const langClass = i18n.language === "ar" ? "ar" : "en";

    const [open, setOpen] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState(null);

    // filters
    const [categorySet, setCategorySet] = useState(new Set()); // store slugs
    const [type, setType] = useState(""); // store type.en_name
    const [colors, setColors] = useState(new Set()); // store color strings
    const [packaging, setPackaging] = useState(new Set()); // store packaging.en_name
    const [priceSort, setPriceSort] = useState(""); // "hl" | "lh" | ""

    // ----- derive filter options from data -----
    const categoryOptions = useMemo(() => {
        const slugs = uniq(products.flatMap((p) => p.categories.map((c) => c.slug)));
        console.log("categories", slugs);
        return slugs.map((slug) => {
            const prod = products.find((p) => p.categories.some((c) => c.slug === slug));
            const cat = prod?.categories.find((c) => c.slug === slug);
            return {
                slug,
                en_name: cat?.en_name ?? slug,
                ar_name: cat?.ar_name ?? "",
            };
        });
    }, []);

    const typeOptions = useMemo(
        () => uniq(products.map((p) => langClass === "ar" ? p.type?.ar_name : p.type?.en_name).filter(Boolean)),
        []
    );

    const colorOptions = useMemo(
        () => uniq(products.flatMap((p) => p.colors?.map((c) => langClass === "ar" ? c.ar_name : c.en_name) || [])),
        []
    );

    const packagingOptions = useMemo(() => {
        // we will expose options as strings (en_name) for easy Set compare
        return uniq(
            products
                .map((p) => p.packaging?.en_name)
                .filter(Boolean)
        ).map((en) => {
            // find one to fetch ar_name for display if needed
            const prod = products.find((p) => p.packaging?.en_name === en);
            return { en_name: en, ar_name: prod?.packaging?.ar_name ?? "" };
        });
    }, []);

    // ----- filtering -----
    const filtered = useMemo(() => {
        let list = [...products];

        if (selectedOccasion) {
            list = list.filter((p) =>
                p.occasions?.some((o) => o.slug === selectedOccasion)
            );
        }

        if (categorySet.size) {
            list = list.filter((p) =>
                p.categories.some((c) => categorySet.has(c.slug))
            );
        }

        if (type) {
            list = list.filter((p) => p.type?.en_name === type);
        }

        if (colors.size) {
            list = list.filter((p) => p.colors?.some((clr) => colors.has(clr)));
        }

        if (packaging.size) {
            list = list.filter((p) => packaging.has(p.packaging?.en_name));
        }

        if (priceSort === "hl") list.sort((a, b) => b.price - a.price);
        if (priceSort === "lh") list.sort((a, b) => a.price - b.price);

        return list;
    }, [selectedOccasion, categorySet, type, colors, packaging, priceSort]);

    const toggleSet = (set, value) => {
        const next = new Set(set);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
    };

    return (
        <section id="filter_gifts">
            <div className="custom-container">
                {/* Header Row */}
                <div className="pt-10 pb-2 flex items-center justify-between">
                    <div className="w-[40%]">
                        <h1 className="lg:text-[1.5rem] xl:text-[2rem] 2xl:text-[2.5rem] text-primary">{langClass === "ar" ? "زهور خارجة عن المألوف" : "Flowers Beyond Ordinary"}</h1>
                    </div>

                    {/* Occasions chips */}
                    <div className="w-[60%] mt-4 ">
                        <Swiper
                            dir={langClass === "ar" ? "rtl" : "ltr"}
                            breakpoints={{
                                0: { slidesPerView: 2.2 },  // small phones
                                1024: { slidesPerView: 3 },  // >= sm → ~3 visible
                                1280: { slidesPerView: 3.5 },  // >= lg → ~4 visible
                            }}
                            spaceBetween={20}
                            centeredSlides={false}
                            className="mySwiper"
                            modules={[Navigation]}
                            loop={true}
                            navigation={true}
                        >
                            {allOccasions.map((o) => (
                                <SwiperSlide key={o.slug}>
                                    <button
                                        // onClick={() =>
                                        //     setSelectedOccasion((s) => (s === o.slug ? null : o.slug))
                                        // }
                                        className={`group border-primary/30 ${langClass === "ar" ? "lg:text-sm 2xl:text-[1rem]" : "lg:text-xs 2xl:text-[.8rem]"}  flex items-center justify-between gap-2 rounded-[8px] font-medium border px-4 py-3 transition text-black w-full`}
                                    >
                                        <span className="">{langClass === "ar" ? o.ar_name : o.en_name}</span>
                                        {
                                            langClass === "ar" ? (
                                                <IoIosArrowBack size={16} color="#0FB4BB" />
                                            ) : (
                                                <IoIosArrowForward size={16} color="#0FB4BB" />
                                            )
                                        }
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Select Filters button */}
                <div className="select-filter-btn mb-10 mt-4">
                    <button
                        onClick={() => setOpen((s) => !s)}
                        className={`${open ? "bg-primary text-white" : "bg-transparent text-primary"
                            } transition-all duration-300 inline-flex items-center gap-2 rounded-[5px] border border-[#BFE8E7] px-4 py-2`}
                    >
                        <IoFilter className="text-lg" />
                        <span className="font-medium">
                            {langClass === "ar" ? "حدد عوامل التصفية" : "Select Filters"}
                        </span>
                    </button>
                </div>

                {/* Content area as responsive grid: sidebar + products */}
                <div className={`grid gap-10 ${open ? "lg:grid-cols-[320px_1fr]" : ""}`}>
                    {/* Sidebar (animated) */}
                    <AnimatePresence initial={false}>
                        {open && (
                            <motion.aside
                                key="filters"
                                initial={{ height: 0, opacity: 0 }}
                                viewport={{ amount: 0.5, once: false }}
                                animate={{ height: "100%", opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="overflow-hidden"
                            >
                                <div className="rounded-[5px] p-6 border border-primary/40 bg-transparent shadow-sm">
                                    {/* Categories */}
                                    <FilterSection title={`${langClass === "ar" ? "فئات" : "Categories"}`}>
                                        {categoryOptions.map((opt) => (
                                            <label key={opt.slug} className="FilterItem">
                                                <RoundCheck
                                                    checked={categorySet.has(opt.slug)}
                                                    onChange={() =>
                                                        setCategorySet((s) => toggleSet(s, opt.slug))
                                                    }
                                                />
                                                <span className="grow">{langClass === "ar" ? opt.ar_name : opt.en_name}</span>
                                            </label>
                                        ))}
                                    </FilterSection>

                                    {/* Flower Type (single) */}
                                    <FilterSection title={`${langClass === "ar" ? "نوع الزهرة" : "Flower Type"}`}>
                                        {typeOptions.map((t) => (
                                            <label key={t} className="FilterItem">
                                                <RoundCheck
                                                    checked={type === t}
                                                    onChange={() => setType((v) => (v === t ? "" : t))}
                                                />
                                                <span className="grow">{t}</span>
                                            </label>
                                        ))}
                                    </FilterSection>

                                    {/* Primary Color */}
                                    <FilterSection title={`${langClass === "ar" ? "الألوان" : "Colors"}`}>
                                        {colorOptions.map((c) => (
                                            <label key={c} className="FilterItem">
                                                <RoundCheck
                                                    checked={colors.has(c)}
                                                    onChange={() => setColors((s) => toggleSet(s, c))}
                                                />
                                                <span className="grow">{c}</span>
                                            </label>
                                        ))}
                                    </FilterSection>

                                    {/* Packaging */}
                                    <FilterSection title={`${langClass === "ar" ? "التعبئة والتغليف" : "Packaging"}`}>
                                        {packagingOptions.map((p) => (
                                            <label key={p.en_name} className="FilterItem">
                                                <RoundCheck
                                                    checked={packaging.has(p.en_name)}
                                                    onChange={() =>
                                                        setPackaging((s) => toggleSet(s, p.en_name))
                                                    }
                                                />
                                                <span className="grow">{langClass === "ar" ? p.ar_name : p.en_name}</span>
                                            </label>
                                        ))}
                                    </FilterSection>

                                    {/* Price Sort */}
                                    <FilterSection title={`${langClass === "ar" ? "السعر" : "Price"}`}>
                                        <label className="FilterItem">
                                            <RoundRadio
                                                name="price"
                                                checked={priceSort === "hl"}
                                                onChange={() =>
                                                    setPriceSort((v) => (v === "hl" ? "" : "hl"))
                                                }
                                            />
                                            <span className="grow">{langClass === "ar" ? "عالي إلى منخفض" : "High to low"}</span>
                                        </label>
                                        <label className="FilterItem">
                                            <RoundRadio
                                                name="price"
                                                checked={priceSort === "lh"}
                                                onChange={() =>
                                                    setPriceSort((v) => (v === "lh" ? "" : "lh"))
                                                }
                                            />
                                            <span className="grow">{langClass === "ar" ? "منخفض إلى عالي" : "Low to high"}</span>
                                        </label>
                                    </FilterSection>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Products grid */}
                    <section>
                        {
                            open && <button
                                onClick={() => {
                                    setCategorySet(new Set());
                                    setType("");
                                    setColors(new Set());
                                    setPackaging(new Set());
                                    setPriceSort("");
                                    setSelectedOccasion(null);
                                }}
                                className="border-primary/30 mb-4 border-[1px] rounded-[5px] py-2 px-4 text-black flex items-center gap-2"
                            >
                                <RxCross1 size={16} color="#0FB4BB" /> {langClass === "ar" ? "مسح المرشحات" : "Clear Filters"}
                            </button>
                        }
                        <div
                            className={`grid gap-6 sm:grid-cols-2 md:grid-cols-2 ${open ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                                }`}
                        >
                            {filtered.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>

                        <Stack spacing={2} style={{ direction: "ltr" }} className="mt-20 flex items-center justify-center">
                            <Pagination count={10} color="primary" />
                        </Stack>
                    </section>
                </div>
            </div>
        </section>
    );
}

/* ---------- Small Components ---------- */
function FilterSection({ title, children }) {
    return (
        <div className="mb-8">
            <div className="text-primary font-semibold text-xl mb-4">{title}</div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

// Round checkbox
function RoundCheck({ checked, onChange, readOnly }) {
    return (
        <span className="relative inline-flex items-center justify-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                readOnly={readOnly}
                className="peer h-5 w-5 appearance-none rounded-full border border-[#BFE8E7] bg-white outline-none cursor-pointer checked:bg-[#18B2AF] transition"
            />
            <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
            >
                <path
                    fill="currentColor"
                    d="M20.285 6.708a1 1 0 0 1 .007 1.414l-9 9a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414l3.293 3.293 8.293-8.293a1 1 0 0 1 1.407 0z"
                />
            </svg>
        </span>
    );
}

// Round radio
function RoundRadio({ name, checked, onChange }) {
    return (
        <span className="relative inline-flex items-center justify-center">
            <input
                type="radio"
                name={name}
                checked={checked}
                onChange={onChange}
                className="peer h-5 w-5 appearance-none rounded-full border border-[#BFE8E7] bg-white outline-none cursor-pointer checked:border-[#18B2AF] transition"
            />
            <span className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#18B2AF] opacity-0 peer-checked:opacity-100" />
        </span>
    );
}

// Local CSS helpers
const styles = `
  .FilterItem{display:flex;align-items:center;gap:.6rem;padding:.6rem .8rem;border:1px solid #BFE8E7;border-radius:12px;background:#fff}
  .FilterItem:hover{border-color:#18B2AF}
  `;
if (typeof document !== "undefined" && !document.getElementById("local-styles")) {
    const style = document.createElement("style");
    style.id = "local-styles";
    style.innerHTML = styles;
    document.head.appendChild(style);
}