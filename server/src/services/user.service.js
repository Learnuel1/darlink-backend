const { sql } = require("../config/database");
const cuid = require("cuid");
const { DB_ACTIONS } = require("../config/database/action");
const { VarChar, Numeric } = require("mssql");

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
     request.input("userId", sql.VarChar(255),id.trim());
    await request
      .execute(DB_ACTIONS.SP_SEND_RECOVERY )
      .then((result) => {
        if (result.recordset.length > 0) data = result.recordset[0];
      })
      .then((err) => {
        if (err) data = { error: err };
      });

    return data;
  } catch (error) {
    if(error.message.includes("Invalid column name")) return {error:"Inalid ID format"}
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
      colour;
    if (details.bgId) bgId = details.bgId;
    if (details.bgUrl) bgUrl = details.bgUrl;
    if (details.passportId) passportId = details.passportId;
    if (details.passportUrl) passportUrl = details.passportUrl;
    if (details.displayName) displayName = details.displayName;
    if (details.description) description = details.description;
    if (details.location) location = details.location;
    if (details.colour) colour = details.colour;
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
    request.input(`colour`, sql.VarChar(255), colour);
    await request
      .execute(DB_ACTIONS.SP_ADD_PROFILE)
      .then((result) => {
        if (result.rowsAffected > 0 || result.rowsAffected.length > 0) {
          data = result.rowsAffected[0];
        }
      })
      .catch((err) => {
         data = { error: err.message || err };
      });
    return data ;
  } catch (error) {
    return { error };
  }
};
 
