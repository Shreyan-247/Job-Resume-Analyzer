const express = require("express");
const authRouter=express.Router()
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


authRouter.post('/register', authController.registerUserController);
authRouter.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user by blacklisting their JWT token. 
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the details of the logged in user
 * @access Public
 */
authRouter.get('/get-me', authMiddleware.authUserMiddleware, authController.getMeController);




module.exports=authRouter;