CREATE TABLE [dbo].[AttendanceCorrectionRequests]
(
	 AutoID INT IDENTITY(1,1),

    UserName NVARCHAR(100) NOT NULL,

    AttendanceDate DATE NOT NULL,

    RequestedCheckIn DATETIME NULL,

    RequestedCheckOut DATETIME NULL,

    Reason NVARCHAR(1000) NOT NULL,

    Status NVARCHAR(20) DEFAULT('Pending'),

    ReviewedBy NVARCHAR(100) NULL,

    ReviewedAt DATETIME NULL,

    Remarks NVARCHAR(500) NULL,

    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_AttendanceCorrectionRequests
        PRIMARY KEY (AutoID),

    CONSTRAINT FK_AttCorrection_UserMaster
        FOREIGN KEY (UserName)
        REFERENCES UserMaster(UserName)
)
