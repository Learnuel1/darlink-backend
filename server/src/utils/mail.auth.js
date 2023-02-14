require("dotenv").config();

exports.mailAuth = {
  service: `gmail`,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
// exports.mailAuth={
// auth:{
//     api_key: process.env.MAIL_API_KEY,
//     domain: process.env.MAIL_DOMAIN,
// },
// sendGridAPIKey:{
//     api_key:process.env.SENDGRID_API_KEY
// }
// }

exports.domainMail={
    mail:()=>process.env.MAIL_ORIGIN
}
