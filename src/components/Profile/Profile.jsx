import React, { useMemo, useState } from "react";
import {
  FiUser,
  FiFileText,
  FiMapPin,
  FiLogOut,
  FiShoppingBag,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { BsBagCheck } from "react-icons/bs";

import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Modal from "../Modal";

import { orders } from "../../lib/orderHistory";

export default function ProfileDashboard() {
  const [tab, setTab] = useState("profile");
  const [ordersTab, setOrdersTab] = useState("ongoing");

  return (
    <section className="w-full py-4 px-4">
      <div className="custom-container">
        {/* Header */}
        <div className="bg-primary/10 inline-block p-1 rounded-full">
          <IoIosArrowBack className="text-3xl text-primary" />
        </div>
        <div className="my-4">
          <h1 className="text-3xl text-primary">Profile</h1>
        </div>

        <div className="mx-auto grid mt-10 grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-primary/30 bg-white p-4 shadow-sm">
            <nav className="space-y-3">
              <SideItem
                active={tab === "profile"}
                onClick={() => setTab("profile")}
                icon={<FiUser />}
                label="Profile"
              />
              <SideItem
                active={tab === "orders"}
                onClick={() => setTab("orders")}
                icon={<FiShoppingBag />}
                label="My Orders"
              />
              <SideItem
                active={tab === "invoices"}
                onClick={() => setTab("")}
                icon={<FiFileText />}
                label="My Invoices"
              />
              <SideItem
                active={tab === "addresses"}
                onClick={() => setTab("")}
                icon={<FiMapPin />}
                label="My Addresses"
              />
            </nav>

            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)]">
              <FiLogOut className="h-4 w-4" /> Log out
            </button>
          </aside>

          {/* Main Panel */}
          <div className="">
            {tab === "profile" && <ProfilePanel />}
            {tab === "orders" && (
              <OrdersPanel ordersTab={ordersTab} setOrdersTab={setOrdersTab} />
            )}
            {tab === "invoices" && (
              <Placeholder
                title="My Invoices"
                subtitle="No invoices to display."
              />
            )}
            {tab === "addresses" && (
              <Placeholder
                title="My Addresses"
                subtitle="Add a new address to get started."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SideItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
        active
          ? "border-transparent bg-teal-500 text-white shadow"
          : "border-cyan-200/70 bg-white text-slate-700 hover:bg-cyan-50",
      ].join(" ")}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-primary/30 bg-primary_light_mode p-5 shadow-sm " +
        className
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-primary">{children}</h2>
        {action}
      </div>
      <hr className="mt-3 border-cyan-100" />
    </div>
  );
}

/*************************
 * Profile panel
 *************************/
function ProfilePanel() {
  return (
    <Card>
      <SectionTitle
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-primary p-2">
            <FiEdit2 className="h-4 w-4 text-white" />
          </button>
        }
      >
        Personal Info
      </SectionTitle>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Name :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            defaultValue="Ethan sage"
          />
        </Field>
        <Field label="Email :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            defaultValue="Ethansage123@gmail.com"
          />
        </Field>
        <Field label="Phone Number :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            defaultValue="(555) 123-4567"
          />
        </Field>
        <Field label="Date of Birth :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            defaultValue="01 \ 03 \ 1999"
          />
        </Field>
        <Field label="Gender :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            defaultValue="Male"
          />
        </Field>
        <Field label="Password :">
          <input
            className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3"
            type="password"
            defaultValue="********"
          />
        </Field>
      </div>

      {/* <div className="mt-6 flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-[10px] bg-red-600 hover:bg-red-700 px-5 py-3 font-semibold text-white">
          <FiTrash2 className="h-4 w-4" /> Delete My Account
        </button>
      </div> */}
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <div className="text-primary font-semibold">{label}</div>
      {children}
    </div>
  );
}

/*************************
 * Orders panel
 *************************/
function OrdersPanel({ ordersTab, setOrdersTab }) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        <OrdersTab
          active={ordersTab === "ongoing"}
          onClick={() => setOrdersTab("ongoing")}
          label="Ongoing Orders"
          count={1}
        />
        <OrdersTab
          active={ordersTab === "previous"}
          onClick={() => setOrdersTab("previous")}
          label="Previous Orders"
          count={1}
        />
      </div>

      {/* Divider */}
      <hr className="border-cyan-100" />

      {ordersTab === "ongoing" ? (
        <OngoingOrdersCard />
      ) : (
        <PreviousOrdersTable />
      )}
    </div>
  );
}

