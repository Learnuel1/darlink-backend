const { domainMail, mailAuth } = require("./mail.auth")
const nodemailer = require("nodemailer");
const  mailgun  = require("nodemailer-mailgun-transport");
  
exports.mailOptions =(sendTo,subject,message)=>{
     
    return{
        from:sendTo,
        to:domainMail.mail(),
        subject,
        text:message,
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
 
exports.recoveryPasswordMailHandler=async(email,password)=>{
    try{ 
        let sentData={};
        const message =`User Account was created successfully. Email: ${email} password:${password}  This password is  known to you alone. `
        const transporter =nodemailer.createTransport(mailgun(mailAuth)); 
        const mail = sendermMailOptions(email,"Evasantos User Account",message) 
        
        transporter.sendMail(mail,(err,data)=>{ 
            if(err){ 
            sentData.error=err;
            } 
       sentData.success=true;
        });  
        return sentData;
    }catch(error){
        return {"error":error};
    }
}

