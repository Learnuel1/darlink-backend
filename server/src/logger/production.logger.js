const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const { combine, timestamp, label, printf, prettyPrint, errors ,json} = format;

 
exports.proLogger = () => {
 return createLogger({
  level: 'debug',
  format: combine( 
    timestamp(),
    errors({stack:true}),
    json(),
  ),
  transports: [
    new transports.MongoDB(
      {
    level:"error",
    collecion: "Darlink_error_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ],  
  transports: [
    new transports.MongoDB({
    level:"infor",
    collecion:"Darlink_infor_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ],  
  exceptionHandlers: [new transports.MongoDB({
    level:"debug",
    collecion:"Darlink_exception_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ]
})
} 