import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
});

/**
 * @name registerUser
 * @desc the function will send a POST request to the server to register a new user use try and catch block to handle errors
 * @param {Object} userData - An object containing the user's registration details (e.g., username, email, password).
 */
export const registerUser = async ({ username, email, password }) => {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const response = await api.post("/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error.response?.data || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out user:", error.response?.data || error.message);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error.response?.data || error.message);
        return null;
    }
};
