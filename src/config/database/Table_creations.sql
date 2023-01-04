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
    ,CONSTRAINT PK_profile PRIMARY KEY(profileId)
    ,CONSTRAINT FK_profileUser FOREIGN KEY(userId) REFERENCES tblusers(userId) ON DELETE CASCADE
);
GO
 
SELECT * FROM tblprofile;