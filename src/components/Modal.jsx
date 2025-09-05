import React, { useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";



const PRIMARY = "#0FB4BB";
const BORDER = "#BFE8E7";
import useMediaQuery from '@mui/material/useMediaQuery';

const pad2 = (n) => String(n).padStart(2, "0");
const currency = (n) => `${n}`;

const Modal = ({ itemsOpen, closeItems, activeOrder, isAr }) => {
  const totalOfActiveOrder = useMemo(() => {
    if (!activeOrder) return 0;
    return activeOrder?.items?.reduce((sum, it) => sum + it.qty * it.price, 0);
  }, [activeOrder]);

  const matches = useMediaQuery('(max-width:767px)');

  return (
    <>
      <Dialog
        open={itemsOpen}
        onClose={closeItems}
        fullWidth
        maxWidth="sm"
        dir={isAr ? "rtl" : "ltr"}
        PaperProps={{
          sx: {
            borderRadius: 8,
            padding: matches ? 0 : 3,
            border: `${matches ? 0 : 1}px solid ${BORDER}`,
            overflow: "visible",
            background: "Transparent",
          },
        }}
      >
        <div className="max-h-[70vh] overflow-y-scroll modal_box" style={{ background: "#fff", borderRadius: 32 }}>
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
              fontSize: `${isAr ? "2rem" : "1.2rem"}`,
            }}
          >
            {isAr ? "كرنشي كوكيز" : "CRUNCHY COOKIES"}
          </h1>

          <DialogContent sx={{ px: 0, pb: 0 }}>
            {/* Outer body padding like a card */}
            <Box sx={{ px: { xs: 2, sm: 4 }, pt: 2, pb: 3 }}>
              {/* Sender / Receiver block */}
              <Box
                sx={{
                  justifyContent: "space-between",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                  mt: 1,
                  mb: 2,
                }}
                className="flex md:flex-row flex-col gap-3"
              >
                <Box>
                  <Typography
                    sx={{
                      color: PRIMARY,
                      fontSize: `${isAr ? "1.3rem" : "1.2rem"}`,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {isAr ? "رقم المرسل" : "Sender Number"}
                  </Typography>
                  <Typography sx={{ color: "#6B7280" }}>
                    {activeOrder?.sender}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: isAr ? "right" : "left" }}>
                  <Typography
                    sx={{
                      color: PRIMARY,
                      fontSize: `${isAr ? "1.3rem" : "1.2rem"}`,
                      fontWeight: 700,
                      mb: 0.5
                    }}
                  >
                    {isAr ? "رقم المتلقي" : "Receiver Number"}
                  </Typography>
                  <Typography sx={{ color: "#6B7280", }}>
                    {activeOrder?.receiver}
                  </Typography>
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
                <Typography>{isAr ? "S.no" : "S.no"}</Typography>
                <Typography>{isAr ? "غرض" : "Item"}</Typography>
                <Typography textAlign="right">
                  {isAr ? "سعر السلعة" : "Item Price"}
                </Typography>
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
                        i === activeOrder.items.length - 1
                          ? "none"
                          : `1px solid ${BORDER}`,
                    }}
                  >
                    <Typography sx={{ color: "#6B7280" }}>
                      {pad2(i + 1)}
                    </Typography>

                    <Box
                      className="flex md:flex-row flex-col items-center gap-3"
                    >
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
                      <h6 className="md:text-base text-[.8rem] font-medium" sx={{ color: "#374151" }}>
                        {isAr ? it.ar_name : it.en_name}
                      </h6>
                      <Typography className="md:text-base text-[.6rem]" sx={{ color: "#6B7280", ml: "auto" }}>
                        x{it.qty}
                      </Typography>
                    </Box>

                    <h5
                      style={{
                        color: "#111827",
                        fontSize: ".9rem",
                        fontWeight: 400,
                      }}
                      className="md:text-end text-center"
                    >
                      QAR {currency(it.qty * it.price)}
                    </h5>
                  </Box>
                ))}
              </Box>

              {/* Total row */}
              <Divider sx={{ borderColor: BORDER, mt: 0.5, mb: 1 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h5
                  style={{
                    color: PRIMARY,
                    fontWeight: 800,
                    fontSize: "1.3rem",
                  }}
                >
                  {isAr ? "المجموع" : "Total"}
                </h5>
                <h5
                  style={{
                    ml: "auto",
                    fontWeight: 400,
                    color: "#111827",
                    fontSize: "1rem",
                  }}
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
                fontSize: `${isAr ? "1.3rem" : "1rem"}`,
              }}
            >
              {isAr ? "يغلق" : "Close"}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
