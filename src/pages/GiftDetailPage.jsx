import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GiftDetail from "../components/Gift Detail/GiftDetail";

const GiftDetailPage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <GiftDetail />
      </main>

      <Footer />
    </>
  );
};

export default GiftDetailPage;
