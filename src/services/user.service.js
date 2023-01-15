const { sql } = require("../config/database");
const cuid = require("cuid");
const { DB_ACTIONS } = require("../config/database/action");

exports.register = async (username, password, email,plan, role = "user") => {
  try {
    let data;
    let check;
    check = await usernameExist(username);
    if (check) return { error: `${username} is not available` };
    check = await emailExist(email);
    if (check) return { error: `${email} is not available` };
    if (check.error) return { error: check.error };
    const request = new sql.Request();
    request.input("id", sql.VarChar, cuid());
    request.input("userplanid", sql.VarChar, cuid());
    request.input("username", sql.VarChar(40), username);
    request.input("password", sql.VarChar(255), password);
    request.input("email", sql.VarChar(255), email);
    request.input("role", sql.VarChar(30), role);
    request.input("plan", sql.VarChar(30), plan);
    await request
      .execute(
        DB_ACTIONS.SP_REGISTER_USER
      )
      .then((result) => {
        if (result.rowsAffected.length > 0) {
          data = { success: true, msg: "Registration successful" };
        } else data = { success: false, msg: "Registration failed" };
      })
      .then((err) => {
        return { error: err };
      });
    return data;
  } catch (error) {
    return { error: error };
  }
};
exports.defaultRegistration = async (details) => {
  try {
    let data;
    let check;
    check = await usernameExist(details.username);
    if (check) return { error: `${details.username} is not available` };
    check = await emailExist(details.email);
    if (check) return { error: `${details.email} is not available` };
    if (check.error) return { error: check.error };
    const request = new sql.Request();
    request.input("id", sql.VarChar, cuid());
    request.input("username", sql.VarChar(40), details.username.trim());
    request.input("password", sql.VarChar(255), details.password);
    request.input("email", sql.VarChar(255), details.email.trim());
    request.input("role", sql.VarChar(30), details.role.trim());
    await request
      .execute(
        DB_ACTIONS.SP_DEFAULT_ADMIN
      )
      .then((result) => {
        if (result.rowsAffected.length > 0) {
          data = { success: true, msg: "Registration successful" };
        } else data = { success: false, msg: "Registration failed" };
      })
      .then((err) => {
        return { error: err };
      });
    return data;
  } catch (error) {
    return { error: error };
  }
};
exports.create=async(details)=>{
    try {
        let data;
        let check;
        check = await usernameExist(details.username);
        if (check) return { error: `${details.username} is not available` };
        check = await emailExist(details.email);
        if (check) return { error: `${details.email} is not available` };
        if (check.error) return { error: check.error };
        const request = new sql.Request();
        request.input("id", sql.VarChar, cuid());
        request.input("username", sql.VarChar(40), details.username);
        request.input("password", sql.VarChar(255), details.password);
        request.input("email", sql.VarChar(255), details.email);
        request.input("role", sql.VarChar(30), details.role);
        await request.query(`INSERT INTO tblusers(userId,username,password,email,role) 
        VALUES(@id,@username,@password,@email,@role)`).then(result=>{
            if(result.rowsAffected>0)
            data=result.rowsAffected[0];
        }).catch(err=>{
            data={error:err};
        })
        return data;
    } catch (error) {
        return {error};
    }
}
const usernameExist = async (username) => {
  let exist;
  const request = new sql.Request();
  request.input("username", sql.VarChar(40), username);
  await request
    .query(`SELECT * FROM tblusers WHERE Username=@username`)
    .then((result) => {
      if (result.recordset.length > 0) exist = true;
      else exist = false;
    });

  return exist;
};
const emailExist = async (email) => {
  let exist;
  const request = new sql.Request();
  request.input("email", sql.VarChar(255), email);
  await request
    .query(`SELECT * FROM tblusers WHERE Email=@email`)
    .then((result) => {
      if (result.recordset.length > 0) exist = true;
      else exist = false;
    });
  return exist;
};

