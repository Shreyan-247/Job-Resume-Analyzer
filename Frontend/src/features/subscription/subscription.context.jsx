import { createContext, useContext, useEffect, useState } from "react";
import { getSubscription } from "./services/subscription.api";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshSubscription = async () => {
        try {
            const data = await getSubscription();
            setSubscription(data.subscription);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSubscription();
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                setSubscription,
                loading,
                setLoading,
                refreshSubscription
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};
