import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:String,
    price:{type:Number,requrired:true},
    category:String,
    stock:{type:Number,default:0},
    createdAt:{type:Date,default:Date.now},
    image: {
        type:String,
        default: null,
    },

    imagePublicId: {
        type: String,
        default: null,
    }
})

export default mongoose.model('Product',productSchema)