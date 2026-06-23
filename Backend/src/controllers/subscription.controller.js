const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const getSubscription = async (req, res) => {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: {
                mongoUserId: req.user.userId.toString()
            }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        return res.status(200).json({
            success: true,
            subscription
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createSubscription = async (req, res) => {
    try {

        const existingSubscription =
            await prisma.subscription.findUnique({
                where: {
                    mongoUserId: req.user.userId.toString()
                }
            });

        if (!existingSubscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription record not found"
            });
        }

        // User already has active PRO subscription
        if (
            existingSubscription.plan === "PRO" &&
            existingSubscription.status === "active"
        ) {
            return res.status(400).json({
                success: false,
                message: "User already has an active subscription"
            });
        }

        // User already created a subscription and hasn't cancelled it
        if (
            existingSubscription.razorpaySubscriptionId &&
            existingSubscription.status !== "cancelled" &&
            existingSubscription.status !== "expired" &&
            existingSubscription.status !== "created"
        ) {
            return res.status(400).json({
                success: false,
                message: "Subscription already exists"
            });
        }

        const subscription =
            await razorpay.subscriptions.create({
                plan_id: process.env.RAZORPAY_PRO_PLAN_ID,
                customer_notify: 1,
                total_count: 120
            });

        await prisma.subscription.update({
            where: {
                mongoUserId: req.user.userId.toString()
            },
            data: {
                razorpaySubscriptionId: subscription.id,
                status: subscription.status
            }
        });

        return res.status(200).json({
            success: true,
            subscription
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifySubscription = async (req, res) => {
    try {

        const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_payment_id +
            "|" +
            razorpay_subscription_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }

        await prisma.subscription.update({
            where: {
                mongoUserId: req.user.userId.toString()
            },
            data: {
                plan: "PRO",
                status: "active"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Subscription activated"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelSubscription = async (req,res)=>{
    try{

        const subscription =
            await prisma.subscription.findUnique({
                where:{
                    mongoUserId:req.user.userId.toString()
                }
            });

        if (!subscription?.razorpaySubscriptionId) {
            return res.status(400).json({
                success: false,
                message: "No active subscription found"
            });
        }

        await razorpay.subscriptions.cancel(
            subscription.razorpaySubscriptionId
        );

        await prisma.subscription.update({
            where:{
                mongoUserId:req.user.userId.toString()
            },
            data:{
                plan:"FREE",
                status:"cancelled"
            }
        });

        return res.status(200).json({
            success:true
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

const handleWebhook = async (req, res) => {
    try {

        const webhookSecret =
            process.env.RAZORPAY_WEBHOOK_SECRET;

        const receivedSignature =
            req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(req.body)
            .digest("hex");

        if (expectedSignature !== receivedSignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        const event = JSON.parse(req.body.toString());

        console.log(event.event);

        switch (event.event) {

            case "subscription.activated": {

                const razorpaySubscriptionId =
                    event.payload.subscription.entity.id;

                await prisma.subscription.update({
                    where: {
                        razorpaySubscriptionId
                    },
                    data: {
                        plan: "PRO",
                        status: "active",
                        currentPeriodEnd: new Date(
                            event.payload.subscription.entity.current_end * 1000
                        )
                    }
                });

                break;
            }

            case "subscription.charged": {

                const razorpaySubscriptionId =
                    event.payload.subscription.entity.id;

                await prisma.subscription.update({
                    where: {
                        razorpaySubscriptionId
                    },
                    data: {
                        status: "active",
                        currentPeriodEnd: new Date(
                            event.payload.subscription.entity.current_end * 1000
                        )
                    }
                });

                break;
            }

            case "subscription.cancelled": {

                const razorpaySubscriptionId =
                    event.payload.subscription.entity.id;

                await prisma.subscription.update({
                    where: {
                        razorpaySubscriptionId
                    },
                    data: {
                        plan: "FREE",
                        status: "cancelled"
                    }
                });

                break;
            }

            case "subscription.completed": {

                const razorpaySubscriptionId =
                        event.payload.subscription.entity.id;

                    await prisma.subscription.update({
                        where: {
                            razorpaySubscriptionId
                        },
                        data: {
                            plan: "FREE",
                            status: "expired"
                        }
                });

                break;
            }
        }

        res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    getSubscription,createSubscription,verifySubscription,cancelSubscription,handleWebhook
};