const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        uique:[true,"username already present"],
        required:[true,"username is required"],
    },
    email: {
        type:String,
        unique:[true,"email already present"],
        required:[true,"email is required"],
    },
    password:{
        type:String,
        required:true,
    }
})


const userModel = mongoose.model("user",userSchema);

module.exports=userModel;