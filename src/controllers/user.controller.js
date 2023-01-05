const { hashSync } = require("bcryptjs");
const { registerUser, 
    findUserAccount, 
    uploadProfile, 
    getUserProfile, 
    createAdmin, 
    plans, 
    getPlans, 
    getUserPlan,
    deletePlan,
    updatePlan} = require("../services");
const { APIError } = require("../utils/apiError");
const { isValidEmail } = require("../utils/validation");
const responseBuilder = require('../utils/responsBuilder');
const { cloudinary, accessPath } = require("../utils/cloudinary");
const { ACTIONS } = require("../utils/actions"); 
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
        const register = await registerUser(username.trim(),hashedPass,email.trim(),ACTIONS.DEFAULT_PLAN);
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
        const details ={username,password:hashedPass,email,role}
        const register = await createAdmin(details);
        if(!register)
        return next(APIError.customError())
        
        if(register.error)
        return next(APIError.customError(register.error,400));
        res.status(200).json({success:true,msg:"Account Created Successfully"});
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
        
        res.status(200).json({success:true,msg:`Profile updated sucessfully`})

    } catch (error) {
        next(error)
    }
}
exports.ctlGetProfile=async(req,res,next)=>{
    try {
        
        if(!req.userId)
        return next(APIError.unauthenticated());
        const profile = await getUserProfile(req.userId);
        if(!profile)
        return next(APIError.customError("user does not exist",404));
        if(profile.error)
        return next(APIError.customError(profile.error,400));
      const data=  responseBuilder.buildProfile(profile);
           const response = responseBuilder.commonReponse("Found",data,"profile");
           res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
exports.ctrlPlan=async(req,res,next)=>{
    try {
        const {plan,amount,duration}=req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(req.userRole.toLowerCase() !==ACTIONS.ADMIN)
        return next(APIError.unauthorized());
        if(!plan)
        return next(APIError.badRequest("Plan name is required"));
        if(!amount)
        return next(APIError.badRequest("Plan cost is required"));
        if(!duration) 
        return next(APIError.badRequest("Plan duration is required"));
        const details ={plan,amount,duration,userId:req.userId};
        const createPlan = await plans(details);
        if(!createPlan)
        return next(APIError.customError());
        if(createPlan.error)
        return next(APIError.customError(createPlan.error,400));
        res.status(201).json({success:true,msg:"Plan created successfully"});
    } catch (error) {
        next(error);
    }
}
exports.ctrlGetPlans=async(req,res,next)=>{
    try {
         
    const plans = await getPlans();
    if(!plans)
    return next(APIError.customError("No plan exist",404));
    if(plans.error)
    return next(APIError.customError(plans.error,400));
    const data = plans.map((item)=>{
        return responseBuilder.buildPlan(item);
    })
    const response= responseBuilder.commonReponse("Found",data,"plans");
    res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
exports.ctrlGetUserPlans=async(req,res,next)=>{
    try {
    if(!req.userId)
    return next(APIError.unauthenticated());

    const plans = await getUserPlan(req.userId)
    if(!plans)
    return next(APIError.customError("No plan exist for this account",404));
    if(plans.error)
    return next(APIError.customError(plans.error,400));
    const data = plans.map((item)=>{
        return responseBuilder.buildPlan(item);
    })
    const response= responseBuilder.commonReponse("Found",data,"plans");
    res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
exports.ctrlDelatePlan=async(req,res,next)=>{
    try {
        const {planId} = req.query;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(req.userRole.toLowerCase() !==ACTIONS.ADMIN)
        return next(APIError.unauthorized());
        if(!planId)
        return next(APIError.badRequest("Plan id is required"));
        const del = await deletePlan(planId);
        if(!del)
        return next(APIError.customError("Plan was not found",404));
        if(del.error)
        return next(APIError.customError(del.error,400));
        res.status(200).json({success:true,msg:"Plan deleted successfully"});
    } catch (error) {
        next(error);
    }
}
exports.ctrlUpdatePlan=async(req,res,next)=>{
    try {
        const {planId} = req.query;
       
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(req.userRole.toLowerCase() !==ACTIONS.ADMIN)
        return next(APIError.unauthorized());
        const details ={}
        if(!planId)
        return next(APIError.badRequest("Plan id is required"));
        for(key in req.body){
            details[key]=req.body[key];
        }
        details.planId=planId;
        const updated = await updatePlan(details);
        if(!updated)
        return next(APIError.customError("No plan was found",404));
        if(updatePlan.error)
        return next(APIError.customError(updated.error,400));
        const msg=ACTIONS.MESSAGE;
        res.status(200).json({success:true,msg:"plan updated successfully"})
    } catch (error) {
        next(error);
    }
}
exports.ctrlSendRecoverMail=async(req,res,next)=>{
    try {
        //TO DO
        //send recovery mail
    } catch (error) {
        next(error);
    }
}