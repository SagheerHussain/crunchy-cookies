// client/src/api/products.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1"
// const BASE_URL = "http://localhost:5000/api/v1"

// 1) SubCategory: Flower in vases
export const getOccasions = async () => {
  const res = await axios.get(`${BASE_URL}/occasion/lists`);
  return res.data;
};