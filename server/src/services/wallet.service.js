const { sql } = require("../config/database");
const { DB_ACTIONS } = require("../config/database/action");

exports.create = async(userId, amount)=>{
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
exports.fund = async(userId, amount, reference)=>{
  try {  
      let data;
      console.log(amount, "amount")
      const req = new sql.Request(); 
        req.input("id",sql.VarChar(255),reference)
        req.input("userId",sql.VarChar(255),userId)
        req.input("amount",sql.Decimal(9,2), amount.toFixed(2))
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

  exports.tempReference = async (id,userId, tranType) => {
    let exist;
    const request = new sql.Request();
    request.input("id", sql.VarChar(255), id); 
    request.input("userId", sql.VarChar(255), userId);
    request.input("tranType", sql.VarChar(10), tranType);
    await request
      .execute(DB_ACTIONS.SP_WALLET_REFERENCE)
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
    await  request.query(`SELECT * FROM tblwallet_reference WHERE id =@id`).then(result => {
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