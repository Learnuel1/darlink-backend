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
    getUserAccounts,
    passwordRecovery,
    getUserAccount,
    getPasswordRecoveryInfor,
    resetLoginByLink,
    removeRecoveryLink,
    userVerification,
    updateUserInfor,
    userAppearance,
    getAppearance,
    deleteAccount,
    updateUserButton,
    updateUserProfile} = require("../services");
const { APIError } = require("../utils/apiError");
const { isValidEmail } = require("../utils/validation");
const responseBuilder = require('../utils/responsBuilder');
const { cloudinary, accessPath } = require("../utils/cloudinary");
const { ACTIONS, PLANS, ERROR_FIELD } = require("../utils/actions"); 
const { recoveryPasswordMailHandler, verificationMailHandler } = require("../utils/mailer");
const {v4 : uuidv4 } =require("uuid"); 
const logger = require("../logger");
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
            details.id=useExist.userId;
             return  res.status(200).json({success:true, msg:"found",user:details});
           
        }else if(data.email){
            const useExist = await findUserAccount(data);
            if(!useExist)
            return next(APIError.customError("Account was not found",404));
            if(useExist.error)
            return next(APIError.customError(useExist.error))
            details = responseBuilder.buildUser(useExist);
            details.id=useExist.userId;
            return res.status(200).json({success:true, msg:"found",user:details});
        }
    } catch (error) {
        next(error);
    }
}
exports.ctrlUserProfile=async(req,res,next)=>{
    try {
        const {displayName,description,location}=req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!displayName)
        return next(APIError.badRequest(`Display name is required`))
        if(!location)
        return next(APIError.badRequest(`Location name is required`))
        if(!description)
        return next(APIError.badRequest(`Bio name is required`))
        const colour= req.body.colour?req.body.colour:null;
        const details={displayName,location,colour,description};
        if(req.body.profileImage){
        const img=await    cloudinary.uploader.upload(req.body.profileImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.passportId=img.public_id;
            details.passportUrl=img.secure_url;
        }
        if(req.body.bgImage){
            const img=await  cloudinary.uploader.upload(req.body.bgImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.bgId=img.public_id;
            details.bgUrl=img.secure_url;
        }
        details.userId=req.userId;
        const profile = await uploadProfile(details);
        if(!profile)
         return next(APIError.customError( "No profile found",404));
        if(profile.error){
         return res.status(400).json(profile.error)
        } 
         res.status(200).json({success:true,msg:`Profile created sucessfully`})

    } catch (error) {
        next(error)
    }
}
exports.ctrlUpdateProfile=async(req,res,next)=>{
    try {
        
        const details ={};
        if(!req.userId)
        return next(APIError.unauthenticated());
        for(const key in req.body){
            details[key] = req.body[key];
        }
        if(details.profileImage){
        const img=await cloudinary.uploader.upload(details.profileImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.passportId=img.public_id;
            details.passportUrl=img.secure_url;
        }
        if(details.bgImage){
            const img=await cloudinary.uploader.upload(details.bgImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            details.bgId=img.public_id;
            details.bgUrl=img.secure_url;
        }
        details.userId=req.userId;
        const profile = await updateUserProfile(details);
        if(!profile)
         return next(APIError.customError( "No profile found",400));
        if(profile.error)
        return next(APIError.customError( profile.error,400));
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
        return next(APIError.customError("No profile exist",404))
        if(profile.error)
        return next(APIError.customError( profile.error,400));
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
        return next(APIError.customError("No profile exist",404))
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
       
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!req.plan)
        return next(APIError.unauthorized());
       
        const details = {};
        for(key in req.body){
            details[key] = req.body[key];
        }
        if(details.length===0)
        return next(APIError.badRequest("No data in request body"))
       
        const plan=req.plan.toLowerCase();
        details.userId=req.userId;
        if(details.email){
             if(!isValidEmail(details.email))
      return  next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL));
        }
        // if(check === ACTIONS.SOCIAL || 
        // check === ACTIONS.MUSIC || 
        // check === ACTIONS.PODCAST || 
        // check === ACTIONS.CONTACT ||
        // check === ACTIONS.PHONE ||
        // check === ACTIONS.DISCORD ||
        // check === ACTIONS.TELEGRAM)
        // if(
        // plan !== PLANS.PERSONAL ||
        //  plan !== PLANS.ENTREPRENEUR){
        //     infor =  PLANS.PERSONAL.charAt(0).toUpperCase() + PLANS.PERSONAL.slice(1);
        //     return next(APIError.unauthenticated(`Upgrade plan to ${infor} Plan`))
        // }
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

exports.ctrlUpdateButton = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!req.plan)
        return next(APIError.unauthorized());
       
        const details = {};
        for(key in req.body){
            details[key] = req.body[key];
        }
        if(!details.buttonId)
        return next(APIError.badRequest("Button ID is required"))
        if(details.length===0)
        return next(APIError.badRequest("No update data in request body"))
       
        const plan=req.plan.toLowerCase();
        details.userId=req.userId;
        if(details.email){
             if(!isValidEmail(details.email))
        next(APIError.badRequest(ERROR_FIELD.INVALID_EMAIL));
        }

        // if(check === ACTIONS.SOCIAL || 
        // check === ACTIONS.MUSIC || 
        // check === ACTIONS.PODCAST || 
        // check === ACTIONS.CONTACT ||
        // check === ACTIONS.PHONE ||
        // check === ACTIONS.DISCORD ||
        // check === ACTIONS.TELEGRAM)
        // if(
        // plan !== PLANS.PERSONAL ||
        //  plan !== PLANS.ENTREPRENEUR){
        //     infor =  PLANS.PERSONAL.charAt(0).toUpperCase() + PLANS.PERSONAL.slice(1);
        //     return next(APIError.unauthenticated(`Upgrade plan to ${infor} Plan`))
        // } 
    const button = await updateUserButton(details);
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
        const{buttonId} = req.query;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!buttonId)
        return next(APIError.badRequest("Button ID is required"));
        const button = await removeUserButton(req.userId,buttonId);
        if(!button)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
        if(button.error)
        return next(APIError.customError(button.error,400));
         res.status(200).json(ACTIONS.COMPLETED);
    } catch (error) {
        next(error);
    }
}
exports.ctrlGetUserAccounts = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated())
        const accounts = await getUserAccounts(req.userId);
         if(!accounts)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404))
        if(accounts.error)
        return next(APIError.customError(accounts.error,400));
      const response = responseBuilder.commonReponse("Found",accounts, "account");
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}
exports.ctrlSendRecoverMail=async(req,res,next)=>{
    try {
        const {id,email}=req.query;
        if (!id)
            return next(APIError.badRequest("userId is required", 404));
        if (!email)
            return next(APIError.badRequest("Email is required", 404));
       
        const userExist = await getUserAccount(id, email);
        if (!userExist)
            return next(APIError.customError("Account was not found", 404));
        if (userExist.error)
            return next(APIError.customError(userExist.error))
        const uniqueString = uuidv4() + userExist.id;
        const expiryTime = new Date();
        expiryTime.setTime(expiryTime.getTime() + 1800000);
        const saveLink = await passwordRecovery(userExist.id,userExist.userId, uniqueString, expiryTime);
        if (!saveLink)
            return next(APIError.customError(ERROR_FIELD.NOT_FOUND, 404))
        if (saveLink.error)
            return next(APIError.customError(saveLink.error, 400));

        const result = await recoveryPasswordMailHandler(email, "30 minutes", uniqueString);
        if (result.error)
            return next(APIError.customError("Recovery mail failed to send", 400))
        logger.info("Recovery mail sent successfully", {meta: "mail-service"})
        res.status(200).json({ ...result, id: uniqueString, msg: "Recovery mail sent successfully" })
    } catch (error) {
        next(error);
    }

}
exports.ctrlVerifyReset = async (req, res, next) => {
    try {
         const { id}=req.query;
        if(!id)
        return next(APIError.customError("Invalid Link",400)); 
         const check = await getPasswordRecoveryInfor(id);
        if(!check)
        return next(APIError.customError("Invalid Link",404))
        if(check.error)
        return next(APIError.customError(check.error,400));
        //verify link
        const currentTime = new Date();
        if(currentTime>check.expiryTime){
            await removeRecoveryLink(id);
        return next(APIError.customError("Link expired",400));
        }
        logger.info("Verify reset link successfully", {meta: "account-service"})
        res.status(200).json({success:true,id:check.uniqueString,msg:"Link is valid"})
    } catch (error) {
        return next(error);
    }
}
exports.ctrlResetPassword =async(req,res,next)=>{
    try {
        const { id,newPassword}=req.body;
        if(!id)
        return next(APIError.customError("Link id is required",400)); 
        if(!newPassword)
        return next(APIError.badRequest("Provide new password"))
         const check = await getPasswordRecoveryInfor(id);
         if(!check)
        return next(APIError.customError("Invalid Link",404))
        const hashedPass = hashSync(newPassword,12);
        const reset = await resetLoginByLink(check.userId,hashedPass);
        if(!reset)
        return next(APIError.customError("Link does not exist",404));
        if(reset.error)
        return next(APIError.customError(reset.error,400))
        logger.info("Reset password successfully", {meta: "auth-service"})
        res.status(200).json({success:true,msg:"Password reset successful"});
    } catch (error) {
        next(error)
    }
}

