require("dotenv").config()
const { configDotenv } = require("dotenv");
const app=require("./src/app.js")
const connectToDB=require("./src/config/database.js")

connectToDB()


app.listen(3000,()=>{
    console.log("Port listening on server 3000");
})