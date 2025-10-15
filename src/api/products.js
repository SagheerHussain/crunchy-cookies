// client/src/api/products.js
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1";

// helper to build query string
const qs = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

// 1) SubCategory: Flower in vases (paginated)
export const getProductsInFlowerInVases = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inFlowerInVases?${qs({ page, limit })}`
  );
  return res.data;
};

// 2) Top sold (now paginated too)
export const getTopSoldProducts = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inTopSold?${qs({ page, limit })}`
  );
  return res.data;
};

// 3) Chocolates OR Hand Bouquets (paginated)
export const getProductsInChocolatesOrHandBouquets = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inChocolatesOrHandBouquets?${qs({ page, limit })}`
  );
  return res.data;
};

// 4) Friends occasion (paginated)
export const getProductsForFriendsOccasion = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inFriendsOccasion?${qs({ page, limit })}`
  );
  return res.data;
};

// 5) Featured (paginated)
export const getFeaturedProducts = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inFeatured?${qs({ page, limit })}`
  );
  return res.data;
};

// 6) Perfumes (paginated)
export const getProductsInPerfumes = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inPerfumes?${qs({ page, limit })}`
  );
  return res.data;
};

// 7) Preserved flowers (paginated)
export const getProductsInPreservedFlowers = async ({ page = 1, limit = 4 } = {}) => {
  const res = await axios.get(
    `${BASE_URL}/product/lists/inPreservedFlowers?${qs({ page, limit })}`
  );
  return res.data;
};

// 8) Gift Detail  👉 return the *product object* (res.data.data)
export const getGiftDetail = async (id) => {
  const res = await axios.get(`${BASE_URL}/product/lists/${id}`);
  return res?.data?.data; // { ...product }
};
