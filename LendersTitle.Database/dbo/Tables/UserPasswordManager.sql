CREATE TABLE [dbo].[UserPasswordManager]
(
	[AutoID] INT IDENTITY(1, 1),
	[UserName]  NVARCHAR (100) NOT NULL,
	[PasswordHash] NVARCHAR(100) NOT NULL,
	[IsVerified] BIT,
	[Otp] NVARCHAR(100) NULL,
	[EntryDate] DATETIME DEFAULT(GETDATE())
)
