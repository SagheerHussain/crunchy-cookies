import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://crunchy-cookies-server.onrender.com/api/v1';

export const updateUser = async (userDetail, userId) => {
    try {
        const response = await axios.put(`${BASE_URL}/user/update/${userId}`, userDetail);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}