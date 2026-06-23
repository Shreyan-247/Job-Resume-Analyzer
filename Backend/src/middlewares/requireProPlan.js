const prisma = require("../config/prisma");

const requireProPlan = async (req, res, next) => {

    const subscription =
        await prisma.subscription.findUnique({
            where: {
                mongoUserId: req.user.userId.toString()
            }
        });

    if (
        !subscription ||
        subscription.plan === "FREE"
    ) {
        return res.status(403).json({
            success: false,
            message: "Pro subscription required"
        });
    }

    next();
};

module.exports = requireProPlan;