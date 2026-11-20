import Product from '../models/Product.js'
export const createProduct=async(req,res)=>{
    try {
        const {name,description,price,stock,category}=req.body;

            if(!name || !price || !category ||!description){   
                return res.status(400).json({message:"name,price and category are required"})
            }

            const newProduct=new Product({
                name,
                description,    
                price,
                stock,
                category,
                image:req.file?.path || null,
                imagePublicId: req.file?.filename || null,
                 
            })
            await newProduct.save();
            res.status(201).json({message:"product created successfully",product:newProduct})


    } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.log(error)
    }
}

export const getProducts=async(req,res)=>{
    try {
        const products=await Product.find();
        if(products.length===0){
            return res.status(400).json({message:'products empty'})
        }
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}