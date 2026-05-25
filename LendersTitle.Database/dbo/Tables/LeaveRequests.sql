CREATE TABLE [dbo].[LeaveRequests] (
    [AutoID]       INT             IDENTITY (1, 1) NOT NULL,
    [Branch]       NVARCHAR (50)   NOT NULL,
    [UserName]     NVARCHAR (100)  NOT NULL,
    [LeaveType]    NVARCHAR (20)   NOT NULL,
    [StartDate]    DATE            NOT NULL,
    [EndDate]      DATE            NOT NULL,
    [Days]         SMALLINT        NOT NULL,
    [Reason]       NVARCHAR (1000) NOT NULL,
    [Status]       NVARCHAR (20)   DEFAULT ('Pending') NOT NULL,
    [AdminRemarks] NVARCHAR (1000) NULL,
    [ReviewedBy]   NVARCHAR (100)  NULL,
    [ReviewedAt]   DATETIME        NULL,
    [EntryDate]    DATETIME        DEFAULT (getdate()) NULL,
    CHECK ([LeaveType]='Annual' OR [LeaveType]='Casual' OR [LeaveType]='Sick'),
    CHECK ([Status]='Rejected' OR [Status]='Approved' OR [Status]='Pending'),
    CONSTRAINT [FK_LeaveRequests_BranchMaster] FOREIGN KEY ([Branch]) REFERENCES [dbo].[BranchMaster] ([Branch]),
    CONSTRAINT [FK_LeaveRequests_UserMaster_ReviewedBy] FOREIGN KEY ([ReviewedBy]) REFERENCES [dbo].[UserMaster] ([UserName]),
    CONSTRAINT [FK_LeaveRequests_UserMaster_UserName] FOREIGN KEY ([UserName]) REFERENCES [dbo].[UserMaster] ([UserName])
);

