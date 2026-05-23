CREATE TABLE [dbo].[AttendanceStatusMaster]
(
	 StatusCode NVARCHAR(10) NOT NULL,

    StatusName NVARCHAR(50) NOT NULL,

    IsPresent BIT DEFAULT(0),

    IsPayable BIT DEFAULT(0),

    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_AttendanceStatusMaster
        PRIMARY KEY (StatusCode)
)
