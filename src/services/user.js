const { sql } = require("../config/database");

exports.register=async(username,password,email)=>{
    try {
       const request= new sql.register();
        request.input("id",sql.Int,20);
        request.input("username",sql.VarChar(40),username);
        request.input("input_param",sql.VarChar(255),password);
        request.input("input_param",sql.VarChar(255),email);
        request.query(`INSERT INTO tblusers VALUES(@id,@username,${password},${email})`,(err,result)=>{
            if(err){
                console.log(err)
                return err;
            }
            return result.recordset;
        })
    } catch (error) {
        console.log(error)
        return {"error":error};
    }
}