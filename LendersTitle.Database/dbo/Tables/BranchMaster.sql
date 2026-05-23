CREATE TABLE [dbo].[BranchMaster]
(
	[AutoId] INT identity(1,1),
	Branch nvarchar(50) NOT NULL,
	EntryDate datetime default(getdate()), 
    [IsActive] BIT NOT NULL DEFAULT (0), 
    CONSTRAINT [PK_BranchMaster] PRIMARY KEY ([Branch])
)
