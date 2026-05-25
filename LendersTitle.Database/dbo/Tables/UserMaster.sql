CREATE TABLE [dbo].[UserMaster] (
    [AutoID]     INT            IDENTITY (1, 1) NOT NULL,
    [Branch]     NVARCHAR (50)  NOT NULL,
    [UserName]   NVARCHAR (100) NOT NULL,
    [FullName]   NVARCHAR (255) NULL,
    [UserImg]    NVARCHAR (MAX) NULL,
    [EmailID]    NVARCHAR (100) NOT NULL,
    [PriPhnNo]   NVARCHAR (20)  NOT NULL,
    [SecPhnNo]   NVARCHAR (20)  NULL,
    [WhatsappNo] NVARCHAR (20)  NULL,
    [Address]    NVARCHAR (255) NULL,
    [Role]       NVARCHAR (20)  DEFAULT ('Employee') NOT NULL,
    [IsActive]   BIT            NULL,
    [IsDefault]  BIT            NULL,
    [EntryDate]  DATETIME       DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([UserName] ASC),
    CHECK ([Role]='Employee' OR [Role]='Admin'),
    CONSTRAINT [FK_UserMaster_BranchMaster] FOREIGN KEY ([Branch]) REFERENCES [dbo].[BranchMaster] ([Branch])
);

