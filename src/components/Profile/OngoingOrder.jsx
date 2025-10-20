import React, { useEffect, useMemo, useState } from "react";
import { BsBagCheck } from "react-icons/bs";
import { Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import { CyanConnector, DotStepIcon } from "./StepperUtils";
import Modal from "../Modal";
import Card from "./Card";
import { getOnGoingOrderByUser, updateOrder } from "../../api/order";
import { ClipLoader } from "react-spinners";

const ORDER_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded", "partial"];

export default function OngoingOrdersCard() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const matches = useMediaQuery("(max-width:767px)");

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [error, setError] = useState("");

  // cancel flow state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null); // order object
  const [cancelReason, setCancelReason] = useState("");
  const [canceling, setCanceling] = useState(false);
  const [cancelErr, setCancelErr] = useState("");

  const statusToIndex = (s) => Math.max(0, ORDER_STATUS.indexOf(String(s || "").toLowerCase()));

  const statusLabel = (s) => {
    const key = String(s || "").toLowerCase();
    if (!isAr) return key.charAt(0).toUpperCase() + key.slice(1);
    switch (key) {
      case "pending": return "زیر التواء";
      case "confirmed": return "تصدیق شدہ";
      case "shipped": return "بھیجا گیا";
      case "delivered": return "ڈیلیورڈ";
      case "cancelled": return "منسوخ";
      case "returned": return "واپس";
      default: return key;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { user } = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?._id || user?.id;
        if (!userId) throw new Error("No user found in localStorage.");

        const res = await getOnGoingOrderByUser(userId);
        const raw = Array.isArray(res?.data) ? res.data : [];

        const normalized = raw.map((node) => {
          const o = node?.order || {};
          const items = Array.isArray(o?.items) ? o.items : [];

          const totalItems = items.reduce((sum, it) => sum + Number(it?.quantity || 0), 0);

          const modalItems = items.map((it) => {
            const p = it?.products || {};
            return {
              en_name: p?.title || "",
              ar_name: p?.ar_title || "",
              image: p?.featuredImage || "",
              qty: Number(it?.quantity || 0),
              price: Number(p?.price ?? it?.totalAmount ?? 0),
            };
          });

          return {
            _id: node?._id || o?._id,
            orderId: node?.order?._id,
            code: o?.code || node?.code,
            status: (node?.status || o?.status || "pending").toLowerCase(),
            paymentStatus: (node?.paymentStatus || o?.payment || "pending").toLowerCase(),
            placedAt: node?.placedAt || o?.placedAt || node?.createdAt || o?.createdAt,
            totalItems,
            grandTotal: Number(o?.grandTotal ?? node?.grandTotal ?? 0),
            sender: o?.shippingAddress?.senderPhone || "",
            receiver: o?.shippingAddress?.receiverPhone || "",
            coupon: o?.appliedCoupon?.value,
            couponType: o?.appliedCoupon?.type,
            taxAmount: o?.taxAmount,
            items: modalItems,
          };
        });

        setList(normalized);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load ongoing orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const progressPct = useMemo(() => {
    if (!list.length) return 0;
    const idx = statusToIndex(list[0]?.status);
    const lastIdx = Math.max(3, ORDER_STATUS.length - 1);
    return (idx / lastIdx) * 100;
  }, [list]);

  const openItems = (orderObj) => {
    setActiveOrder(orderObj);
    setItemsOpen(true);
  };
  const closeItems = () => setItemsOpen(false);

  // ------- Cancel flow handlers -------

  const askCancel = (order) => {
    setCancelErr("");
    setCancelReason("");
    setCancelTarget(order);
    setConfirmOpen(true);        // 1) first dialog
  };

  const onConfirmNo = () => {
    // user says "Cancel" in confirm dialog → abort flow
    setConfirmOpen(false);
    setCancelTarget(null);
    setCancelReason("");
    setCancelErr("");
  };

  const onConfirmYes = () => {
    // user says "Yes" in confirm dialog → go to reason dialog
    setConfirmOpen(false);
    setReasonOpen(true);
  };

  const onReasonCancel = () => {
    // user cancels in reason dialog → abort flow, no request
    setReasonOpen(false);
    setCancelTarget(null);
    setCancelReason("");
    setCancelErr("");
  };

  const submitCancel = async () => {
    if (!cancelTarget?.orderId) return;
    if (!cancelReason.trim()) {
      setCancelErr("Please provide a reason to cancel the order.");
      return;
    }
    try {
      setCancelErr("");
      setCanceling(true);
      const payload = { status: "cancelled", cancelReason: cancelReason.trim() };
      console.log(payload, cancelTarget?.orderId)
      await updateOrder(payload, cancelTarget?.orderId);

      // Optimistic UI update: mark as cancelled or remove from ongoing
      setList((prev) =>
        prev
          .map((o) => (o._id === cancelTarget._id ? { ...o, status: "cancelled" } : o))
          // hide cancelled from ongoing list (optional; comment next line if you prefer showing it)
          .filter((o) => !["cancelled", "returned", "delivered"].includes(o.status))
      );

      // Close dialog
      setReasonOpen(false);
      setCancelTarget(null);
      setCancelReason("");
    } catch (e) {
      console.error(e);
      setCancelErr(e?.message || "Failed to cancel order.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-4 mx-auto">{isAr ? "جاری آرڈرز لوڈ ہو رہے ہیں..." : <ClipLoader />}</div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <div className="p-4 text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <Card>
      {list.length === 0 ? (
        <div className="p-4 opacity-70">{isAr ? "کوئی جاری آرڈر نہیں" : "No ongoing orders"}</div>
      ) : (
        list.map((order) => {
          const current = statusToIndex(order.status);
          const itemsText = isAr ? "آئٹمز" : "items";
          const codText = isAr ? "ادائیگی" : "Payment";
          const orderNoText = isAr ? "آرڈر" : "Order";

          return (
            <div key={order._id} className="mb-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-primary ring-1 ring-primary/20">
                  <BsBagCheck />
                </div>
                <div className="text-black">
                  <div className="font-semibold">
                    {orderNoText} #{order.code || String(order._id).slice(-6)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {codText}: {PAYMENT_STATUS.includes(order.paymentStatus) ? order.paymentStatus : "pending"}
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="mt-4 flex md:flex-row flex-col items-center gap-4">
                <div className="md:w-[70%]" style={{ direction: "ltr" }}>
                  <Stepper
                    activeStep={current}
                    alternativeLabel
                    connector={matches ? false : <CyanConnector />}
                    orientation={matches ? "vertical" : "horizontal"}
                  >
                    {ORDER_STATUS.slice(0, 4).map((label) => (
                      <Step key={label}>
                        <StepLabel StepIconComponent={DotStepIcon}>
                          {statusLabel(label)}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex md:flex-row flex-col gap-3">
                  <button
                    onClick={() => openItems(order)}
                    className="xl:text-base md:w-auto w-full lg:text-xs rounded-xl bg-primary px-3 xl:px-5 py-2 font-semibold text-white shadow hover:bg-primary/80"
                  >
                    {isAr ? "آئٹمز دیکھیں" : "View Items"}
                  </button>

                  <button
                    onClick={() => askCancel(order)}
                    className="xl:text-base md:w-auto w-full lg:text-xs rounded-xl hover:bg-rose-50 bg-rose-100 px-3 xl:px-5 py-2 font-semibold text-rose-500"
                  >
                    {isAr ? "آرڈر منسوخ کریں" : "Cancel Order"}
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-4 flex md:flex-row flex-col items-center lg:gap-x-3 xl:gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{String(order.totalItems).padStart(2, "0")} </span> {itemsText}
                <span className="mx-1">•</span> {isAr ? "کل" : "Total"}: QAR {order.grandTotal ?? 0}
                {order.placedAt && (
                  <>
                    <span className="mx-1">•</span>
                    {isAr ? "آرڈر کیا گیا" : "Placed"}: {new Date(order.placedAt).toLocaleString()}
                  </>
                )}
                <span className="mx-1">•</span>
                {isAr ? "سٹیٹس" : "Status"}: {statusLabel(order.status)}
              </div>
            </div>
          );
        })
      )}

      {/* Modal: view items */}
      <Modal
        itemsOpen={itemsOpen}
        closeItems={closeItems}
        activeOrder={activeOrder}
        isAr={isAr}
      />

      {/* Dialog 1: Confirm cancellation */}
      <Dialog open={confirmOpen} onClose={onConfirmNo} maxWidth="xs" fullWidth>
        <DialogTitle>{isAr ? "کیا آپ یقینی ہیں؟" : "Cancel this order?"}</DialogTitle>
        <DialogContent>
          {isAr
            ? "یہ کاروائی آرڈر کو منسوخ کر دے گی۔"
            : "This action will cancel the order."}
        </DialogContent>
        <DialogActions>
          <button
            onClick={onConfirmNo}
            className="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200"
          >
            {isAr ? "منسوخ" : "No, keep it"}
          </button>
          <button
            onClick={onConfirmYes}
            className="rounded-lg px-4 py-2 bg-rose-600 text-white hover:bg-rose-700"
          >
            {isAr ? "ہاں، منسوخ کریں" : "Yes, cancel"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Dialog 2: Reason input */}
      <Dialog open={reasonOpen} onClose={onReasonCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{isAr ? "منسوخی کی وجہ" : "Cancellation reason"}</DialogTitle>
        <DialogContent>
          {cancelErr && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cancelErr}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            placeholder={isAr ? "یہاں وجہ لکھیں..." : "Write your reason here…"}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={onReasonCancel}
            disabled={canceling}
            className="rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
          >
            {isAr ? "منسوخ" : "Cancel"}
          </button>
          <button
            onClick={submitCancel}
            disabled={canceling}
            className="rounded-lg px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {canceling ? (isAr ? "برائے مہربانی انتظار کریں…" : "Please wait…") : (isAr ? "جمع کرائیں" : "Submit")}
          </button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
