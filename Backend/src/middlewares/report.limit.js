const prisma = require("../config/prisma");

const checkReportLimit = async (req, res, next) => {
    try {

        const subscription =
            await prisma.subscription.findUnique({
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

        if (subscription.plan === "PRO") {
            return next();
        }

        if (new Date() > subscription.usageResetDate) {

            const nextReset = new Date();

            nextReset.setMonth(
                nextReset.getMonth() + 1
            );

            await prisma.subscription.update({
                where: {
                    mongoUserId:
                        req.user.userId.toString()
                },
                data: {
                    reportsGenerated: 0,
                    usageResetDate: nextReset
                }
            });

            subscription.reportsGenerated = 0;
        }

        if (subscription.reportsGenerated >= 3) {
            return res.status(403).json({
                success: false,
                message:
                    "Free plan limit reached. Upgrade to Pro."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = checkReportLimit;