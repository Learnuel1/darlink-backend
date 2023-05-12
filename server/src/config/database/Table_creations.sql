-- CREATE DATABASE darlink_db
-- GO
-- USE darlink_db
-- GO
CREATE TABLE tblusers(
    id INT NOT NULL IDENTITY(1,1)
    ,userId VARCHAR(255) NOT NULL UNIQUE
    ,username VARCHAR(40) NOT NULL UNIQUE
    ,password VARCHAR(255) NOT NULL
    ,email VARCHAR(255) NOT NULL UNIQUE,
	status varchar(20) NOT NULL CHECK(status IN('verified','unverified')) DEFAULT ('unverified')
    ,role varchar(30) NOT NULL CHECK(role IN('user','admin')) DEFAULT('user')
	,refreshToken VARCHAR(255)
    ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_User PRIMARY KEY(UserId)
);
GO
CREATE TABLE tblprofile(
    id INT NOT NULL IDENTITY(1,1)
    ,profileId VARCHAR(255) NOT NULL
    ,userId VARCHAR(255) NOT NULL
    ,passportId VARCHAR(255) NULL
    ,passportUrl VARCHAR(255) NULL
    ,bgId VARCHAR(255) NULL
    ,bgUrl VARCHAR(255) NULL
    ,location VARCHAR(60) NOT NULL
    ,[description] VARCHAR(200) NOT NULL
    ,displayName VARCHAR(50)NOT NULL
    ,colour VARCHAR(20) NULL
	,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_profile PRIMARY KEY(profileId)
    ,CONSTRAINT FK_profileUser FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
);
GO
CREATE TABLE tbllink(
id INT NOT NULL IDENTITY(1,1)
,linkId varchar(255) NOT NULL
,userId varchar(255) NOT NULL
,[url] varchar(255) NOT NULL
,title varchar(60)  NULL
,theme VARCHAR(40) NULL
,subtitle varchar(120) NULL
,urlId varchar(255) NULL 
,[type] varchar(20) NOT NULL CHECK([type] IN('link','section','embed'))
 ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
 ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
 ,CONSTRAINT PK_Link PRIMARY KEY(linkId)
 ,CONSTRAINT FK_UserLink FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
 );
 GO

 CREATE TABLE tblplan(
 id INT NOT NULL IDENTITY(1,1)
 ,planId VARCHAR(255) NOT NULL
 ,userId VARCHAR(255) NULL
  ,[plan] VARCHAR(40) NOT NULL CHECK([plan] IN('Beginner','Personal','Entrepreneur','Professional')) DEFAULT('Beginner')
 ,amount decimal(9,2) NOT NULL DEFAULT(0.00)
 ,duration varchar(10) NOT NULL DEFAULT('0Mnts')
 ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
 ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
 ,CONSTRAINT PK_plan PRIMARY KEY(planId)
 ,CONSTRAINT FK_planUser FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE SET NULL
 );
 GO

 CREATE TABLE tbluserplan(
 id INT NOT NULL IDENTITY(1,1)
 ,userPlanId VARCHAR(255) NOT NULL
 ,planId VARCHAR(255) NOT NULL
 ,userId VARCHAR(255) NULL
 ,[plan] VARCHAR(40) NOT NULL CHECK([plan] IN('Beginner','Personal','Entrepreneur','Professional')) DEFAULT('Beginner')
 ,amount decimal(9,2) NOT NULL DEFAULT(0.00)
 ,startDate DATE NOT NULL DEFAULT GETDATE()
 ,endDate DATE NULL
 ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
 ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
  ,CONSTRAINT PK_userplan PRIMARY KEY(userPlanId)
  ,CONSTRAINT FK_planUserplan FOREIGN KEY(planId) REFERENCES tblplan(planId) ON DELETE CASCADE
  ,CONSTRAINT FK_userplanUser FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE SET NULL
 );

GO
CREATE TABLE tblbutton(
    id INT NOT NULL IDENTITY(1,1)
    ,buttonId VARCHAR(255) NOT NULL
    ,email VARCHAR(255)  NULL
    ,discord VARCHAR(255)   NULL
    ,telegram VARCHAR(255)   NULL
    ,social VARCHAR(255)   NULL
    ,music VARCHAR(255)   NULL
    ,contact VARCHAR(255)   NULL
    ,podcast VARCHAR(255)   NULL
    ,phone VARCHAR(255)   NULL
    ,dataId VARCHAR(255) NULL
    ,userId VARCHAR(255) NOT NULL
    ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_button PRIMARY KEY(buttonId,userId)
    ,CONSTRAINT FK_buttonUser FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
);
GO

CREATE TABLE tblpassword_recovery(
    id INT NOT NULL
    ,userId VARCHAR(255) NOT NULL
    ,uniqueString VARCHAR(255) NOT NULL
    ,expiryTime DATETIME NOT NULL 
    ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
)
GO
CREATE TABLE tblappearance(
    id INT NOT NULL IDENTITY(1,1)
    ,appearanceId VARCHAR(255) NOT NULL
    ,userId VARCHAR(255) NOT NULL
    ,[type] VARCHAR(10) NOT NULL CHECK([type] IN('font','theme','icon','link','colour'))
    ,iconUrl VARCHAR(255) NULL
    ,iconId VARCHAR(255) NULL
    ,[data] VARCHAR(255) NULL
    ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_appearance PRIMARY KEY(appearanceId)
    ,CONSTRAINT FK_userAppearance FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
)
GO
CREATE TABLE tbltemp_reference (
     id varchar(255) NOT NULL
     ,planId VARCHAR(255) NOT NULL
     ,userId VARCHAR(255) NOT NULL
     ,[type] VARCHAR(255) NOT NULL CHECK([type] IN ('plan','wallet'))
     ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_temp_reference PRIMARY KEY(id)
    ,CONSTRAINT FK_temp_referencePlan FOREIGN KEY(planId) REFERENCES tblplan(planId) ON DELETE CASCADE
    ,CONSTRAINT FK_temp_referenceUser FOREIGN KEY(userId) REFERENCES tblusers(UserId) ON DELETE CASCADE
)
CREATE TABLE tblwallet_reference (
     id varchar(255) NOT NULL 
     ,userId VARCHAR(255) NOT NULL
     ,[type] VARCHAR(255) NOT NULL CHECK([type] IN ('plan','wallet'))
     ,createdAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_wallet_reference PRIMARY KEY(id) 
    ,CONSTRAINT FK_wallet_walletUser FOREIGN KEY(userId) REFERENCES tblusers(UserId) ON DELETE CASCADE
)
GO
CREATE TABLE tblwallet(
    id INT NOT NULL IDENTITY(1,1)
    ,userId VARCHAR(255) NOT NULL
    ,balance MONEY NOT NULL DEFAULT(0.00)
    ,createAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_wallet PRIMARY KEY (id, userId)
    ,CONSTRAINT FK_wallet_user FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
)
CREATE TABLE tblwallet_log(
    refereceId VARCHAR(255) NOT NULL  
    ,userId VARCHAR(255) NOT NULL 
    ,[description] VARCHAR(50) NOT NULL
    ,amount MONEY NOT NULL
    ,balance MONEY NOT NULL 
    ,createAt DATETIME NOT NULL DEFAULT GETDATE()
    ,updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    ,CONSTRAINT PK_wallet_log PRIMARY KEY (refereceId, userId)
    ,CONSTRAINT FK_walletlog_user FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
)