exports.ctrlSendVerification =async (req, res, next) => {
    try {
        if(!req.userId)
         return next(APIError.unauthenticated())
          const uniqueString = uuidv4() + req.userId;
           const expiryTime = new Date();
        expiryTime.setDate(expiryTime.getDate() + 10);
         const saveLink = await passwordRecovery(req.userId,req.userId, uniqueString, expiryTime);
        if (!saveLink)
            return next(APIError.customError(ERROR_FIELD.NOT_FOUND, 404))
        if (saveLink.error)
            return next(APIError.customError(saveLink.error, 400));

        const result = await verificationMailHandler(req.email, "10 days", uniqueString, req.username);
        if (result.error)
            return next(APIError.customError("Recovery mail failed to send", 400))
        logger.info("Verification mail sent successfully", {meta: "mail-service"})
        res.status(200).json({ ...result, id: uniqueString, msg: "Verification mail sent successfully" })
    } catch (error) {
        return next(error);
    }
}

exports.ctrlVeifyUser =async (req, res, next) => {
    try {
       
        const {id}=req.query;
        if(!id)
        return next(APIError.badRequest("Invalid verification link"));
          const check = await getPasswordRecoveryInfor(id);
        if(!check)
        return next(APIError.customError("Invalid Link",404))
        if(check.error)
        return next(APIError.customError(check.error,400));
        const currentTime = new Date();
        if(currentTime>check.expiryTime){
            await removeRecoveryLink(id);
        logger.info("Expired link detected", {meta: "account-service"})
        return next(APIError.customError("Link expired",400));
        }
        const verify = await userVerification(id)
          if(!verify)
        return next(APIError.customError("Invalid Link",404))
        if(verify.error)
        return next(APIError.customError("Verification failed, try again",400));
        logger.info("Verification successful", {meta: "account-service"})

        res.status(200).json({success:true,msg:"Verification successful"})
    } catch (error) {
        return next(error);
    }
}

