const express = require("express");
const app=express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());

app.use(
    "/api/subscription/webhook",
    express.raw({ type: "application/json" })
);

app.use(express.json());

const authRouter=require("./routes/auth.routes");
const aiRouter=require("./routes/ai.routes");
const subscriptionRouter=require("./routes/subscription.routes");
app.use('/api/auth',authRouter);
app.use('/api/ai',aiRouter);
app.use('/api/subscription',subscriptionRouter)

module.exports=app;