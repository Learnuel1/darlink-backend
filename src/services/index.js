const UserModule =require('./user');

exports.registerUser =async(username,password,email)=>UserModule.register(username,password,email);