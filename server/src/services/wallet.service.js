const cuid = require("cuid");
const { sql } = require("../config/database");
const { DB_ACTIONS } = require("../config/database/action");

exports.create = async(details)=>{
  try {  
      let data;
      const req = new sql.Request(); 
        req.input("userId",sql.VarChar(255),details.userId)
        req.input("amount",sql.Decimal,details.amount)
        await req.execute(DB_ACTIONS.SP_FUND_WALLET).then(result=>{
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
exports.fund = async(userId, amount)=>{
  try {  
      let data;
      const req = new sql.Request(); 
        req.input("userId",sql.VarChar(255),userId)
        req.input("amount",sql.Decimal,amount)
        await req.execute(DB_ACTIONS.SP_FUND_WALLET).then(result=>{
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
  exports.balance = async (userId) => {
    try {
      let data;
      const request = new sql.Request();
      request.input("userId", sql.VarChar(255), userId);
      await request
        .query(`SELECT * FROM tblwallet WHERE userId=@userId`)
        .then((result) => {
          if (result.recordset.length > 0) data = result.recordset[0];
        })
        .then((err) => {
          if (err) data = { error: err };
        });
      return data;
    } catch (error) {
      return { error: error };
    }
  };