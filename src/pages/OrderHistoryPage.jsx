import React from "react";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import OrderHistory from "../components/Order History/OrderHistory";
import Footer from "../components/Footer";

const OrderHistoryPage = () => {
    return (
        <>
            <header id="header">
                <Topbar />
                <Navbar />
            </header>

            <main id="main">
                <OrderHistory />
            </main>

            <Footer />
        </>
    );
};

export default OrderHistoryPage;
