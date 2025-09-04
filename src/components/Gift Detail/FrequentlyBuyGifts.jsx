import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { frequentlyBuyGifts } from "../../lib/giftDetail";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

const FrequentlyBuyGifts = () => {
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
                alt={product.product[1].name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <h5 className="text-[.65rem] text-black font-medium mt-3">
                {product.product[0].name.slice(0, 30)}...
              </h5>
            </div>
            <div className="w-[10%] object-cover rounded-lg">
              <FaPlus size={20} />
            </div>
            <div className="w-[45%]">
              <img
                src={product.product[1].image}
                alt={product.product[1].name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <h5 className="text-[.65rem] text-black font-medium mt-3">
                {product.product[1].name.slice(0, 30)}...
              </h5>
            </div>
          </div>
          <div className="mt-4">
            <button className="flex items-center justify-center font-medium text-sm mt-4 bg-primary hover:bg-primary/70 text-white p-2 rounded-lg w-full">
              <IoBagHandleOutline className="mr-2" />
              Add Both to Cart QAR {product?.price}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrequentlyBuyGifts;
