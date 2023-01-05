
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
 SET @defaultPlanId=(SELECT planId FROM tblplan WHERE [plan]=@plan)
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

SELECT* from tbluserplan

SELECT * FROM tblusers u LEFT JOIN tbluserplan p ON u.userId=p.userId

delete from tblusers
select * FROM tblplan
select * FROM tblprofile