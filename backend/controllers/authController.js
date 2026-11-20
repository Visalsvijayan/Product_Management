import User from '../models/user.js'
import bcrypt from 'bcrypt'
import transpoter from '../config/mailer.js'
import crypto from 'crypto'
import twilioClient from '../config/twilio.js'
import jwt from 'jsonwebtoken'

import AppError from '../utils/AppError.js'
 
const generateOtp=()=>{
    
     return Math.floor(100000+Math.random()*900000)
}
export const signup=async(req,res)=>{
    try {
        const {name,email,password,phone}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"all feild required"})
        }
        const userExist=await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"user already exist"})
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const otp=generateOtp()

        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            phone,
            otp
        })
        //  await transpoter.sendMail({
        //     from: process.env.EMAIL,
        //     to: email,
        //     subject: "Account verification",
        //     text: `Your account verification otp is ${otp} `
            
        // })


        await newUser.save();
        
   


        res.status(201).json({message:"user signup successful,please verify your email"})

    } catch (error) {
         console.log(error)
        res.status(500).json({message:"server error"})
       
    }
}


export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;
        if(!email || !otp){
            return res.status(400).json({message:"email and otp required"})
        }
        const user=await User.findOne({email})
        //for production disabale otp validation
        // if(!user || user.otp!==otp){
        //     return res.status(400).json({message:"invalid otp"})
        // }

        user.isVerified=true;
        user.otp=null;
        await user.save();

        res.status(200).json({message:"email verified successfully,please login"})

    } catch (error) {
         res.status(500).json({message:"server error"})
         console.log(error)
    }
}

export const login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            // return res.status(400).json({message:"email and password required"})
            return next(new AppError(400,"email and password required"))
        }
        const user=await User.findOne({email})
         
        if(!user){
            // return res.status(400).json({message:"user not found"})
            return next(new AppError(400,"user not found"))
        }
        if(!user.isVerified){
            return res.status(400).json({message:"please verify your email"})
        }

        const passwordMatch=await bcrypt.compare(password,user.password)
        
        if(!passwordMatch){
            return res.status(400).json({message:"Invalid credential"})
        }


        // token generation

        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}

        )

 

 
        res.status(200).json({message:"user login successful",token})
        
    } catch (error) {
        //  res.status(500).json({message:"server error"})
        //  console.log(error)
        next(error)
    }
}


const forgotPasswordOtp=()=>{
    return crypto.randomInt(100000,999999).toString()
}

export const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})

        }

        const otp=forgotPasswordOtp()
        const hashedOtp=await bcrypt.hash(otp,10);
        const otpExpire=Date.now() + 10*60*1000;

        user.otp=hashedOtp;
        user.otpExpire=otpExpire;
        user.save()

        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Reset Password OTP",
            text:`Your otp is ${otp}`
        })

        res.status(200).json({message:"Otp sent to registerd email"})
    } catch (error) {
        res.status(500).json({message:"server error"})
         console.log(error) 
    }
}


export const resetPassword=async(req,res)=>{
    try {
        const {email,otp,newPassword}=req.body;
        if(!email||!otp || !newPassword){
            return res.status(400).json({message:"all feilds required"})
        
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        if(!user.otp || !user.otpExpire){
            return res.status(400).json({message:"otp not requested"})
        }
        if(Date.now()>user.otpExpire){
            return res.status(400).json({message:"otp expired"})
        }
        
        const isOtpValid=await bcrypt.compare(otp,user.otp)
        if(!isOtpValid){
            return res.status(400).json({message:"Invalid otp"})
        }

        user.password=await bcrypt.hash(newPassword,10);

        user.otp=null;
        user.otpExpire=null;

        user.save()

        res.status(200).json({message:"password reset successfully"})

    } catch (error) {
         res.status(500).json({message:"server error"})
         console.log(error) 
    }
}

export const resendOtp=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"email required"})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const otp=forgotPasswordOtp()
        const hashedOtp=await bcrypt.hash(otp,10);
        const otpExpire=Date.now() + 10*60*1000;
        user.otp=hashedOtp;
        user.otpExpire=otpExpire;
        await user.save();

        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Resend OTP",
            text:`Your otp is ${otp}`
        })

        res.status(200).json({message:"otp resent to registerd email"})


 } catch (error) {
        res.status(500).json({message:"server error"})      
        console.log(error)
    }
}

export const twoFaLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"email and password required"})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(400).json({message:"Invalid credential"})
        }
        const otp=forgotPasswordOtp()
        const hashedOtp=await bcrypt.hash(otp,10);
        const otpExpire=Date.now() + 10*60*1000;
        user.otp=hashedOtp;
        user.otpExpire=otpExpire;
        await user.save();

        // await transpoter.sendMail({
        //     from:process.env.EMAIL,
        //     to:email,
        //     subject:"2FA Login OTP",
        //     text:`Your otp is ${otp}`
        // })

        await twilioClient.messages.create({
            body:`Your  login otp is ${otp}`,
            from:process.env.TWILIO_PHONE,
            to:user.phone
        })


        res.status(200).json({message:"otp sent to registerd email,please verify to complete login"})


    } catch (error) {
        res.status(500).json({message:"server error"})
        console.log(error)
    }
}

export const verify2faLogin=async(req,res)=>{
    try {
        const {email,otp}=req.body;
        if(!email||!otp){
            return res.status(400).json({message:"email and otp required"})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        if(!user.otp || !user.otpExpire){
            return res.status(400).json({message:"otp not requested"})
        }

        if(Date.now()>user.otpExpire){
            return res.status(400).json({message:"otp expired"})
        }
        const isOtpValid=await bcrypt.compare(otp,user.otp)
        if(!isOtpValid){
            return res.status(400).json({message:"Invalid otp"})
        }
        user.otp=null;
        user.otpExpire=null;
        await user.save();
        res.status(200).json({message:"2FA login successful"})




    } catch (error) {
        res.status(500).json({message:"server error"})
        console.log(error)
    }
}

export const getMe = async (req, res, next) => {
    try {
        // req.user = { userId, iat, exp } set by authMiddleware
        const user = await User.findById(req.user.userId)
            .select('-password -otp -otpExpire');

        if (!user) {
            return next(new AppError(401, 'User no longer exists'));
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};








