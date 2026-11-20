import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import cors from 'cors'

import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3000;



const app=express()
dotenv.config()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
// app.use(cors({
//     origin: 'http://localhost:5173',
//     Credentials:true
// }))
app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL
    ],
    credentials: true
}));

connectDb()

app.use('/api/auth',authRoutes)
app.use('/api/user',authMiddleware,userRoutes)
app.use('/api/products',productRoutes)  

app.use(errorHandler)
 




app.listen(PORT,()=>console.log(`server running on ${PORT}`))