const UserModule = require('./user.service');

exports.registerUser = async (username, password, email, plan, role = 'user') => {
    return await UserModule.register(username, password, email, plan, role);
}
exports.getUsername = async (username) =>
    UserModule.username(username);
exports.getCurrentPlan = async (userId) => UserModule.currentPlan(userId);
exports.userExist = async (userId) => UserModule.checkUser(userId);
exports.getUserbyEmail = async (email) => UserModule.userEmail(email);
exports.resetUserLogin = async (userId, newPassword) => UserModule.resetPass(userId, newPassword);
exports.findUserAccount = async (infor) => UserModule.findAccount(infor);
exports.getUserAccount = async (id, email) => UserModule.getAccount(id, email);
exports.sendRecoverMail = async (details) => UserModule.recoverPassword(details);
exports.uploadProfile = async (details) => UserModule.profile(details);
exports.getUserProfile = async (userId) => UserModule.getProfile(userId);
exports.getUserProfiles = async () => UserModule.getProfiles();
exports.getUserPlan = async (userId) => UserModule.userPlan(userId);
exports.createAdmin = async (details) => UserModule.create(details);
exports.plans = async (details) => UserModule.plan(details);
exports.getPlans = async () => UserModule.plans();
exports.deletePlan = async (planId) => UserModule.deletePlan(planId);
exports.updatePlan = async (details) => UserModule.updatePlan(details);
exports.userProfileLink = async (details) => UserModule.profileLink(details);
exports.getUserLinks = async (userId) => UserModule.links(userId);
exports.removeUserLinks = async (userId,linkId) => UserModule.removeLinks(userId,linkId);
exports.userButton = async (details) => UserModule.button(details);
exports.getUserButton = async (userId) => UserModule.userButton(userId);
exports.removeUserButton = async (userId) => UserModule.removeButton(userId);
exports.defaultAccount = async (details) => UserModule.defaultRegistration(details);
exports.getUserAccounts = async (userId) => UserModule.userAccounts(userId);
exports.passwordRecovery = async (id,userId, uniqueString, expiryTime) => UserModule.recoveryLink(id,userId, uniqueString, expiryTime);
exports.getPasswordRecoveryInfor =async (uniqueString) => UserModule.getRecoveryInfor(uniqueString);
exports.resetLoginByLink = async (userid, newPassword) => UserModule.resetPassByLink(userid, newPassword);
exports.removeRecoveryLink = async (uniqueString) => UserModule.delRecoveryLink(uniqueString);
exports.userVerification = async (uniqueString) => UserModule.verifyUser(uniqueString);
exports.updateUserInfor = async (email,username, userId) => UserModule.updateInfor(email,username, userId);
