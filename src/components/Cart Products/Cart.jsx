// client/src/pages/Cart/Cart.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiTruck,
  FiPhone,
  FiGift,
  FiX,
} from "react-icons/fi";
import previewCard from "/images/preview-card.png";
import PaymentMethod from "../PaymentMethod";
import { useCartFlag } from "../../context/CartContext";

const CURRENCY = (n) => `QAR ${Number(n || 0).toLocaleString()}`;
const PANEL_RING = "ring-1 ring-primary/10";
import { Link, useParams } from "react-router-dom";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { useTranslation } from "react-i18next";

// hooks to fetch/mutate cart
import { useCartByUser } from "../../hooks/cart/useCart";
import {
  useSetItemQty,
  useRemoveItemFromCart,
} from "../../hooks/cart/useCartMutation";

export default function Cart() {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

   const { setUpdate } = useCartFlag();

  // get userId from route params
  const { id } = useParams();

  // toast state (slide-in/out)
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastInRef = useRef(null);
  const toastOutRef = useRef(null);

  const showToast = (msg) => {
    if (toastInRef.current) clearTimeout(toastInRef.current);
    if (toastOutRef.current) clearTimeout(toastOutRef.current);

    setToast(msg);
    setToastShow(true); // slide in

    // stay visible 3s then slide out
    toastInRef.current = setTimeout(() => {
      setToastShow(false);
      // wait for animation to finish (300ms) then clear text
      toastOutRef.current = setTimeout(() => setToast(""), 350);
    }, 3000);
  };

  // local editable copy of items for UI (selection, optimistic qty)
  const [items, setItems] = useState([]);
  const [phones, setPhones] = useState({ sender: "", receiver: "" });
  const [cardMsg, setCardMsg] = useState("");
  const [voucher, setVoucher] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // fetch user cart
  const { data: cartRes, isLoading: cartLoading } = useCartByUser(id);

  // map API items -> UI items
  useEffect(() => {
    const apiItems = cartRes?.data?.items || [];
    const mapped = apiItems.map((it) => {
      const p = it?.product || {};
      return {
        id: String(p?._id || it?.product),         // UI key
        selected: true,
        qty: Number(it?.qty || 1),
        price: Number(p?.price || 0),
        image: p?.images?.[0]?.url || p?.featuredImage,
        en_title: p?.title || p?.name || "—",
        ar_title: p?.ar_title || p?.title || p?.name || "—",
        productId: String(p?._id || it?.product),   // for API
      };
    });
    setItems(mapped);
  }, [cartRes]);

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0),
    [selectedItems]
  );
  const delivery = selectedItems.length ? 15 : 0;
  const total = subtotal + delivery;

  // mutations
  const { mutateAsync: setQtyMut, isPending: qtyUpdating } = useSetItemQty();
  const { mutateAsync: removeItemMut, isPending: removing } = useRemoveItemFromCart();

  const toggleSelect = (productId) =>
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, selected: !i.selected } : i))
    );

  // qty change (optimistic UI + server update)
  const changeQty = async (productId, delta) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;

    const prevQty = Number(item.qty);
    const newQty = Math.max(1, prevQty + delta);

    // optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, qty: newQty } : i))
    );

    try {
      await setQtyMut({ user: id, productId: item.productId, qty: newQty });
    } catch {
      // revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, qty: prevQty } : i))
      );
    }
  };

  // remove item (with toast)
  const removeItem = async (productId) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;

    const prev = items;
    // optimistic remove
    setItems((p) => p.filter((i) => i.id !== productId));

    try {
      await removeItemMut({ user: id, productId: item.productId });
      setUpdate((u) => !u);
      // success toast
      showToast(langClass ? "أُزيل من السلة" : "Removed from cart");
    } catch {
      // revert on error
      setItems(prev);
    }
  };

  return (
    <section id="cart" className="pt-4 pb-10">
      {/* ✅ Bottom Toast with slide animation */}
      {toast && (
        <div
          className={[
            "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
            toastShow ? "bottom-8 translate-y-0 opacity-100"
                      : "bottom-0 translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <div className="custom-container pb-10">
        <Link to={"/"} className="px-4">
          <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full">
            {langClass ? (
              <MdArrowForwardIos size={24} className="cursor-pointer text-primary" />
            ) : (
              <MdOutlineArrowBackIos size={24} className="cursor-pointer text-primary" />
            )}
          </div>
        </Link>

        {/* Header */}
        <h1 className="text-4xl text-primary mt-4 px-4">
          {langClass ? "عربة التسوق" : "CART"}
        </h1>

        <div className="grid lg:grid-cols-2 gap-y-6 mt-10">
          {/* LEFT: Items */}
          <div className={`bg-primary_light_mode border mx-4 px-4 text-primary_light_mode border-primary/20 rounded-2xl`}>
            <div className="flex items-center justify-between p-5 border-b border-primary/20">
              <h5 className="text-2xl font-semibold text-primary">
                {langClass ? "إجمالي العناصر" : "Total Items"}
              </h5>
              <div className="text-2xl font-semibold text-primary">
                {cartLoading ? "…" : items.length}
              </div>
            </div>

            <div className="py-4 pt-4 pb-2 text-black text-lg font-medium">
              {langClass
                ? "حدد العناصر التي تريد شراءها"
                : "Select Items You Want To Purchase"}
            </div>

            {/* Items list */}
            <div className="pt-4 pb-5 space-y-4 overflow-y-auto max-h-[900px]">
              {cartLoading && (
                <p className="text-sm text-slate-500 px-2">
                  {langClass ? "جارِ تحميل سلة التسوق…" : "Loading your cart…"}
                </p>
              )}

              {!cartLoading && items.length === 0 && (
                <p className="text-sm text-slate-500 px-2">
                  {langClass ? "لا توجد عناصر في سلتك." : "There are no items in your cart."}
                </p>
              )}

              {items.map((i) => (
                <article
                  key={i.id}
                  className="relative flex items-center gap-4 p-3 pl-12 rounded-2xl border border-primary/20 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
                  }}
                >
                  {/* Custom checkbox */}
                  <button
                    aria-label="select"
                    onClick={() => toggleSelect(i.id)}
                    style={{ direction: langClass ? "rtl" : "ltr" }}
                    className={`
                      absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded
                      border-2 ${i.selected ? "border-primary" : "border-primary/30"}
                      grid place-items-center bg-white transition
                      focus:outline-none
                    `}
                  >
                    <span
                      className={`h-3 w-3 rounded-sm ${
                        i.selected ? "bg-primary" : "bg-transparent"
                      } transition`}
                    />
                  </button>

                  {/* Image */}
                  <img
                    src={i?.image}
                    alt={langClass ? i.ar_title : i.en_title}
                    className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                  />

                  {/* Title + meta */}
                  <div className="flex-1">
                    <h5 className="text-black md:text-base text-sm font-medium">
                      {langClass ? i.ar_title : i.en_title}
                    </h5>
                    <div className="text-primary font-semibold text-sm mt-2 mb-4">
                      {CURRENCY(i.price)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[#333] text-sm">
                      <FiTruck className="text-primary" />
                      Express Delivery
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col">
                    {/* Qty stepper */}
                    <div className="flex md:flex-row flex-col jsutify-center items-center">
                      <button
                        onClick={() => changeQty(i.id, -1)}
                        disabled={qtyUpdating}
                        className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center hover:bg-slate-50 disabled:opacity-60"
                      >
                        <FiMinus className="text-black" />
                      </button>
                      <div className="md:w-10 font-semibold text-slate-700 text-center">
                        {i.qty}
                      </div>
                      <button
                        onClick={() => changeQty(i.id, +1)}
                        disabled={qtyUpdating}
                        className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center hover:bg-slate-50 disabled:opacity-60"
                      >
                        <FiPlus className="text-primary" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(i.id)}
                      disabled={removing}
                      className="text-rose-400 hover:text-rose-500 p-2 disabled:opacity-60"
                      aria-label="remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: Details + Summary */}
          <div className="space-y-6">
            {/* Details */}
            <div className={`bg-primary_light_mode border mx-4 px-4 border-primary/20 rounded-2xl ${PANEL_RING}`}>
              <div className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {langClass ? "تفاصيل" : "Details"}
                </h5>
              </div>

              <div className="py-4 space-y-5">
                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-primary font-medium">
                      {langClass ? "هاتف المرسل" : "Sender Phone"}
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
                      {langClass ? "هاتف المتلقي" : "Receiver Phone"}
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
                    {langClass ? "رسالة البطاقة" : "Card Message"}
                  </span>
                  <textarea
                    rows={3}
                    value={cardMsg}
                    onChange={(e) => setCardMsg(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-primary/20 p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={`${langClass ? "رسالتك" : "Your message…"}`}
                  />
                </label>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button className="px-6 py-2.5 rounded-xl border border-primary/20 text-[#333] hover:bg-primary hover:text-white font-medium transition-all duration-200">
                    {langClass ? "يلغي" : "Cancel"}
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/70"
                  >
                    {langClass ? "معاينة" : "Preview"}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={`bg-primary_light_mode mx-4 px-4 border-primary/20 rounded-2xl ${PANEL_RING}`}>
              <header className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {langClass ? "ملخص الطلب" : "Order Summary"}
                </h5>
              </header>

              <div className="py-4 space-y-5">
                <Row
                  label={`${langClass ? "المجموع الفرعي" : "Subtotal"}`}
                  value={CURRENCY(subtotal)}
                />
                <Row
                  label={`${langClass ? "رسوم التوصيل" : "Delivery charges"}`}
                  value={CURRENCY(delivery)}
                />
                <p className="text-[#333] text-sm leading-relaxed max-w-sm">
                  {langClass
                    ? ".يرجى ملاحظة أن بعض المناطق والتوصيل السريع قد يتطلبان رسوم توصيل إضافية"
                    : "Please note that specific regions and express delivery may incur extra delivery fees"}
                </p>
                <hr className="border-primary/20" />
                <Row
                  label={
                    <span className="font-semibold text-lg">
                      {langClass ? "المجموع" : "Total"}
                    </span>
                  }
                  value={
                    <span className="font-semibold text-lg text-primary">
                      {CURRENCY(total)}
                    </span>
                  }
                />

                <PaymentMethod />

                <button
                  disabled={!selectedItems.length}
                  className={`mt-2 w-full py-3 rounded-xl text-white font-medium ${
                    selectedItems.length
                      ? "bg-primary hover:opacity-90"
                      : "bg-primary/50 cursor-not-allowed"
                  }`}
                >
                  {langClass ? "الدفع" : "Check out"}
                </button>

                <hr className="border-primary/20" />

                <div>
                  <div className="text-primary text-xl font-semibold mb-3">
                    {langClass ? "بطاقة قسيمة" : "Voucher Card"}
                  </div>
                  <div className="flex md:flex-row flex-col gap-3">
                    <input
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      placeholder={langClass ? "أدخل كود القسيمة" : "Enter Voucher Code"}
                      className="flex-1 rounded-xl border-2 border-primary/20 p-3 focus:outline-none"
                    />
                    <button className="px-6 py-2 md:py-0 rounded-xl bg-primary text-white font-medium hover:bg-primary/70">
                      {langClass ? "يتقدم" : "Apply"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        phones={phones}
        cardMsg={cardMsg}
        items={selectedItems}
      />
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[#333]">
      <span className="font-medium">{label}</span>
      <span className="text-[#111] font-medium">{value}</span>
    </div>
  );
}

/* ---------- Modal Component ---------- */
function PreviewModal({ open, onClose, phones, cardMsg, items }) {
  if (!open) return null;

  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 mx-auto w-[860px] max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <div className={`bg-white border border-primary/20 rounded-3xl shadow-2xl ${PANEL_RING}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiGift />
              </span>
              <h3 className="text-primary text-xl">
                {langClass ? "تاريخ" : "Details"}
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
                  {langClass ? "هاتف المرسل :" : "Sender Phone :"}
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
                  {langClass ? "هاتف المتلقي :" : "Receiver Phone :"}
                </span>
                <input
                  value={phones.receiver}
                  disabled
                  placeholder="+974 0000 576"
                  className="mt-2 w-full rounded-xl border-2 border-primary/20 p-2.5 bg-white text-slate-700 cursor-default"
                />
              </label>
            </div>

            {/* Message + Card image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-primary font-medium">
                  {langClass ? "رسالة البطاقة :" : "Card Message :"}
                </span>
                <textarea
                  value={cardMsg}
                  placeholder={langClass ? "أدخل رسالتك" : "Enter your message"}
                  disabled
                  rows={6}
                  className="mt-2 w-full rounded-xl h-[300px] xl:h-[350px] border-2 border-primary/20 p-3 bg-white text-slate-700 cursor-default"
                />
              </label>

              <label className="block">
                <span className="text-primary font-medium">
                  {langClass ? "بطاقة :" : "Card :"}
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

            {/* Items */}
            <div>
              <div className="text-primary font-medium mb-2">
                {langClass ? "أغراض :" : "Items :"}
              </div>
              <div className="space-y-3 max-h-[120px] overflow-y-auto">
                {items.map((i) => (
                  <article
                    key={i.id}
                    className="relative flex items-center gap-4 p-3 pl-4 rounded-2xl border border-primary/20 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
                    }}
                  >
                    <img
                      src={i.image}
                      alt={langClass ? i.ar_title : i.en_title}
                      className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                    />
                    <div className="flex-1">
                      <h5 className="text-black font-medium">
                        {langClass ? i.ar_title : i.en_title}
                      </h5>
                      <div className="text-primary font-semibold text-sm mt-2 mb-4">
                        {CURRENCY(i.price)}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[#333] text-sm">
                        <FiTruck className="text-primary" />
                        Express Delivery
                      </div>
                    </div>

                    {/* qty (disabled look) */}
                    <div className="flex items-center opacity-60 pointer-events-none">
                      <button className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center">
                        <FiMinus className="text-black" />
                      </button>
                      <div className="w-10 text-center font-semibold text-slate-700">
                        {i.qty}
                      </div>
                      <button className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center">
                        <FiPlus className="text-primary" />
                      </button>
                    </div>

                    <button
                      className="text-rose-400 p-2 opacity-60 pointer-events-none"
                      aria-label="remove"
                      title="Remove (disabled in preview)"
                    >
                      <FiTrash2 />
                    </button>
                  </article>
                ))}

                {items.length === 0 && (
                  <p className="text-sm text-slate-500">
                    {langClass ? "لا توجد عناصر محددة." : "No items selected."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
