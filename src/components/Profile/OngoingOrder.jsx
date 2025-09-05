import React, { useState, useMemo } from "react";
import { BsBagCheck } from "react-icons/bs";
import { Stepper, Step, StepLabel } from "@mui/material";
import { CyanConnector, DotStepIcon } from "./StepperUtils";
import Modal from "../Modal";
import Card from "./Card";
import { orders } from "../../lib/orderHistory";
import { useTranslation } from "react-i18next";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function OngoingOrdersCard() {

  const { i18n } = useTranslation();
  const langClass = i18n.language === "ar";
  const matches = useMediaQuery('(max-width:767px)');

  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const stages = [`${langClass ? "التأكيد" : "Confirm"}`, `${langClass ? "التحضير" : "Preparing"}`, `${langClass ? "التقديم" : "Picked up"}`, `${langClass ? "التسليم" : "Delivered"}`];
  const current = 2;
  const progressPct = useMemo(
    () => (current / (stages.length - 1)) * 100,
    [current, stages.length]
  );

  const openItems = (order) => {
    setActiveOrder(order[0]);
    setItemsOpen(true);
  };

  const closeItems = () => setItemsOpen(false);

  return (
    <Card>
      {/* Order Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-primary ring-1 ring-primary/20">
          <BsBagCheck />
        </div>
        <div className="text-black">
          <div className="font-semibold">{langClass ? "الطلب رقم" : "Order no"} # 1125</div>
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
            {stages.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={DotStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex md:flex-row flex-col gap-3">
          <button
            onClick={() => openItems(orders)}
            className="xl:text-base md:w-auto w-full lg:text-xs rounded-xl bg-primary px-3 xl:px-5 py-2 font-semibold text-white shadow hover:bg-primary/80"
          >
            View Items
          </button>
          <button className="xl:text-base md:w-auto w-full lg:text-xs rounded-xl bg-rose-50 px-3 xl:px-5 py-2 font-semibold text-rose-500">
            Cancel Order
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="mt-4 flex md:flex-row flex-col items-center lg:gap-x-3 xl:gap-x-6 gap-y-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">06 </span> {langClass ? "البضائع" : "Items"}
        <span className="mx-1">•</span> {langClass ? "الدفع عند الاستلام" : "Cash on Delivery"}
        <span className="mx-1">•</span> {langClass ? "تم الطلب منذ 2 دقائق" : "Ordered 2 mins ago"}
        <span className="mx-1">•</span> {langClass ? "تسليم خلال أسبوع" : "Delivery within a week"}
      </div>

      {/* Modal for View Items */}
      <Modal
        itemsOpen={itemsOpen}
        closeItems={closeItems}
        activeOrder={activeOrder}
        isAr={false}
      />
    </Card>
  );
}
