import React from "react";
import { giftDetail } from "../../lib/giftDetail";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { BsBagCheck } from "react-icons/bs";
import { TbShoppingCart } from "react-icons/tb";
import FrequentlyBuyGifts from "./FrequentlyBuyGifts";

const ProductDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start">
        {/* Product Image Section */}
        <div className="relative">
          <img
            src={giftDetail.images[0]}
            alt="Product"
            className="w-full rounded-xl h-[500px] object-cover"
          />
          {/* Additional images carousel */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex space-x-4">
              {giftDetail.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Additional Product ${index + 1}`}
                  className="rounded-lg w-[60px] h-[60px]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 md:ml-8 mt-4 md:mt-0">
          <div className="flex items-center justify-between">
            <h5 className="lg:text-xl xl:text-4xl font-semibold text-primary">
              {giftDetail.title.en}
            </h5>
            <p className="lg:text-md xl:text-3xl font-semibold text-primary">
              {giftDetail.price}
            </p>
          </div>

          <div className="grid lg:grid-cols-1 xl:grid-cols-3 mt-4 xl:space-x-4 xl:space-y-0 space-y-4">
            <span className="border-primary/30 flex items-center justify-center gap-1 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
              <CiDeliveryTruck size={18} className="text-primary" />
              {giftDetail.delivery.en}
            </span>
            <span className="border-primary/30 flex items-center justify-center gap-1 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
              <IoLocationOutline size={18} className="text-primary" />
              {giftDetail.address.en}
            </span>
            <span className="border-primary/30 flex items-center justify-center gap-1 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
              <MdOutlineWorkspacePremium size={18} className="text-primary" />
              {giftDetail.type.en}
            </span>
          </div>

          <div className="description-filled-box mt-6">
            <h5 className="text-white bg-primary inline-block rounded-lg px-4 py-2 text-xs mb-4">
              Description
            </h5>
            <p className="text-balck text-sm">{giftDetail.description.en}</p>
            <p className="text-sm mt-4"><span className="font-medium text-primary">Note:</span> {giftDetail.note.en}</p>
          </div>


          <div className="mt-4 text-gray-600">
            <h5 className="font-medium text-primary text-xl mb-4">
              Arrangement Includes:
            </h5>
            <ul className="list-disc pl-5">
              {giftDetail.arrangements.map((arrangement, index) => (
                <li key={index} className="text-black text-sm mb-2">
                  {arrangement.en}
                </li>
              ))}
            </ul>
          </div>

          <div className="sku mt-6">
            <h5 className="font-medium text-primary text-xl">
              SKU {giftDetail.sku}
            </h5>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button className="bg-primary border border-primary hover:border-primary/80 hover:bg-primary/80 text-center w-1/2 font-medium text-white py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
              <BsBagCheck size={20} />
              Buy Now
            </button>
            <button className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2">
              <TbShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Section */}
      <div className="mt-20">
        <h3 className="text-3xl text-primary">
          Frequently Bought Together
        </h3>
        <div className="mt-4 border border-primary rounded-3xl">
          <FrequentlyBuyGifts />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
