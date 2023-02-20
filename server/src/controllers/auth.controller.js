const { compareSync, hashSync } = require("bcryptjs");
const { getTokenSecrete, getRefreshTokenSecrete } = require("../config/env");
const { getUsername, userExist, resetUserLogin, getCurrentPlan, defaultAccount, deleteAccount } = require("../services");
const { APIError } = require("../utils/apiError");
const jwt = require('jsonwebtoken');
const responseBuilder = require('../utils/responsBuilder');
const { ERROR_FIELD, ACTIONS } = require("../utils/actions");
const { isValidEmail } = require("../utils/validation");

exports.ctrLogin =async(req,res,next)=>{
    try {
        const {username, password}=req.body;
        if(!username)
        return next(APIError.badRequest("username is required"))
        if(!password)
       return next(APIError.badRequest("password is required"))
        const exist= await getUsername(username);
        if(!exist)
       return next(APIError.customError( "User does  not exist",404));
        if(exist.error)
         return next(APIError.customError( exist.error,400)); 
        const verify = compareSync(password,exist.password); 
        if(!verify)
       return next(APIError.badRequest("Incorrect password",400));
        let payload={};
        const userPlan= await getCurrentPlan(exist.userId);
        if(!userPlan.error && userPlan){ 
            payload = {id:exist.userId,role:exist.role,plan:userPlan.plan};
        }else{ 
            payload = {id:exist.userId,role:exist.role};
        }
        logger.info("Login successful",{meta:"auth-service"});
        const data = responseBuilder.buildUser(exist);
        const token = jwt.sign(payload,getTokenSecrete(),{expiresIn:'30m'});
        const refreshToken = jwt.sign(payload,getRefreshTokenSecrete(),{expiresIn:"60m"});
       const response  = responseBuilder.commonReponse("login successful",data,"user",{token,refreshToken});
      
        res.cookie('jwt',token,{
            httpOnly:false,
            secure:true,
            sameSite:'none',
            maxAge:60*60*1000
        });
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}
exports.ctrDefaultUser =async(req,res,next)=>{
    try{
        const {username,password,email,role}=req.body;
        if(!username)
       return next(APIError.badRequest('Username is required'));
        if(!password)
       return next(APIError.badRequest('Password is required'));
        if(!email)
       return next(APIError.badRequest('Email is required'));
        if(!role)
       return next(APIError.badRequest('Role is required'));
        if(!isValidEmail(email))
       return next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL,400));
        const hashedPass = hashSync(password.trim(),12);
        const details ={username,password:hashedPass,email,role}
        const register = await defaultAccount(details);
        if(!register)
        return next(APIError.customError())
        
        if(register.error)
        return next(APIError.customError(register.error,400));
        logger.info("Account created Successfully",{meta:"account-service"});
        res.status(200).json({success:true,msg:"Account Created Successfully"});
    }catch(error){
        next(error);
    }
}
exports.ctrLogout=async(req,res,next)=>{
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt)
        return res.status(400).json({error:"No valid cookie"});
        const token =cookies.jwt;
        const payload = jwt.decode(token,getTokenSecrete());
        const exist = await userExist(payload.id);
        if(!exist)
        return next(APIError.customError("User does not exist"));
        logger.info("Logged out successfully", {meta:"auth-service"});
        res.clearCookie('jwt');
        res.status(200).json({success:true,msg:"You have successfully logged out"});

    } catch (error) {
        next(error);
    }
}
exports.ctrlResetLogin =async(req,res,next)=>{
    try {
        const {currentPassword, newPassword}=req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!currentPassword)
        return next(APIError.badRequest("Provide current password"))
        if(!newPassword)
        return next(APIError.badRequest("Provide new password"))
        const check = await userExist(req.userId);
        if(!check)
        return res.status(404).json({error:"Incorrect password"})
        if(check.error)
        return res.status(404).json({error:check.error});
        const verify = compareSync(currentPassword,check.password);
        if(!verify)
        return next(APIError.customError("current password is incorrect",400));
        const hashedPass = hashSync(newPassword,12);
        const reset=await resetUserLogin(req.userId,hashedPass);
        if(!reset)
        return next(APIError.customError());
        if(reset.error)
        return next(APIError.customError(reset.error,400))
        logger.info("Reset login successfully", {meta: "account-service"});
        res.status(200).json({success:true,msg:"Password reset successful"});
    } catch (error) {
        next(error)
    }
}

exports.ctrlCheckUser =(req, res, next) => {
    try{
          const token = req.cookies.jwt;
        if(!token)
        return next(APIError.unauthenticated()); 
        const verify = jwt.verify(token, getTokenSecrete());
        if(verify)
        res.status(200).json({success:true, msg:"User is Authenticated"})
    }catch(error){
         if( error.message ===ACTIONS.JWT_EXPIRED)
        next(APIError.unauthenticated())
      else  next(error)
    }
}

exports.ctrlDeleteAcctount = async (req, res, next) => {
    try {
        const {userId} =req.query;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(req.userRole.toLowerCase() !== 'admin')
        return next(APIError.unauthorized());
        if(!userId)
        return next(APIError.badRequest("Account id to delete is required"));
        const delAccount = await  deleteAccount(userId);
         if(!delAccount)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404));
        if(delAccount.error)
        return next(APIError.customError(delAccount.error,400));
        logger.info("Account deleted successfully", {meta: "account-service"})
        res.status(200).json({success:true, msg: "Account Deleted Successfully"});
    } catch (error) {
        next(error);
    }
}