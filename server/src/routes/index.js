const express = require('express');
const routesRouter = express.Router();

const userRouteModule = require('./user.route');
const authRoutModule =require('./auth.route')
const planRoutModule = require('./plan.route')
const previewRouteModule = require('./preview.route');
const walletRouteModule = require("./wallet.route");
routesRouter.use('/user',userRouteModule.userRoute);
routesRouter.use('/plan',planRoutModule.planRoute);
routesRouter.use("/auth",authRoutModule.authRoute);
routesRouter.use('/preview', previewRouteModule.previewRoute);
routesRouter.use("/wallet", walletRouteModule.walletRoute);
module.exports={
    routesRouter,
}
