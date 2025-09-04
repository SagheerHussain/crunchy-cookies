import React, { useState } from "react";
import Card from "./Card";
import { orders } from "../../lib/orderHistory";
import Modal from "../Modal";
// import { PRIMARY, BORDER, ROW_BG } from "../../constants";
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
} from "@mui/material";

const PRIMARY = "#0FB4BB";
const BORDER = "#BFE8E7";
const ROW_BG = "rgba(15, 180, 187, 0.03)";

const pad2 = (n) => String(n).padStart(2, "0");
const currency = (n) => `${n}`;

export default function PreviousOrdersTable() {
  const isAr = false;

  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const openItems = (order) => {
    setActiveOrder(order);
    setItemsOpen(true);
  };

  const closeItems = () => setItemsOpen(false);

  return (
    <Card className="h-[14rem]">
      <div className="previous_order_table">
        {/* <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-primary">
              {["S.No", "Sender Number", "Receiver Number", "Price", "Total Items", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-cyan-100/70 text-slate-700">
                <td className="px-4 py-3 text-primary font-medium">{r.sn}</td>
                <td className="px-4 py-3">{r.sender}</td>
                <td className="px-4 py-3">{r.receiver}</td>
                <td className="px-4 py-3">{r.price}</td>
                <td className="px-4 py-3">{r.items}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openItems(orders)} className="rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow hover:bg-primary/80">
                    View Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            // border: `1px solid ${BORDER}`,
            borderRadius: "18px",
            overflow: "auto !important",
            bgcolor: "transparent",
            maxHeight: "200px",
          }}
        >
          <Box sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}>
            <Table
              sx={{
                minWidth: 1000,
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
                  <TableCell sx={{ fontSize: "1rem", width: 80 }}>
                    S.No
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Sender Number
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Receiver Number
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Total Items
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: 400 }}>
                    Date
                  </TableCell>
                  <TableCell align="right" sx={{ width: 220 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {orders?.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      // bgcolor: ROW_BG,
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
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
                      {row.sender}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {row.receiver}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {currency(row.price)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {pad2(row.totalItems)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4B5563",
                        fontSize: "1rem",
                        fontWeight: 400,
                      }}
                    >
                      {row.date}
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

                        {/* View items -> CRUNCHY style modal */}
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
                          {isAr ? "عرض العناصر" : "View items"}
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
        isAr={false}
      />
    </Card>
  );
}
