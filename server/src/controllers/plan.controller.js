const { getPaystackSecreteKey } = require("../config/env");
const logger = require("../logger");
const { getPlanById, generateTempRef, getTempReference, getUserPlan, finalizePlanUpgrade } = require("../services");
const { APIError } = require("../utils/apiError");
const { paymentSuccessMailHandler } = require("../utils/mailer");
const {options} = require("../utils/paystack.auth");


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
    // get user plan
    const userPlan = await getUserPlan(req.userId);
    if (userPlan.planId === planId) return next(APIError.badRequest("You can't upgrade to your current plan"));
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
       logger.info("Payment authorization confirmed", {meta:"Paystack-service"});
      const event = req.body.data;
      // check response status
      if(event.status === "success"){
        // send info to databaseq
        let temPlan = await getTempReference(event.reference);
        if(!temPlan || temPlan.length ===0 || temPlan.error){
          APIError.customError("Temporal reference failed",400);
          logger.info("Temporal reference retrieval failed", {meta:"paystack-plan-service"});
        }else{
          logger.info("Temporal reference id retrieved", {meta:"paystack-plan-service"});
          temPlan = temPlan[0];
          let userPlan = await getUserPlan(temPlan.userId);
          let plan = await   getPlanById(temPlan.planId);
          if(!userPlan || userPlan.length === 0 || userPlan.error) {
            logger.error("Paid plan update failed", {meta:"paystack-plan-service"});
          }
          else if(!plan || plan.length === 0 || plan.error) {
            logger.error("Paid plan update failed", {meta:"paystack-plan-service"});
          }
          // update user plan info
          const startDate = new Date();
          plan = plan[0];
          const upgradePlanInfor = {
            planId: plan.planId,
            userId: temPlan.userId,
            plan: plan.plan,
            amount: plan.amount,
            refId:temPlan.id,
            userPlanId: userPlan.userPlanId,
            startDate,
          }
          const finalize = await finalizePlanUpgrade(upgradePlanInfor);
          if(!finalize || finalize.error){
            APIError.customError("Plan final upgrade failed",400);
            logger.info("Plan final upgrade failed", {meta:"paystack-plan-service"});
          }else{
            logger.info("Plan upgraded successfully", {meta: "Plan-service"});
            //send email to customer 
            const emailer = await paymentSuccessMailHandler(event.customer.email);
            if (emailer.error)
                APIError.customError("Upgrade payment mail failed to send", 400)
                else logger.info("Upgrade payment success mail sent", {meta:"email-service"});
              }
        }
      }
    }else{
        logger.info("Payment hack detected", {meta:"Paystack-server"});
      }
  }catch(error){
    next(error);
  }
}