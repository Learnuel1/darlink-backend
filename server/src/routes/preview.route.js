const express = require("express")
const Controller = require('../controllers');
const previewRoute = express.Router()

//third party preview  /preview
previewRoute.get('/verify',Controller.previewControl.ctrlVerifyProfile);
previewRoute.get('/profile',Controller.previewControl.ctlGetProfile);
previewRoute.get('/resources',Controller.previewControl.ctrlGetLinks)
previewRoute.get("/button", Controller.previewControl.ctrlGetButton)
previewRoute.get("/appearance", Controller.previewControl.ctrlGetAppearance); 

module.exports={
  previewRoute,
} 