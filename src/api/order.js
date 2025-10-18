import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://crunchy-cookies-server.onrender.com/api/v1"
// const BASE_URL = "http://localhost:5000/api/v1"

export const createOrder = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/orders`, payload);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}