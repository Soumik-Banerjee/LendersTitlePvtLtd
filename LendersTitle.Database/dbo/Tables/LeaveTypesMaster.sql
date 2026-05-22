CREATE TABLE [dbo].[LeaveTypesMaster]
(
	AutoID int identity(1, 1),
	LeaveName nvarchar(50),
	LeaveQuantity int,
	UserName Nvarchar(150),
	EntryDate datetime default(getdate())
)
