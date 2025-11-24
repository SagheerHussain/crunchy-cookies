// App.jsx
import React, { useEffect, useState, useRef } from "react";
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
import ToastNotification from "./components/ToastNotification";
import ClipLoader from "react-spinners/ClipLoader";
import Success from "./components/Success";
import Failed from "./components/Failed";

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

  // login / app start time ko track karo
  const loginAtRef = useRef(Date.now());

  // jab bhi userId set ho / change ho, ye "login time" maan lo
  useEffect(() => {
    if (userId) {
      loginAtRef.current = Date.now();
    }
  }, [userId]);

  // ─── Feedback popup state ──────────────────────────────────────────
  const [latestOrder, setLatestOrder] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  // animation control for popup
  const [feedbackMounted, setFeedbackMounted] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  // which option is currently being submitted
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("");

  // Toast for feedback
  const [feedbackToast, setFeedbackToast] = useState("");
  const [feedbackToastVisible, setFeedbackToastVisible] = useState(false);

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

  // ─── Fetch latest order every 30 seconds ───────────────────────────
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchLatest = async () => {
      try {
        // ✅ hard guard: login/app-start ke 30s se pehle kuch mat karo
        const now = Date.now();
        if (now - loginAtRef.current < 30_000) {
          return;
        }

        const { data } = await getCurrentLatestOrder(userId);
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

    // ⏱️ ab interval bhi 30s ka
    const intervalId = setInterval(fetchLatest, 5 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId, location.pathname, loginAtRef]);

  // ─── Popup open/close animation controller ─────────────────────────
  useEffect(() => {
    let timeoutId;

    if (showFeedbackModal) {
      setFeedbackMounted(true);
      requestAnimationFrame(() => {
        setFeedbackVisible(true);
      });
    } else {
      setFeedbackVisible(false);
      timeoutId = setTimeout(() => {
        setFeedbackMounted(false);
      }, 200);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showFeedbackModal]);

  const showFeedbackThanks = (msg) => {
    setFeedbackToast(msg);
    setFeedbackToastVisible(true);
  };

  const handleSubmitFeedback = async (value) => {
    if (!latestOrder?._id) return;

    try {
      setFeedbackSending(true);
      setSelectedSatisfaction(value);

      await updateOrder({ satisfaction: value }, latestOrder._id);

      setShowFeedbackModal(false);
      setLatestOrder((prev) =>
        prev ? { ...prev, satisfaction: value } : prev
      );

      showFeedbackThanks("Thank you for your feedback!");
    } catch (err) {
      console.error("updateOrder (satisfaction) error:", err);
    } finally {
      setFeedbackSending(false);
      // optional: setSelectedSatisfaction("");
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
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failed" element={<Failed />} />{" "}
        {/* simple error page */}
      </Routes>

      {/* ─── FEEDBACK POPUP (animated + per-button loader) ───────────── */}
      {feedbackMounted && latestOrder && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
            feedbackVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-xl max-w-md w-[90%] p-6 transform transition-all duration-200 ${
              feedbackVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
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
                  className="relative w-full text-sm py-2.5 rounded-lg border border-primary/20 px-4 hover:bg-primary_light_mode/20 text-primary flex items-center justify-between transition"
                >
                  {/* Normal content (hide while loading that option) */}
                  <div
                    className={`flex w-full items-center justify-between ${
                      feedbackSending && selectedSatisfaction === opt.value
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    <span className="font-normal">{opt.label}</span>
                    <span className="text-[10px] font-normal uppercase tracking-wide text-black">
                      Tap to select
                    </span>
                  </div>

                  {/* Loader overlay only on selected button */}
                  {feedbackSending && selectedSatisfaction === opt.value && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                      <ClipLoader size={18} color="#0b5a5e" />
                    </div>
                  )}
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
      <ToastNotification
        open={feedbackToastVisible}
        type="success"
        title="Thank you!"
        message={feedbackToast}
        duration={3000}
        onClose={() => setFeedbackToastVisible(false)}
      />
    </>
  );
}
