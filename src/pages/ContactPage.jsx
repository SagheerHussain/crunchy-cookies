import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contact from "../components/Contact Us/Contact";

const ContactPage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
