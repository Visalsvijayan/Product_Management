import express from 'express'
import {createProduct,getProducts} from '../controllers/productController.js'
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/',authMiddleware,upload.single('image'),createProduct)
router.get('/',authMiddleware,getProducts)


export default router