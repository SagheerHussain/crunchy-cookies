// src/components/ProductsSection.jsx
import React from "react";
import ProductCard from "../ProductCard";
import Button from "../Button";

const ProductsSection = ({ title, products }) => {
  return (
    <section className="py-10">
      <div className="custom-container">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="xl:text-[2.5rem] text-primary">{title}</h2>
          <Button label="See more" />
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <Button label="Load more" />
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
