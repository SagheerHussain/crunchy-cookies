import React from "react";
import { flowerBouquets } from "../../lib/homepageData";
import ProductCard from "../ProductCard";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";

const WishlistGifts = () => {
  return (
    <>
      <section id="wishlist" className="py-10">
        <div className="custom-container">

          <Link to={"/"}>
            <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full">
              <MdOutlineArrowBackIos
                size={24}
                className="cursor-pointer text-primary"
              />
            </div>
          </Link>

          <div className="flex items-center justify-between mt-4 mb-8">
            <h2 className="text-center lg:text-[1.8rem] xl:text-[2.5rem] text-primary">
              Favourites
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {flowerBouquets.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishlistGifts;
