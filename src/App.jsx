import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FilterGiftPage from "./pages/FilterGiftPage";
import WishlistPage from "./pages/WishlistPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import GiftDetailPage from "./pages/GiftDetailPage";
import BrandsPage from "./pages/BrandsPage";
import CategoriesPage from "./pages/CategoriesPage";
import OccasionsPage from "./pages/OccasionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute"
import { useLocation } from "react-router-dom";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import "./App.css";

export default function App() {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"   // 👈 ye animation karega
    });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/filters/:type/:name" element={<FilterGiftPage />} />
      <Route path="/order-history/:id" element={<OrderHistoryPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/wishlist/:id" element={<WishlistPage />} />
        <Route path="/cart/:id" element={<CartPage />} />
        <Route path="/member/:id" element={<ProfilePage />} />
      </Route>
      <Route path="/gift-detail/:id" element={<GiftDetailPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/occasions" element={<OccasionsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
