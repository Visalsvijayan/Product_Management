import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String},
    otp:{type:String},
    isVerified:{type:Boolean,default:false},
    otpExpire:{type:Date}
    
    
})

export default mongoose.model('User',userSchema)