exports.username = async (username) => {
  try {
    let data;

    const request = new sql.Request();
    request.input("username", sql.VarChar(40), username.trim());
    await request
      .query(`SELECT * FROM tblusers WHERE username=@username`)
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
exports.currentPlan = async (userId) => {
  try {
    let data;

    const request = new sql.Request();
    request.input("userId", sql.VarChar(40), username.trim());
    await request
      .query(`SELECT * FROM tblusersplan WHERE userId=@userId`)
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

exports.getAccount = async (id,email) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("email", sql.VarChar(40), email.trim());
    request.input("id", sql.Int,id);
    await request
      .query(`SELECT * FROM tblusers WHERE email=@email AND id=@id`)
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
exports.findAccount = async (infor) => {
  try {
    let data, value;
    for (key in infor) {
      value = key;
      break;
    }
    const request = new sql.Request();
    request.input("data", sql.VarChar(40), infor[value].trim());
    await request
      .query(`SELECT * FROM tblusers WHERE ${value}=@data`)
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
exports.checkUser = async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userid", sql.VarChar(255), userId);
    await request
      .query("SELECT * FROM tblusers WHERE userId=@userid")
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
exports.userEmail = async (email) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("email", sql.VarChar(255), email);
    await request.query(
      `SELECT * FROM tbusers WHERE email=@email`,
      (err, result) => {
        if (err) data = { error: err };
        else data = result.recordset[0];
      }
    );
    return data;
  } catch (error) {
    return { error: error };
  }
};

exports.resetPass = async (userid, newPassword) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("password", sql.VarChar(255), newPassword);
    request.input("userid", sql.VarChar(255), userid);
    await request
      .query("UPDATE tblusers SET password =@password WHERE userId=@userid")
      .then((result) => {
        if (result.rowsAffected>0 || result.rowsAffected.length > 0) 
        data = result.rowsAffected; 
      })
      .then((err) => {
        if (err) data = { error: err };
      });
    return data;
  } catch (error) {
    return { error: error };
  }
};
exports.resetPassByLink = async (userid, newPassword) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("newpassword", sql.VarChar(255), newPassword);
    request.input("userid", sql.VarChar(255), userid);
    await request
      .execute(DB_ACTIONS.SP_RESET_PASSWORD_BY_LINK)
      .then((result) => {
        if (result.rowsAffected>0 || result.rowsAffected.length > 0)
         data = result.rowsAffected; 
      })
      .then((err) => {
        if (err) data = { error: err };
      });
    return data;
  } catch (error) {
    return { error: error };
  }
};
 
exports.profile = async (details) => {
  try {
    let data;
    const userId = details.userId;
    let bgId,
      bgUrl,
      passportId,
      passportUrl,
      displayName,
      description,
      location,
      contact;
    if (details.bgId) bgId = details.bgId;
    if (details.bgUrl) bgUrl = details.bgUrl;
    if (details.passportId) passportId = details.passportId;
    if (details.passportUrl) passportUrl = details.passportUrl;
    if (details.displayName) displayName = details.displayName;
    if (details.description) description = details.description;
    if (details.location) location = details.location;
    if (details.contact) contact = details.contact;
    const request = new sql.Request();
    request.input(`userId`, sql.VarChar(255), userId);
    request.input(`profileId`, sql.VarChar(255), cuid());
    request.input(`bgId`, sql.VarChar(255), bgId);
    request.input(`bgUrl`, sql.VarChar(255), bgUrl);
    request.input(`passportId`, sql.VarChar(255), passportId);
    request.input(`passportUrl`, sql.VarChar(255), passportUrl);
    request.input(`displayName`, sql.VarChar(50), displayName);
    request.input(`description`, sql.VarChar(255), description);
    request.input(`location`, sql.VarChar(255), location);
    request.input(`contact`, sql.VarChar(255), contact);
    await request
      .query(
        `IF (SELECT COUNT(Id) FROM tblprofile)=0 
        BEGIN 
        INSERT INTO tblprofile(profileId,userId,bgId,bgUrl,passportId,
            passportUrl,
            description, 
            displayName,location,contact)
             VALUES (@profileId,@userId,
                @bgId,
                @bgUrl,
                @passportId,
                @passportUrl,
                @description, 
                @displayName,
                @location,@contact)
            END
           ELSE
           BEGIN
           UPDATE tblprofile SET
           bgId=@bgId,
           bgUrl=@bgUrl,
           passportId=@passportId,
           passportUrl=@passportUrl,
           [description]=@description, 
           displayName=@displayName,
           location=@location,
           contact=@contact,
           updatedAt=GETDATE()
            WHERE userId=@userId
           END
           `
      )
      .then((result) => {
        if (result.rowsAffected > 0) {
          data = result.rowsAffected[0];
        }
      })
      .catch((err) => {
        if (err) data = { error: err };
      });
    return data;
  } catch (error) {
    return { error };
  }
};

