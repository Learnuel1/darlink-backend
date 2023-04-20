const { sql } = require("../config/database");
const cuid = require("cuid");
const { DB_ACTIONS } = require("../config/database/action");
const { VarChar } = require("mssql");

exports.planPayment = async (payInfor) => {
  try {
    
  } catch (error) {
    return {error};
  }
}

 exports.tempReference = async (id, planId) => {
  
  let exist;
  const request = new sql.Request();
  request.input("id", sql.VarChar(255), id);
  request.input("planId", sql.VarChar(255), planId);
  console.log(id, planId)
  await request
    .execute(DB_ACTIONS.SP_TEMP_REFERENCE)
    .then((result) => {
      if (result.rowsAffected.length > 0) exist = true;
      else exist = false;
    });
  return exist;
};