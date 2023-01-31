const express =require('express'); 
const Controller = require('../controllers');
const { userRequired, adminRequired } = require('../middlewares/auth.middleware');

const authRoute=express.Router();

authRoute.post('/register', Controller.userControl.ctrRegister);
authRoute.post('/create',adminRequired, Controller.userControl.ctrCreate);
authRoute.post('/login', Controller.AuthControl.ctrLogin);
authRoute.post('/logout',Controller.AuthControl.ctrLogout);
authRoute.patch('/reset',userRequired,Controller.AuthControl.ctrlResetLogin);
authRoute.post('/plan',adminRequired,Controller.userControl.ctrlPlan)
authRoute.post('/default',Controller.AuthControl.ctrDefaultUser)
authRoute.get('/users', adminRequired, Controller.userControl.ctrlGetUserAccounts)
authRoute.post('/check', Controller.AuthControl.ctrlCheckUser);
authRoute.delete("/user", adminRequired, Controller.AuthControl.ctrlDeleteAcctount)
module.exports={
    authRoute,
}