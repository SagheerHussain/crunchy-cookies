import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FilterGiftPage from "./pages/FilterGiftPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/filters/:category" element={<FilterGiftPage />} />
    </Routes>
  );
}
