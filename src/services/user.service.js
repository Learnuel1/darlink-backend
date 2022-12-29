const { sql } = require("../config/database");
const cuid = require('cuid')

exports.register=async(username,password,email,role='user')=>{
    try {
        let data;
        let check;
        check=await  usernameExist(username);
        if(check)
        return {"error":`${username} is not available`}
        check=await emailExist(email);
       if(check)
       return {"error":`${email} is not available`}
       if(check.error)
       return {"error":check.error}
       const request= new sql.Request();
        request.input("id",sql.VarChar,cuid());
        request.input("username",sql.VarChar(40),username);
        request.input("password",sql.VarChar(255),password);
        request.input("email",sql.VarChar(255),email);
        request.input('role',sql.VarChar(30),role);
        await request.query(`INSERT INTO tblusers(userId,username,password,email,role) VALUES(@id,@username,@password,@email,@role)`).then(result=>{
            if(result.rowsAffected.length>0){ 
                data= {success:true,msg:"Registration successful"};
            }
            else  data= {success:false,msg:"Registration failed"};
        }).then(err=>{
            return{"error":err}
        })
         return data;
    } catch (error) { 
        return {"error":error};
    }
}
const usernameExist =async(username)=>{
    let exist;
    const request= new sql.Request();
    request.input('username',sql.VarChar(40),username);
  await  request.query(`SELECT * FROM tblusers WHERE Username=@username`).then(result=>{
        if(result.recordset.length>0)
         exist= true
        else exist=false;
    });
     
    return exist;
}
const emailExist =async(email)=>{
    let exist;
    const request= new sql.Request();
    request.input('email',sql.VarChar(255),email);
     await request.query(`SELECT * FROM tblusers WHERE Email=@email`).then(result=>{
        if(result.recordset.length>0)
         exist= true
        else exist=false;
    });
    return exist;
}

exports.username =async(username)=>{
    try {
        let data;
        
        const request = new sql.Request();
        request.input("username",sql.VarChar(40),username.trim());
         await   request.query(`SELECT * FROM tblusers WHERE username=@username`).then(result=>{
 
            if(result.recordset.length>0)
              data = result.recordset[0];  
         })
         .then(err=>{
            if(err)
            data= {"error":err}
         }) 
        return data;
    } catch (error) {
        return{"error":error}
    }
}

exports.findAccount =async(infor)=>{
    try {
        let data,value;
        for(key in infor){
            value =key;
            break;
        }
        const request = new sql.Request();
        request.input("data",sql.VarChar(40),infor[value].trim());
         await   request.query(`SELECT * FROM tblusers WHERE ${value}=@data`).then(result=>{
             if(result.recordset.length>0) 
                  data = result.recordset[0];  
         })
         .then(err=>{
            if(err)
            data= {"error":err}
         }) 

        return data;
    } catch (error) {
        return{"error":error}
    }
}
exports.checkUser=async(userId)=>{
    try {
 
        let data;
        const request =new sql.Request();
        request.input("userid",sql.VarChar(255),userId);
       await request.query("SELECT * FROM tblusers WHERE userId=@userid").then(result=>{
        if(result.recordset.length>0)
          data = result.recordset[0];  
     })
     .then(err=>{
        if(err)
        data= {"error":err}
     }) 
        return data;
    } catch (error) {
        return{"error":error};
    }
}
exports.userEmail=async(email)=>{
    try {
        let data;
        const request = new sql.Request();
        request.input("email",sql.VarChar(255),email);
     await   request.query(`SELECT * FROM tbusers WHERE email=@email`,(err,result)=>{
            if(err)
            data= {"error":err};
           else data= result.recordset[0];
        });
        return data
    } catch (error) {
        return {"error":error};
    }
}

exports.resetPass=async(userid,newPassword)=>{
    try {
        let data;
        const request = new sql.Request();
        request.input('password',sql.VarChar(255),newPassword);
        request.input('userid',sql.VarChar(255),userid);
     await   request.query("UPDATE tblusers SET password =@password WHERE userId=@userid").then(result=>{
        console.log(result)
            if(result.rowsAffected>0)
            data=result.rowsAffected;
            else data ={"error":"Password reset failed"}
        }).then(err=>{
            if(err)
            data={"error":err};
        })
        return data;
    } catch (error) {
        return {"error":error};
    }
}

exports.recoverPassword =async(details)=>{
    try {
        
    } catch (error) {
        return {error}
    }
}