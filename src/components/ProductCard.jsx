import React from "react";
import Button from "./Button";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-primary_light_mode rounded-[35px] border-[1px] border-primary/30 flex flex-col items-center transition-shadow duration-300 p-4">
      <img
        src={product.image}
        alt={product.en_name}
        className="w-full h-[300px] object-cover rounded-[35px] mb-3"
      />
      <div className="card-content w-full">
        <p className="text-primary font-medium text-lg flex items-center">
          Qar <span className="text-2xl ps-2">{product.price}</span>
        </p>
        <h5 className="text-black text-[14px] mt-1">{product.en_name}</h5>
        <div className="card-content-btn flex justify-end">
          <Button label="Add to cart" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
