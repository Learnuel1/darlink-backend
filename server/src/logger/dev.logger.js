const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]   ${message}`;
});


exports.devLogger = () => {
 return createLogger({
  level: 'debug',
  format: combine( 
    format.colorize(),
    timestamp({format: "HH:mm:ss"}),
    myFormat, 
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()]
})
}