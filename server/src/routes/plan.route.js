const express =require('express');
const Controller = require('../controllers');
const { userRequired, adminRequired } = require('../middlewares/auth.middleware');
const planRoute=express.Router();
 
planRoute.get('/',Controller.userControl.ctrlGetPlans)
planRoute.get('/:planid',Controller.userControl.ctrlGetPlanById)
planRoute.post('/',adminRequired, Controller.userControl.ctrlPlan)
planRoute.delete('/',adminRequired, Controller.userControl.ctrlDelatePlan)
planRoute.get('/user-plan',userRequired, Controller.userControl.ctrlGetUserPlans)
planRoute.put('/',adminRequired,Controller.userControl.ctrlUpdatePlan)
planRoute.post("/upgrade", userRequired, Controller.planController.ctrlPlanUpgrade);
planRoute.post("/payment-successful", Controller.planController.paymentCompleted);
module.exports={
    planRoute,
}