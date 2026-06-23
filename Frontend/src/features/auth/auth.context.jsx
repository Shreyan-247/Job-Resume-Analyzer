import { createContext, useState, useEffect } from 'react';
import {getCurrentUser} from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const getSetUser = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (currentUser?.user) {
                    setUser(currentUser.user);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        getSetUser();
    }, []);
    

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

