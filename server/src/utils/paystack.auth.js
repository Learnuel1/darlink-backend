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
const verificationOptions = (ref) =>{
  return   { hostname: 'api.paystack.co',
  port: 443,
  path: `/transaction/verify/:${ref}`,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${auth}`
  }}
}

module.exports = {options,
  verificationOptions,
};