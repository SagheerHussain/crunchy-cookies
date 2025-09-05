import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import FancySlick from "../components/HeroSlider";
import ProductsSection from "../components/Home Page/ProductsSection";
import GiftIdeasSection from "../components/Home Page/CategoriesSection";
import { giftIdeas, flowerBouquets, giftMoments, bestSellerProducts, houseOfDelights, simplyTimeless, latestCollection, perfumeCollection, preservedFlowersCollection, collections, brands, recipients } from "../lib/homepageData";
import CategoriesSlider from "../components/Home Page/CategoriesSlider";
import ShowcaseProducts from "../components/Home Page/ShowcaseProducts";
import LatestCollection from "../components/Home Page/LatestCollection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <FancySlick />

        <ProductsSection
          en_title="Flowers Beyond Ordinary"
          ar_title="زهور تتجاوز العادي"
          products={flowerBouquets}
        />

        <GiftIdeasSection
          en_title="Explore Unique Gift Ideas"
          ar_title="استكشف أفكار هدايا فريدة"
          items={giftIdeas}
        />

        <CategoriesSlider
          en_title="Gifts For Every Moment"
          ar_title="هدايا لكل لحظة"
          items={giftMoments}
          onItemClick={(item) => console.log("clicked:", item.id)}
        />

        <ShowcaseProducts
          products={bestSellerProducts}
          en_title="Best Sellers"
          ar_title="الأكثر مبيعًا"
        />

        <ProductsSection
          en_title="House Of Delights"
          ar_title="بيت المسرات"
          products={houseOfDelights}
        />

        <ProductsSection
          en_title="Simply Timeless"
          ar_title="ببساطة خالد"
          products={simplyTimeless}
        />

        <ProductsSection
          en_title="Latest & Loveliest"
          ar_title="الأحدث والأجمل"
          products={latestCollection}
        />

        <ProductsSection
          en_title="Perfumes For Every Personality"
          ar_title="عطور لكل شخصية"
          products={perfumeCollection}
        />

        <ProductsSection
          en_title="Forever Beautiful"
          ar_title="جميلة إلى الأبد"
          products={preservedFlowersCollection}
        />

        <LatestCollection
          collections={collections}
          en_title="Discover New Ideas"
          ar_title="اكتشف أفكارًا جديدة"
        />

        <GiftIdeasSection
          en_title="Brands You'll Love"
          ar_title="ماركات ستعجبك"
          items={brands}
        />

        <CategoriesSlider
          className="bg-[#F0E9E0] scale-[.95]"
          en_title="Gifts For Everyone"
          ar_title="هدايا للجميع"
          items={recipients}
          onItemClick={(item) => console.log("clicked:", item.id)}
        />
      </main>


      <Footer />
    </>
  );
};

export default HomePage;