exports.updateProfile = async (details) => {
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
      colour;
    if (details.bgId) bgId = details.bgId;
    if (details.bgUrl) bgUrl = details.bgUrl;
    if (details.passportId) passportId = details.passportId;
    if (details.passportUrl) passportUrl = details.passportUrl;
    if (details.displayName) displayName = details.displayName;
    if (details.description) description = details.description;
    if (details.location) location = details.location;
    if (details.colour) colour = details.colour;
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
    request.input(`colour`, sql.VarChar(255), colour);
    await request
      .query(
        ` IF @displayName !=' '
        UPDATE tblprofile SET displayName = @displayName WHERE userId =@userId
        IF @description IS NOT NULL
        UPDATE tblprofile SET description = @description WHERE userId =@userId
        IF @location IS NOT NULL
        UPDATE tblprofile SET location = @location WHERE userId =@userId
        IF @colour IS NOT NULL
        UPDATE tblprofile SET colour = @colour WHERE userId =@userId
        IF @bgUrl IS NOT NULL
        UPDATE tblprofile SET bgUrl = @bgUrl, bgId =@bgId WHERE userId =@userId
        IF @passportUrl IS NOT NULL
        UPDATE tblprofile SET passportUrl = @passportUrl, passportId =@passportId WHERE userId =@userId

        UPDATE tblprofile SET  updatedAt=GETDATE()
           `
      )
      .then((result) => {
        if (result.rowsAffected > 0 || result.rowsAffected.length > 0) {
          data = result.rowsAffected[0];
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

exports.getProfile = async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userId", sql.VarChar(255), userId.trim());
    await request
      .query(`SELECT * FROM tblprofile WHERE userId=@userId`)
      .then((result) => {
        if (result.recordset.length > 0) {
          data = result.recordset[0];
        }else if(result.rowsAffected.length >0){
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
exports.planById =async(id)=>{
    try {
        let data;
        const req = new sql.Request();
        req.input("planId", sql.VarChar(255), id); 
        await req.query(`SELECT * FROM tblplan WHERE planId =@planId`).then(result=>{
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
            data = result.rowsAffected[0];
            else data={error:"No record found"};
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
    let data,dataId,email,discord,telegram,social,music,contact,podcast,phone;
    if(details.dataId)
    dataId= details.dataId;
    if(details.email)
    email= details.email;
    if(details.discord)
    discord= details.discord;
    if(details.telegram)
    telegram= details.telegram;
    if(details.social)
    social= details.social;
    if(details.music)
    music= details.music;
    if(details.contact)
    contact= details.contact;
    if(details.podcast)
    podcast= details.podcast;
    if(details.phone)
    phone= details.phone;
      
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), details.userId);
    request.input('email', sql.VarChar(255), details.email);
    request.input('discord', sql.VarChar(255), details.discord);
    request.input('telegram', sql.VarChar(255), details.telegram);
    request.input('social', sql.VarChar(255), details.social);
    request.input('music', sql.VarChar(255), details.music);
    request.input('contact', sql.VarChar(255), details.contact);
    request.input('podcast', sql.VarChar(255), details.podcast);
    request.input('phone', sql.VarChar(255), details.phone);
    request.input("buttonId", sql.VarChar(255), cuid());
    request.input("dataId", sql.VarChar(255), dataId);
    await request.execute(DB_ACTIONS.SP_ADD_USER_BUTTON).then(result => {
      if (result.rowsAffected > 0)
        data = result.rowsAffected[0];
    }).catch(err => {
      data = { error: err }
    });
    return data;
  } catch (error) {
    return { error };
  }
}

exports.updateButton = async(details) => {
  try{
    let data,dataId,email,discord,telegram,social,music,contact,podcast,phone;
    if(details.dataId)
    dataId= details.dataId;
    if(details.email)
    email= details.email;
    if(details.discord)
    discord= details.discord;
    if(details.telegram)
    telegram= details.telegram;
    if(details.social)
    social= details.social;
    if(details.music)
    music= details.music;
    if(details.contact)
    contact= details.contact;
    if(details.podcast)
    podcast= details.podcast;
    if(details.phone)
    phone= details.phone;
      
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), details.userId);
    request.input('buttonId', sql.VarChar(255), details.buttonId);
    request.input('email', sql.VarChar(255), details.email);
    request.input('discord', sql.VarChar(255), details.discord);
    request.input('telegram', sql.VarChar(255), details.telegram);
    request.input('social', sql.VarChar(255), details.social);
    request.input('music', sql.VarChar(255), details.music);
    request.input('contact', sql.VarChar(255), details.contact);
    request.input('podcast', sql.VarChar(255), details.podcast);
    request.input('phone', sql.VarChar(255), details.phone);
    request.input("dataId", sql.VarChar(255), dataId);
    await request.execute(DB_ACTIONS.SP_UPDATE_USER_BUTTON).then(result => {
      if (result.rowsAffected > 0 || result.rowsAffected.length>0)
        data = result.rowsAffected[0];
    }).catch(err => {
      data = { error: err }
    });
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
exports.removeButton = async(userId,buttonId) => {
  try{
    let data;
    const request = new sql.Request();
    request.input('userId', sql.VarChar(255), userId);
    request.input('buttonId', sql.VarChar(255), buttonId);
    await request.query(`DELETE FROM tblbutton WHERE userId=@userId AND buttonId=@buttonId`).then(result => {
      if (result.rowsAffected > 0)
        data = result.rowsAffected[0];
        else data={error:"No record found"};
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

exports.updateInfor = async(email,username,userid) => {
  try{
    let data;
     let check;
    check = await usernameExist(username);
    if (check) return { error: `${username} is not available` };
    check = await emailExist(email);
    if (check) return { error: `${email} is not available` };
    if (check.error) return { error: check.error };

    const request = new sql.Request();
    request.input("userid",sql.VarChar(255),userid);
    request.input("email",sql.VarChar(255),email);
    request.input("username",sql.VarChar(40),username);
    await request.query(`IF @email IS NOT NULL 
    UPDATE tblusers SET email=@email WHERE userId=@userid
    
    IF @username IS NOT NULL 
    UPDATE tblusers SET username= @username  WHERE userId=@userid
    `)
    .then(result => {
      if(result.rowsAffected>0 ||result.rowsAffected.length>0)
      data= result.rowsAffected[0]
    })
    .catch(err =>{
      data ={error:err};
    })
    return data;
  }catch(error){
    return {error};
  }
}

exports.appearance = async (infor) => {
  try {
    let iconId,iconUrl,data, appearanceId, stored;
    if(infor.iconId)
    iconId = infor.iconId
    if(infor.iconUrl)
    iconUrl = infor.iconUrl
    if(infor.data)
   if(!infor.appearanceId)
    appearanceId = cuid();
  const request = new sql.Request();
  request.input("appearanceId",VarChar(255), appearanceId);
  request.input("iconId", sql.VarChar(255), iconId)
  request.input("userId", sql.VarChar(255), infor.userId)
  request.input("iconUrl", sql.VarChar(255), iconUrl)
  request.input("data", sql.VarChar(255), infor.data)
  request.input("type", sql.VarChar(255), infor.type);
  await request.execute(DB_ACTIONS.SP_ADD_APPEARANCE).then(result => {
    if(result.recordsets.length>0){
      stored = result.recordset[0];
    } else if( result.rowsAffected>0 || result.rowsAffected.length>0){
      stored = result.rowsAffected[0];
    }
  }).catch(err => {
    stored = {error:err};
  })
    return stored;
  } catch (error) {
    return {error};
  }
}
exports.userAppearance = async (userId) => {
  try {
    let data ;
    const request = new sql.Request();
    request.input("userId", sql.VarChar(255), userId);
    await request.query(`SELECT * FROM tblappearance WHERE userId = @userId`).then( result => {
      if(result.recordset.length>0)
      data = result.recordset;
    }).catch( err => {
      data = { error : err};
    })
    return data;
  } catch (error) {
    return {error};
  }
}

exports.delete = async (userId) => {
  try {
    let data;
    const request = new sql.Request();
    request.input("userId", sql.VarChar(255), userId);
  await  request.query(`DELETE FROM tblusers WHERE id =@userid`).then(result => {
      if(result.rowsAffected.length>0)
      data = result.rowsAffected[0];
    else data ={error:"No record found"};
    }).catch(err => {
      data = {eror: err};
    })
    return data;
  } catch (error) {
    return { error }
  }
}

exports.verifyProfile =async (username) => {
  try {
   let data; 
   const request = new  sql.Request(); 
   request.input('username',sql.VarChar(255),username);
   await request.execute(DB_ACTIONS.SP_VERIFY_PROFILE).then(result => {
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