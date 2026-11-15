import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import path from 'path'
import cors from 'cors'

const app=express()
dotenv.config()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    Credentials:true
}))

connectDb()

app.use('/api/auth',authRoutes)
app.use('/api/user',authMiddleware,userRoutes)
app.use('/api/products',productRoutes)  

app.use(errorHandler)
 




app.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))