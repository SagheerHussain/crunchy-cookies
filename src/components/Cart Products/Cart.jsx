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
  FiPlusCircle,
} from "react-icons/fi";
import previewCard from "/images/preview-card.png";
import { useCartFlag } from "../../context/CartContext";
import { Link, useParams } from "react-router-dom";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { FormControl, Select, MenuItem } from "@mui/material";

import { useCartByUser } from "../../hooks/cart/useCart";
import {
  useSetItemQty,
  useRemoveItemFromCart,
} from "../../hooks/cart/useCartMutation";
import { checkCoupon } from "../../api/coupon";
import { createOrder } from "../../api/order";

const CURRENCY = (n) => `QAR ${Number(n || 0).toLocaleString()}`;
const PANEL_RING = "ring-1 ring-primary/10";
const ORDER_CODE_KEY = "last_order_code";

const round2 = (n) =>
  Math.max(0, Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100);

/** Generates a code like SA-2025-000121 and persists last used in localStorage. */
function nextOrderCode(prefix = "SA") {
  const year = new Date().getFullYear();
  const last =
    localStorage.getItem(ORDER_CODE_KEY) || `${prefix}-${year}-000120`;
  const m = last.match(/^([A-Z]+)-(\d{4})-(\d{6})$/);
  const lastNum = m ? parseInt(m[3], 10) : 120;
  const newNum = lastNum + 1;
  const code = `${prefix}-${year}-${String(newNum).padStart(6, "0")}`;
  localStorage.setItem(ORDER_CODE_KEY, code);
  return code;
}

/* =============================================================== */

