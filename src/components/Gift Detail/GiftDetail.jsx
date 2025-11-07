// client/src/pages/GiftDetail/GiftDetail.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { TbShoppingCart } from "react-icons/tb";
import FrequentlyBuyGifts from "./FrequentlyBuyGifts";
import { useTranslation } from "react-i18next";
import { useGiftDetail } from "../../hooks/products/useProducts";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useCartFlag } from "../../context/CartContext";

// cart hooks
import { useCartByUser } from "../../hooks/cart/useCart";
import {
  useAddItemToCart,
  useRemoveItemFromCart,
} from "../../hooks/cart/useCartMutation";

/* ===== Modal imports / helpers (aligned with Cart.jsx) ===== */
import {
  FiGift,
  FiPhone,
  FiTruck,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import previewCard from "/images/preview-card.png";
import { checkCoupon } from "../../api/coupon";
import { createOrder } from "../../api/order";
import Button from "../Button";

const CURRENCY = (n) => `QAR ${Number(n || 0).toLocaleString()}`;
const PANEL_RING = "ring-1 ring-primary/10";
const ORDER_CODE_KEY = "last_order_code";
const round2 = (n) =>
  Math.max(0, Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100);
function nextOrderCode(prefix = "SA") {
  const year = new Date().getFullYear();
  const last =
    localStorage.getItem(ORDER_CODE_KEY) || `${prefix}-${year}-000120`;
  const m = last?.match?.(/^([A-Z]+)-(\d{4})-(\d{6})$/);
  const lastNum = m ? parseInt(m[3], 10) : 120;
  const code = `${prefix}-${year}-${String(lastNum + 1).padStart(6, "0")}`;
  localStorage.setItem(ORDER_CODE_KEY, code);
  return code;
}

/* ---------- Preview Modal (same look/behavior as Cart preview) ---------- */
function InlinePreviewModal({ open, onClose, phones, cardMsg, item }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto w-[860px] max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <div
          className={`bg-white border border-primary/20 rounded-3xl shadow-2xl ${PANEL_RING}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiGift />
              </span>
              <h3 className="text-primary text-xl">
                {isAr ? "تفاصيل" : "Details"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-full border border-primary/20 text-slate-600 hover:bg-primary/10"
              aria-label="close"
            >
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Phones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-primary font-medium">
                  {isAr ? "هاتف المرسل :" : "Sender Phone :"}
                </span>
                <input
                  value={phones.sender}
                  disabled
                  placeholder="+974 2345 456"
                  className="mt-2 w-full rounded-xl border-2 border-primary/20 p-2.5 bg-white text-slate-700 cursor-default"
                />
              </label>

              <label className="block">
                <span className="text-primary font-medium">
                  {isAr ? "هاتف المتلقي :" : "Receiver Phone :"}
                </span>
                <input
                  value={phones.receiver}
                  disabled
                  placeholder="+974 0000 576"
                  className="mt-2 w-full rounded-xl border-2 border-primary/20 p-2.5 bg-white text-slate-700 cursor-default"
                />
              </label>
            </div>

            {/* Message + Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-primary font-medium">
                  {isAr ? "رسالة البطاقة :" : "Card Message :"}
                </span>
                <textarea
                  value={cardMsg}
                  disabled
                  rows={6}
                  className="mt-2 w-full rounded-xl h-[300px] xl:h-[350px] border-2 border-primary/20 p-3 bg-white text-slate-700 cursor-default"
                />
              </label>

              <label className="block">
                <span className="text-primary font-medium">
                  {isAr ? "بطاقة :" : "Card :"}
                </span>
                <div className="mt-2 lg:h-[300px] xl:h-[350px] rounded-2xl overflow-hidden ring-1 ring-primary/20">
                  <img
                    src={previewCard}
                    alt="card"
                    className="h-full w-full object-cover"
                  />
                </div>
              </label>
            </div>

            {/* Item (disabled controls, like Cart preview) */}
            <div>
              <div className="text-primary font-medium mb-2">
                {isAr ? "أغراض :" : "Items :"}
              </div>
              <div className="space-y-3 max-h-[120px] overflow-y-auto">
                <article
                  className="relative flex items-center gap-4 p-3 pl-4 rounded-2xl border border-primary/20 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={isAr ? item.ar_title : item.en_title}
                    className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                  />
                  <div className="flex-1">
                    <h5 className="text-black font-medium">
                      {isAr ? item.ar_title : item.en_title}
                    </h5>
                    <div className="text-primary font-semibold text-sm mt-2 mb-4">
                      {CURRENCY(item.price)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[#333] text-sm">
                      <FiTruck className="text-primary" /> Express Delivery
                    </div>
                  </div>

                  <div className="flex items-center opacity-60 pointer-events-none">
                    <button className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center">
                      <FiMinus className="text-black" />
                    </button>
                    <div className="w-10 text-center font-semibold text-slate-700">
                      {item.qty}
                    </div>
                    <button className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center">
                      <FiPlus className="text-primary" />
                    </button>
                  </div>

                  <button
                    className="text-rose-400 p-2 opacity-60 pointer-events-none"
                    aria-label="remove"
                  >
                    <FiTrash2 />
                  </button>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Buy Now Modal --------------------------- */
function GiftBuyNowModal({
  open,
  onClose,
  userId,
  product,
  onToast = () => {},
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  // Hooks must always run — do NOT early-return before these
  const [qty, setQty] = useState(1);
  const [phones, setPhones] = useState({ sender: "", receiver: "" });
  const [cardMsg, setCardMsg] = useState("");
  const [voucher, setVoucher] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // compute defensively; still safe even when product is undefined
  const item = useMemo(() => {
    const p = product || {};
    const img = p?.images?.[0]?.url || p?.featuredImage;
    const priceNumber =
      typeof p?.price === "number"
        ? p.price
        : typeof p?.price?.sale === "number"
        ? p.price.sale
        : 0;
    return {
      id: String(p?._id || p?.id || "p1"),
      productId: String(p?._id || p?.id || "p1"),
      qty,
      price: Number(priceNumber),
      image: img,
      en_title: p?.title || p?.name || "—",
      ar_title: p?.ar_title || p?.title || p?.name || "—",
    };
  }, [product, qty]);

  const subtotal = Number(item.price) * Number(item.qty);
  const delivery = item.qty > 0 ? 200 : 0;
  const total = useMemo(() => {
    const base = subtotal + delivery;
    if (couponMessage && coupon) {
      return coupon?.type === "percentage"
        ? base - (base * coupon.value) / 100
        : base - coupon.value;
    }
    return base;
  }, [subtotal, delivery, coupon, couponMessage]);

  const changeQty = (delta) => setQty((q) => Math.max(1, q + delta));

  const applyCoupon = async (code) => {
    try {
      setLoadingCoupon(true);
      const res = await checkCoupon({ code });
      if (res?.success) {
        setCouponMessage(res.message);
        setCoupon(res.coupon);
      } else {
        setCouponMessage("");
        setCoupon(null);
      }
    } catch {
      setCouponMessage("");
      setCoupon(null);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setOrderLoading(true);
      if (!item?.productId) throw new Error("Missing product");

      const code = nextOrderCode("SA");
      const taxAmount = delivery;
      const grandTotal = round2(total);

      const orderPayload = {
        code,
        user: userId,
        items: [{ product: item.productId, quantity: Number(item.qty || 1) }],
        shippingAddress: {
          senderPhone: String(phones.sender || "").trim(),
          receiverPhone: String(phones.receiver || "").trim(),
        },
        taxAmount,
        cardMessage: cardMsg || "",
        cardImage: "",
        couponCode:
          couponMessage && (voucher || coupon?.code)
            ? String(voucher || coupon?.code)
            : undefined,
        grandTotal,
      };

      const res = await createOrder(orderPayload);
      if (res?.success) {
        onToast(res?.message || (isAr ? "تم تقديم الطلب" : "Order placed"));
        onClose(); // close modal
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOrderLoading(false);
    }
  };

  // After all hooks are declared, it's safe to short-circuit render
  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      {/* w-[1100px] max-w-[92vw] max-h-[94vh] overflow-y-auto */}
      <div className="relative z-10 mx-auto  w-[1100px] max-w-[92vw] max-h-[94vh] overflow-y-auto">
        <div
          className={`bg-white border border-primary/20 rounded-3xl shadow-2xl ${PANEL_RING}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiGift />
              </span>
              <h3 className="text-primary text-xl">
                {isAr ? "شراء الآن" : "Buy Now"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-full border border-primary/20 text-slate-600 hover:bg-primary/10"
              aria-label="close"
            >
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="grid lg:grid-cols-2 gap-y-6 gap-x-4 p-6">
            {/* LEFT: Item + Qty */}
            <div className="bg-primary_light_mode border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center justify-between p-3 border-b border-primary/20">
                <h5 className="text-2xl font-semibold text-primary">
                  {isAr ? "عنصر" : "Item"}
                </h5>
              </div>

              <div className="pt-4">
                <article
                  className="relative flex items-center gap-4 p-3 pl-4 rounded-2xl border border-primary/20 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={isAr ? item.ar_title : item.en_title}
                    className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                  />
                  <div className="flex-1">
                    <h5 className="text-black md:text-base text-sm font-medium">
                      {isAr ? item.ar_title : item.en_title}
                    </h5>
                    <div className="text-primary font-semibold text-sm mt-2 mb-4">
                      {CURRENCY(item.price)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[#333] text-sm">
                      <FiTruck className="text-primary" /> Express Delivery
                    </div>
                  </div>

                  {/* Qty stepper */}
                  <div className="flex items-center">
                    <button
                      onClick={() => changeQty(-1)}
                      className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center"
                    >
                      <FiMinus className="text-black" />
                    </button>
                    <div className="w-10 font-semibold text-slate-700 text-center">
                      {qty}
                    </div>
                    <button
                      onClick={() => changeQty(+1)}
                      className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center"
                    >
                      <FiPlus className="text-primary" />
                    </button>
                  </div>
                </article>
              </div>
            </div>

            {/* RIGHT: Details (card info) */}
            <div
              className={`bg-primary_light_mode border border-primary/20 rounded-2xl ${PANEL_RING}`}
            >
              <div className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {isAr ? "تفاصيل" : "Details"}
                </h5>
              </div>

              <div className="p-4 space-y-5">
                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-primary font-medium">
                      {isAr ? "هاتف المرسل" : "Sender Phone"}
                    </span>
                    <div className="mt-2 relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+974 2345 456"
                        value={phones.sender}
                        onChange={(e) =>
                          setPhones((p) => ({ ...p, sender: e.target.value }))
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-primary font-medium">
                      {isAr ? "هاتف المتلقي" : "Receiver Phone"}
                    </span>
                    <div className="mt-2 relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+974 0000 576"
                        value={phones.receiver}
                        onChange={(e) =>
                          setPhones((p) => ({ ...p, receiver: e.target.value }))
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </label>
                </div>

                {/* Card message */}
                <label className="block">
                  <span className="text-primary font-medium">
                    {isAr ? "رسالة البطاقة" : "Card Message"}
                  </span>
                  <textarea
                    rows={3}
                    value={cardMsg}
                    onChange={(e) => setCardMsg(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-primary/20 p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={isAr ? "رسالتك" : "Your message…"}
                  />
                </label>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border border-primary/20 text-[#333] hover:bg-primary hover:text-white font-medium transition-all duration-200"
                  >
                    {isAr ? "يلغي" : "Cancel"}
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/70"
                  >
                    {isAr ? "معاينة" : "Preview"}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div
              className={`lg:col-span-2 bg-primary_light_mode border border-primary/20 rounded-2xl ${PANEL_RING}`}
            >
              <header className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {isAr ? "ملخص الطلب" : "Order Summary"}
                </h5>
              </header>

              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between text-[#333]">
                  <span className="font-medium">
                    {isAr ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                  <span className="text-[#111] font-medium">
                    {CURRENCY(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#333]">
                  <span className="font-medium">
                    {isAr ? "رسوم التوصيل" : "Delivery charges"}
                  </span>
                  <span className="text-[#111] font-medium">
                    {CURRENCY(delivery)}
                  </span>
                </div>
                <p className="text-[#333] text-sm leading-relaxed max-w-sm">
                  {isAr
                    ? ".يرجى ملاحظة أن بعض المناطق والتوصيل السريع قد يتطلبان رسوم توصيل إضافية"
                    : "Please note that specific regions and express delivery may incur extra delivery fees"}
                </p>
                <hr className="border-primary/20" />

                {couponMessage && (
                  <div className="flex items-center justify-between text-[#333]">
                    <span className="font-medium">
                      {isAr ? "خصم القسيمة" : "Coupon Discount"}
                    </span>
                    <span className="text-sm font-medium text-green-500">
                      {coupon?.type === "percentage"
                        ? `${coupon?.value}%`
                        : CURRENCY(coupon?.value)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">
                    {isAr ? "المجموع" : "Total"}
                  </span>
                  <span className="font-semibold text-lg text-primary">
                    {CURRENCY(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={orderLoading}
                  className={`${
                    orderLoading ? "opacity-50" : "opacity-100"
                  } mt-2 w-full py-3 rounded-xl text-white font-medium bg-primary hover:opacity-90`}
                >
                  {!orderLoading ? (
                    <>{isAr ? "الدفع" : "Check out"}</>
                  ) : (
                    <ClipLoader color="#fff" size={20} />
                  )}
                </button>

                <hr className="border-primary/20" />

                {/* <div>
                  <div className="text-primary text-xl font-semibold mb-3">
                    {isAr ? "بطاقة قسيمة" : "Voucher Card"}
                  </div>
                  <div className="flex md:flex-row flex-col gap-3">
                    <input
                      value={voucher}
                      disabled={!!couponMessage}
                      onChange={(e) => setVoucher(e.target.value)}
                      placeholder={
                        isAr ? "أدخل كود القسيمة" : "Enter Voucher Code"
                      }
                      className="flex-1 rounded-xl border-2 border-primary/20 p-3 focus:outline-none"
                    />
                    <button
                      onClick={() => applyCoupon(voucher)}
                      disabled={loadingCoupon || !!couponMessage}
                      className={`${
                        loadingCoupon || couponMessage
                          ? "opacity-50"
                          : "opacity-100"
                      } px-6 py-2 md:py-0 rounded-xl bg-primary text-white font-medium hover:bg-primary/70`}
                    >
                      {!loadingCoupon ? (
                        <>{isAr ? "يتقدم" : "Apply"}</>
                      ) : (
                        <ClipLoader color="#fff" size={20} />
                      )}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className="text-green-600 text-sm mt-2">
                      {couponMessage}
                    </p>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <InlinePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        phones={phones}
        cardMsg={cardMsg}
        item={item}
      />
    </div>
  );
}

/* =============================== Page =============================== */
const ProductDetail = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { id } = useParams();

  const { setUpdate } = useCartFlag();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const imgWrapRef = useRef(null);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastInRef = useRef(null);
  const toastOutRef = useRef(null);

  const LENS_SIZE = 160;
  const ZOOM = 2.2;

  const { data: product, isLoading } = useGiftDetail(id);

  // user for cart & order
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("user"));
      if (stored?.user?._id) setUserId(stored.user._id);
    } catch {}
  }, []);

  // cart state
  const {
    data: cartRes,
    isLoading: cartLoading,
    isFetching: cartFetching,
  } = useCartByUser(userId);

  const cartItems = useMemo(
    () =>
      cartRes?.data?.items && Array.isArray(cartRes.data.items)
        ? cartRes.data.items
        : [],
    [cartRes]
  );

  const inCart = useMemo(() => {
    const pid = String(product?._id || "");
    return cartItems.some(
      (it) => String(it?.product?._id ?? it?.product) === pid
    );
  }, [cartItems, product?._id]);

  const { mutateAsync: addItemToCart, isPending: addPending } =
    useAddItemToCart();
  const { mutateAsync: removeItemFromCart, isPending: removePending } =
    useRemoveItemFromCart();

  const resolvingCart = cartLoading || cartFetching;
  const mainBtnDisabled = resolvingCart || addPending || removePending;

  // bottom toast with slide animation
  const showToast = (msg) => {
    if (toastInRef.current) clearTimeout(toastInRef.current);
    if (toastOutRef.current) clearTimeout(toastOutRef.current);

    setToast(msg);
    setToastShow(true);
    toastInRef.current = setTimeout(() => {
      setToastShow(false);
      toastOutRef.current = setTimeout(() => setToast(""), 350);
    }, 3000);
  };

  // Buy Now modal state
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  // derived fields
  const title = isAr ? product?.ar_title || product?.title : product?.title;
  const priceNumber = Number(
    typeof product?.price === "number"
      ? product.price
      : product?.price?.sale || 0
  );
  const priceText = `${
    product?.currency || "QAR"
  } ${priceNumber.toLocaleString()}`;
  const imageUrls =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.map((img) => img?.url).filter(Boolean)
      : product?.featuredImage
      ? [product.featuredImage]
      : [];
  const htmlDescription = isAr
    ? product?.ar_description || product?.description || ""
    : product?.description || product?.ar_description || "";
  const stockText = `${product?.remainingStocks ?? 0} ${
    isAr ? "متوفر" : "in stock"
  }`;
  const categoryText =
    product?.categories?.[0]?.[isAr ? "ar_name" : "name"] ||
    product?.type?.[isAr ? "ar_name" : "name"] ||
    (isAr ? "فئة" : "Category");
  const conditionText = product?.condition || (isAr ? "جديد" : "new");
  const arrangements = Array.isArray(product?.arrangements)
    ? product.arrangements
    : [];

  // magnifier
  const handleMouseEnter = () => setIsMagnifying(true);
  const handleMouseLeave = () => setIsMagnifying(false);
  const handleMouseMove = (e) => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const half = LENS_SIZE / 2;
    setLensPos({
      x: Math.max(half, Math.min(relX, rect.width - half)),
      y: Math.max(half, Math.min(relY, rect.height - half)),
    });
  };
  const backgroundSize = (wrap) =>
    wrap
      ? `${wrap.clientWidth * ZOOM}px ${wrap.clientHeight * ZOOM}px`
      : "auto";
  const backgroundPosition = `${-(lensPos.x * ZOOM - LENS_SIZE / 2)}px ${-(
    lensPos.y * ZOOM -
    LENS_SIZE / 2
  )}px`;

  // cart handlers
  const handleAddToCart = async () => {
    if (!userId) return;
    await addItemToCart({ user: userId, product: product._id, qty: 1 });
    setUpdate((u) => !u);
    showToast(isAr ? "أُضيفت إلى السلة" : "Added to cart");
  };

  const handleRemoveFromCart = async () => {
    if (!userId) return;
    await removeItemFromCart({ user: userId, productId: product._id });
    setUpdate((u) => !u);
    showToast(isAr ? "أُزيلت من السلة" : "Removed from cart");
  };

  // helper (robust to ids or populated objects)
  const hasEnoughTypeStock = useMemo(() => {
    const carry = Number(product?.totalPieceCarry || 0);

    // if no types, allow add-to-cart
    if (!Array.isArray(product?.type) || product.type.length === 0) return true;

    // if types are populated, they have remainingStock; if not populated, treat as OK
    return product.type.some((t) => {
      const rem = Number(
        (t && typeof t === "object" ? t.remainingStock : null) ?? Infinity
      );
      return rem > carry;
    });
  }, [product?.type, product?.totalPieceCarry]);

  const isOutOfStock = product?.stockStatus === "out_of_stock";
  const canAddToCart = !isOutOfStock && hasEnoughTypeStock;

  // ---- then your early returns are fine ----
  if (isLoading) {
    return (
      <section className="py-10">
        <div className="custom-container">
          <div className="flex items-center justify-center h-64">
            <ClipLoader color="#0fb4bb" size={50} />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-10">
        <div className="custom-container">
          <div className="text-center text-red-600">Product not found.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      {/* bottom toast */}
      {toast && (
        <div
          className={[
            "fixed left-1/2 bottom-0 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
            toastShow
              ? "bottom-8 translate-y-0 opacity-100"
              : "bottom-0 translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <div className="custom-container">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Images */}
          <div className="relative md:w-1/2 xl:w-[40%]">
            <div
              ref={imgWrapRef}
              className="relative w-full rounded-xl h-[500px] overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {imageUrls[activeImgIndex] ? (
                <img
                  src={imageUrls[activeImgIndex]}
                  alt="Product"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-primary/60">
                  No image
                </div>
              )}

              {isMagnifying && imageUrls[activeImgIndex] && (
                <div
                  className="pointer-events-none rounded-full border border-white/70 shadow-xl"
                  style={{
                    position: "absolute",
                    width: `160px`,
                    height: `160px`,
                    top: `${lensPos.y - 80}px`,
                    left: `${lensPos.x - 80}px`,
                    backgroundImage: `url(${imageUrls[activeImgIndex]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: backgroundSize(imgWrapRef.current),
                    backgroundPosition,
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.3)",
                    backdropFilter: "blur(0.5px)",
                  }}
                />
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="grid grid-cols-3 gap-3">
                  {imageUrls.map((image, index) => (
                    <div className="relative" key={index}>
                      <img
                        src={image}
                        alt={`Additional Product ${index + 1}`}
                        className={`${
                          activeImgIndex === index
                            ? "border-2 border-primary"
                            : ""
                        } rounded-lg object-cover lg:w-[80px] lg:h-[80px] h-[60px] cursor-pointer w-[60px]`}
                        onClick={() => setActiveImgIndex(index)}
                      />
                      <div
                        className={`absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg ${
                          activeImgIndex === index ? "" : "hidden"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 mt-4 md:mt-0 md:w-1/2 xl:w-[60%]">
            <div className="flex items-center justify-between">
              <h5 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary">
                {title}
              </h5>
              <p className="lg:text-md xl:text-3xl font-semibold text-primary">
                {priceText}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 mt-4 gap-2">
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <CiDeliveryTruck size={18} className="text-primary" />
                {stockText}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <IoLocationOutline size={18} className="text-primary" />
                {categoryText}
              </span>
              <span className="border-primary/30 flex items-center justify-center gap-2 border text-black py-2 px-4 rounded-lg text-xs 2xl:text-sm">
                <MdOutlineWorkspacePremium size={18} className="text-primary" />
                {isAr ? "الحالة: " : "Condition: "}
                {conditionText}
              </span>
            </div>

            <div className="description-filled-box mt-6">
              <h5 className="text-white bg-primary inline-block rounded-lg px-4 py-2 text-xs mb-4">
                {isAr ? "وصف" : "Description"}
              </h5>
              <div
                className="text-black text-sm prose max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              {product?.note && (
                <p className="text-sm mt-4">
                  <span className="font-medium text-primary">
                    {isAr ? "ملاحظة:" : "Note:"}
                  </span>{" "}
                  {product.note}
                </p>
              )}
            </div>

            {arrangements.length > 0 && (
              <div className="mt-4 text-gray-600">
                <h6
                  className="font-medium text-xl mb-4"
                  style={{ color: "#000 !important" }}
                >
                  {isAr ? "يتضمن الترتيب:" : "Arrangement Includes:"}
                </h6>
                <ul className="list-disc pl-5">
                  {arrangements.map((a, idx) => (
                    <li key={idx} className="text-black text-sm mb-2">
                      {isAr ? a?.ar || a?.en || a : a?.en || a?.ar || a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product?.sku && (
              <div className="sku mt-6">
                <h5 className="font-medium text-primary text-xl">
                  {product.sku}
                </h5>
              </div>
            )}

            <div className="flex xl:w-1/2 items-center gap-4 mt-4">
              {/* BUY NOW */}
              {/* <button
                onClick={() => setBuyNowOpen(true)}
                className="bg-primary border border-primary hover:border-primary/80 hover:bg-primary/80 text-center w-1/2 font-medium text-white py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2"
              >
                {isAr ? "شراء الآن" : "Buy Now"}
              </button> */}

              {resolvingCart ? (
                <button
                  className="border border-primary bg-primary_light_mode text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2 opacity-60"
                  disabled
                >
                  <ClipLoader size={18} color="#0fb4bb" />
                  {isAr ? "جاري التحقق..." : "Checking..."}
                </button>
              ) : canAddToCart ? (
                inCart ? (
                  <button
                    onClick={handleRemoveFromCart}
                    disabled={mainBtnDisabled}
                    className="border text-white bg-red-500 hover:bg-red-600 border-red-500 text-center w-1/2 font-medium py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2"
                  >
                    <TbShoppingCart size={20} />
                    {isAr ? "إزالة من السلة" : "Remove From Cart"}
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={mainBtnDisabled}
                    className="border border-primary bg-primary_light_mode hover:bg-primary_light_mode/10 text-center w-1/2 font-medium text-primary py-3 px-4 rounded-lg mt-6 flex items-center justify-center gap-2"
                  >
                    <TbShoppingCart size={20} />
                    {isAr ? "إضافة إلى السلة" : "Add to Cart"}
                  </button>
                )
              ) : (
                <Button
                  disabled
                  label={
                    langClass === "ar" ? "إنتهى من المخزن" : "Out Of Stock"
                  }
                  isBgColor={true}
                />
              )}
            </div>
          </div>
        </div>

        {product?.suggestedProducts?.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl text-primary">
              {isAr
                ? "المنتجات الأكثر شراءًا معاً"
                : "Frequently Bought Together"}
            </h3>
            <div className="mt-4 border border-primary rounded-3xl">
              <FrequentlyBuyGifts
                data={product}
                product={product?.suggestedProducts}
                userId={userId}
                onToast={showToast}
              />
            </div>
          </div>
        )}
      </div>

      {/* BUY NOW MODAL (conditionally mounted to avoid hook-order issues) */}
      {buyNowOpen && (
        <GiftBuyNowModal
          open
          onClose={() => setBuyNowOpen(false)}
          userId={userId}
          product={product}
          onToast={showToast} // bottom animation toast on success
        />
      )}
    </section>
  );
};

export default ProductDetail;
