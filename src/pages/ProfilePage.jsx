import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileDashboard from "../components/Profile/Profile";

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
    </>
  );
};

export default ProfilePage;
