const UserModule =require('./user.service');

exports.registerUser =async(username,password,email,plan,role='user')=>{
    return await UserModule.register(username,password,email,plan,role);
}
exports.getUsername =async(username)=>
 UserModule.username(username);
 exports.getCurrentPlan=async(userId)=>UserModule.currentPlan(userId);
exports.userExist =async(userId)=>UserModule.checkUser(userId);
exports.getUserbyEmail =async(email)=>UserModule.userEmail(email);
exports.resetUserLogin =async(userId,newPassword)=>UserModule.resetPass(userId,newPassword);
exports.findUserAccount =async(infor)=>UserModule.findAccount(infor);
exports.sendRecoverMail=async(details)=>UserModule.recoverPassword(details);
exports.uploadProfile=async(details)=>UserModule.profile(details);
exports.getUserProfile= async(userId)=>UserModule.getProfile(userId);
exports.getUserPlan = async(userId )=>UserModule.userPlan( userId);
exports.createAdmin =async(details)=>UserModule.create(details);
exports.plans =async(details)=>UserModule.plan(details);
exports.getPlans =async( )=>UserModule.plans( );
exports.deletePlan =async(planId)=>UserModule.deletePlan(planId);
exports.updatePlan =async(details)=>UserModule.updatePlan(details);