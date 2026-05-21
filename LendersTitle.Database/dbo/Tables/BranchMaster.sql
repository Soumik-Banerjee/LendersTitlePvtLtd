CREATE TABLE [dbo].[BranchMaster]
(
	[AutoId] INT identity(1,1),
	Branch nvarchar(50),
	EntryDate datetime default(getdate())
)
