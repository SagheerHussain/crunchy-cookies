// client/src/api/products.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1"

// 1) SubCategory: Flower in vases
export const getProductsInFlowerInVases = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inFlowerInVases`);
  console.log(res.data)
  return res.data;
};

// 2) Top sold (optional ?limit=n)
export const getTopSoldProducts = async (limit = 1) => {
  const res = await axios.get(`${BASE_URL}/product/lists/inTopSold`);
  console.log(res.data)
  return res.data;
};

// 3) SubCategory: chocolates OR hand bouquets
export const getProductsInChocolatesOrHandBouquets = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inChocolatesOrHandBouquets`);
  console.log(res.data)
  return res.data;
};

export const getProductsForFriendsOccasion = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inFriendsOccasion`);
  console.log(res.data)
  return res.data;
};

// 5) Featured
export const getFeaturedProducts = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inFeatured`);
  console.log(res.data)
  return res.data;
};

// 6) SubCategory: perfumes
export const getProductsInPerfumes = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inPerfumes`);
  console.log(res.data)
  return res.data;
};

// 7) SubCategory: preserved flowers
export const getProductsInPreservedFlowers = async () => {
  const res = await axios.get(`${BASE_URL}/product/lists/inPreservedFlowers`);
  console.log(res.data)
  return res.data;
};
