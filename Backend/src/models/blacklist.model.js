const mongoose=require("mongoose")

const blacklistTokenSchema= new mongoose.Schema({
    token:{
        type:String,
        unique:[true,"Token already blacklisted"],
        required:[true,"Token is required"]
    }
},{
    timestamps:true
})

const blacklistModel=mongoose.model("blacklisted",blacklistTokenSchema);

module.exports=blacklistModel
