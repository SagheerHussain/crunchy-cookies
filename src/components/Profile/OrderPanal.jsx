import React from "react";
import OrdersTab from "./OrderTab";
import OngoingOrdersCard from "./OngoingOrder";
import PreviousOrdersTable from "./PreviousOrder";

export default function OrdersPanel({ ordersTab, setOrdersTab }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <OrdersTab active={ordersTab === "ongoing"} onClick={() => setOrdersTab("ongoing")} label="Ongoing Orders" count={1} />
        <OrdersTab active={ordersTab === "previous"} onClick={() => setOrdersTab("previous")} label="Previous Orders" count={1} />
      </div>
      <hr className="border-cyan-100" />
      {ordersTab === "ongoing" ? <OngoingOrdersCard /> : <PreviousOrdersTable />}
    </div>
  );
}
