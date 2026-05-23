CREATE TABLE [dbo].[LeaveTypesMaster]
(
	AutoID int identity(1, 1),
	LeaveName nvarchar(50),
	LeaveQuantity int,
	UserName Nvarchar(100),
	EntryDate datetime default(getdate()),
	CONSTRAINT FK_LeaveTypesMaster_UserMaster FOREIGN KEY (UserName) REFERENCES dbo.UserMaster(UserName)
)
