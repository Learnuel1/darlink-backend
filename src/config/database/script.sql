
CREATE PROC sp_register
@id varchar(255)
,@username varchar(60)
,@password varchar(255),
@email varchar(255)
,@role varchar(255)
,@plan varchar(40)
,@userplanid varchar(255)
 AS
 BEGIN
 BEGIN TRY
 BEGIN TRAN
 DECLARE @default varchar(255)
 SET @default=(SELECT * FROM tblplan WHERE [plan]=@plan)

 INSERT INTO tblusers(userId,username,password,email,role)
 VALUES(@id,@username,@password,@email,@role)
 
 INSERT INTO tbluserplan(userPlanId,planId,userId) VALUES(@userplanid,@default,@id)
 COMMIT TRAN

 
 END TRY
 BEGIN CATCH
 ROLLBACK TRAN
 DECLARE @em varchar(150)
 SET @em = ERROR_MESSAGE()
 RAISERROR(@em,16,1)
 END CATCH
 END
