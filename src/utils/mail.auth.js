require("dotenv").config();

exports.mailAuth={
auth:{
    api_key: process.env.MAIL_API_KEY,
    domain: process.env.MAIL_DOMAIN,
}
}

exports.domainMail={
    mail:()=>process.env.MAIL_ORIGIN
}