const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const { combine, timestamp, errors, json , metadata} = format;

exports.proLogger = () => {
  return createLogger({
    format: combine(
      json(),
      timestamp(), 
      errors({ stack: true }),
      metadata()),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.MongoDB({
        level: "error",
        collection: "darlink_error_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
      new transports.MongoDB({
        level: "info",
        collection: "darlink_infor_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
      new transports.MongoDB({
        level: "debug",
        collection: "darlink_exception_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
    ],
  });
};
