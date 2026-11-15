import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:String,
    price:{type:Number,requrired:true},
    category:String,
    stock:{type:Number,default:0},
    image:String,
    createdAt:{type:Date,default:Date.now}
})

export default mongoose.model('Product',productSchema)