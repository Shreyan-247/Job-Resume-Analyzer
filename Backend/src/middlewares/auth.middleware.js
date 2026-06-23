const jwt=require("jsonwebtoken");
const blacklistModel=require("../models/blacklist.model");


/**
 * @name authUserMiddleware
 * @desc Middleware to authenticate users using JWT also check if token is blacklisted or not if it is blacklisted then return error else allow user to access the route
 */
const authUserMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const isBlacklisted = await blacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {authUserMiddleware};