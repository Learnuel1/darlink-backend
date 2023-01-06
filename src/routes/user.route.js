const express =require('express');
 
const Controller = require('../controllers');
const { errorMiddleWareModule } = require('../middlewares');
const { userRequired, adminRequired, userPlanRequired } = require('../middlewares/auth.middleware');
const userRoute=express.Router();
userRoute.get("/forgot-password",Controller.userControl.ctrlFindUser);
userRoute.post('/recovery-mail',Controller.userControl.ctrlSendRecoverMail);
userRoute.post('/profile',userRequired,Controller.userControl.ctrlUserProfile);
userRoute.get('/profile',adminRequired,Controller.userControl.ctlGetProfile);
userRoute.get('/profiles',adminRequired,Controller.userControl.ctlGetProfiles);
userRoute.get('/',Controller.userControl.ctrlGetPlans)
userRoute.post('/resources',userRequired,userPlanRequired,Controller.userControl.ctrlLink)
userRoute.get('/resources',userRequired,Controller.userControl.ctrlGetLinks)
userRoute.delete('/resources',userRequired,Controller.userControl.ctrlRemoveLinks)


userRoute.use("*",errorMiddleWareModule.notFound);
userRoute.all(errorMiddleWareModule.errorHandler);

module.exports={
    userRoute,
}