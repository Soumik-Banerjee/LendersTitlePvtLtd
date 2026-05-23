CREATE TABLE [dbo].[AttendenceRecords]
(
	[AutoID] INT IDENTITY(1,1) NOT NULL,    
    UserName Nvarchar(100) not null,
    [AttendanceDate] DATE NOT NULL,
    [CheckInTime] TIME NULL,
    [CheckOutTime] TIME NULL,
    [WorkingMinutes] SMALLINT NULL,
    [status] NVARCHAR(20) NOT NULL
        DEFAULT ('Absent')
        CHECK ([status] IN ('Present', 'Late', 'Absent', 'Weekend')),
    [IsLate] BIT NOT NULL DEFAULT (0),
    [Notes] NVARCHAR(500) NULL,
    [EntryDate] Datetime DEFAULT (SYSDATETIME()),
    CONSTRAINT FK_AttendenceRecords_UserMaster FOREIGN KEY (UserName) REFERENCES dbo.UserMaster(UserName)
)
