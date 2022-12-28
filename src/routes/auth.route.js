const express =require('express');
const { ctrRegister } = require('../controllers/user.controller');
const { notFound, errorHandler } = require('../middlewares/error.middleware');

const authRoute=express.Router();

authRoute.post('/register',ctrRegister);
authRoute.post('/login');


authRoute.use("*",notFound);
authRoute.all(errorHandler);

module.exports={
    authRoute,
}