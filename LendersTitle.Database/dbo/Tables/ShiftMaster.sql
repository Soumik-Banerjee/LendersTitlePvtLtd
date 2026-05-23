CREATE TABLE [dbo].[ShiftMaster]
(
	ShiftID INT IDENTITY(1,1),

    ShiftName NVARCHAR(50) NOT NULL,

    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,

    GraceMinutes INT DEFAULT(15),

    HalfDayMinutes INT NOT NULL,
    FullDayMinutes INT NOT NULL,

    OvertimeAllowed BIT DEFAULT(0),

    IsNightShift BIT DEFAULT(0),

    IsActive BIT DEFAULT(1),

    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_ShiftMaster
        PRIMARY KEY (ShiftID)
)
