const logger = require("../logger");
const { verifyUserProfile, getUserProfile, getUserButton, getAppearance, getUserLinks } = require("../services");
const { ERROR_FIELD } = require("../utils/actions");
const { APIError } = require("../utils/apiError");
const responseBuilder= require('../utils/responsBuilder')
exports.ctrlVerifyProfile = async (req, res, next) => {
  try {
       const {username}=req.query;
      if(!username)
      return next(APIError.customError("Invalid Link",400)); 
       const check = await verifyUserProfile(username);
      if(!check)
      return next(APIError.customError("Invalid Link",404))
      if(check.error)
      return next(APIError.customError(check.error,400));
      //verify link
      logger.info("Verify profile link successfully", {meta: "account-service"})
      res.status(200).json(
        {success:true,
          userId:check.userId,
          username:check.username,
          msg:"Link is valid"
        }
        )
  } catch (error) {
      return next(error);
  }
}
exports.ctlGetProfile=async(req,res,next)=>{
  try {
    const {userId} = req.query;
      if(!userId)
      return next(APIError.unauthenticated());
      const profile = await getUserProfile(userId);
      if(!profile)
      return next(APIError.customError("No profile exist",404))
      if(profile.error)
      return next(APIError.customError( profile.error,400));
    const data=  responseBuilder.buildProfile(profile);
      const response = responseBuilder.commonReponse("Found",data,"profile");
      logger.info("Profile retrieved successfully", {meta: "account-service"})
      res.status(200).json(response);
  } catch (error) {
      next(error);
  }
}

exports.ctrlGetLinks = async(req, res, next) => {
  try {
    const { userId} = req.query;
      if(!userId)
      return next(APIError.unauthenticated());
      const userLinks= await getUserLinks(userId);
      if(!userLinks)  
      return next(APIError.customError('No user link found',404));
      if(userLinks.error)
      return next(APIError.customError(userLinks.error,400));
      const data = userLinks.map((cur)=>{
          return responseBuilder.buildPlan(cur);
      })
      const response = responseBuilder.commonReponse("Found",data,"Link");
      logger.info("Link retrieved successfully", {meta: "account-service"})
      res.status(200).json(response)
  } catch (error) {
      next(error);
  }
}


exports.ctrlGetButton = async (req, res, next) => {
  try {
    const {userId} = req.query;
      if(!userId)
      return next(APIError.unauthenticated());
      const button = await getUserButton(userId);
      if(!button)
      return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
      if(button.error)
      return next(APIError.customError(button.error,400));
      const data= button.map((cur)=>{
          return responseBuilder.buildPlan(cur);
      })
  const response = responseBuilder.commonReponse("Found",data,"button");
  logger.info("Button retrieved successfully", {meta: "account-service"})
  res.status(200).json(response);
  } catch (error) {
      next(error);
  }
}

exports.ctrlGetAppearance = async (req, res, next ) => {
  try {
    const {userId} =req.query;
      if(!userId)
      return next( APIError.unauthenticated());
      const infor = await getAppearance(userId);
      if(!infor)
      return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404));
      if(infor.error)
      return next(APIError.customError(infor.error,404));
      const data = infor.map( (cur) => {
          return responseBuilder.buildPlan(cur);
      })
      const response  = responseBuilder.commonReponse("Found",data, "appearance");
      logger.info("Appearance retrieved successfully", {meta: "account-service"})
      res.status(200).json(response);
  } catch (error) {
      next(error);
  }
}