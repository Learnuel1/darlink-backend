const { devLogger } = require("./dev.logger");
const { proLogger } = require("./production.logger");

let logger =null;

if (process.env.NODE_ENV === 'dev') {
 logger = devLogger()
}
if (process.env.NODE_ENV === 'production') {
 logger = proLogger()
}

module.exports = logger;