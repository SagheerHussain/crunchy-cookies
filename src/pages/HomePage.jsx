// client/src/pages/HomePage.jsx
import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import FancySlick from "../components/HeroSlider";

import ProductsSection from "../components/Home Page/ProductsSection";
import GiftIdeasSection from "../components/Home Page/CategoriesSection";
import CategoriesSlider from "../components/Home Page/CategoriesSlider";
import ShowcaseProducts from "../components/Home Page/ShowcaseProducts";
import LatestCollection from "../components/Home Page/LatestCollection";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTop";

// static-only sections (categories/brands/recipients etc.)
import {
  giftIdeas,
  giftMoments,
  collections,
  brands,
  recipients,
} from "../lib/homepageData";

// ✅ hooks (30-min cache) — we created these earlier
import {
  useProductsInFlowerInVases,
  useTopSoldProducts,
  useProductsInChocolatesOrHandBouquets,
  useFeaturedProducts,
  useProductsInPerfumes,
  useProductsInPreservedFlowers,
  useProductsForFriendsOccasion,
} from "../hooks/products/useProducts";

// small helper to extract array safely
const asList = (resp, fallback = []) =>
  Array.isArray(resp?.data) ? resp.data : fallback;

// optional simple loader
const GridLoader = () => (
  <div style={{ padding: "24px", textAlign: "center" }}>Loading…</div>
);

const HomePage = () => {
  // 1) Flowers Beyond Ordinary -> SubCategory: Flower in vases
  const flowerInVasesQ = useProductsInFlowerInVases({ page: 1, limit: 12 });

  // 2) Best Sellers -> Top sold (get top 12)
  const topSoldQ = useTopSoldProducts(2);

  // 3) House Of Delights -> Chocolates OR Hand Bouquets
  const chocoOrBouquetQ = useProductsInChocolatesOrHandBouquets({
    page: 1,
    limit: 12,
  });

  // 4) Simply Timeless -> Featured
  const featuredQ = useFeaturedProducts({ page: 1, limit: 12 });

  // 5) Friends -> Friends Occasion
  const friendsQ = useProductsForFriendsOccasion({ page: 1, limit: 12 });

  // 6) Perfumes For Every Personality -> SubCategory: perfumes
  const perfumesQ = useProductsInPerfumes({ page: 1, limit: 12 });

  // 7) Forever Beautiful -> SubCategory: preserved flowers
  const preservedQ = useProductsInPreservedFlowers({ page: 1, limit: 12 });

  console.log("Flowers In Vases", flowerInVasesQ?.data);
  console.log("Chocolates", chocoOrBouquetQ?.data);
  console.log("Top Sold", topSoldQ?.data);
  console.log("Featured", featuredQ?.data);
  console.log("Friends", friendsQ?.data);
  console.log("Perfumes", perfumesQ?.data);
  console.log("Preserved", preservedQ?.data);

  // console.log("flowerInVasesQ", preservedQ?.data);
  // console.log("topSoldQ", topSoldQ?.data);
  // console.log("chocoOrBouquetQ", chocoOrBouquetQ?.data);
  // console.log("featuredQ", featuredQ?.data);
  // console.log("latestQ", latestQ?.data);
  // console.log("perfumesQ", perfumesQ?.data);
  // console.log("preservedQ", preservedQ?.data);

  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <FancySlick />

        {/* Flowers Beyond Ordinary */}
        {flowerInVasesQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="Flowers Beyond Ordinary"
            ar_title="زهور تتجاوز العادي"
            products={asList(flowerInVasesQ.data)}
          />
        )}

        {/* Explore Unique Gift Ideas (static categories) */}
        <GiftIdeasSection
          en_title="Explore Unique Gift Ideas"
          ar_title="استكشف أفكار هدايا فريدة"
          items={giftIdeas}
        />

        {/* Gifts For Every Moment (static slider) */}
        <CategoriesSlider
          en_title="Gifts For Every Moment"
          ar_title="هدايا لكل لحظة"
          items={giftMoments}
          onItemClick={(item) => console.log("clicked:", item.id)}
        />

        {/* Best Sellers -> Top sold */}
        {topSoldQ.isLoading ? (
          <GridLoader />
        ) : (
          <ShowcaseProducts
            products={asList(topSoldQ.data)}
            en_title="Best Sellers"
            ar_title="الأكثر مبيعًا"
          />
        )}

        {/* House Of Delights -> chocolates OR hand bouquets */}
        {chocoOrBouquetQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="House Of Delights"
            ar_title="بيت المسرات"
            products={asList(chocoOrBouquetQ.data)}
          />
        )}

        {/* Simply Timeless -> featured */}
        {featuredQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="Simply Timeless"
            ar_title="ببساطة خالد"
            products={asList(friendsQ.data)}
          />
        )}

        {/* Latest & Loveliest -> newest */}
        {friendsQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="Latest & Loveliest"
            ar_title="الأحدث والأجمل"
            products={asList(featuredQ.data)}
          />
        )}

        {/* Perfumes For Every Personality */}
        {perfumesQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="Perfumes For Every Personality"
            ar_title="عطور لكل شخصية"
            products={asList(perfumesQ.data)}
          />
        )}

        {/* Forever Beautiful -> preserved flowers */}
        {preservedQ.isLoading ? (
          <GridLoader />
        ) : (
          <ProductsSection
            en_title="Forever Beautiful"
            ar_title="جميلة إلى الأبد"
            products={asList(preservedQ.data)}
          />
        )}

        {/* Discover New Ideas (static) */}
        <LatestCollection
          collections={collections}
          en_title="Discover New Ideas"
          ar_title="اكتشف أفكارًا جديدة"
        />

        {/* Brands You'll Love (static) */}
        <GiftIdeasSection
          en_title="Brands You'll Love"
          ar_title="ماركات ستعجبك"
          items={brands}
        />

        {/* Gifts For Everyone (static recipients) */}
        <CategoriesSlider
          className="bg-[#F0E9E0] scale-[.95]"
          en_title="Gifts For Everyone"
          ar_title="هدايا للجميع"
          items={recipients}
          onItemClick={(item) => console.log("clicked:", item.id)}
        />
      </main>

      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default HomePage;
