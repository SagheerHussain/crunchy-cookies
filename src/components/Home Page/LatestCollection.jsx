import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Button from '../Button';
import { useTranslation } from "react-i18next";

const LatestCollection = ({ collections, en_title, ar_title }) => {

    const { i18n } = useTranslation();
    const langClass = i18n.language === "ar" ? "ar" : "en";

    return (
        <section className="py-20">
            <div className="custom-container">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-center lg:text-[1.8rem] xl:text-[2.5rem] font-medium text-primary">{langClass === "ar" ? ar_title : en_title}</h2>
                    <Button label={"See More"} />
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {collections?.map((item) => (
                        <div
                            key={item.id}
                            className="relative flex flex-col items-cente bg-white rounded-lg"
                        >
                            <img
                                src={item.image}
                                alt={item.en_title}
                                className="w-full object-cover rounded-[35px]"
                            />
                            <div style={{ borderBottomRightRadius: "20px" }} className="absolute top-0 left-0 text-white z-10 text-lg font-semibold px-4 py-2 bg-white">
                                <p className='lg:text-[1.2rem] xl:text-[1.5rem] text-primary'>{langClass ? item.ar_title : item.en_title}</p>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-white px-4 py-2" style={{ borderTopLeftRadius: "30px" }}>
                                <div className="bg-[#0fb5bb25] p-2 rounded-full cursor-pointer">
                                    <AiOutlineArrowRight size={24} color="#00B5B8" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default LatestCollection;
