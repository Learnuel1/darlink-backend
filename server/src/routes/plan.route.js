const express =require('express');
 
const Controller = require('../controllers');
const { errorMiddleWareModule } = require('../middlewares');
const { userRequired, adminRequired } = require('../middlewares/auth.middleware');
const planRoute=express.Router();
 
planRoute.get('/',Controller.userControl.ctrlGetPlans)
planRoute.post('/',adminRequired, Controller.userControl.ctrlPlan)
planRoute.delete('/',adminRequired, Controller.userControl.ctrlDelatePlan)
planRoute.get('/user-plan',userRequired, Controller.userControl.ctrlGetUserPlans)
planRoute.put('/',adminRequired,Controller.userControl.ctrlUpdatePlan)
planRoute.use("*",errorMiddleWareModule.notFound);
planRoute.all(errorMiddleWareModule.errorHandler);

module.exports={
    planRoute,
}