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
  await  request.query(`SELECT FROM tbltemp_reference WHERE id =@id`).then(result => {
      if(result.recordset.length>0)
      data = result.recordset;
    }).catch( err => {
      data = { error : err};
    })
    return data;
  } catch (error) {
    return { error }
  }

}

exports.upGradeCompletion = async(details)=>{
  try { 
      let data;
      const req = new sql.Request();
      req.input("planId",sql.VarChar,exports.plan=async(details)=>{
        let data, endDate="";
        if(details.endDate) endDate=details.endDate;
        const req = new sql.Request();
        req.input("userPlanId",sql.VarChar,details.userPlanId)
        req.input("planId",sql.VarChar,details.planId)
        req.input("userId",sql.VarChar,details.userId.trim())
        req.input("plan",sql.VarChar,details.plan.trim())
        req.input("amount",sql.Decimal,details.amount.trim())
        req.input("duration",sql.VarChar,details.duration.trim())
        req.input("startDate",sql.data,details.startDate)
        req.input("endDate",sql.data, startDate)
        await req.execute(DB_ACTIONS.SP_UPGRADE_USER_PLAN).then(result=>{
            if(result.rowsAffected>0)
            data= result.rowsAffected[0];
        }).catch(err=>{
            data={error:err};
        })
      })
        return data;            
    } catch (error) {
        return{error};
    }  
  }