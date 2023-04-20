const { getPaystackSecreteKey } = require("../config/env");
const logger = require("../logger");
const { getPlanById, generateTempRef } = require("../services");
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
        generateTempRef(data.data.reference, planId).then((check) =>{
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
      const event = req.body;
      // check response status
      if(event.data.status === "success"){
        // send info to database
        console.log(event);
        logger.info("Payment completed successfully", {meta:"Paystack-server"});
      }
    }else{
        logger.info("Payment hack detected", {meta:"Paystack-server"});
      }
  }catch(error){
    next(error);
  }
}