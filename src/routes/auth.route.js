const express =require('express'); 
const Controller = require('../controllers');
const { notFound, errorHandler } = require('../middlewares/error.middleware');
const { userRequired } = require('../middlewares/auth.middleware');

const authRoute=express.Router();

authRoute.post('/register', Controller.userControl.ctrRegister);
authRoute.post('/create', Controller.userControl.ctrCreate);
authRoute.post('/login', Controller.AuthControl.ctrLogin);
authRoute.post('/logout',Controller.AuthControl.ctrLogout);
authRoute.patch('/reset',userRequired,Controller.AuthControl.ctrlResetLogin);

authRoute.use("*",notFound);
authRoute.all(errorHandler);

module.exports={
    authRoute,
}