export default function Cart() {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";
  const { setUpdate } = useCartFlag();
  const { id } = useParams(); // userId from route

  // toast
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastInRef = useRef(null);
  const toastOutRef = useRef(null);

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

  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setorderMessage] = useState("");

  // CART items
  const [items, setItems] = useState([]);

  // sender + recipients
  const [senderPhone, setSenderPhone] = useState("");

  // recipients: [{ tempId, label, phone, cardMessage }]
  const [recipients, setRecipients] = useState([
    {
      tempId: "r1",
      label: "Recipient 1",
      phone: "",
      cardMessage: "",
    },
  ]);

  // item allocations:
  // { [itemId]: [{ recipientTempId, quantity }] }
  const [itemAllocations, setItemAllocations] = useState({});

  const [voucher, setVoucher] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  /* --------------------- Fetch cart from API --------------------- */

  const { data: cartRes, isLoading: cartLoading } = useCartByUser(id);

  useEffect(() => {
    const apiItems = cartRes?.data?.items || [];
    const mapped = apiItems.map((it) => {
      const p = it?.product || {};
      return {
        id: String(p?._id || it?.product),
        selected: true,
        qty: Number(it?.qty || 1),
        price: Number(p?.price || 0),
        image: p?.images?.[0]?.url || p?.featuredImage,
        en_title: p?.title || p?.name || "—",
        ar_title: p?.ar_title || p?.title || p?.name || "—",
        productId: String(p?._id || it?.product),
      };
    });
    setItems(mapped);
  }, [cartRes]);

  /* ----------------------- Derived values ------------------------ */

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.qty),
        0
      ),
    [selectedItems]
  );

  const delivery = selectedItems.length ? 200 : 0;

  const total = () => {
    const base = subtotal + delivery;
    if (couponMessage && coupon) {
      if (coupon?.type === "percentage") {
        return base - (base * coupon.value) / 100;
      } else {
        return base - coupon.value;
      }
    }
    return base;
  };

  /* ---------------------- Cart mutations ------------------------- */

  const { mutateAsync: setQtyMut, isPending: qtyUpdating } = useSetItemQty();
  const { mutateAsync: removeItemMut, isPending: removing } =
    useRemoveItemFromCart();

  const toggleSelect = (productId) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, selected: !i.selected } : i
      )
    );

  const changeQty = async (productId, delta) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;
    const prevQty = Number(item.qty);
    const newQty = Math.max(1, prevQty + delta);

    // optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, qty: newQty } : i))
    );

    // also normalize allocations for this item
    setItemAllocations((prev) => {
      const forItem = prev[productId] || [];
      return {
        ...prev,
        [productId]: normalizeAllocations(
          newQty,
          forItem,
          recipients[0]?.tempId
        ),
      };
    });

    try {
      await setQtyMut({ user: id, productId: item.productId, qty: newQty });
    } catch {
      // revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, qty: prevQty } : i))
      );
      setItemAllocations((prev) => {
        const forItem = prev[productId] || [];
        return {
          ...prev,
          [productId]: normalizeAllocations(
            prevQty,
            forItem,
            recipients[0]?.tempId
          ),
        };
      });
    }
  };

  const removeItem = async (productId) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;
    const prev = items;
    setItems((p) => p.filter((i) => i.id !== productId));
    setItemAllocations((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    try {
      await removeItemMut({ user: id, productId: item.productId });
      setUpdate((u) => !u);
      showToast(langClass ? "أُزيل من السلة" : "Removed from cart");
    } catch {
      setItems(prev);
    }
  };

  /* ---------------------- Coupon apply --------------------------- */

  const applyCoupon = async (code) => {
    try {
      const payload = { code };
      setLoading(true);
      const res = await checkCoupon(payload);
      if (res.success) {
        setCouponMessage(res.message);
        setCoupon(res.coupon);
      } else {
        setCouponMessage("");
        setCoupon(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- Recipients Helpers ---------------------- */

  // Ensure allocations stay valid when items or recipients change
  useEffect(() => {
    setItemAllocations((prev) => {
      const next = { ...prev };
      const itemIds = new Set(items.map((i) => i.id));
      const validRecipients = new Set(recipients.map((r) => r.tempId));

      // remove for deleted items
      Object.keys(next).forEach((itemId) => {
        if (!itemIds.has(itemId)) delete next[itemId];
      });

      // ensure each item has at least one allocation & uses valid recipients
      for (const item of items) {
        const existing = next[item.id] || [];
        const filtered = existing.filter((a) =>
          validRecipients.has(a.recipientTempId)
        );
        next[item.id] = normalizeAllocations(
          item.qty,
          filtered,
          recipients[0]?.tempId
        );
      }

      return next;
    });
  }, [items, recipients]);

  const addRecipient = () => {
    setRecipients((prev) => {
      const idx = prev.length + 1;
      return [
        ...prev,
        {
          tempId: `r${idx}`,
          label: `Recipient ${idx}`,
          phone: "",
          cardMessage: "",
        },
      ];
    });
  };

  const updateRecipientField = (tempId, field, value) => {
    setRecipients((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
    );
  };

  // Allocation UI handlers

  const addAllocationRow = (itemId, itemQty) => {
    setItemAllocations((prev) => {
      const existing = prev[itemId] || [];
      const used = new Set(existing.map((a) => a.recipientTempId));
      const available = recipients.find((r) => !used.has(r.tempId));
      const targetRecipient = available || recipients[0] || { tempId: "r1" };

      const next = [
        ...existing,
        { recipientTempId: targetRecipient.tempId, quantity: 1 },
      ];

      return {
        ...prev,
        [itemId]: normalizeAllocations(itemQty, next, recipients[0]?.tempId),
      };
    });
  };

  const updateAllocationRecipient = (itemId, index, newTempId, itemQty) => {
    setItemAllocations((prev) => {
      const list = [...(prev[itemId] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], recipientTempId: newTempId };
      return {
        ...prev,
        [itemId]: normalizeAllocations(itemQty, list, recipients[0]?.tempId),
      };
    });
  };

  const commitAllocationQty = (itemId, itemQty, recipients) => {
    setItemAllocations((prev) => {
      const list = [...(prev[itemId] || [])];

      // Agar sab empty / invalid hain to normalize khud single recipient pe le aayega
      const normalized = normalizeAllocations(
        itemQty,
        list,
        recipients[0]?.tempId
      );

      return {
        ...prev,
        [itemId]: normalized,
      };
    });
  };

  const updateAllocationQty = (itemId, index, newQtyRaw, itemQty) => {
    const maxQty = Number(itemQty) || 0;

    setItemAllocations((prev) => {
      const list = [...(prev[itemId] || [])];
      if (!list[index]) return prev;

      // ----- 1) Raw input handle -----
      // allow empty while typing (don't delete row)
      if (newQtyRaw === "") {
        list[index] = { ...list[index], quantity: "" };
        return {
          ...prev,
          [itemId]: list,
        };
      }

      let newQty = Number(newQtyRaw);
      if (!Number.isFinite(newQty) || newQty < 0) newQty = 0;

      // ----- 2) Set edited row -----
      list[index] = { ...list[index], quantity: newQty };

      // ----- 3) Auto-balance others so total == maxQty -----
      // calculate sum of other rows (excluding edited)
      const otherIdxs = list.map((_, i) => i).filter((i) => i !== index);

      let otherSum = 0;
      otherIdxs.forEach((i) => {
        const q = Number(list[i].quantity) || 0;
        list[i].quantity = q;
        otherSum += q;
      });

      // total if we keep others as is
      let total = newQty + otherSum;

      // (a) if total > maxQty → reduce last other row
      if (total > maxQty && otherIdxs.length) {
        let diff = total - maxQty;
        // try to cut from last other allocation
        for (let k = otherIdxs.length - 1; k >= 0 && diff > 0; k--) {
          const idxOther = otherIdxs[k];
          const canCut = Math.min(Number(list[idxOther].quantity) || 0, diff);
          if (canCut > 0) {
            list[idxOther].quantity =
              (Number(list[idxOther].quantity) || 0) - canCut;
            diff -= canCut;
          }
        }
        total =
          (Number(list[index].quantity) || 0) +
          otherIdxs.reduce((s, i) => s + (Number(list[i].quantity) || 0), 0);
      }

      // (b) if total < maxQty → add remaining to last other (or edited)
      if (total < maxQty) {
        const remaining = maxQty - total;

        if (otherIdxs.length) {
          const lastIdx = otherIdxs[otherIdxs.length - 1];
          list[lastIdx].quantity =
            (Number(list[lastIdx].quantity) || 0) + remaining;
        } else {
          // only one allocation exists → all qty goes here
          list[index].quantity =
            (Number(list[index].quantity) || 0) + remaining;
        }
      }

      // ----- 4) Cleanup: drop zero rows, keep at least one -----
      let cleaned = list.filter(
        (a) => Number(a.quantity) > 0 && a.recipientTempId
      );

      if (!cleaned.length) {
        // safety: one row full qty
        cleaned = [
          {
            recipientTempId:
              list[index].recipientTempId || list[0]?.recipientTempId || "r1",
            quantity: maxQty,
          },
        ];
      }

      return {
        ...prev,
        [itemId]: cleaned,
      };
    });
  };

  const removeAllocationRow = (itemId, index, itemQty) => {
    setItemAllocations((prev) => {
      const list = [...(prev[itemId] || [])];
      list.splice(index, 1);
      return {
        ...prev,
        [itemId]: normalizeAllocations(itemQty, list, recipients[0]?.tempId),
      };
    });
  };

  /* -------------------- Payload & Checkout ----------------------- */

  const validateBeforeOrder = () => {
    if (!selectedItems.length) {
      showToast(
        langClass ? "الرجاء تحديد عناصر" : "Please select items to purchase"
      );
      return false;
    }

    if (!senderPhone?.trim()) {
      showToast(
        langClass ? "أدخل رقم هاتف المرسل" : "Please enter sender phone"
      );
      return false;
    }

    if (!recipients.length) {
      showToast(
        langClass
          ? "أضف مستلمًا واحدًا على الأقل"
          : "Add at least one recipient"
      );
      return false;
    }

    // each recipient must have phone & cardMessage
    for (const r of recipients) {
      if (!r.phone?.trim() || !r.cardMessage?.trim()) {
        showToast(`${r.label}: please fill phone & card message`);
        return false;
      }
    }

    // allocations must exist & sum to qty
    for (const item of selectedItems) {
      const allocs = itemAllocations[item.id] || [];
      const sum = allocs.reduce((s, a) => s + Number(a.quantity || 0), 0);
      if (!allocs.length || sum !== Number(item.qty)) {
        showToast(
          `${langClass ? "تحقق من التوزيع" : "Check allocation"} for ${
            langClass ? item.ar_title : item.en_title
          }`
        );
        return false;
      }
    }

    return true;
  };

  const handleOrderPayload = async () => {
    try {
      setOrderLoading(true);

      if (!validateBeforeOrder()) {
        setOrderLoading(false);
        return;
      }

      const code = nextOrderCode("SA");
      const taxAmount = delivery;
      const totalAmount = round2(total());

      // build recipients payload
      const recipientsPayload = recipients.map((r) => ({
        tempId: r.tempId,
        label: r.label,
        phone: r.phone.trim(),
        cardMessage: r.cardMessage.trim(),
        address: {
          senderPhone: String(senderPhone).trim(),
          receiverPhone: String(r.phone).trim(),
        },
      }));

      // items with allocations
      const itemsPayload = selectedItems.map((item) => ({
        product: item.productId,
        quantity: Number(item.qty || 1),
        allocations: (itemAllocations[item.id] || []).map((a) => ({
          recipientTempId: a.recipientTempId,
          quantity: Number(a.quantity || 0),
        })),
      }));

      const couponCode =
        couponMessage && (voucher || coupon?.code)
          ? String(voucher || coupon?.code)
          : undefined;

      const payload = {
        code,
        user: id,
        senderPhone: String(senderPhone).trim(),
        recipients: recipientsPayload,
        items: itemsPayload,
        taxAmount,
        couponCode,
        grandTotal: totalAmount,
      };

      const res = await createOrder(payload);
      setorderMessage(res?.message);

      if (res?.success) {
        showToast(res?.message || "Order placed");
      } else {
        showToast(res?.message || "Order failed");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      showToast(
        langClass
          ? "فشل إنشاء الطلب"
          : "Failed to create order. Please try again."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const allocationsInvalid = selectedItems.some((item) => {
    const allocs = itemAllocations[item.id] || [];
    const sum = allocs.reduce((s, a) => s + Number(a.quantity || 0), 0);
    return !allocs.length || sum !== Number(item.qty);
  });

  const disableCheckout =
    orderLoading ||
    !selectedItems.length ||
    !senderPhone ||
    !recipients.length ||
    recipients.some((r) => !r.phone?.trim() || !r.cardMessage?.trim()) ||
    allocationsInvalid;

  /* ============================= UI ============================== */

  return (
    <section id="cart" className="pt-4 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={[
            "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
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

      <div className="custom-container pb-10">
        <Link to={"/"} className="px-4">
          <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full">
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

        {/* Title */}
        <h1 className="text-4xl text-primary mt-4 px-4">
          {langClass ? "عربة التسوق" : "CART"}
        </h1>

        <div className="grid lg:grid-cols-2 gap-y-6 mt-10">
          {/* LEFT: Items + recipient allocation */}
          <div
            className={`bg-primary_light_mode border mx-4 px-4 text-primary_light_mode border-primary/20 rounded-2xl`}
          >
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

            <div className="pt-4 pb-5 space-y-4 overflow-y-auto max-h-[900px]">
              {cartLoading && (
                <p className="text-sm text-slate-500 px-2">
                  {langClass ? "جارِ تحميل سلة التسوق…" : "Loading your cart…"}
                </p>
              )}

              {!cartLoading && items.length === 0 && (
                <p className="text-sm text-slate-500 px-2">
                  {langClass
                    ? "لا توجد عناصر في سلتك."
                    : "There are no items in your cart."}
                </p>
              )}

              {items.map((i) => {
                const allocs = itemAllocations[i.id] || [];
                return (
                  <article
                    key={i.id}
                    className="relative flex flex-col gap-4 p-3 pl-12 rounded-2xl border border-primary/20 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(90deg, #11e7ff1f 0%, #e59eff1f 55%, #f6b4001f 100%)",
                    }}
                  >
                    {/* checkbox */}
                    <button
                      aria-label="select"
                      onClick={() => toggleSelect(i.id)}
                      style={{
                        direction: langClass ? "rtl" : "ltr",
                      }}
                      className={`absolute left-4 top-6 h-5 w-5 rounded border-2 ${
                        i.selected ? "border-primary" : "border-primary/30"
                      } grid place-items-center bg-white transition focus:outline-none`}
                    >
                      <span
                        className={`h-3 w-3 rounded-sm ${
                          i.selected ? "bg-primary" : "bg-transparent"
                        } transition`}
                      />
                    </button>

                    <div className="flex items-center gap-4">
                      {/* image */}
                      <img
                        src={i.image}
                        alt={langClass ? i.ar_title : i.en_title}
                        className="h-16 w-20 object-cover rounded-xl ring-1 ring-primary/10"
                      />

                      {/* content */}
                      <div className="flex-1">
                        <h5 className="text-black md:text-base text-sm font-medium">
                          {langClass ? i.ar_title : i.en_title}
                        </h5>
                        <div className="text-primary font-semibold text-sm mt-2">
                          {CURRENCY(i.price)}
                        </div>
                      </div>

                      {/* qty + delete */}
                      <div className="flex md:flex-row flex-col items-center">
                        <div className="flex md:flex-row flex-col items-center">
                          <button
                            onClick={() => changeQty(i.id, -1)}
                            disabled={qtyUpdating}
                            className="h-6 w-6 md:h-6 md:w-6 rounded-full bg-[#fff] border border-slate-200 grid place-items-center hover:bg-[#eee] disabled:opacity-60"
                          >
                            <FiMinus className="text-black" />
                          </button>
                          <div className="md:w-8 my-1 md:my-0 font-semibold text-slate-700 text-center">
                            {i.qty}
                          </div>
                          <button
                            onClick={() => changeQty(i.id, +1)}
                            disabled={qtyUpdating}
                            className="h-6 w-6 md:h-6 md:w-6 rounded-full bg-[#fff] border border-slate-200 grid place-items-center hover:bg-[#eee] disabled:opacity-60"
                          >
                            <FiPlus className="text-black" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(i.id)}
                          disabled={removing}
                          className="text-rose-400 hover:text-rose-500 p-2 disabled:opacity-60"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Allocations */}
                    {i.selected && (
                      <div className="mt-1 space-y-2">
                        {allocs.map((alloc, idx) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2 text-sm"
                          >
                            <FiTruck className="text-primary" />
                            <span className="text-slate-600">Send to:</span>
                            {/* recipient dropdown */}
                            <FormControl
                              size="small"
                              sx={{
                                minWidth: 140,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "999px",
                                  backgroundColor: "#ffffff",
                                  paddingX: 1.5,
                                  borderColor: "rgba(15,181,187,0.3)",
                                  "& fieldset": {
                                    borderColor: "rgba(15,181,187,0.3)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "rgba(15,181,187,0.6)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0fb5bb",
                                    boxShadow:
                                      "0 0 0 2px rgba(15,181,187,0.15)",
                                  },
                                },
                                "& .MuiSelect-select": {
                                  paddingY: 0.6,
                                  fontSize: 14,
                                  color: "#1592a6",
                                },
                              }}
                            >
                              <Select
                                value={alloc.recipientTempId}
                                onChange={(e) =>
                                  updateAllocationRecipient(
                                    i.id,
                                    idx,
                                    e.target.value,
                                    i.qty
                                  )
                                }
                                displayEmpty
                                inputProps={{ "aria-label": "Recipient" }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      borderRadius: 2,
                                      boxShadow: 3,
                                    },
                                  },
                                }}
                              >
                                {recipients.map((r) => (
                                  <MenuItem key={r.tempId} value={r.tempId}>
                                    {r.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* quantity input */}
                            <span className="text-slate-600">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={i.qty}
                              value={alloc.quantity}
                              onChange={(e) =>
                                updateAllocationQty(
                                  i.id,
                                  idx,
                                  e.target.value,
                                  i.qty
                                )
                              }
                              onBlur={() =>
                                commitAllocationQty(i.id, i.qty, recipients)
                              }
                              className="w-20 px-3 py-1.5 rounded-full border border-primary/25 bg-white/90 text-xs
             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-black
             placeholder:text-slate-300 shadow-sm"
                            />

                            {allocs.length > 1 && (
                              <button
                                onClick={() =>
                                  removeAllocationRow(i.id, idx, i.qty)
                                }
                                className="ml-1 text-rose-400 hover:text-rose-500"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        ))}

                        {/* add new split */}
                        <button
                          type="button"
                          onClick={() => addAllocationRow(i.id, i.qty)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          disabled={
                            !recipients.length ||
                            allocs.length >= recipients.length
                          }
                        >
                          <FiPlusCircle />
                          <span>
                            {langClass
                              ? "إضافة مستلم آخر لهذا المنتج"
                              : "Add another recipient for this item"}
                          </span>
                        </button>

                        {/* info line: show if invalid */}
                        {allocs.length > 0 &&
                          allocs.reduce(
                            (s, a) => s + Number(a.quantity || 0),
                            0
                          ) !== Number(i.qty) && (
                            <p className="text-[11px] text-rose-500">
                              Sum of quantities must equal {i.qty}.
                            </p>
                          )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Sender + Recipients + Summary */}
          <div className="space-y-6">
            {/* Details */}
            <div
              className={`bg-primary_light_mode border mx-4 px-4 border-primary/20 rounded-2xl ${PANEL_RING}`}
            >
              <div className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {langClass ? "تفاصيل" : "Details"}
                </h5>
              </div>

              <div className="py-4 space-y-5">
                {/* Sender phone */}
                <div>
                  <span className="text-primary font-medium">
                    {langClass ? "هاتف المرسل" : "Sender Phone"}
                  </span>
                  <div className="mt-2 relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+974 2345 456"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Recipients list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">
                      {langClass
                        ? "المستلمون"
                        : "Recipients (Number & Card Message)"}
                    </span>
                    <button
                      type="button"
                      onClick={addRecipient}
                      className="inline-flex items-center gap-1 text-primary text-sm hover:text-primary/80"
                    >
                      <FiPlusCircle />
                      <span>{langClass ? "إضافة مستلم" : "Add Recipient"}</span>
                    </button>
                  </div>

                  {recipients.map((r, idx) => (
                    <div
                      key={r.tempId}
                      className="rounded-2xl border border-primary/15 bg-white/70 px-3 py-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-primary text-sm">
                          {r.label}
                        </div>
                      </div>

                      {/* phone */}
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+974 0000 576"
                          value={r.phone}
                          onChange={(e) =>
                            updateRecipientField(
                              r.tempId,
                              "phone",
                              e.target.value
                            )
                          }
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                      </div>

                      {/* card message */}
                      <textarea
                        rows={2}
                        placeholder={
                          langClass
                            ? "رسالة البطاقة لهذا المستلم"
                            : "Card message for this recipient"
                        }
                        value={r.cardMessage}
                        onChange={(e) =>
                          updateRecipientField(
                            r.tempId,
                            "cardMessage",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-primary/20 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </div>

                {/* Preview button */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    className="px-6 py-2.5 rounded-xl border border-primary/20 text-[#333] hover:bg-primary hover:text-white font-medium transition-all duration-200"
                    onClick={() => {
                      // simple reset for demo; or keep as-is
                      // setSenderPhone("");
                      // setRecipients([...]);
                    }}
                  >
                    {langClass ? "إعادة تعيين" : "Reset"}
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
            <div
              className={`bg-primary_light_mode mx-4 px-4 border-primary/20 rounded-2xl ${PANEL_RING}`}
            >
              <header className="flex items-center gap-2 p-5 border-b border-primary/20">
                <FiGift className="text-primary" />
                <h5 className="text-primary text-xl font-semibold">
                  {langClass ? "ملخص الطلب" : "Order Summary"}
                </h5>
              </header>

              <div className="py-4 space-y-5">
                <Row
                  label={langClass ? "المجموع الفرعي" : "Subtotal"}
                  value={CURRENCY(subtotal)}
                />
                <Row
                  label={langClass ? "رسوم التوصيل" : "Delivery charges"}
                  value={CURRENCY(delivery)}
                />
                <p className="text-[#333] text-sm leading-relaxed max-w-sm">
                  {langClass
                    ? ".يرجى ملاحظة أن بعض المناطق والتوصيل السريع قد يتطلبان رسوم توصيل إضافية"
                    : "Please note that specific regions and express delivery may incur extra delivery fees"}
                </p>
                <hr className="border-primary/20" />
                {couponMessage && coupon && (
                  <Row
                    label={langClass ? "خصم القسيمة" : "Coupon Discount"}
                    value={
                      coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : CURRENCY(coupon.value)
                    }
                  />
                )}
                <Row
                  label={
                    <span className="font-semibold text-lg">
                      {langClass ? "المجموع" : "Total"}
                    </span>
                  }
                  value={
                    <span className="font-semibold text-lg text-primary">
                      {CURRENCY(total())}
                    </span>
                  }
                />

                <button
                  disabled={disableCheckout}
                  onClick={handleOrderPayload}
                  className={`mt-2 w-full py-3 rounded-xl text-white font-medium transition-all ${
                    disableCheckout
                      ? "bg-primary/50 opacity-50 cursor-not-allowed"
                      : "bg-primary hover:opacity-90"
                  }`}
                >
                  {!orderLoading ? (
                    <>{langClass ? "الدفع" : "Check out"}</>
                  ) : (
                    <ClipLoader color="#fff" size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        senderPhone={senderPhone}
        recipients={recipients}
        items={selectedItems}
        allocations={itemAllocations}
      />
    </section>
  );
}

/* ------------------------- Helpers ------------------------- */

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[#333]">
      <span className="font-medium">{label}</span>
      <span className="text-[#111] font-medium">{value}</span>
    </div>
  );
}

// normalize allocations so sum == itemQty & valid
function normalizeAllocations(itemQty, allocs, defaultRecipientTempId) {
  const qty = Number(itemQty || 0);
  if (qty <= 0) return [];

  let list = (allocs || [])
    .map((a) => ({
      recipientTempId: a.recipientTempId,
      quantity: Math.max(0, Number(a.quantity || 0)),
    }))
    .filter((a) => !!a.recipientTempId);

  // drop zeros
  list = list.filter((a) => a.quantity > 0);

  let sum = list.reduce((s, a) => s + a.quantity, 0);

  if (!list.length || !sum) {
    if (!defaultRecipientTempId) return [];
    return [
      {
        recipientTempId: defaultRecipientTempId,
        quantity: qty,
      },
    ];
  }

  // if sum < qty -> give extra to last
  if (sum < qty) {
    const diff = qty - sum;
    list[list.length - 1].quantity += diff;
    sum = qty;
  }

  // if sum > qty -> trim from last backwards
  if (sum > qty) {
    let extra = sum - qty;
    for (let i = list.length - 1; i >= 0 && extra > 0; i--) {
      const canTake = Math.min(list[i].quantity - 1, extra); // keep at least 1
      if (canTake > 0) {
        list[i].quantity -= canTake;
        extra -= canTake;
      }
      if (list[i].quantity <= 0) {
        list.splice(i, 1);
      }
    }
    if (extra > 0 && list.length) {
      // if still extra, just force last
      list[list.length - 1].quantity = Math.max(
        1,
        list[list.length - 1].quantity - extra
      );
    }
  }

  // final guard
  const finalSum = list.reduce((s, a) => s + a.quantity, 0);
  if (finalSum !== qty && defaultRecipientTempId) {
    // fallback: single recipient
    return [
      {
        recipientTempId: defaultRecipientTempId,
        quantity: qty,
      },
    ];
  }

  return list;
}

/* ---------------------- Preview Modal ---------------------- */

function PreviewModal({
  open,
  onClose,
  senderPhone,
  recipients,
  items,
  allocations,
}) {
  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";

  if (!open) return null;

  const getRecipientLabel = (tempId) =>
    recipients.find((r) => r.tempId === tempId)?.label || tempId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto w-[900px] max-w-[90vw] max-height-[90vh] overflow-y-auto">
        <div
          className={`bg-white border border-primary/20 rounded-3xl shadow-2xl ${PANEL_RING}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FiGift />
              </span>
              <h3 className="text-primary text-xl">
                {langClass ? "معاينة الطلب" : "Order Preview"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-full border border-primary/20 text-slate-600 hover:bg-primary/10"
            >
              <FiX />
            </button>
          </div>

          <div className="p-6 space-y-5 h-[500px] 2xl:h-[800px] overflow-y-scroll">
            <div className="text-primary font-medium">
              {langClass ? "هاتف المرسل:" : "Sender Phone:"}{" "}
              <span className="text-slate-800">{senderPhone || "—"}</span>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              {recipients.map((r) => (
                <div
                  key={r.tempId}
                  className="border border-primary/15 rounded-2xl px-3 py-2 bg-primary/5"
                >
                  <div className="font-semibold text-primary text-sm">
                    {r.label}
                  </div>
                  <div className="text-xs text-slate-700">
                    {langClass ? "هاتف:" : "Phone:"} {r.phone || "—"}
                  </div>
                  <div className="text-xs text-slate-700 mt-1">
                    {langClass ? "رسالة البطاقة:" : "Card Message:"}{" "}
                    {r.cardMessage || "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Card image + message example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-primary font-medium text-sm">
                  {langClass ? "بطاقة نموذجية" : "Sample Card"}
                </span>
                <div className="mt-2 rounded-2xl overflow-hidden ring-1 ring-primary/20">
                  <img
                    src={previewCard}
                    alt="card"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <p>
                  {langClass
                    ? "سيتم تطبيق رسائل البطاقة لكل مستلم كما هو مذكور أعلاه."
                    : "Card messages will be printed per recipient as specified above."}
                </p>
              </div>
            </div>

            {/* Items with allocations */}
            <div className="space-y-2">
              <div className="text-primary font-medium">
                {langClass ? "العناصر:" : "Items & Recipient Splits:"}
              </div>
              {items.map((i) => {
                const allocs = allocations[i.id] || [];
                return (
                  <div
                    key={i.id}
                    className="border border-primary/15 rounded-2xl px-3 py-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={i.image}
                        alt={langClass ? i.ar_title : i.en_title}
                        className="h-12 w-16 rounded-xl object-cover ring-1 ring-primary/20"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {langClass ? i.ar_title : i.en_title}
                        </div>
                        <div className="text-[10px] text-primary">
                          {CURRENCY(i.price)} × {i.qty}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-[10px] text-slate-700 space-y-1">
                      {allocs.map((a, idx) => (
                        <div key={idx}>
                          {getRecipientLabel(a.recipientTempId)} → {a.quantity}
                        </div>
                      ))}
                      {!allocs.length && (
                        <div className="text-rose-500">
                          {langClass
                            ? "لم يتم تعيين التوزيع."
                            : "No allocation defined."}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
