// client/src/api/products.js
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

export const getPayments = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/payment/lists`);
    console.log("res payment", res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/payment/lists/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentByUserId = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/payment/user/${userId}`);
    console.log("res user payment", res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStripeSessionDetails = async (sessionId) => {
  const res = await axios.get(`${BASE_URL}/checkout-session/${sessionId}`);
  return res.data;    // { success, session, receiptUrl, paymentIntentId }
};

export const createPayment = async (payload) => {
  const res = await axios.post(`${BASE_URL}/payment`, payload);
  console.log("payment result:", res.data);
  return res.data;
};

export const updatePayment = async (id, payload) => {
  const res = await axios.put(`${BASE_URL}/payment/update/${id}`, payload);
  return res.data;
};

export const deletePayment = async (id) => {
  const res = await axios.delete(`${BASE_URL}/payment/delete/${id}`);
  return res.data;
};

export const bulkDeletePayment = async () => {
  const res = await axios.delete(`${BASE_URL}/payment/bulkDelete`);
  return res.data;
};
