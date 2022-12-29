const { getTokenSecrete } = require("../config/env"); 
const { APIError } = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const { userExist } = require("../services");

const adminRequired=(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token)
        return next(APIError.unauthenticated()); 
        const payload = jwt.verify(token, getTokenSecrete());
      if(payload.role.toLowerCase() !=="admin" )
      return next(APIError.unauthorized()); 
        req.userId = payload.id;
        req.userRole = payload.role; 
        next();
    }catch(error){
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
        next();
    }catch(error){
        if( error.message ==='jwt expired')
        next(APIError.customError('session expired',400))
       else next(error);
    }
}

module.exports={
    adminRequired,
    userRequired,
}