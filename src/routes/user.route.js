const express =require('express');
const { notFound, errorHandler } = require('../middlewares/error.middleware');

const userRoute=express.Router();

userRoute.use("*",notFound);
userRoute.all(errorHandler);

module.exports={
    userRoute,
}