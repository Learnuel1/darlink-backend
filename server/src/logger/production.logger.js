const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const { combine, timestamp, label, printf, prettyPrint, errors ,json} = format;

 
exports.proLogger = () => {
 return createLogger({
  format: combine( 
    timestamp(),
    errors({stack:true}),
    json(),
  ),
  transports: [
    new transports.MongoDB({
      level:"infor",
      db: process.env.ERROR_LOG_URL,
      options: { useUnifiedTopology: true },
      collecion:"Darlinkinforlog",
    }),
    new transports.MongoDB(
      {
    level:"error",
    db: process.env.ERROR_LOG_URL,
    options: { useUnifiedTopology: true },
    collecion: "Darlinkerrorlog",
  }),
 
 new transports.MongoDB({
  level:"debug",
  db: process.env.ERROR_LOG_URL,
  options: { useUnifiedTopology: true },
  collecion:"Darlinkexceptionlog",
}),
  ],  
})
} 