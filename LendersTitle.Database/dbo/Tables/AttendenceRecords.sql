CREATE TABLE [dbo].[AttendenceRecords]
(
	AutoID INT IDENTITY(1,1),

    UserName NVARCHAR(100) NOT NULL,

    AttendanceDate DATE NOT NULL,

    ShiftID INT NULL,

    CheckInTime DATETIME NULL,

    CheckOutTime DATETIME NULL,

    LateMinutes INT DEFAULT(0),

    EarlyExitMinutes INT DEFAULT(0),

    WorkingMinutes INT DEFAULT(0),

    OvertimeMinutes INT DEFAULT(0),

    StatusCode NVARCHAR(10) NOT NULL,

    IsManualEntry BIT DEFAULT(0),

    Remarks NVARCHAR(500) NULL,

    ApprovedBy NVARCHAR(100) NULL,

    ApprovedAt DATETIME NULL,

    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_AttendanceRecords
        PRIMARY KEY (AutoID),

    CONSTRAINT FK_AttendanceRecords_UserMaster
        FOREIGN KEY (UserName)
        REFERENCES UserMaster(UserName),

    CONSTRAINT FK_AttendanceRecords_ShiftMaster
        FOREIGN KEY (ShiftID)
        REFERENCES ShiftMaster(ShiftID),

    CONSTRAINT FK_AttendanceRecords_StatusMaster
        FOREIGN KEY (StatusCode)
        REFERENCES AttendanceStatusMaster(StatusCode),

    CONSTRAINT UQ_Attendance_User_Date
        UNIQUE(UserName, AttendanceDate)
)
