// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import PartnerWithUsPage from "./pages/PartnerWithUsPage";

import "./App.css";
import { getCurrentLatestOrder, updateOrder } from "./api/order";

export default function App() {
  const location = useLocation();

  // ─── Get userId safely from sessionStorage ─────────────────────────
  let userId = null;
  try {
    const stored = JSON.parse(sessionStorage.getItem("user"));
    userId = stored?.user?._id || null;
  } catch {
    userId = null;
  }

  // ─── Feedback popup state ──────────────────────────────────────────
  const [latestOrder, setLatestOrder] = useState(null); // only the order object
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  // Toast for feedback
  const [feedbackToast, setFeedbackToast] = useState("");
  const [feedbackToastVisible, setFeedbackToastVisible] = useState(false);

  // Satisfaction options (must match backend enum)
  const SATISFACTION_OPTIONS = [
    { value: "extremely satisfied", label: "Extremely satisfied" },
    { value: "satisfied", label: "Satisfied" },
    { value: "poor", label: "Poor" },
    { value: "very poor", label: "Very poor" },
  ];

  // ─── Scroll to top on route change ─────────────────────────────────
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // ─── Fetch latest order every 30 minutes + on route change ─────────
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchLatest = async () => {
      try {
        const { data } = await getCurrentLatestOrder(userId);
        // API shape: { success, message, data: orderOrNull }
        const order = data || null;

        if (!isMounted) return;

        if (
          order &&
          (order.status === "delivered" || order.status === "returned") &&
          !order.satisfaction
        ) {
          setLatestOrder(order);
          setShowFeedbackModal(true);
        } else {
          setLatestOrder(null);
          setShowFeedbackModal(false);
        }
      } catch (err) {
        console.error("getCurrentLatestOrder error:", err);
      }
    };

    // initial fetch
    fetchLatest();

    // poll every 30 minutes
    const intervalId = setInterval(fetchLatest, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId, location.pathname]);

  // ─── Toast helper ──────────────────────────────────────────────────
  const showFeedbackThanks = (msg) => {
    setFeedbackToast(msg);
    setFeedbackToastVisible(true);
    setTimeout(() => setFeedbackToastVisible(false), 3000);
  };

  // ─── Submit satisfaction to backend ────────────────────────────────
  const handleSubmitFeedback = async (value) => {
    if (!latestOrder?._id) return;

    try {
      setFeedbackSending(true);
      await updateOrder({ satisfaction: value }, latestOrder._id);

      // close popup and update local state so it doesn't show again
      setShowFeedbackModal(false);
      setLatestOrder((prev) =>
        prev ? { ...prev, satisfaction: value } : prev
      );

      showFeedbackThanks("Thank you for your feedback!");
    } catch (err) {
      console.error("updateOrder (satisfaction) error:", err);
    } finally {
      setFeedbackSending(false);
    }
  };

  return (
    <>
      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/filters/:type/:name" element={<FilterGiftPage />} />
        <Route path="/order-history/:id" element={<OrderHistoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist/:id" element={<WishlistPage />} />
          <Route path="/cart/:id" element={<CartPage />} />
          <Route path="/member/:id/:currentTab" element={<ProfilePage />} />
        </Route>
        <Route path="/gift-detail/:id" element={<GiftDetailPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/occasions" element={<OccasionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      {/* ─── FEEDBACK POPUP ─────────────────────────────────────────── */}
      {showFeedbackModal && latestOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-[90%] p-6">
            <h3 className="text-lg text-primary mb-1">
              How was your recent order?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Order&nbsp;
              <span className="font-semibold">{latestOrder.code}</span>
              {typeof latestOrder.grandTotal === "number" && (
                <>
                  {" "}
                  • Total:&nbsp;
                  <span className="font-medium">
                    QAR {latestOrder.grandTotal}
                  </span>
                </>
              )}
            </p>

            <p className="text-sm text-gray-700 mb-3">
              Please select a quick feedback option:
            </p>

            <div className="space-y-2">
              {SATISFACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  disabled={feedbackSending}
                  onClick={() => handleSubmitFeedback(opt.value)}
                  className="w-full text-sm py-2.5 rounded-lg border border-primary/20 px-4 hover:bg-primary_light_mode/20 text-primary flex items-center justify-between transition"
                >
                  <span className="font-normal">{opt.label}</span>
                  <span className="text-[10px] font-normal uppercase tracking-wide text-black">
                    Tap to select
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                disabled={feedbackSending}
                className="text-xs text-gray-600 font-normal hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FEEDBACK TOAST ─────────────────────────────────────────── */}
      {feedbackToastVisible && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-[70]">
          <div className="bg-primary text-white text-xs px-4 py-2 rounded-full shadow-lg">
            {feedbackToast}
          </div>
        </div>
      )}
    </>
  );
}
