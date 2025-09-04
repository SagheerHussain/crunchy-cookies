import React from "react";
import { FiUser, FiFileText, FiMapPin, FiShoppingBag, FiLogOut } from "react-icons/fi";
import SideItem from "./SideItem";
import { CiDeliveryTruck } from "react-icons/ci";

export default function Sidebar({ tab, setTab }) {
  return (
    <aside className="rounded-2xl border border-primary/30 bg-white p-4 shadow-sm">
      <nav className="space-y-3">
        <SideItem active={tab === "profile"} onClick={() => setTab("profile")} icon={<FiUser />} label="Profile" />
        <SideItem active={tab === "orders"} onClick={() => setTab("orders")} icon={<CiDeliveryTruck />} label="My Orders" />
        <SideItem active={tab === "invoices"} onClick={() => setTab("invoices")} icon={<FiFileText />} label="My Invoices" />
        <SideItem active={tab === "addresses"} onClick={() => setTab("addresses")} icon={<FiMapPin />} label="My Addresses" />
      </nav>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)]">
        <FiLogOut className="h-4 w-4" /> Log out
      </button>
    </aside>
  );
}
