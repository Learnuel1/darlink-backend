const express = require("express");
const walletRoute = express.Router();
const Controller = require("../controllers");
const { userRequired } = require("../middlewares/auth.middleware");

walletRoute.post("/", userRequired, Controller.walletController.ctrlInitiateTransaction).get("/verify-transaction", Controller.walletController.ctrlVerifyTransaction).get("/balance", userRequired, Controller.walletController.ctrlWalletBalance);
module.exports = {
  walletRoute,
}