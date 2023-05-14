const https = require('https');
const { getPaystackCallBackUrl } = require('../config/env');
const { options, verifyOtions } = require('../utils/paystack.auth');
const { APIError } = require('../utils/apiError');
const logger = require('../logger');
const responseBuilder = require("../utils/responsBuilder");
const { getWalletBalance,  generateWalletTempRef, getWalletHistory } = require('../services');
const { ACTIONS } = require('../utils/actions');

exports.ctrlInitiateTransaction = async ( req, res, next) => {
  try{ 
      const {amount } = req.body;
      if(!amount) return next(APIError.badRequest("Amount is required"));
      if(amount <= 0) return next(APIError.badRequest("Invalid amount"));
    const callback_url = getPaystackCallBackUrl(); 
    const params = JSON.stringify({
      "email": req.email,
      "amount": amount*100,
      "callback_url":callback_url,
    }) 
    const reqpay = https.request(options, reqpay => {
      let data = ''
      reqpay.on('data', (chunk) => {
        data += chunk
      });
      reqpay.on('end', () => {
        // write info to database
        data = JSON.parse(data); 
        const transType = ACTIONS.TRANSACTION_TYPE[1];
        generateWalletTempRef(data.data.reference, req.userId, transType).then((check) =>{
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

exports.ctrlVerifyTransaction = async (req, res, next) => {
  try {
      const {reference} = req.query;
      if(!reference) return next(APIError.badRequest("Transaction reference is required"));
    const options = verifyOtions(reference);
  const reqpay=  https.request(options, reqpay => {
      let data = ''
    
      reqpay.on('data', (chunk) => {
        data += chunk
      });
    
      reqpay.on('end', () => {
        const verify = JSON.parse(data);
        res.status(200).json(verify);
      })
    }).on('error', error => {
      next(error)
    })
  } catch (error) {
    next(error);
  }
}
exports.ctrlWalletBalance = async (req,res,next)=>{
  try { 
  const balnace = await getWalletBalance(req.userId)
  if(!balnace)
  return next(APIError.customError("No wallet found",404));
  if(balnace.error)
  return next(APIError.customError(balnace.error,400));
  const data= responseBuilder.buildPlan(balnace);
  const response= responseBuilder.commonReponse("Found",data,"wallet");
  res.status(200).json(response);
  } catch (error) {
      next(error);
  }
}
exports.ctrlWalletHistory = async (req,res,next)=>{
  try { 
  const history = await getWalletHistory(req.userId)
  if(!history || history.length === 0)
  return next(APIError.customError("No wallet history found",404));
  if(history.error)
  return next(APIError.customError(history.error,400));
  const data= history.map((cur) => {
   return responseBuilder.buildHistory(cur);
  }) 
  const response= responseBuilder.commonReponse("Found",data,"history");
  res.status(200).json(response);
  } catch (error) {
      next(error);
  }
}