CREATE TABLE [dbo].[AttendenceRecords]
(
	[AutoID] INT IDENTITY(1,1) NOT NULL,    
    UserName Nvarchar(150) not null,
    [AttendanceDate] DATE NOT NULL,
    [CheckInTime] TIME NULL,
    [CheckOutTime] TIME NULL,
    [WorkingMinutes] SMALLINT NULL,
    [status] NVARCHAR(20) NOT NULL
        DEFAULT ('Present')
        CHECK ([status] IN ('Present', 'Late', 'Absent', 'Weekend')),
    [IsLate] BIT NOT NULL DEFAULT (0),
    [Notes] NVARCHAR(500) NULL,
    [EntryDate] Datetime DEFAULT (SYSDATETIME())
)