exports.getProfile = async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userId", sql.VarChar(255), userId);
    await request
      .query(`SELECT * FROM tblprofile WHERE userId=@userId`)
      .then((result) => {
        if (result.recordset.length > 0) {
          data = result.recordset[0];
        }
      })
      .catch((err) => {
        data = { error: err };
      });
    return data;
  } catch (error) {
    return { error };
  }
};
exports.getProfiles = async () => {
  try {
    let data;
    const request = new sql.Request(); 
    await request
      .query(`SELECT * FROM tblprofile`)
      .then((result) => {
        if (result.recordset.length > 0) {
          data = result.recordset;
        }
      })
      .catch((err) => {
        data = { error: err };
      });
    return data;
  } catch (error) {
    return { error };
  }
};
exports.userPlan = async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userId", sql.VarChar(255), userId);
    await request
      .query(`SELECT * FROM tbluserplan WHERE userId=@userId `)
      .then((result) => {
        if (result.recordset.length > 0) {
          data = result.recordset[0];
        }
      }).catch(err=>{
        data={error:err};
      })
      return data;
  } catch (error) {
    return { error };
  }
};      
exports.plan=async(details)=>{
    try {
        let data;
        const req = new sql.Request();
        req.input("planId",sql.VarChar,cuid())
        req.input("plan",sql.VarChar,details.plan.trim())
        req.input("amount",sql.Decimal,details.amount.trim())
        req.input("duration",sql.VarChar,details.duration.trim())
        req.input("userId",sql.VarChar,details.userId.trim())
        await req.query(`INSERT INTO tblplan(planId,userId,[plan],amount,duration) 
        VALUES(@planId,@userId,@plan,@amount,@duration)`).then(result=>{
            if(result.rowsAffected>0)
            data= result.rowsAffected[0];
        }).catch(err=>{
            data={error:err};
        })
        return data;            
    } catch (error) {
        return{error};
    }
}
exports.plans =async( )=>{
    try {
        let data;
        const req = new sql.Request(); 
        await req.query(`SELECT * FROM tblplan`).then(result=>{
            if(result.recordset.length>0)
            data = result.recordset
        }).catch(err=>{
            data={error:err};
        });
        return data;
    } catch (error) {
        return {error};
    }
}
exports.deletePlan = async (planId) => {
    try {
      let data;
      const request = new sql.Request();
      request.input("planid", sql.VarChar(255), planId);
      await request
        .query(`DELETE FROM tblplan WHERE planId=@planid `)
        .then((result) => {
          if (result.rowsAffected>0) {
            data = result.rowsAffected[0];
          }
        }).catch(err=>{
            data={error:err}
        })
        return data;
    } catch (error) {
      return { error };
    }
  };
exports.updatePlan = async (details) => {
    try {
      let data,plan,amount,duration;
      if(details.plan)
      plan=details.plan
      if(details.amount)
      amount=details.amount
      if(details.duration)
      duration=details.duration
      const request = new sql.Request();
      request.input("planId", sql.VarChar(255), details.planId);
      request.input("plans", sql.VarChar(60), plan);
      request.input("amount", sql.Decimal, amount);
      request.input("duration", sql.VarChar(10), duration);
      await request
        .execute(DB_ACTIONS.SP_ADMIN_UPDATE_PLAN)
        .then((result) => {
          if (result.rowsAffected>0 || result.rowsAffected.length>0) {
            data = result.rowsAffected[0];
          }
        }).catch(err=>{
            data={error:err}
        })
        return data;
    } catch (error) {
      return { error };
    }
  };

exports.profileLink = async (details) => {
  try {
   let url,urlId,title,subtitle,theme,data;

   if(details.url)
   url=details.url
   if(details.urlId)
   urlId=details.urlId
   if(details.title)
   title=details.title
   if(details.theme)
   theme=details.theme
   if(details.subtitle)
   subtitle=details.subtitle

   const request= new sql.Request();
   request.input("linkId",sql.VarChar(255),cuid())
   request.input("userId",sql.VarChar(255),details.userId)
   request.input("url",sql.VarChar(255),url)
   request.input("urlId",sql.VarChar(255),urlId)
   request.input("title",sql.VarChar(60),title)
   request.input("theme",sql.VarChar(40),theme)
   request.input("subtitle",sql.VarChar(120),subtitle)
   request.input("type",sql.VarChar(10),details.type.toLowerCase())
   await request.execute(DB_ACTIONS.SP_ADD_LINK).then(result=>{
    if(result.rowsAffected>0 || result.rowsAffected.length>0)
    data=result.rowsAffected[0];
   }).catch(err=>{
    data={error:err};
   })
   return data;
  } catch (error) {
    return { error };
  }
};
exports.links =async( userId)=>{
    try {
        let data;
        const req = new sql.Request(); 
        req.input("userId",sql.VarChar(255),userId)
        await req.query(`SELECT * FROM tbllink WHERE userId=@userId`).then(result=>{
            if(result.recordset.length>0)
            data = result.recordset
        }).catch(err=>{
            data={error:err};
        });
        return data;
    } catch (error) {
        return {error};
    }
}
exports.removeLinks =async( userId,linkId)=>{
    try {
        let data;
        const req = new sql.Request(); 
        req.input("userId",sql.VarChar(255),userId)
        req.input("linkId",sql.VarChar(255),linkId)
        await req.query(`DELETE FROM tbllink WHERE userId=@userId AND linkId=@linkId`).then(result=>{
            if(result.rowsAffected>0)
            data = result.rowsAffected[0]
        }).catch(err=>{
            data={error:err};
        });
        return data;
    } catch (error) {
        return {error};
    }
}

