const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const { combine, timestamp, errors, json , metadata, stack} = format;

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
    collection: "Darlink_error_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ],  
  transports: [
    new transports.MongoDB({
    level:"infor",
    collection:"Darlink_infor_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ],  
  exceptionHandlers: [new transports.MongoDB({
    level:"debug",
    collection:"Darlink_exception_log",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
  }),
  ]
})
} 
