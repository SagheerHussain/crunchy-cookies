import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileDashboard from "../components/Profile/Profile";
import ScrollToTopButton from "../components/ScrollToTop";

const ProfilePage = () => {
  return (
    <>
      <header id="header">
        <Topbar />
        <Navbar />
      </header>

      <main id="main">
        <ProfileDashboard />
      </main>

      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default ProfilePage;
