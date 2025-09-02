import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart Products/Cart";
import Footer from "../components/Footer";

const CartPage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <Cart />
      </main>

      <Footer />
    </>
  );
};

export default CartPage;
