CREATE TABLE [dbo].[HolidaysMaster]
(
	[AutoID] INT IDENTITY(1, 1),
	HolidayName NVARCHAR(150),
	HolidayDate DATE,
	DayName NVARCHAR(150),
	UserName Nvarchar(150),
	EntryDate Datetime default(getdate())
)
