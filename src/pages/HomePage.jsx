import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import FancySlick from "../components/HeroSlider";
import ProductsSection from "../components/Home Page/ProductsSection";
import GiftIdeasSection from "../components/Home Page/CategoriesSection";
import { flowerBouquets } from "../lib/homepageData";
import { giftIdeas } from "../lib/homepageData";

const HomePage = () => {
  return (
    <>
      <Topbar />
      <Navbar />
      <FancySlick />
      <ProductsSection
        title="Flowers Beyond Ordinary"
        products={flowerBouquets}
      />
      <GiftIdeasSection title={"Explore Unique Gifts Ideas"} items={giftIdeas} />
    </>
  );
};

export default HomePage;
