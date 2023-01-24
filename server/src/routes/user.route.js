const express =require('express');
 
const Controller = require('../controllers');
const { errorMiddleWareModule } = require('../middlewares');
const { userRequired, adminRequired, userPlanRequired } = require('../middlewares/auth.middleware');
const userRoute=express.Router();
userRoute.get("/forgot-password",Controller.userControl.ctrlFindUser);
userRoute.post('/recovery-mail',Controller.userControl.ctrlSendRecoverMail);
userRoute.post('/reset-password',Controller.userControl.ctrlResetPassword);
userRoute.get('/verify-reset',Controller.userControl.ctrlVerifyReset);
userRoute.post('/profile',userRequired,Controller.userControl.ctrlUserProfile);
userRoute.get('/profile',userRequired,Controller.userControl.ctlGetProfile);
userRoute.get('/profiles',adminRequired,Controller.userControl.ctlGetProfiles);
userRoute.get('/',Controller.userControl.ctrlGetPlans)
userRoute.post('/resources',userRequired,userPlanRequired,Controller.userControl.ctrlLink)
userRoute.get('/resources',userRequired,Controller.userControl.ctrlGetLinks)
userRoute.delete('/resources',userRequired,Controller.userControl.ctrlRemoveLinks)
userRoute.post("/button",userRequired, userPlanRequired, Controller.userControl.ctrlButton)
userRoute.get("/button",userRequired, Controller.userControl.ctrlGetButton)
userRoute.delete("/button",userRequired, Controller.userControl.ctrlRemoveButton)
userRoute.post("/verification-link",userRequired,Controller.userControl.ctrlSendVerification)
userRoute.get("/verify",Controller.userControl.ctrlVeifyUser);
userRoute.patch("/update",userRequired,Controller.userControl.ctrlUpdateUserInfor)

 
module.exports={
    userRoute,
}