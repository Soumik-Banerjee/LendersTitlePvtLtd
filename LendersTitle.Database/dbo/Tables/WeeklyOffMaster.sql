CREATE TABLE [dbo].[WeeklyOffMaster]
(
	 AutoID INT IDENTITY(1,1),

    Branch NVARCHAR(50) NOT NULL,

    DayName NVARCHAR(20) NOT NULL,

    IsActive BIT DEFAULT(1),

    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_WeeklyOffMaster
        PRIMARY KEY (AutoID),

    CONSTRAINT FK_WeeklyOffMaster_BranchMaster
        FOREIGN KEY (Branch)
        REFERENCES BranchMaster(Branch)
)
