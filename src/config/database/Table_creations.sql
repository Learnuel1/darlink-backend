
CREATE TABLE tblusers(
    Id INT NOT NULL IDENTITY(1,1)
    ,userId VARCHAR(255) NOT NULL
    
);
GO
DROP TABLE tblprofile
DROP TABLE IF EXISTS tblprofile
CREATE TABLE tblprofile(
    Id INT NOT NULL IDENTITY(1,1)
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
)
delete from tblprofile
SELECT * FROM tblprofile;