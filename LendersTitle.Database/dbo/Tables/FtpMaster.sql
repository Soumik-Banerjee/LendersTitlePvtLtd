CREATE TABLE [dbo].[FtpMaster]
(
	[AutoID] INT IDENTITY(1, 1),
	[Url] NVARCHAR(MAX),
    [Port] NVARCHAR(50) NULL,
	[PasswordHash] NVARCHAR(100)
)
