const express = require("express");

const subscriptionRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const subscriptionController = require("../controllers/subscription.controller");

subscriptionRouter.get(
    "/",
    authMiddleware.authUserMiddleware,
    subscriptionController.getSubscription
);

subscriptionRouter.post(
    "/checkout",
    authMiddleware.authUserMiddleware,
    subscriptionController.createSubscription
);

subscriptionRouter.post(
    "/verify",
    authMiddleware.authUserMiddleware,
    subscriptionController.verifySubscription
);

subscriptionRouter.post(
    "/cancel",
    authMiddleware.authUserMiddleware,
    subscriptionController.cancelSubscription
);

subscriptionRouter.post(
    "/webhook",
    subscriptionController.handleWebhook
);


module.exports = subscriptionRouter;