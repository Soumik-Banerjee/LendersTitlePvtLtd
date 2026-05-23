CREATE TABLE [dbo].[LeaveRequests]
(
	[AutoID] INT IDENTITY(1,1) NOT NULL,
    [Branch] NVARCHAR(50) NOT NULL,
    [UserName] NVARCHAR(100) NOT NULL,
    [LeaveType] NVARCHAR(20) NOT NULL
        CHECK ([LeaveType] IN ('Sick', 'Casual', 'Annual')),
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NOT NULL,
    [Days] SMALLINT NOT NULL,
    [Reason] NVARCHAR(1000) NOT NULL,
    [Status] NVARCHAR(20) NOT NULL
        DEFAULT ('Pending')
        CHECK ([Status] IN ('Pending', 'Approved', 'Rejected')),
    [AdminRemarks] NVARCHAR(1000) NULL,
    [ReviewedBy] NVARCHAR(100) NULL,
    [ReviewedAt] DATETIME NULL,
    [EntryDate] DATETIME DEFAULT (GETDATE()),
    CONSTRAINT FK_LeaveRequests_BranchMaster FOREIGN KEY (Branch) REFERENCES dbo.BranchMaster(Branch),
    CONSTRAINT FK_LeaveRequests_UserMaster_UserName FOREIGN KEY (UserName) REFERENCES dbo.UserMaster(UserName),
    CONSTRAINT FK_LeaveRequests_UserMaster_ReviewedBy FOREIGN KEY (ReviewedBy) REFERENCES dbo.UserMaster(UserName)
)
