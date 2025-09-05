import React, { useState } from "react";
import Button from "./Button";
import { FiHeart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {

  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar" ? "ar" : "en";

  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link to={`/gift-detail/${product.id}`}>
      <div className="relative bg-primary_light_mode rounded-[35px] border-[1px] border-primary/30 flex flex-col items-center transition-shadow duration-300 p-4">
      <img
        src={product.image}
        alt={product.en_title}
        className="w-full h-[300px] object-cover rounded-[35px] mb-3"
      />
      <div className="absolute top-[calc(100%-92%)] right-[calc(100%-92%)]">
        <button className="bg-white p-2 rounded-full" onClick={() => setIsLiked(!isLiked)}>
          {!isLiked ? <FiHeart size={20} className='text-primary' /> : <FaHeart size={20} className='text-primary' />}
        </button>
      </div>
      <div className="card-content w-full">
        <p className="text-primary font-medium text-lg flex items-center">
          Qar <span className="text-2xl ps-2">{product.price}</span>
        </p>
        <h5 className={`text-black ${langClass === "ar" ? "text-[18px]" : "text-[14px]"}  mt-1`}>{langClass === "en" ? product.en_title.slice(0, 30) : product.ar_title.slice(0, 25)} {product.en_title.length > 30 || product.ar_title.length > 30 ? "..." : ""}</h5>
        <div className="card-content-btn flex justify-end">
          <Button label={`${langClass === "ar" ? "أضف إلى السلة" : "Add to cart"}`} />
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
