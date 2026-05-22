CREATE TABLE [dbo].[LeaveRequests]
(
	[AutoID] INT IDENTITY(1,1) NOT NULL,
    UserName NVARCHAR(150) NOT NULL,
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
    [ReviewedBy] NVARCHAR(150) NULL,
    [ReviewedAt] DATETIME NULL,
    [EntryDate] DATETIME DEFAULT (SYSDATETIME())
)
