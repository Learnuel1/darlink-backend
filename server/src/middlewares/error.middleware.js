const logger = require("../logger");

exports.notFound=(req,res,next)=>{
    const err = new Error("Route Not Found");
    err.status=404;
    next(err)
}

exports.errorHandler=(err,req,res,next)=>{ 
    logger.error(err);
    if(err.error)
      return  res.status(err.status || 404).json({error: "No Internet connection"})
     res.status(err.status || 500).json({error:err.message || "Unknow error"});
}