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

 exports.tempReference = async (id, planId,userId) => {
  
  let exist;
  const request = new sql.Request();
  request.input("id", sql.VarChar(255), id);
  request.input("planId", sql.VarChar(255), planId);
  request.input("userId", sql.VarChar(255), userId);
  await request
    .execute(DB_ACTIONS.SP_TEMP_REFERENCE)
    .then((result) => {
      if (result.rowsAffected.length > 0) exist = true;
      else exist = false;
    });
  return exist;
};

exports.findTempReference = async(reference) =>{
  try {
    let data;
    const request = new sql.Request();
    request.input("id", sql.VarChar(255), reference);
  await  request.query(`SELECT * FROM tbltemp_reference WHERE id =@id`).then(result => {
      if(result.recordset.length >0)
      data = result.recordset;
    }).catch( err => {
      data = { error : err};
    })
    return data;
  } catch (error) {
    return { error }
  }

}

exports.upgradeCompletion = async(details)=>{
  try {  
      let data, endDate="";
      const req = new sql.Request();
      if(details.endDate) endDate=details.endDate;
        req.input("userPlanId",sql.VarChar(255),details.userPlanId)
        req.input("planId",sql.VarChar(255),details.planId)
        req.input("refId",sql.VarChar(255),details.refId)
        req.input("userId",sql.VarChar(255),details.userId)
        req.input("plan",sql.VarChar(60),details.plan);
        req.input("amount",sql.Decimal,details.amount)
        req.input("startDate",sql.Date,details.startDate)
        req.input("endDate",sql.VarChar(40), endDate)
        await req.execute(DB_ACTIONS.SP_UPGRADE_USER_PLAN).then(result=>{
            if(result.rowsAffected >0 || result.rowsAffected.length > 0)
            data= result.rowsAffected[0];
        }).catch(err=>{
            data={error:err};
        })
        return data;            
    } catch (error) {
        return{error};
    }  
  }