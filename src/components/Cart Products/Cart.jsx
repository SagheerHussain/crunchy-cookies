import React, { useMemo, useState } from "react";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiTruck,
  FiPhone,
  FiGift,
  FiX,
} from "react-icons/fi";

const CURRENCY = (n) => `QAR ${n.toLocaleString()}`;
const PANEL_RING = "ring-1 ring-primary/10";
import { initialItems } from "../../lib/cartItems";
import { Link } from "react-router-dom";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function Cart() {
    const { i18n } = useTranslation();
    const langClass = i18n.language === "ar";

  const [items, setItems] = useState(initialItems);
  const [phones, setPhones] = useState({ sender: "", receiver: "" });
  const [cardMsg, setCardMsg] = useState(
    "Wishing You All The Best For The Next Year. Stay Happy And Blessed."
  );
  const [voucher, setVoucher] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    [selectedItems]
  );
  const delivery = selectedItems.length ? 15 : 0;
  const total = subtotal + delivery;

  const toggleSelect = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    );

  const changeQty = (id, delta) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <section id="cart" className="py-10">
      <div className="custom-container">
        <Link to={"/"}>
          <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full mb-4">
            {langClass ? (
              <MdArrowForwardIos
                size={24}
                className="cursor-pointer text-primary"
              />
            ) : (
              <MdOutlineArrowBackIos
                size={24}
                className="cursor-pointer text-primary"
              />
            )}
          </div>
        </Link>

        {/* Header */}
        <h1 className="text-4xl text-primary mb-4">CART</h1>

        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 mt-6">
          {/* LEFT: Items */}
          <section
            className={`bg-primary_light_mode border text-primary_light_mode border-primary/20 rounded-2xl px-4`}
          >
            <div className="flex items-center justify-between p-5 border-b border-primary/20">
              <h5 className="text-2xl font-semibold text-primary">
                Total Items
              </h5>
              <div className="text-2xl font-semibold text-primary">
                {items.length}
              </div>
            </div>

            <div className="py-4 pt-4 pb-2 text-black text-lg font-medium">
              Select Items You Want To Purchase
            </div>

            {/* Items list */}
            <div className="py-4 pb-5 space-y-4 overflow-y-auto max-h-[750px]">
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
                    className={`
                      absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded
                      border-2 ${
                        i.selected ? "border-primary" : "border-primary/30"
                      }
                      grid place-items-center bg-white transition
                      focus:outline-none focus:ring-2 focus:ring-primary/30
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
                    src={i.image}
                    alt={i.title}
                    className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                  />

                  {/* Title + meta */}
                  <div className="flex-1">
                    <h5 className="text-black font-medium">{i.title}</h5>
                    <div className="text-primary font-semibold text-sm mt-2 mb-4">
                      {CURRENCY(i.price)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[#333] text-sm">
                      <FiTruck className="text-primary" />
                      Express Delivery
                    </div>
                  </div>

                  {/* Qty stepper */}
                  <div className="flex items-center">
                    <button
                      onClick={() => changeQty(i.id, -1)}
                      className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center hover:bg-slate-50"
                    >
                      <FiMinus className="text-black" />
                    </button>
                    <div className="w-10 text-center font-semibold text-slate-700">
                      {i.qty}
                    </div>
                    <button
                      onClick={() => changeQty(i.id, +1)}
                      className="h-8 w-8 rounded-full bg-[#ddd] border border-slate-200 grid place-items-center hover:bg-slate-50"
                    >
                      <FiPlus className="text-primary" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(i.id)}
                    className="text-rose-400 hover:text-rose-500 p-2"
                    aria-label="remove"
                  >
                    <FiTrash2 />
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT: Details + Summary */}
          <aside className="space-y-6">
            {/* Details */}
            <section
              className={`bg-primary_light_mode border border-primary/20 rounded-2xl px-4 ${PANEL_RING}`}
            >
              <header className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h3 className="text-primary text-xl">Details</h3>
              </header>

              <div className="py-4 space-y-5">
                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-primary font-medium">
                      Sender Phone :
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
                      Receiver Phone :
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
                    Card Message :
                  </span>
                  <textarea
                    rows={3}
                    value={cardMsg}
                    onChange={(e) => setCardMsg(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-primary/20 p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Your message…"
                  />
                </label>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button className="px-6 py-2.5 rounded-xl border border-primary/20 text-[#333] hover:bg-primary hover:text-white font-medium transition-all duration-200">
                    Cancel
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/70"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <section
              className={`bg-primary_light_mode border border-primary/20 rounded-2xl px-4 ${PANEL_RING}`}
            >
              <header className="flex items-center gap-2 py-4 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h3 className="text-primary text-xl">Order Summary</h3>
              </header>

              <div className="py-4 space-y-4">
                <Row label="Subtotal" value={CURRENCY(subtotal)} />
                <Row label="Delivery charges" value={CURRENCY(delivery)} />
                <p className="text-[#333] text-sm leading-relaxed max-w-sm">
                  Please note that specific regions and express delivery may
                  incur extra delivery fees
                </p>
                <hr className="border-primary/20" />
                <Row
                  label={<span className="font-semibold text-lg">Total</span>}
                  value={
                    <span className="font-semibold text-lg text-primary">
                      {CURRENCY(total)}
                    </span>
                  }
                />

                <button
                  disabled={!selectedItems.length}
                  className={`mt-2 w-full py-3 rounded-xl text-white font-medium ${
                    selectedItems.length
                      ? "bg-primary hover:opacity-90"
                      : "bg-primary/50 cursor-not-allowed"
                  }`}
                >
                  Check out
                </button>

                <hr className="border-primary/20" />

                <div>
                  <div className="text-primary text-xl font-semibold mb-3">
                    Voucher Card
                  </div>
                  <div className="flex gap-3">
                    <input
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      placeholder="Enter Voucher Code"
                      className="flex-1 rounded-xl border-2 border-primary/20 p-3 focus:outline-none"
                    />
                    <button className="px-6 rounded-xl bg-primary text-white font-medium hover:bg-primary/70">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </aside>
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

  return (
    <div
      className="fixed inset-0 z-50"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 mx-auto mt-10 xl:mt-40 w-[860px] max-w-[92vw]">
        <div
          className={`bg-white border border-primary/20 rounded-3xl shadow-2xl ${PANEL_RING}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiGift />
              </span>
              <h3 className="text-primary text-xl">History</h3>
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
                <span className="text-primary font-medium">Sender Phone :</span>
                <input
                  value={phones.sender}
                  disabled
                  placeholder="+974 2345 456"
                  className="mt-2 w-full rounded-xl border-2 border-primary/20 p-2.5 bg-white text-slate-700 cursor-default"
                />
              </label>

              <label className="block">
                <span className="text-primary font-medium">
                  Receiver Phone :
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
                <span className="text-primary font-medium">Card Message :</span>
                <textarea
                  value={cardMsg}
                  disabled
                  rows={6}
                  className="mt-2 w-full rounded-xl border-2 border-primary/20 p-3 bg-white text-slate-700 cursor-default"
                />
              </label>

              <label className="block">
                <span className="text-primary font-medium">Card :</span>
                <div className="mt-2 h-[180px] rounded-2xl overflow-hidden ring-1 ring-primary/20">
                  {/* Replace with your card image */}
                  <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                    alt="card"
                    className="h-full w-full object-cover"
                  />
                </div>
              </label>
            </div>

            {/* Items */}
            <div>
              <div className="text-primary font-medium mb-2">Item :</div>
              <div className="space-y-3">
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
                      alt={i.title}
                      className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                    />
                    <div className="flex-1">
                      <h5 className="text-black font-medium">{i.title}</h5>
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
                  <p className="text-sm text-slate-500">No items selected.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
