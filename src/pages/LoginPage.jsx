import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "../components/Auth/Login";
import ScrollToTopButton from "../components/ScrollToTop";

const LoginPage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <Login />
      </main>

      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default LoginPage;
