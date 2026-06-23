const mongoose=require("mongoose");
const userModel= require("../models/user.model");
const blacklistModel=require("../models/blacklist.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const prisma = require("../config/prisma");

/**
 * @name registerUserController
 * @desc register a new user given their username,email,password in the request body username and email should be unique and all the three and password should be hashed before saving to the database
 * @access Public
 */
const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user already exists
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);

        await prisma.subscription.create({
            data: {
                mongoUserId: newUser._id.toString(),
                plan: "FREE",
                status: "active",
                reportsGenerated: 0,
                usageResetDate: nextReset
            }
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
/**
 * @name loginUserController
 * @desc login a user given their email and password in the request body email should be unique and password should be compared with the hashed password in the database and if it matches a jwt token should be generated and sent in the response
 * @access Public   
 */
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });
        res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
/**
 * @name logoutUserController
 * @desc Logout a user by blacklisting their token and also removing it from the cookies
 * @access Public
 */
const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Blacklist the token
        await blacklistModel.create({ token });

        // Remove the token from cookies
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @name getMeController
 * @desc Get the details of the logged in user using the userId from the JWT token and fetching the user details from the database
 * @access Public
 */
const getMeController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User found', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};  

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };
