const { hashSync } = require("bcryptjs");
const { registerUser, userExist, getUsername, getUserbyEmail, findUserAccount, uploadProfile } = require("../services");
const { APIError } = require("../utils/apiError");
const { isValidEmail } = require("../utils/validation");
const responseBuilder = require('../utils/responsBuilder');
const { cloudinary, accessPath } = require("../utils/cloudinary");
const { appPool } = require("../config/database");
exports.ctrRegister =async(req,res,next)=>{
    try{
        const {username,password,email}=req.body;
        if(!username)
        next(APIError.badRequest('username is required'));
        if(!password)
        next(APIError.badRequest('password is required'));
        if(!email)
        next(APIError.badRequest('email is required'));
        if(!isValidEmail(email))
        next(APIError.badRequest("email is invalid"));
        const hashedPass = hashSync(password.trim(),12);
        const register = await registerUser(username.trim(),hashedPass,email.trim());
        if(!register)
        return next(APIError.customError())
        
        if(register.error)
        return next(APIError.customError(register.error,400));

        res.status(200).json(register);
    }catch(error){
        next(error);
    }
}
exports.ctrCreate =async(req,res,next)=>{
    try{
        const {username,password,email,role}=req.body;
        if(!username)
        next(APIError.badRequest('Username is required'));
        if(!password)
        next(APIError.badRequest('Password is required'));
        if(!email)
        next(APIError.badRequest('Email is required'));
        if(!role)
        next(APIError.badRequest('Role is required'));
        if(!isValidEmail(email))
        next(APIError.badRequest("Email is invalid"));
        const hashedPass = hashSync(password.trim(),12);
        const register = await registerUser(username.trim(),hashedPass,email.trim(),role.trim());
        if(!register)
        return next(APIError.customError())
        
        if(register.error)
        return next(APIError.customError(register.error,400));

        res.status(200).json(register);
    }catch(error){
        next(error);
    }
}

exports.ctrlFindUser=async(req,res,next)=>{
    try {
        if(!req.query.username && !req.query.email)
        next(APIError.badRequest());
        let details;
        const data={};
        for(key in req.query){
            data[key]=req.query[key];
        }
        if(data.email){
            if(!isValidEmail(data.email))
            return next(APIError.customError("Invalid email",400));
        }
        if(data.username){
            const useExist = await findUserAccount(data);
            if(!useExist)
            return next(APIError.customError("Account was not found",404));
            if(useExist.error)
            return next(APIError.customError(useExist.error))
            details = responseBuilder.buildUser(useExist);
             return  res.status(200).json({success:true, msg:"found",user:details});
           
        }else if(data.email){
            const useExist = await findUserAccount(data);
            if(!useExist)
            return next(APIError.customError("Account was not found",404));
            if(useExist.error)
            return next(APIError.customError(useExist.error))
            details = responseBuilder.buildUser(useExist);
            return res.status(200).json({success:true, msg:"found",user:details});
        }
    } catch (error) {
        next(error);
    }
}
exports.ctrlUserProfile=async(req,res,next)=>{
    try {
        const {displayName,contact,description,location}=req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        
        if(!displayName)
        return next(APIError.badRequest(`Display name is required`))
        if(!location)
        return next(APIError.badRequest(`Location name is required`))
        if(!contact)
        return next(APIError.badRequest(`Contact name is required`))
        if(!description)
        return next(APIError.badRequest(`Bio name is required`))
        const details={displayName,location,contact,description};
        if(req.body.profileImage){
            //store image
        const img=await    cloudinary.uploader.upload(req.body.profileImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.passportId=img.public_id;
            details.passportUrl=img.secure_url;
        }
        if(req.body.bgImage){
            const img=await    cloudinary.uploader.upload(req.body.profileImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.bgId=img.public_id;
            details.bgUrl=img.secure_url;
        }
        details.userId=req.userId;
        const profile = await uploadProfile(details);
        if(!profile)
        return next(APIError.customError());
        if(profile.error)
        return next(APIError.customError(profile.error,400));
        
        res.status(200).json({success:true,msg:`Updated sucessfully`})

    } catch (error) {
        next(error)
    }
}
exports.ctrlSendRecoverMail=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error);
    }
}