import React from "react";
import { flowerBouquets } from "../../lib/homepageData";
import ProductCard from "../ProductCard";
import { MdOutlineArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../../hooks/wishlist/useWishlistQuery";

const WishlistGifts = () => {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  const { id } = useParams();

  const { data: wishlist } = useWishlist(id);

  return (
    <>
      <section id="wishlist" className="pt-4 pb-10">
        <div className="custom-container">
          <Link to={"/"}>
            <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full mb-4">
              {langClass ? (
                <MdArrowForwardIos
                  size={24}
                  className="cursor-pointer text-primary"
                />
              ) : (
                <MdOutlineArrowBackIos
                  size={24}
                  className="cursor-pointer text-primary"
                />
              )}
            </div>
          </Link>

          <div className="">
            <h2 className="text-[2rem] lg:text-[2.5rem] text-primary">
              {langClass ? "المفضلة" : "Favourites"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {wishlist?.data?.map((item) => (
              <ProductCard key={item.id} product={item?.product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishlistGifts;
