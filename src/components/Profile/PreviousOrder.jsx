import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Modal from "../Modal";
import {
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { getPreviousOrder } from "../../api/order";
import { useTranslation } from "react-i18next";

const PRIMARY = "#0FB4BB";
const BORDER = "#BFE8E7";

const pad2 = (n) => String(n).padStart(2, "0");
const currency = (n) => `${Number(n || 0)}`;
const fmtDMY = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  const dd = pad2(dt.getDate());
  const mm = pad2(dt.getMonth() + 1);
  const yy = dt.getFullYear();
  return `${dd}-${mm}-${yy}`;
};

const ORDER_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded", "partial"];

// ---------- Badge helpers ----------
const chipSX = (bg, fg) => ({
  bgcolor: bg,
  color: fg,
  fontWeight: 600,
  borderRadius: "999px",
  px: 1.25,
  height: 26,
  "& .MuiChip-label": { px: 0.75, textTransform: "capitalize" },
});

function renderPaymentChip(status) {
  const s = String(status || "pending").toLowerCase();
  // tailwind-ish palette equivalents
  switch (s) {
    case "paid":
      return <Chip label="paid" size="small" sx={chipSX("#DEF7EC", "#03543F")} />; // green
    case "failed":
      return <Chip label="failed" size="small" sx={chipSX("#FEE2E2", "#991B1B")} />; // red
    case "refunded":
      return <Chip label="refunded" size="small" sx={chipSX("#DBEAFE", "#1E3A8A")} />; // blue
    case "partial":
      return <Chip label="partial" size="small" sx={chipSX("#EDE9FE", "#5B21B6")} />; // purple
    case "pending":
    default:
      return <Chip label="pending" size="small" sx={chipSX("#FEF3C7", "#92400E")} />; // amber
  }
}

function renderOrderChip(status) {
  const s = String(status || "pending").toLowerCase();
  switch (s) {
    case "delivered":
      return <Chip label="delivered" size="small" sx={chipSX("#DCFCE7", "#065F46")} />; // green
    case "shipped":
      return <Chip label="shipped" size="small" sx={chipSX("#DBEAFE", "#1E3A8A")} />; // blue
    case "confirmed":
      return <Chip label="confirmed" size="small" sx={chipSX("#CFFAFE", "#155E75")} />; // cyan
    case "cancelled":
      return <Chip label="cancelled" size="small" sx={chipSX("#FFE4E6", "#9F1239")} />; // rose
    case "returned":
      return <Chip label="returned" size="small" sx={chipSX("#FEF3C7", "#92400E")} />; // amber
    case "pending":
    default:
      return <Chip label="pending" size="small" sx={chipSX("#F3F4F6", "#374151")} />; // gray
  }
}

export default function PreviousOrdersTable() {
  const { i18n } = useTranslation();
  const isAr = false;
  const isArabic = i18n.language === "ar";

  // userId (supports multiple shapes)
  const { user } = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [rawData, setRawData] = useState([]);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userId = user?._id;
        if (!userId) {
          setErrMsg("No user found (not logged in).");
          setLoading(false);
          return;
        }
        setLoading(true);
        setErrMsg("");
        const res = await getPreviousOrder(userId); // or getPreviousOrder({ userId }) if your api expects object
        const arr = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) setRawData(arr);
      } catch (e) {
        if (!cancelled) setErrMsg(e?.message || "Failed to load previous orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?._id]);

  // normalize backend → table rows + modal payload
  const rows = useMemo(() => {
    return rawData.map((node) => {
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
        code: o?.code || node?.code,
        status: (node?.status || o?.status || "pending").toLowerCase(),
        paymentStatus: (node?.paymentStatus || o?.payment || "pending").toLowerCase(),
        placedAt: o?.placedAt,
        deliveredAt: o?.deliveredAt,
        totalItems,
        grandTotal: Number(o?.grandTotal ?? 0),
        sender: o?.shippingAddress?.senderPhone || "",
        receiver: o?.shippingAddress?.receiverPhone || "",
        coupon: o?.appliedCoupon?.value,
        couponType: o?.appliedCoupon?.type,
        taxAmount: o?.taxAmount,
        items: modalItems,
      };
    });
  }, [rawData]);

  const openItems = (row) => { setActiveOrder(row); setItemsOpen(true); };
  const closeItems = () => setItemsOpen(false);

  if (!user?._id) {
    return (
      <Card className="h-[14rem]">
        <div className="p-4 text-red-500">No user found (not logged in).</div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <div className="p-4 mx-auto flex items-center gap-2">
          <ClipLoader />
        </div>
      </Card>
    );
  }

  if (errMsg) {
    return (
      <Card className="h-[14rem]">
        <div className="p-4 text-red-500">{errMsg}</div>
      </Card>
    );
  }

  return (
    <Card className="h-[14rem]">
      <div className="previous_order_table">
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "18px",
            overflow: "auto !important",
            bgcolor: "transparent",
            maxHeight: "200px",
          }}
        >
          <Box sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}>
            <Table
              sx={{
                minWidth: 1400,
                "& th": {
                  color: PRIMARY,
                  fontWeight: 600,
                  borderBottom: `1px solid ${BORDER}`,
                  whiteSpace: "nowrap",
                },
                "& td": { borderBottom: `1px solid ${BORDER}` },
              }}
              aria-label="orders table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1rem", width: 80 }}>S.No</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "رقم المرسل" : "Sender Number"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "رقم المتلقي" : "Receiver Number"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "السعر" : "Price"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "العدد الكلي" : "Total Items"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "تم الطلب في" : "Placed At"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "تم التسليم في" : "Delivered At"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "الدفع" : "Payment"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>{isArabic ? "الحالة" : "Status"}</TableCell>
                  <TableCell align="right" sx={{ width: 220 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={row._id || idx}>
                    <TableCell sx={{ color: PRIMARY, fontSize: "1rem", fontWeight: 600 }}>
                      {pad2(idx + 1)}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {row.sender || "-"}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {row.receiver || "-"}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {currency(row.grandTotal)}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {pad2(row.totalItems)}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {fmtDMY(row?.placedAt)}
                    </TableCell>

                    <TableCell sx={{ color: "#4B5563", fontSize: "1rem", fontWeight: 400 }}>
                      {fmtDMY(row?.deliveredAt)}
                    </TableCell>

                    {/* Payment badge */}
                    <TableCell>
                      {renderPaymentChip(
                        PAYMENT_STATUS.includes(row.paymentStatus) ? row.paymentStatus : "pending"
                      )}
                    </TableCell>

                    {/* Order status badge */}
                    <TableCell>
                      {renderOrderChip(
                        ORDER_STATUS.includes(row.status) ? row.status : "pending"
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          onClick={() => openItems(row)}
                          size="small"
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            color: PRIMARY,
                            borderColor: PRIMARY,
                            "&:hover": {
                              borderColor: PRIMARY,
                              bgcolor: "rgba(15,180,187,0.08)",
                            },
                            borderRadius: "10px",
                            px: 2,
                            minWidth: 90,
                          }}
                        >
                          {isArabic ? "عرض العناصر" : "View items"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ borderColor: BORDER }} />
          </Box>
        </TableContainer>
      </div>

      <Modal
        itemsOpen={itemsOpen}
        closeItems={closeItems}
        activeOrder={activeOrder}
        isAr={isArabic}
      />
    </Card>
  );
}
