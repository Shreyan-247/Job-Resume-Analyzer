import {useContext} from "react"
import { AuthContext } from "../auth.context.jsx"
import{loginUser,registerUser,logoutUser} from "../services/auth.api.js"

export const useAuth = () => {
    const {user,setUser,loading,setLoading} = useContext(AuthContext);

    const handleLogin = async (email,password) => {
        setLoading(true);
        try {
            const data = await loginUser({email,password});
            setUser(data.user);
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (username,email,password) => {
        setLoading(true);
        try {
            const data = await registerUser({username,email,password});
            setUser(data.user);
        } catch (error) {
            console.error("Error registering:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setLoading(false);
        }
    }

    return { user,loading, handleLogin, handleRegister, handleLogout};
};
