import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/subscription",
    withCredentials: true
});

export const getSubscription = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createSubscription = async () => {
    try {
        const response = await api.post("/checkout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const cancelSubscription = async () => {
    try {
        const response = await api.post("/cancel");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifySubscription = async ({
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature
}) => {
    try {
        const response = await api.post("/verify", {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        });

        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                success: false,
                message: "Verification failed"
            }
        );
    }
};