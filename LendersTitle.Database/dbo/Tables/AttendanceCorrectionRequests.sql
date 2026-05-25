CREATE TABLE [dbo].[AttendanceCorrectionRequests] (
    [AutoID]            INT             IDENTITY (1, 1) NOT NULL,
    [UserName]          NVARCHAR (100)  NOT NULL,
    [AttendanceDate]    DATE            NOT NULL,
    [RequestedCheckIn]  DATETIME        NULL,
    [RequestedCheckOut] DATETIME        NULL,
    [Reason]            NVARCHAR (1000) NOT NULL,
    [Status]            NVARCHAR (20)   DEFAULT ('Pending') NULL,
    [ReviewedBy]        NVARCHAR (100)  NULL,
    [ReviewedAt]        DATETIME        NULL,
    [Remarks]           NVARCHAR (500)  NULL,
    [EntryDate]         DATETIME        DEFAULT (getdate()) NULL,
    CONSTRAINT [PK_AttendanceCorrectionRequests] PRIMARY KEY CLUSTERED ([AutoID] ASC),
    CONSTRAINT [FK_AttCorrection_UserMaster] FOREIGN KEY ([UserName]) REFERENCES [dbo].[UserMaster] ([UserName])

);

