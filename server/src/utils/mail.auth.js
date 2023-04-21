require("dotenv").config();

exports.mailAuth = {
  service: `gmail`,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
  
exports.domainMail={
    mail:()=>process.env.MAIL_ORIGIN
}
