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
    updatePlan,
    getUserProfiles,
    userProfileLink,
    getUserLinks,
    removeUserLinks,
    userButton,
    getUserButton,
    removeUserButton,
    sendRecoverMail} = require("../services");
const { APIError } = require("../utils/apiError");
const { isValidEmail } = require("../utils/validation");
const responseBuilder = require('../utils/responsBuilder');
const { cloudinary, accessPath } = require("../utils/cloudinary");
const { ACTIONS, PLANS, ERROR_FIELD } = require("../utils/actions"); 
const { recoveryPasswordMailHandler } = require("../utils/mailer");
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
        next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL));

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
        next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL,400));
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
            return next(APIError.customError(ERROR_FIELD.INVALID_EMAIL,400));
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
exports.ctlGetProfiles=async(req,res,next)=>{
    try {
        
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!req.userRole)
        return next(APIError.unauthorized());
        const profile = await getUserProfiles();
        if(!profile)
        return next(APIError.customError("user does not exist",404));
        if(profile.error)
        return next(APIError.customError(profile.error,400));
        const data= profile.map((item)=>{
            return responseBuilder.buildProfile(item)
        }) 
           const response = responseBuilder.commonReponse("Found",data,"profile");
           res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
exports.ctrlPlan=async(req,res,next)=>{
    try {
        const {plan,amount,duration}=req.body;
        console.log(req.userId) // hy is it complaining of this code ok
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

    const plan = await getUserPlan(req.userId)
    if(!plan)
    return next(APIError.customError("No plan exist for this account",404));
    if(plan.error)
    return next(APIError.customError(plan.error,400));
    const data= responseBuilder.buildPlan(plan);
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
exports.ctrlLink = async(req, res, next) => {
    try {
         
        const details={type}=req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!req.plan)
        return next(APIError.unauthorized(`Updgrade plan to have access`))
        const plan = req.plan
        if(!type)
        return next(APIError.badRequest("Type is required"));
        details.type=type;
        details.userId=req.userId;
        for(key in req.body){
            if(key.toLowerCase() !=='dataFile')
            details[key] = req.body[key];
        }
        if(details.subtitle){
            if(plan.toLowerCase() !==PLANS.PERSONAL || plan.toLowerCase() !==PLANS.ENTREPRENEUR){

            const infor = PLANS.ENTREPRENEUR.charAt(0).toUpperCase() + PLANS.ENTREPRENEUR.slice(1);
            return next(APIError.unauthorized(`Updgrade to ${infor} Plan to have access`));
            }
        }
        if(req.body.dataFile){
            //send file to cloude
             if(req.body.bgImage){
            const img=await    cloudinary.uploader.upload(req.body.dataFile,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.url=img.public_id;
            details.urlId=img.secure_url;
        }
        }

        const userLink = await userProfileLink(details);
        if(!userLink)
        return  next(APIError.customError("No user infor found"));

        if(userLink.error)
        return next(APIError.customError(userLink.error,400));
         res.status(201).json(ACTIONS.COMPLETED);

    } catch (error) {
        next(error);
    }
}

exports.ctrlGetLinks = async(req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        const userLinks= await getUserLinks(req.userId);
        if(!userLinks)
        return next(APIError.customError('No user link found',404));
        if(userLinks.error)
        return next(APIError.customError(userLinks.error,400));
        const data = userLinks.map((cur)=>{
            return responseBuilder.buildPlan(cur);
        })
        const response = responseBuilder.commonReponse("Found",data,"Link");
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}
exports.ctrlRemoveLinks = async(req, res, next) => {
    try {
        const {linkId} = req.query;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!linkId)
        return next(APIError.badRequest("LinkId is required"));
        const userLinks= await removeUserLinks(req.userId,linkId);
        if(!userLinks)
        return next(APIError.customError('Link Id does not exist',404));
        if(userLinks.error)
        return next(APIError.customError(userLinks.error,400));
        res.status(200).json({success:true,msg:'Delete completed successfully'})
    } catch (error) {
        next(error);
    }
}
exports.ctrlButton = async (req, res, next) => {
    try {
        const {type} = req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!req.plan)
        return next(APIError.unauthorized());
        if(!type)
        return next(APIError.badRequest("Type is required"));

        const details = {};
        for(key in req.body){
            details[key] = req.body[key];
        }
        if(details.length===0)
        return next(APIError.badRequest())
        const check=type.toLowerCase();
        const plan=req.plan.toLowerCase();
        details.userId=req.userId;
        if(check === ACTIONS.EMAIL){
             if(!isValidEmail(details.data))
        next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL));
        }
        if(check === ACTIONS.SOCIAL || 
        check === ACTIONS.MUSIC || 
        check === ACTIONS.PODCAST || 
        check === ACTIONS.CONTACT)
        if(
        plan !== PLANS.PERSONAL ||
         plan !== PLANS.ENTREPRENEUR){
            infor =  PLANS.PERSONAL.charAt(0).toUpperCase() + PLANS.PERSONAL.slice(1);
            return next(APIError.unauthenticated(`Upgrade plan to ${infor} Plan`))
        }
        details.type=check;
        details.plan=plan;

    const button = await userButton(details);
    if(!button)
    return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
    if(button.error)
    return next(APIError.customError(button.error,400));
    res.status(201).json(ACTIONS.COMPLETED);
    } catch (error) {
        next(error);
    }
}

exports.ctrlGetButton = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        const button = await getUserButton(req.userId);
        if(!button)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
        if(button.error)
        return next(APIError.customError(button.error,400));
        const data= button.map((cur)=>{
            return responseBuilder.buildPlan(cur);
        })
    const response = responseBuilder.commonReponse("Found",data,"button");
    res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
exports.ctrlRemoveButton = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        const button = await removeUserButton(req.userId);
        if(!button)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
        if(button.error)
        return next(APIError.customError(button.error,400));
    res.status(200).json(ACTIONS.COMPLETED);
    } catch (error) {
        next(error);
    }
}
exports.ctrlSendRecoverMail=async(req,res,next)=>{
    try {
        //TO DO
        //send recovery mail
        if(!req.mail)
        return next(APIError.badRequest("Account not Found"));
        const temPass ="dljperkladf";
        recoveryPasswordMailHandler(req.email,temPass).then(async response=>{
          const details= {email:req.mail};
            const newPass = await sendRecoverMail(details);
        }).catch(err=>{

        })
    } catch (error) {
        next(error);
    }
}