
CREATE PROC sp_register
@id varchar(255)
,@username varchar(60)
,@password varchar(255)
,@email varchar(255)
,@role varchar(255)
,@plan varchar(40)
,@userplanid varchar(255)
 AS
 BEGIN
 BEGIN TRY
 BEGIN TRAN
 DECLARE @defaultPlanId varchar(255)
 SET @defaultPlanId=(SELECT TOP 1  planId FROM tblplan WHERE [plan]=@plan)
  IF @defaultPlanId IS NULL
  RAISERROR('Registration is not available at the moment',16,1)
 INSERT INTO tblusers(userId,username,password,email,role)
 VALUES(@id,@username,@password,@email,@role)
 
 INSERT INTO tbluserplan(userPlanId,planId,userId) VALUES(@userplanid,@defaultPlanId,@id)
 COMMIT TRAN
 
 END TRY
 BEGIN CATCH
 ROLLBACK TRAN
 DECLARE @em varchar(150)
 SET @em = ERROR_MESSAGE()
 RAISERROR(@em,16,1)
 END CATCH
 END
GO
CREATE PROC sp_default_admin
@id varchar(255)
,@username varchar(60)
,@password varchar(255)
,@email varchar(255)
,@role varchar(255)
 AS
 BEGIN
 BEGIN TRY
 BEGIN TRAN
 IF(SELECT COUNT(userId) FROM tblusers)>0
  RAISERROR('Access denied, login required',16,1)

 INSERT INTO tblusers(userId,username,password,email,role)
 VALUES(@id,@username,@password,@email,@role)
 COMMIT TRAN
 END TRY
 BEGIN CATCH
 ROLLBACK TRAN
 DECLARE @em varchar(150)
 SET @em = ERROR_MESSAGE()
 RAISERROR(@em,16,1)
 END CATCH
 END
GO

CREATE PROC sp_update_plan
@planId VARCHAR(255)
,@plans VARCHAR(60)
,@amount DECIMAL(9,2)
,@duration VARCHAR(10)
AS
BEGIN
BEGIN TRY
 
UPDATE tblplan SET [plan]=@plans WHERE planId=@planId;
IF @amount is NOT NULL OR @duration !=' ' 
UPDATE tblplan SET amount=@amount WHERE planId=@planId
IF @duration is NOT NULL OR @duration !=' '
UPDATE tblplan SET duration=@duration WHERE planId=@planId
UPDATE tblplan SET updatedAt=GETDATE() WHERE planId=@planId

END TRY
BEGIN CATCH
DECLARE @em VARCHAR(150)
SET @em = ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END 
GO

CREATE PROC sp_add_user_links
@userId varchar(255)
,@linkId varchar(255)
,@type VARCHAR(10)
,@url varchar(255)
,@title varchar(60)
,@subtitle varchar(120)
,@theme VARCHAR(40)
,@urlId VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
 IF @type ='link'
 BEGIN
  INSERT INTO tbllink(linkId,userId,[url], title,[type]) VALUES(@linkId,@userId,@url,@title,@type)  
 END
 ELSE IF @type ='section'
 BEGIN
  INSERT INTO tbllink(linkId,userId,theme,title,[type]) VALUES(@linkId,@userId,@theme,@title,@type)
 END
 ELSE IF @type = 'embed'
 BEGIN
  INSERT INTO tbllink(linkId,userId,[url],urlId,subtitle,[type]) VALUES(@linkId,@userId,@url,@urlId,@subtitle,@type)
 END
  COMMIT TRAN
END TRY
BEGIN CATCH
DECLARE @em varchar(150)
SET @em= ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END
GO

CREATE PROC sp_add_user_button
@userId VARCHAR(255)
,@buttonId VARCHAR(255)
,@type VARCHAR(20)
,@data VARCHAR(255)
,@dataId VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
IF LOWER(@type) = 'contact' OR LOWER(@type) = 'social' OR LOWER(@type) = 'podcast'
BEGIN
INSERT INTO tblbutton(buttonId, [data],[type], userId) VALUES(@buttonId, @data,@type,@userId)
END
ELSE IF LOWER(@type) = 'music'
BEGIN
INSERT INTO tblbutton(buttonId,[data],dataId,[type], userId) VALUES(@buttonId,@data,@dataId,@type,@userId)
END
ELSE IF LOWER(@type) = 'email'
BEGIN
INSERT INTO tblbutton(buttonId,[data],[type], userId) 
VALUES(@buttonId,@data,@type,@userId)
END
ELSE
RAISERROR('No button type found',16,1)
COMMIT TRAN
END TRY
BEGIN CATCH
ROLLBACK TRAN
DECLARE @em VARCHAR(150)
SET @em = ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END
GO
<<<<<<< HEAD
 
=======

CREATE PROC sp_get_accounts
@userId varchar(255)
AS
BEGIN
 SELECT u.id,username,email,[status],[role], [plan],userPlanId, p.planId, amount,startDate,endDate FROM tblusers u LEFT JOIN tbluserplan p ON u.userId=p.userId WHERE u.userId !=@userId
END

 
>>>>>>> 7e053b5 (fix: update login route)