function OrdersTab({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold",
        active
          ? "border-transparent bg-primary text-white shadow"
          : "border-primary/20 text-primary hover:bg-primary/20",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs",
          active ? "bg-white text-primary" : "bg-primary text-white",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

// --- Styled MUI parts to match your teal/cyan look ---
const CyanConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#0FB4BB",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#0FB4BB",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 1,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const Dot = styled("div")(({ $active, $completed }) => ({
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: `2px solid ${$active || $completed ? "#0FB4BB" : "#ddd"}`,
  backgroundColor: $completed ? "#fff" : "#fff",
  transition: "all .2s ease",
}));

function DotStepIcon(props) {
    const { active, completed, className } = props;
    return (
      <span
        className={className}
        style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <Dot $active={active} $completed={completed} />
        {completed && (
          <FiCheck className="absolute" size={12} color="#fff" style={{ color: "#fff" }} />
        )}
      </span>
    );
  }

function OngoingOrdersCard() {

  const isAr = false;

  const stages = ["Confirm", "Preparing", "Picked up", "Delivered"];
  const current = 2; // 0..3 (Preparing)
  const progressPct = useMemo(
    () => (current / (stages.length - 1)) * 100,
    [current, stages.length]
  );

  const [itemsOpen, setItemsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const openItems = (order) => {
    console.log("order", order)
    setActiveOrder(order[0]);
    setItemsOpen(true);
  };
  const closeItems = () => setItemsOpen(false);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-primary ring-1 ring-primary/20">
            <BsBagCheck />
          </div>
          <div className="text-black">
            <div className="font-semibold">Order no # 1125</div>
          </div>
        </div>
      </div>

      {/* Stepper + actions (same row) */}
      <div className="mt-4 flex items-center gap-4">
        <div className="w-[70%]">
          <Stepper
            activeStep={current}
            alternativeLabel
            connector={<CyanConnector />}
            sx={{
              "& .MuiStepLabel-label": {
                color: "rgb(100 116 139)", // slate-500
                fontSize: 12,
              },
            }}
          >
            {stages.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={DotStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Actions on the right of the stepper */}
        <div className="shrink-0 flex gap-3">
          <button onClick={() => openItems(orders)} className="rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow hover:bg-primary/80">
            View Items
          </button>
          <button className="rounded-xl bg-rose-50 px-5 py-2 font-semibold text-rose-500">
            Cancel Order
          </button>
        </div>
      </div>

      {/* Meta row under the stepper */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">06</span> Items
        <span className="mx-1">•</span> Cash on Delivery
        <span className="mx-1">•</span> Ordered 2 mins ago
        <span className="mx-1">•</span> Delivery within a week
      </div>

      <Modal
        itemsOpen={itemsOpen}
        closeItems={closeItems}
        activeOrder={activeOrder}
        isAr={isAr}
      />
    </Card>
  );
}

function PreviousOrdersTable() {
  const rows = [
    {
      sn: "01",
      sender: "+974 2345 456",
      receiver: "+974 9867 456",
      price: "2,456",
      items: "04",
      date: "27-08-2025",
    },
    {
      sn: "02",
      sender: "+974 8367 456",
      receiver: "+974 9345 456",
      price: "2,234",
      items: "03",
      date: "27-08-2025",
    },
  ];

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-primary">
              {[
                "S.No",
                "Sender Number",
                "Receiver Number",
                "Price",
                "Total Items",
                "Date",
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={idx}
                className="border-t border-cyan-100/70 text-slate-700"
              >
                <td className="px-4 py-3 text-primary font-medium">{r.sn}</td>
                <td className="px-4 py-3">{r.sender}</td>
                <td className="px-4 py-3">{r.receiver}</td>
                <td className="px-4 py-3">{r.price}</td>
                <td className="px-4 py-3">{r.items}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">
                  <button className="rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow hover:bg-primary/80">
                    View Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const inputBase =
  "h-11 w-full rounded-lg border border-cyan-200/70 bg-cyan-50/50 px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300";

if (typeof document !== "undefined") {
  const id = "profile-input-style";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `.Input{${toCss(inputBase)}}`;
    document.head.appendChild(style);
  }
}

function toCss(cls) {
  return "";
}
