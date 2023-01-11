const { domainMail, mailAuth } = require("./mail.auth")
const nodemailer = require("nodemailer");
const  mailgun  = require("nodemailer-mailgun-transport");
const sgMail = require('@sendgrid/mail')
require("dotenv").config();
exports.mailOptions =(sendTo,subject,message)=>{
     
    return{
        from:sendTo,
        to:domainMail.mail(),
        subject,
        text:message,
        html:"<h1>Welcome<h1/>"
    }
}
const sendermMailOptions =(sendTo,subject,message)=>{
     
    return{
        from:domainMail.mail(),
        to:sendTo,
        subject,
        html:message,
    }
}
 
exports.recoveryPasswordMailHandler=async(email)=>{
    try{ 
        let sentData={};
        const message =`User Account was created successfully. Click on the link to verify `
        const transporter =nodemailer.createTransport(mailgun(mailAuth)); 
        const mail = sendermMailOptions(email,"User Account",message) 
        
        transporter.sendMail(mail,(error,info)=>{ 
            if(error){ 
          return  sentData.error=error;
            } 
            console.log(info.messageId)
       sentData.success=true;
        });  
        return sentData;
    }catch(error){
        return {"error":error};
    }
}
 
// sgMail.setApiKey(mailAuth.sendGridAPIKey.api_key)
// const msg = {
//   to: 'learnueltechdev@gmail.com', // Change to your recipient
//   from: {
//     name: "LearnuelTech",
//     email: "learnueltechdev@gmail.com"
//   }, // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log('Email sent',response)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
