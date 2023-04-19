const { getPaystackSecreteKey } = require("../config/env");

auth = getPaystackSecreteKey();
const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${auth}`,
    'Content-Type': 'application/json'
  }
}

module.exports = options;