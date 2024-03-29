const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
const cookieparser=require('cookie-parser');
const {urlencoded} = require('express');
const { getFrontendOrigin } = require('./config/env');
const CONFIG = require('./config');
const expressWinston = require("express-winston");
const ORIGIN = getFrontendOrigin();
const logger = require('./logger');
const app = express();
app.use(cors({
    origin:ORIGIN,
    methods:['GET','PUT','POST','DELETE','PATCH'],
    credentials:true
})); 
app.use(expressWinston.logger(logger))
app.set("trust proxy",1)
app.use(cookieparser());
app.disable('etag');//clear cache history to agitvoid error 304
app.use(express.json({limit:'5mb'}));
app.use(urlencoded({limit:'5mb', extended:true}));

app.use("/api/v1/status",(req,res)=>{
    res.send({msg:`Yes!... Welcome to ${CONFIG.APP_NAME} API`});
})

module.exports=app;