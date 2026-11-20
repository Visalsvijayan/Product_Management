import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
// const transpoter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL,
//         pass:process.env.EMAIL_PASSWORD
//     }
// })



import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Keep the same transporter.sendMail() interface
const transpoter = {
    sendMail: async ({ to, subject, text, html }) => {

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL|| 'onboarding@resend.dev',
            to: Array.isArray(to) ? to : [to],
            subject,
            text,
            html
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            messageId: data.id
        }
    }
}

 


export default transpoter