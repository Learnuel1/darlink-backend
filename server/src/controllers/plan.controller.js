const logger = require("../logger");
const { getPlanById } = require("../services");
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
        res.send(data);
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
    // send infor to database
    logger.info("Payment completed successfully", {meta:"Paystack-server"});
  }catch(error){
    next(error);
  }
}