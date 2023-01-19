const { getTokenSecrete } = require("../config/env"); 
const { APIError } = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const { userExist, getUserPlan } = require("../services");
const { ACTIONS, ERROR_FIELD } = require("../utils/actions");

const adminRequired=(req,res,next)=>{
    try{
        console.log(req);
        const token = req.cookies.jwt;
        if(!token)
        return next(APIError.unauthenticated()); 
        const payload = jwt.verify(token, getTokenSecrete());
      if(payload.role.toLowerCase() !==ACTIONS.ADMIN)
      return next(APIError.unauthorized()); 
        req.userId = payload.id;
        req.userRole = payload.role; 
        next();
    }catch(error){
        if( error.message ===ACTIONS.JWT_EXPIRED) //
        next(APIError.unauthenticated())
    next(error);
    }
}
const userRequired =async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token)
        return next(APIError.unauthenticated());
        const payload= jwt.verify(token,getTokenSecrete());
        const isUser= await  userExist(payload.id);
        if(!isUser)
        return next(APIError.customError(`user does not exist`,404));
        if(isUser.error)
        return next(APIError.customError(isUser.error));
        req.userId=payload.id;
        req.userRole=payload.role;
        req.username=isUser.username;
        req.email=isUser.email;
        next();
    }catch(error){
        if( error.message ===ACTIONS.JWT_EXPIRED)
        next(APIError.unauthenticated())
       else next(error);
    }
}
 const userPlanRequired = async(req,res,next)=>{
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        const user = await getUserPlan(req.userId);
        if(!user)
        return next(APIError.customError("User plan was not found",404))
        if(user.error)
        return next(APIError.customError(user.error,400));
        req.plan=user.plan
        next();
    } catch (error) {
        next(error);
    }
 }
module.exports={
    adminRequired,
    userRequired,
    userPlanRequired,
}