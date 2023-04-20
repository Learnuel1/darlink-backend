
CREATE PROCEDURE sp_register
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
CREATE PROCEDURE sp_default_admin
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

CREATE PROCEDURE sp_update_plan
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

CREATE PROCEDURE sp_add_user_links
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

CREATE PROCEDURE sp_add_user_button
@userId VARCHAR(255)
,@buttonId VARCHAR(255) 
,@email VARCHAR(255)
,@discord VARCHAR(255)
,@telegram VARCHAR(255)
,@contact VARCHAR(255)  
,@phone VARCHAR(255)
,@music VARCHAR(255)
,@podcast VARCHAR(255)
,@social VARCHAR(255)
,@dataId VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN 
  INSERT INTO tblbutton(buttonId, userId, email, discord, contact,phone,telegram, music, podcast,social) VALUES(@buttonId, @userId, @email, @discord, @contact,@phone,@telegram, @music, @podcast,@social);
   
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

CREATE PROCEDURE sp_update_user_button
@userId VARCHAR(255)
,@buttonId VARCHAR(255) 
,@email VARCHAR(255)
,@discord VARCHAR(255)
,@telegram VARCHAR(255)
,@contact VARCHAR(255)  
,@phone VARCHAR(255)
,@music VARCHAR(255)
,@podcast VARCHAR(255)
,@social VARCHAR(255)
,@dataId VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
  IF @email is NOT NULL OR @email !=' '
  UPDATE  tblbutton SET email=@email ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId;
  IF @discord is NOT NULL OR  @discord  !=' ' 
  UPDATE  tblbutton SET discord=@discord ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId;
  IF @contact is NOT NULL OR @contact !=' '
  UPDATE  tblbutton SET contact=@contact ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId
  IF @phone is NOT NULL OR  @phone  !=' '
  UPDATE  tblbutton SET phone=@phone ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId
  IF @telegram is NOT NULL OR @telegram !=' '
 UPDATE  tblbutton SET telegram=@telegram ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId
  IF @music is NOT NULL OR @music !=' '
 UPDATE  tblbutton SET music=@music,updatedAt=GETDATE()  WHERE buttonId=@buttonId AND userId=@userId
  IF @podcast is NOT NULL OR @podcast !=' '
 UPDATE  tblbutton SET podcast=@podcast ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId
  IF @social is NOT NULL OR  @social !=' '
  UPDATE  tblbutton SET social=@social ,updatedAt=GETDATE() WHERE buttonId=@buttonId AND userId=@userId
 
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

CREATE PROCEDURE sp_get_accounts
@userId varchar(255)
AS
BEGIN
 SELECT u.id,username,email,[status],[role], [plan],userPlanId, p.planId, amount,startDate,endDate FROM tblusers u LEFT JOIN tbluserplan p ON u.userId=p.userId WHERE u.userId !=@userId
END

 GO
 CREATE PROCEDURE sp_add_recovery_link
 @id varchar(255)
 ,@userid VARCHAR(255)
 ,@uniquestring varchar(255)
 ,@expirytime DATETIME
 AS
 BEGIN
 BEGIN TRY
 INSERT INTO tblpassword_recovery(id,userId, uniqueString,expiryTime) VALUES(@id, @userid, @uniquestring, @expirytime)
 END TRY
BEGIN CATCH
ROLLBACK TRAN
DECLARE @em VARCHAR(150)
SET @em = ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END
GO

CREATE PROCEDURE sp_reset_password_by_link
@userid varchar(255)
,@newpassword varchar(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
DELETE FROM tblpassword_recovery WHERE userId=@userid;
UPDATE tblusers SET [password] =@newpassword ,updatedAt= GETDATE() WHERE userId=@userid
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

CREATE PROCEDURE sp_verify_user
@uniquestring VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
DECLARE @userid VARCHAR(255);
SET @userid=(SELECT userId FROM tblpassword_recovery WHERE uniqueString=@uniquestring)
DELETE FROM tblpassword_recovery WHERE uniqueString =@uniquestring
UPDATE tblusers SET [status]='verified' WHERE userId=@userid
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

CREATE PROCEDURE sp_add_appearance
@appearanceId varchar(255)
,@userId VARCHAR(255)
,@type VARCHAR(10)
,@data VARCHAR(255)
,@iconId VARCHAR(255)
,@iconUrl VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
  
  IF  (SELECT COUNT(id) appearanceId FROM tblappearance WHERE userId = @userId AND  [type]=LOWER(@type))=0
  BEGIN
  IF LOWER(@type) = 'icon'
  BEGIN
  INSERT INTO tblappearance(appearanceId, userId, [type], iconId, iconUrl) VALUES(@appearanceId,@userId, @type, @iconId, @iconUrl)
  END
  ELSE
  BEGIN
  INSERT INTO tblappearance(appearanceId, userId, [type], [data]) VALUES(@appearanceId, @userId, @type, @data)
  END
  END
  ELSE
  BEGIN
  IF LOWER(@type) = 'icon'
  BEGIN
  UPDATE tblappearance SET iconId = @iconId, iconUrl=@iconUrl, updatedAt =GETDATE()  WHERE userId = @userId AND  [type]=LOWER(@type)
  END
  ELSE
  BEGIN 
  UPDATE tblappearance SET [data]=LOWER(@data), updatedAt =GETDATE() WHERE  userId = @userId AND  [type]= LOWER(@type)
  END
  END
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
CREATE PROCEDURE sp_add_profile
 @userId  VarChar(255), 
   @profileId  VarChar(255), 
   @bgId  VarChar(255), 
   @bgUrl  VarChar(255), 
    @passportId  VarChar(255), 
    @passportUrl  VarChar(255), 
    @displayName  VarChar(50),
    @description  VarChar(255),  
    @location  VarChar(255),  
    @colour  VarChar(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
    IF (SELECT COUNT(Id) FROM tblprofile WHERE userId = @userId)>0 
          RAISERROR('Profile already exist, update instead',16,1)
    INSERT INTO tblprofile(profileId,userId,bgId,bgUrl,passportId,
            passportUrl,
            description, 
            displayName,location,colour)
             VALUES (@profileId,@userId,
                @bgId,
                @bgUrl,
                @passportId,
                @passportUrl,
                @description, 
                @displayName,
                @location,@colour)
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

CREATE PROCEDURE sp_send_recovery
 @userId  VarChar(255)
,@email  VarChar(255)
AS
BEGIN
BEGIN TRY
 SELECT * FROM tblusers WHERE email=@email AND userId=@userId

END TRY
BEGIN CATCH 
DECLARE @em VARCHAR(150)
SET @em = ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END

GO
CREATE PROCEDURE sp_add_preview
@title VARCHAR(255)
,@url VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
INSERT INTO tblpreview(title, [url]) VALUES(@title, @url)
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

CREATE PROCEDURE sp_verify_user_preview
@username VARCHAR(255)
AS
BEGIN
  SELECT userId, username FROM tblusers WHERE username=@username
END
GO

CREATE PROCEDURE sp_temp_reference
@id VARCHAR(255)
,@planId VARCHAR(255)
AS
BEGIN
BEGIN TRY
BEGIN TRAN
INSERT INTO tbltemp_reference(id, planId) VALUES(@id, @planId)
COMMIT TRAN
END TRY
BEGIN CATCH
ROLLBACK TRAN
DECLARE @em VARCHAR(150)
SET @em = ERROR_MESSAGE()
RAISERROR(@em,16,1)
END CATCH
END