DROP TABLE  tblusers;
GO
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
    ,contact VARCHAR(20) NOT NULL
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
,url varchar(255) NOT NULL
,title varchar(60) NOT NULL
,subtitle varchar(120) NULL
,thumbnailId varchar(255) NULL
,thumbnailUrl varchar(255) NULL
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
SELECT * FROM tbluserplan;