const { hashSync } = require("bcryptjs");
const { registerUser } = require("../services");
const { APIError } = require("../utils/apiError");
const { isValidEmail } = require("../utils/validation");

exports.ctrRegister =async(req,res,next)=>{
    try{
        console.log(req.body)
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
        const register = await registerUser(username.trim(),hashedPass,email);
        if(register.error)
        return next(APIError.customError());

        res.status(200).json(register);
    }catch(error){
        next(error);
    }
}