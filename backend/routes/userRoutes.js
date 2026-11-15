import express from 'express'
import { getDashbaord } from '../controllers/userController.js'
const router=express.Router()

router.get('/dashboard',getDashbaord)




export default router