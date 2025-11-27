// client/src/components/Dashboard/PaymentsTable.jsx
import React, { useMemo } from "react";
import Card from "./Card";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ClipLoader } from "react-spinners";

import { usePaymentsByUser } from "../../hooks/payments/usePayment";
import { getStripeSessionDetails } from "../../api/payments";

const PRIMARY = "#0FB4BB";
const BORDER = "#BFE8E7";

const pad2 = (n) => String(n).padStart(2, "0");

const fmtDateTime = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  const dd = pad2(dt.getDate());
  const mm = pad2(dt.getMonth() + 1);
  const yy = dt.getFullYear();
  const hh = pad2(dt.getHours());
  const min = pad2(dt.getMinutes());
  return `${dd}-${mm}-${yy} ${hh}:${min}`;
};

export default function Transactions() {
  // current logged-in user (same as you already use elsewhere)
  const user = JSON.parse(localStorage.getItem("user"));

  // ----- React Query: fetch payments for this user -----
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = usePaymentsByUser(user?.user?._id);

  console.log("data payment === >", data);

  // data shape from hook: { rows, success, message }
  const payments = data?.rows || [];

  const rows = useMemo(() => {
    return payments.map((p) => {
      const u = p.userId || {};
      return {
        _id: p.id || p._id,
        sessionId: p.sessionId,
        createdAt: p.createdAt,
        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || "-",
        email: u.email || "-",
        phone: u.phone || "-",
      };
    });
  }, [payments]);

  // ---------- View Receipt handler ----------
  const handleViewReceipt = async (sessionId) => {
    try {
      if (!sessionId) {
        alert("Session ID missing");
        return;
      }

      // hit backend: /api/v1/checkout-session/:id
      const res = await getStripeSessionDetails(sessionId);

      if (!res.success) {
        alert(res.message || "Could not fetch Stripe session.");
        return;
      }

      // backend returns paymentIntentId (and full session)
      const paymentIntentId =
        res.paymentIntentId || res.session?.payment_intent?.id;

      if (!paymentIntentId) {
        alert("Payment Intent ID not found for this session.");
        return;
      }

      // ⚠️ Stripe dashboard URL (sandbox) – account id same as your screenshot
      const stripeDashboardUrl = `https://dashboard.stripe.com/acct_1SWt1rQklE9Bzvtx/test/payments/${paymentIntentId}`;

      // open Stripe payment page in new tab
      window.open(stripeDashboardUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to open Stripe receipt:", err);
      alert("Failed to open Stripe receipt, please try again.");
    }
  };

  // ----- Loading / error states -----
  if (isLoading) {
    return (
      <Card className="h-[14rem]">
        <div className="p-4 flex items-center justify-center gap-2">
          <ClipLoader />
          <span className="text-sm text-slate-600">Loading payments…</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[14rem]">
        <div className="p-4 text-slate-700 text-center">
          No Record Found
        </div>
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
                minWidth: 1100,
                "& th": {
                  color: PRIMARY,
                  fontWeight: 600,
                  borderBottom: `1px solid ${BORDER}`,
                  whiteSpace: "nowrap",
                },
                "& td": { borderBottom: `1px solid ${BORDER}` },
              }}
              aria-label="payments table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1rem", width: 80 }}>
                    S.No
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Created At
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={row._id || idx}>
                    <TableCell
                      sx={{
                        color: PRIMARY,
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {pad2(idx + 1)}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {row.name}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {row.email}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {row.phone}
                    </TableCell>

                    {/* <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={row.sessionId}
                    >
                      {row.sessionId}
                    </TableCell> */}

                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {fmtDateTime(row.createdAt)}
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleViewReceipt(row.sessionId)}
                        className="text-xs text-[#0FB4BB] underline hover:opacity-80"
                      >
                        View Receipt
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {isFetching && (
              <div className="px-2 pb-2 text-xs text-slate-500">
                updating…
              </div>
            )}
          </Box>
        </TableContainer>
      </div>
    </Card>
  );
}
