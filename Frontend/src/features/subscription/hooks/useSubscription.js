import { useContext } from "react";
import { SubscriptionContext } from "../subscription.context";
import {
    getSubscription,
    createSubscription,
    cancelSubscription,
    verifySubscription
} from "../services/subscription.api";

export const useSubscription = () => {

    const context = useContext(SubscriptionContext);

    if (!context) {
        throw new Error(
            "useSubscription must be used within a SubscriptionProvider"
        );
    }

    const {
        subscription,
        setSubscription,
        loading,
        setLoading,
        refreshSubscription
    } = context;

    const getSub = async () => {
        setLoading(true);

        let response = null;

        try {
            response = await getSubscription();

            setSubscription(response.subscription);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response?.subscription;
    };

    const checkoutSubscription = async () => {
        setLoading(true);

        let response = null;

        try {
            response = await createSubscription();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response?.subscription;
    };

    const verifySub = async ({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
    }) => {

        setLoading(true);

        let response = null;

        try {

            response = await verifySubscription({
                razorpay_payment_id,
                razorpay_subscription_id,
                razorpay_signature
            });

            await refreshSubscription();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response;
    };

    const cancelSub = async () => {

        setLoading(true);

        let response = null;

        try {

            response = await cancelSubscription();

            await refreshSubscription();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response;
    };

    return {
        subscription,
        loading,
        getSub,
        checkoutSubscription,
        verifySub,
        cancelSub,
        refreshSubscription
    };
};