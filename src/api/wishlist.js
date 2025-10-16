import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1";

export const getWishlistByUser = async (userId) => {
  const res = await axios.get(`${BASE_URL}/wishlist/lists/user/${userId}`);
  return res.data;
};

export const createWishlist = async ({ user, product }) => {
  const res = await axios.post(`${BASE_URL}/wishlist`, { user, product });
  return res.data;
};

// IMPORTANT: send body (not params)
export const deleteWishlist = async ({ user, product }) => {
  const res = await axios.delete(`${BASE_URL}/wishlist`, {
    data: { user, product },
  });
  return res.data;
};
