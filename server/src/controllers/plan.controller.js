const { getPaystackSecreteKey } = require("../config/env");
const logger = require("../logger");
const { getPlanById, generateTempRef, getTempReference, getUserPlan, finalizePlanUpgrade } = require("../services");
const { APIError } = require("../utils/apiError");
const options = require("../utils/paystack.auth");


exports.ctrlPlanUpgrade = async ( req, res, next) => {
  try{
    if(!req.userId) return next(APIError.unauthenticated());
    const { planId } = req.body;
    if (!planId) return next(APIError.badRequest("Plan ID is required"));
    const plan = await getPlanById(planId);
    if(!plan || plan.length === 0) return next(APIError.customError("Plan NOT found", 404));
    if(plan.error) return next(APIError.customError(plan.error, 400));
    const https = require('https')
    const selectPlan = plan[0]
    const params = JSON.stringify({
      "email": req.email,
      "amount": selectPlan.amount*100,
    }) 
    const reqpay = https.request(options, reqpay => {
      let data = ''
      reqpay.on('data', (chunk) => {
        data += chunk
      });
      reqpay.on('end', () => {
        // write info to database
        data = JSON.parse(data);
        generateTempRef(data.data.reference, planId,req.userId).then((check) =>{
          logger.info("Payment authorized successfully", {meta:"Paystack-service"});
          res.send(data);
        }).catch((err) =>{
          return res.status(400).json({error:"Authorization failed, try again"})
        })
      })
    }).on('error', error => {
      next(error);
    })
    
    reqpay.write(params)
    reqpay.end()
  }catch(error){
    next(error);
  }
}

exports.paymentCompleted = async (req, res, next) => {
  try{
    const crypto = require('crypto');
    const secret = getPaystackSecreteKey(); 
      //validate event
      const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex'); 
    // verify request origin
    if (hash == req.headers['x-paystack-signature']) {
      // Retrieve the request's body
      const event = req.body.data;
      // check response status
      if(event.status === "success"){
        // send info to database
        const temPlan = await getTempReference(event.reference);
        if(!temPlan || temPlan.error){
          logger.info("Payment hacked successfully", {meta:"Paystack-service"});
        }else{
          
          const userPlan = await getUserPlan(temPlan.userId);
          if(!userPlan || userPlan.error) {
            logger.error("Paid plan update failed", {meta:"paystack-plan-service"});
          }
          const plan = await  getPlanById(temPlan.planId);
          if(!plan || plan.error) {
            logger.error("Paid plan update failed", {meta:"paystack-plan-service"});
          }
          // update user plan info
          const upgradePlanInfor = {
            planId:plan.planId,
            userId: temPlan.userId,
            plan: plan.plan,
            amount: plan.amount,
            userPlanId: userPlan.userPlanId,
            startDate: Date.now(),
          }
          const finalize = await finalizePlanUpgrade(upgradePlanInfor);
          if(!finalize || finalize.error){
            logger.error("Plan upgrade failed", {meta:"paystack-plan-service"});
          }else{
            //send email to customer
            logger.info("Plan upgraded successfully", {meta: "Plan-service"});
          }
        }
        console.log(event);
      }
    }else{
        logger.info("Payment hack detected", {meta:"Paystack-server"});
      }
  }catch(error){
    next(error);
  }
}