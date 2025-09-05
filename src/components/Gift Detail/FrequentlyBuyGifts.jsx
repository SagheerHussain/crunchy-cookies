import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { frequentlyBuyGifts } from "../../lib/giftDetail";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const FrequentlyBuyGifts = () => {

  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 p-6">
      {frequentlyBuyGifts.map((product, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-primary/30"
          style={{
            background:
              "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="w-[45%]">
              <img
                src={product.product[0].image}
                alt={product.product[1].name[langClass ? "ar" : "en"]}
                className="w-full 2xl:h-32 lg:h-28 md:h-24 h-28 object-cover rounded-lg"
              />
              <h5 className={`text-black font-medium mt-3 ${langClass ? "text-[.8rem]" : "text-[.65rem]"}`}>
                {product.product[0].name[langClass ? "ar" : "en"].slice(0, 30)}...
              </h5>
            </div>
            <div className="w-[10%] object-cover rounded-lg">
              <FaPlus size={20} />
            </div>
            <div className="w-[45%]">
              <img
                src={product.product[1].image}
                alt={product.product[1].name[langClass ? "ar" : "en"]}
                className="w-full 2xl:h-32 lg:h-28 md:h-24 h-28 object-cover rounded-lg"
              />
              <h5 className={`text-black font-medium mt-3 ${langClass ? "text-[.8rem]" : "text-[.65rem]"}`}>
                {product.product[1].name[langClass ? "ar" : "en"].slice(0, 30)}...
              </h5>
            </div>
          </div>
          <div className="mt-4">
            <button className="flex items-center justify-center font-medium text-sm mt-4 bg-primary hover:bg-primary/70 text-white p-2 rounded-lg w-full">
              <IoBagHandleOutline className={`mr-2 ${langClass ? "ml-2" : "mr-2"}`} />
              {langClass ? "إضافة كلاهما إلى السلة" : "Add Both to Cart"} QAR {product?.price}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrequentlyBuyGifts;
