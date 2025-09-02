import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { GrClose } from "react-icons/gr";
import { orders } from "../../lib/orderHistory";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useTranslation } from "react-i18next";

const PRIMARY = "#0FB4BB";
const BORDER = "#BFE8E7";
const ROW_BG = "rgba(15, 180, 187, 0.03)";

const pad2 = (n) => String(n).padStart(2, "0");
const currency = (n) => `${n}`;

export default function OrdersTable({ rows = orders }) {
  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const openItems = (order) => {
    setActiveOrder(order);
    setItemsOpen(true);
  };
  const closeItems = () => setItemsOpen(false);

  const totalOfActiveOrder = useMemo(() => {
    if (!activeOrder) return 0;
    return activeOrder.items.reduce((sum, it) => sum + it.qty * it.price, 0);
  }, [activeOrder]);

  return (
    <>
      <section id="order-history" className="py-10" dir={isAr ? "rtl" : "ltr"}>
        <div className="custom-container">
          <Link to={"/"}>
            <div className="bg-[#0fb5bb25] p-2 inline-block rounded-full">
              {isAr ? (
                <MdArrowForwardIos size={24} className="cursor-pointer text-primary" />
              ) : (
                <MdOutlineArrowBackIos size={24} className="cursor-pointer text-primary" />
              )}
            </div>
          </Link>

          <div className="flex items-center justify-between mt-4 mb-8">
            <h2 className="text-center lg:text-[1.8rem] xl:text-[2.5rem] text-primary">
              {isAr ? "تاريخ الطلب" : "Order History"}
            </h2>
          </div>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: "18px",
              overflow: "hidden",
              bgcolor: "#FFFFFF",
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Box sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}>
              <Table
                sx={{
                  minWidth: 1200,
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
                    <TableCell sx={{ fontSize: "1.2rem", width: 80 }}>S.No</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem", fontWeight: 400 }}>Sender Number</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem", fontWeight: 400 }}>Receiver Number</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem", fontWeight: 400 }}>Price</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem", fontWeight: 400 }}>Total Items</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem", fontWeight: 400 }}>Date</TableCell>
                    <TableCell align="right" sx={{ width: 220 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        bgcolor: ROW_BG,
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell sx={{ color: PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
                        {pad2(idx + 1)}
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563", fontSize: "1.2rem", fontWeight: 400 }}>
                        {row.sender}
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563", fontSize: "1.2rem", fontWeight: 400 }}>
                        {row.receiver}
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563", fontSize: "1.2rem", fontWeight: 400 }}>
                        {currency(row.price)}
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563", fontSize: "1.2rem", fontWeight: 400 }}>
                        {pad2(row.totalItems)}
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563", fontSize: "1.2rem", fontWeight: 400 }}>
                        {row.date}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          {/* View receipt -> open in new tab */}
                          <Button
                            component="a"
                            href="https://b.stripecdn.com/docs-statics-srv/assets/terminal-pre-built-receipt.64db66739eaf8f8db1f9dd61c463a322.png"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="contained"
                            sx={{
                              textTransform: "none",
                              bgcolor: PRIMARY,
                              "&:hover": { bgcolor: "#0fb4bbd9" },
                              borderRadius: "10px",
                              px: 2,
                              minWidth: 120,
                            }}
                          >
                            View receipt
                          </Button>

                          {/* View items -> CRUNCHY style modal */}
                          <Button
                            onClick={() => openItems(row)}
                            size="small"
                            variant="outlined"
                            sx={{
                              textTransform: "none",
                              color: PRIMARY,
                              borderColor: PRIMARY,
                              "&:hover": { borderColor: PRIMARY, bgcolor: "rgba(15,180,187,0.08)" },
                              borderRadius: "10px",
                              px: 2,
                              minWidth: 120,
                            }}
                          >
                            View items
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
      </section>

      {/* ---------- Items Modal (CRUNCHY COOKIES style) ---------- */}
      <Dialog
        open={itemsOpen}
        onClose={closeItems}
        fullWidth
        maxWidth="sm"
        dir={isAr ? "rtl" : "ltr"}
        PaperProps={{
          sx: {
            borderRadius: 8,
            padding: 3,
            border: `1px solid ${BORDER}`,
            overflow: "visible",
            background: "Transparent"
          },
        }}
      >
        <div style={{ background: "#fff", borderRadius: 32 }}>
        {/* Title as centered brand */}
        <h1
          style={{
            textAlign: "center",
            paddingTop: "1rem",
            paddingBottom: "0.5rem",
            color: PRIMARY,
            fontWeight: 800,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            fontSize: "1.2rem",
          }}
        >
          CRUNCHY COOKIES
        </h1>

        <DialogContent sx={{ px: 0, pb: 0 }}>
          {/* Outer body padding like a card */}
          <Box sx={{ px: { xs: 2, sm: 4 }, pt: 2, pb: 3 }}>
            {/* Sender / Receiver block */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                mt: 1,
                mb: 2,
              }}
            >
              <Box>
                <Typography sx={{ color: PRIMARY, fontWeight: 700, mb: 0.5 }}>
                  Sender Number
                </Typography>
                <Typography sx={{ color: "#6B7280" }}>{activeOrder?.sender}</Typography>
              </Box>
              <Box sx={{ textAlign: isAr ? "right" : "left" }}>
                <Typography sx={{ color: PRIMARY, fontWeight: 700, mb: 0.5 }}>
                  Receiver Number
                </Typography>
                <Typography sx={{ color: "#6B7280" }}>{activeOrder?.receiver}</Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: BORDER, mb: 1 }} />

            {/* Mini table header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "52px 1fr 110px",
                gap: 1,
                px: 1,
                pb: 1,
                color: PRIMARY,
                fontWeight: 700,
              }}
            >
              <Typography>S.no</Typography>
              <Typography>Item</Typography>
              <Typography textAlign="right">Item Price</Typography>
            </Box>

            <Divider sx={{ borderColor: BORDER }} />

            {/* Items rows (with small thumbnails) */}
            <Box>
              {activeOrder?.items.map((it, i) => (
                <Box
                  key={`${activeOrder.id}-${i}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr 110px",
                    gap: 1,
                    alignItems: "center",
                    px: 1,
                    py: 1.2,
                    borderBottom:
                      i === activeOrder.items.length - 1 ? "none" : `1px solid ${BORDER}`,
                  }}
                >
                  <Typography sx={{ color: "#6B7280" }}>{pad2(i + 1)}</Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box
                      component="img"
                      src={it.image}
                      alt={it.name}
                      sx={{
                        width: 36,
                        height: 36,
                        objectFit: "cover",
                        borderRadius: 1.2,
                        border: `1px solid ${BORDER}`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ color: "#374151" }}>{it.name}</Typography>
                    <Typography sx={{ color: "#6B7280", ml: "auto" }}>x{it.qty}</Typography>
                  </Box>

                  <h5 style={{ color: "#111827", fontSize: ".9rem", fontWeight: 400, textAlign: "right" }}>
                    QAR {currency(it.qty * it.price)}
                  </h5>
                </Box>
              ))}
            </Box>

            {/* Total row */}
            <Divider sx={{ borderColor: BORDER, mt: 0.5, mb: 1 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h5 style={{ color: PRIMARY, fontWeight: 800, fontSize: "1.3rem" }}>
                Total
              </h5>
              <h5
                style={{ ml: "auto", fontWeight: 400, color: "#111827", fontSize: "1rem" }}
              >
                QAR {currency(totalOfActiveOrder)}
              </h5>
            </div>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={closeItems}
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: PRIMARY,
              "&:hover": { bgcolor: "#0fb4bbd9" },
              borderRadius: "10px",
              px: 4,
            }}
          >
            Close
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