exports.button = async(details) => {
  try{
    let data,dataId;
    if(details.dataId)
    dataId= details.dataId;
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), details.userId);
    request.input("buttonId", sql.VarChar(255), cuid());
    request.input("type", sql.VarChar(20), details.type);
    request.input("data", sql.VarChar(255), details.data);
    request.input("dataId", sql.VarChar(255), dataId);
    await request.execute(DB_ACTIONS.SP_ADD_USER_BUTTON).then(result => {
      if (result.rowsAffected > 0)
        data = result.rowsAffected[0];
    }).catch(err => {
      data = { error: err }
    })
    return data;
  } catch (error) {
    return { error };
  }
}
exports.userButton = async(userId) => {
  try{
    let data;
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), userId);
    await request.query(`SELECT * FROM tblbutton WHERE userId=@userId`).then(result => {
      if (result.recordset.length > 0)
        data = result.recordset;
    }).catch(err => {
      data = { error: err }
    })
    return data;
  } catch (error) {
    return { error };
  }
}
exports.removeButton = async(userId) => {
  try{
    let data;
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), userId);
    await request.query(`DELETE FROM tblbutton WHERE userId=@userId`).then(result => {
      if (result.rowsAffected > 0)
        data = result.rowsAffected[0];
    }).catch(err => {
      data = { error: err }
    })
    return data;
  } catch (error) {
    return { error };
  }
}
exports.userAccounts =async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userId",sql.VarChar(255),userId);
    await request.execute(DB_ACTIONS.SP_GET_ACCOUNTS).then(result => {
      if(result.recordset.length>0)
      data =result.recordset;
    }).catch(err => {
      data={error:err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}
exports.recoveryLink = async (id,userId,uniqueString,expiryTime) => {
  try {
    let data;
    const request = new  sql.Request();
    request.input("id",sql.VarChar(255),id);
    request.input("userid",sql.VarChar(255),userId);
    request.input("uniquestring",sql.VarChar(255),uniqueString);
    request.input("expirytime",sql.DateTime,expiryTime);
    await request.execute(DB_ACTIONS.SP_RECOVERY_LINK).then(result => {
      if(result.rowsAffected.length>0)
      data= result.rowsAffected[0];
    }).catch(err =>{
      data = {error:err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}
exports.getRecoveryInfor = async (uniqueString) => {
  try {
    let data; 
    const request = new  sql.Request(); 
    request.input('uniquestring',sql.VarChar(255),uniqueString);
    await request.query(`SELECT * FROM tblpassword_recovery WHERE uniqueString=@uniquestring`).then(result => {
      if(result.recordset.length>0)
      data= result.recordset[0];
    }).catch(err =>{
      data = {error:err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}
exports.delRecoveryLink = async (uniqueString) => {
  try {
    let data; 
    const request = new  sql.Request(); 
    request.input('uniquestring',sql.VarChar(255),uniqueString);
    await request.query(`DELETE FROM tblpassword_recovery WHERE uniqueString=@uniquestring`).then(result => {
      if(result.recordset.length>0)
      data= result.recordset[0];
    }).catch(err =>{
      data = {error:err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}

exports.verifyUser =async (uniqueString) => {
   try {
    let data; 
    const request = new  sql.Request(); 
    request.input('uniquestring',sql.VarChar(255),uniqueString);
    await request.execute(DB_ACTIONS.SP_VERIFY_USER).then(result => {
      if(result.rowsAffected>0 || result.rowsAffected.length>0)
      data= result.recordset[0];
    }).catch(err =>{
      data = {error:err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}