exports.ctrlUpdateUserInfor = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        let email,username;
        if(req.body.email)
        email=req.body.email;
        if(req.body.username)
        username=req.body.username;
    if(!email && !username)
    return next(APIError.badRequest(`Username or email is required`));
    const updated = await updateUserInfor(email,username,req.userId);
    if(!updated)
      return next(APIError.customError(ERROR_FIELD.NOT_FOUND, 404))
    if(updated.error)
    return next(APIError.customError(updated.error,400));
    logger.info("Update user infor successfully", {meta: "account-service"})
    res.status(200).json({success:true,msg:"Infor updated successfully"});

    } catch (error) {
        next(error);
    }
}

exports.ctrlAppearance = async (req, res, next) => {
    try {
        const { type } = req.body;
        if(!req.userId)
        return next(APIError.unauthenticated());
        if(!type)
        return next(APIError.badRequest("Type is required"));
        const infor = {};
        for(key in req.body){
            if(key !== "iconImage")
            infor[key] = req.body[key];
        };
         infor.userId = req.userId;
        if(req.body.iconImage){
             const img = await    cloudinary.uploader.upload(req.body.iconImage,{
                upload_preset:accessPath.preset(),
                folder:accessPath.folder()
            })
            infor.iconId=img.public_id;
            infor.iconUrl=img.secure_url;
        }
        const save = await userAppearance(infor);
        if(!save)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404));
        if(save.error)
        return next(APIError.customError(save.error,400));
        logger.info("Appearance added successfully", {meta: "account-service"})
        res.status(200).json({success:true, msg: "Operation successful"});
    } catch (error) {
        next(error)
    }
}

exports.ctrlGetAppearance = async (req, res, next ) => {
    try {
        if(!req.userId)
        return next( APIError.unauthenticated());
        const infor = await getAppearance(req.userId);
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
exports.ctrlDeleteAcctount = async (req, res, next) => {
    try {
        if(!req.userId)
        return next(APIError.unauthenticated());
        const delAccount = await  deleteAccount(req.userId);
         if(!delAccount)
        return next(APIError.customError(ERROR_FIELD.NOT_FOUND,404));
        if(delAccount.error)
        return next(APIError.customError(delAccount.error,400));
         logger.info("Deleted account successfully", {meta: "account-service"})
        res.status(200).json({success:true, msg: "Account Deleted Successfully"});
    } catch (error) {
        next(error);
    }
}