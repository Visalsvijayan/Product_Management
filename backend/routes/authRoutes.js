import express from 'express'
import {signup,verifyOtp,login,forgotPassword,resetPassword,resendOtp,twoFaLogin,verify2faLogin} from '../controllers/authController.js'
const router=express.Router()


router.post('/signup',signup)
router.post('/verify-otp',verifyOtp)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
router.post('/resend-otp',resendOtp)
router.post('/2fa-login',twoFaLogin)
router.post('/verify-2fa',verify2faLogin)

export default router