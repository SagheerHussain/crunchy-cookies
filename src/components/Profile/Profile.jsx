import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfilePanel from "./ProfilePanal";
import OrdersPanel from "./OrderPanal";
import Placeholder from "./Placeholder";
import { IoIosArrowBack } from "react-icons/io";
import MyAddresses from "./MyAddresses";
import EditProfile from "./EditProfile";
import EditAddress from "./EditAddress";

export default function ProfileDashboard() {
  const [tab, setTab] = useState("profile");
  const [ordersTab, setOrdersTab] = useState("ongoing");

  return (
    <section className="w-full py-4 px-4">
      <div className="custom-container">
        <div className="bg-primary/10 inline-block p-1 rounded-full">
          <IoIosArrowBack className="text-3xl text-primary" />
        </div>
        <div className="my-4">
          <h1 className="text-3xl text-primary">Profile</h1>
        </div>

        <div className="mx-auto flex gap-6 items-center mt-10 ">
          {/* Sidebar */}
          <div className="lg:w-[30%] xl:w-[25%] 2xl:w-[20%]">
            <Sidebar tab={tab} setTab={setTab} />
          </div>

          {/* Main Panel */}
          <div className="lg:w-[70%] xl:w-[75%] 2xl:w-[80%]">
            {tab === "profile" && <ProfilePanel tab={tab} setTab={setTab} />}
            {tab === "orders" && (
              <OrdersPanel ordersTab={ordersTab} setOrdersTab={setOrdersTab} />
            )}
            {tab === "edit" && <EditProfile tab={tab} setTab={setTab} />}
            {tab === "invoices" && <Placeholder title="My Invoices" subtitle="No invoices to display." />}
            {tab === "addresses" && <MyAddresses tab={tab} setTab={setTab} />}
            {tab === "editAddress" && <EditAddress tab={tab} setTab={setTab} />}
          </div>
        </div>
      </div>
    </section>
  );
}
