// BestSellersSection.js
import React, { useState } from 'react';
import { FiHeart } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa6";

const ShowcaseProducts = ({ products, en_title, ar_title }) => {

    const { i18n } = useTranslation();
    const langClass = i18n.language === "ar" ? "ar" : "en";

    const [currentIdx, setCurrentIdx] = useState(null);

    const handleCurrentIndex = (id) => {
        setCurrentIdx(currentIdx === id ? null : id);
    };

    return (
        <section className="py-10 px-4">
            <div className="custom-container relative">
                <div className="flex md:flex-row flex-col items-center justify-between mb-10">
                    <h2 className="text-center text-[1.3rem] md:text-[1.5rem] lg:text-[1.8rem] xl:text-[2.5rem] tracking-wide text-primary">{langClass === "ar" ? ar_title : en_title}</h2>
                    <Button label={`${langClass === "ar" ? "شاهد المزيد" : "See more"}`} href="/filters/chocolate" />
                </div>
                <div className="md:block hidden absolute bottom-[-7%] left-0 w-full bg-[#0fb5bb25] rounded-[25px] md:h-[500px] lg:h-[200px] xl:h-[250px] border-[1px] border-primary"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:px-0 xl:px-2 2xl:px-6">
                    {products.map((product, id) => (
                        <div key={product.id} className="relative">
                            <img
                                src={product?.featuredImage}
                                alt={langClass === "en" ? product.en_title : product.ar_title}
                                className="w-full object-cover lg:h-[325px] 2xl:h-[400px] rounded-[35px]"
                            />
                            <div className="absolute w-full h-full top-0 left-0 bg-black/30 rounded-[35px]"></div>
                            <div className="absolute top-[5%] right-[5%]">
                                <button className="bg-white p-2 rounded-full" onClick={() => handleCurrentIndex(id)}>
                                    {currentIdx !== id ? <FiHeart size={20} className='text-primary' /> : <FaHeart size={20} className='text-primary' />}
                                </button>
                            </div>
                            <div className="absolute bottom-0 w-full p-4 flex items-center justify-between">
                                <div>
                                    <h5 className="text-lg text-white font-medium">{product?.title} {langClass === "en" ? product.en_title : product.ar_title}</h5>
                                    <h6 className="text-lg text-white font-medium">{langClass === "en" ? product.en_count : product.ar_count}</h6>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <Link to={``} className="bg-primary hover:bg-primary/70 rounded-full p-2">
                                    {
                                        langClass === "ar" ? <IoIosArrowBack size={28} className='text-white' /> : <IoIosArrowForward size={28} className='text-white' />
                                    }
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ShowcaseProducts;
