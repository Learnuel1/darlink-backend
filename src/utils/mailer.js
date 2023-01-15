const { domainMail, mailAuth } = require("./mail.auth")
const nodemailer = require("nodemailer");
const  mailgun  = require("nodemailer-mailgun-transport");
const sgMail = require('@sendgrid/mail');
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config(); 
const path = require("path");
const CONFIG = require("../config"); 

const handlebarsOptions = {
    viewEngine:{
        extName: ".handlebars",
        partialsDir: path.resolve("./src/views"),
        defaultLayout: false,
    },
    viewPath : path.resolve("./src/views"),
    extName: ".handlebars",
}
var transporter =nodemailer.createTransport(mailgun(mailAuth)); 
transporter.use("compile", hbs(handlebarsOptions))
exports.mailOptions =(sendTo,subject,message)=>{
    return{
        from:sendTo,
        to:domainMail.mail(),
        subject,
        text:message,
        html: message,
    }
}
const senderMailOptions =(sendTo,subject,username)=>{
    return{
        from:`${CONFIG.APP_NAME} ${domainMail.mail()}`,
        to:sendTo,
        subject, 
        template: "resetpassword", 
        context:{
            expiryTime: `"30"`,
            link: "facebook.com",  
        }
    }
}
const passwordMailOptions =(sendTo,subject,expiryTime,uniqueString)=>{
    return{
        from:`${CONFIG.APP_NAME} ${domainMail.mail()}`,
        to:sendTo,
        subject, 
        template: "resetpassword", 
        context:{
            expiryTime: `${expiryTime} `,
            link: `${ process.env.FRONTEND_ORIGIN_URL}/user/verify-reset?id=${uniqueString}`,  
        }
    }
}
const verificationdMailOptions =(sendTo,subject,expiryTime,uniqueString,username)=>{
    return{
        from:`${CONFIG.APP_NAME} ${domainMail.mail()}`,
        to:sendTo,
        subject, 
        template: "verify", 
        context:{
             expiryTime: `${expiryTime} `,
            link: `${ process.env.FRONTEND_ORIGIN_URL}/user/verify?id=${uniqueString}`, 
            username, 
        }
    }
}
 
exports.recoveryPasswordMailHandler=async(email,expiryTime,uniqueString)=>{
   
        return new Promise((resolve, reject) => {
            const mail = passwordMailOptions(email, "Password Reset", expiryTime, uniqueString)
            transporter.sendMail(mail, (err, data) => {
                if (err) {
                    console.log(err)
                    return reject(err);
                }
                return resolve({ success: true })
            });
        }) 
}

 exports.registrationMailHandler=async(email,username)=>{
     try {
         return new Promise((resolve, reject) => {

             const mail = senderMailOptions(email, "Account Registration",expiryTime, username)
             transporter.sendMail(mail, (err, data) => {
                 if (err) {
                     return reject(err);
                 }
                 return resolve({ success: true })
             });
         })
     } catch (error) {
         return { "error": error };
     }
 }
 exports.verificationMailHandler=async(email,expiryTime,uniqueString,username)=>{
    return new Promise((resolve, reject) => { 
        const mail = verificationdMailOptions(email,"Account Verification",expiryTime,uniqueString,username) 
       transporter.sendMail(mail,(err,data)=>{ 
            if(err){  
         return  reject(err);
            } 
            return resolve({success:true})
        });  
    })
  
}
 