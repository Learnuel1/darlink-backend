const UserModule =require('./user.service');

exports.registerUser =async(username,password,email,role='user')=>{
    return await UserModule.register(username,password,email,role);
}
exports.getUsername =async(username)=>
 UserModule.username(username);
exports.userExist =async(userId)=>UserModule.checkUser(userId);
exports.getUserbyEmail =async(email)=>UserModule.userEmail(email);
exports.resetUserLogin =async(userId,newPassword)=>UserModule.resetPass(userId,newPassword);
exports.findUserAccount =async(infor)=>UserModule.findAccount(infor);
exports.sendRecoverMail=async(details)=>UserModule.recoverPassword(details);
exports.uploadProfile=async(details)=>UserModule.profile(details);
exports.getUserProfile= async(userId)=>UserModule.getProfile(userId);