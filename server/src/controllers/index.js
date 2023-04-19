const AuthControl =require('./auth.controller')
const userControl =require('./user.controller');
const previewControl = require('./preview.controller');
const planController = require("./plan.controller");

module.exports={
    AuthControl,
    userControl,
    previewControl,
    planController,
}