import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FilterGiftPage from "./pages/FilterGiftPage";
import WishlistPage from "./pages/WishlistPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/filters/:category" element={<FilterGiftPage />} />
      <Route path="/wishlist/:id" element={<WishlistPage />} />
    </Routes>
  );
}
