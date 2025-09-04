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

import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/filters/:category" element={<FilterGiftPage />} />
      <Route path="/wishlist/:id" element={<WishlistPage />} />
      <Route path="/order-history/:id" element={<OrderHistoryPage />} />
      <Route path="/cart/:id" element={<CartPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/member/:id" element={<ProfilePage />} />
      <Route path="/gift-detail/:id" element={<GiftDetailPage />} />
    </Routes>
  );
}
