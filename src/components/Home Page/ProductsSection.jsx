// src/components/ProductsSection.jsx
import React from "react";
import ProductCard from "../ProductCard";
import Button from "../Button";
import { useTranslation } from "react-i18next";

const ProductsSection = ({ en_title, ar_title, products }) => {

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-10">
      <div className="custom-container">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="lg:text-[1.8rem] xl:text-[2.5rem] text-primary">{isAr ? ar_title : en_title}</h2>
          <Button href="/filters/chocolates" label={`${isAr ? "شاهد المزيد" : "See more"}`} />
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button label={`${isAr ? "تحميل المزيد" : "Load more"}`} />
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
