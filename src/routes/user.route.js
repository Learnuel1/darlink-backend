const express =require('express');
 
const Controller = require('../controllers');
const { errorMiddleWareModule } = require('../middlewares');
const { userRequired } = require('../middlewares/auth.middleware');
const userRoute=express.Router();
userRoute.get("/forgot-password",Controller.userControl.ctrlFindUser);
userRoute.post('/recovery-mail',Controller.userControl.ctrlSendRecoverMail);
userRoute.post('/profile',userRequired,Controller.userControl.ctrlUserProfile);
userRoute.get('/profile',userRequired,Controller.userControl.ctlGetProfile);

userRoute.use("*",errorMiddleWareModule.notFound);
userRoute.all(errorMiddleWareModule.errorHandler);

module.exports={
    userRoute,
}