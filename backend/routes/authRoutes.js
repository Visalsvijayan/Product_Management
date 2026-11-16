import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {signup,verifyOtp,login,forgotPassword,resetPassword,resendOtp,twoFaLogin,verify2faLogin,getMe} from '../controllers/authController.js'
const router=express.Router()



router.post('/signup',signup)
router.post('/verify-otp',verifyOtp)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
router.post('/resend-otp',resendOtp)
router.post('/2fa-login',twoFaLogin)
router.post('/verify-2fa',verify2faLogin)


router.get('/me',authMiddleware,getMe)

export default router