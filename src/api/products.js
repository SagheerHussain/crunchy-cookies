// client/src/api/products.js
import axios from "axios";

// ---------- axios instance ----------
export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: false, // set true if your server uses cookies
});

// small helper to build query string cleanly
const toQuery = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          Array.isArray(v) ? v.join(",") : v
        )}`
    )
    .join("&");

// ---------- core products ----------
export const getProducts = async (params = {}) => {
  // params: { page, limit, stockStatus, from, to }
  const qs = toQuery(params);
  const { data } = await api.get(`/product/lists${qs ? `?${qs}` : ""}`);
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/product/lists/${id}`);
  return data;
};

export const getFilteredProducts = async (params = {}) => {
  // params: { category, categories, occasion, recipient, color, packagingOption, minPrice, maxPrice, priceLabel, sort, page, limit }
  const qs = toQuery(params);
  const { data } = await api.get(`/product/lists/filter${qs ? `?${qs}` : ""}`);
  return data;
};

export const getProductNames = async () => {
  const { data } = await api.get(`/product/names`);
  return data;
};

// update (multipart)
export const updateProduct = async (id, payload = {}) => {
  const fd = new FormData();

  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;

    if (k === "featuredImage" && v instanceof File) return;
    if (k === "images" && Array.isArray(v)) return;

    if (Array.isArray(v)) {
      v.forEach((item, idx) => fd.append(`${k}[${idx}]`, item));
    } else if (typeof v === "object") {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, v);
    }
  });

  if (payload.featuredImage instanceof File) {
    fd.append("featuredImage", payload.featuredImage);
  }
  if (Array.isArray(payload.images)) {
    payload.images.forEach((f) => f && fd.append("images", f));
  }

  const { data } = await api.put(`/product/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ---------- 7 custom lists ----------

// 1) SubCategory: Flower in vases
export const getProductsInFlowerInVases = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inFlowerInVases`);
  console.log(res.data)
  return res.data;
};

// 2) Top sold (optional ?limit=n)
export const getTopSoldProducts = async (limit = 1) => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inTopSold`);
  console.log(res.data)
  return res.data;
};

// 3) SubCategory: chocolates OR hand bouquets
export const getProductsInChocolatesOrHandBouquets = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inChocolatesOrHandBouquets`);
  console.log(res.data)
  return res.data;
};

export const getProductsForFriendsOccasion = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inFriendsOccasion`);
  console.log(res.data)
  return res.data;
};

// 5) Featured
export const getFeaturedProducts = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inFeatured`);
  console.log(res.data)
  return res.data;
};

// 6) SubCategory: perfumes
export const getProductsInPerfumes = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inPerfumes`);
  console.log(res.data)
  return res.data;
};

// 7) SubCategory: preserved flowers
export const getProductsInPreservedFlowers = async () => {
  const res = await axios.get(`http://localhost:5000/api/v1/product/lists/inPreservedFlowers`);
  console.log(res.data)
  return res.data;
};
