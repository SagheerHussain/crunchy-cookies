import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1"
// const BASE_URL = "http://localhost:5000/api/v1"

export const getOnGoingOrderByUser = async (userId) => {
    try {
        const res = await axios.get(`${BASE_URL}/ongoingOrder/lists/user/${userId}`);
        console.log("response inside orders.js =====>", res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const getPreviousOrder = async (userId) => {
    try {
        const res = await axios.get(`${BASE_URL}/orderHistory/lists/user/${userId}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const createOrder = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/orders`, payload);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const updateOrder = async (payload, id) => {
    try {
        const res = await axios.put(`${BASE_URL}/orders/update/${id}`, payload);
        console.log("res update order", res)
        return res.data;
    } catch (error) {
        console.log(error)
    }
}