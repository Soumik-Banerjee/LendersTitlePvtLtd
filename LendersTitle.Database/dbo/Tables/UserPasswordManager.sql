CREATE TABLE [dbo].[UserPasswordManager]
(
	[AutoID] INT IDENTITY(1, 1),
	[UserName]  NVARCHAR (100) NOT NULL,
	[PasswordHash] NVARCHAR(100) NOT NULL,
	[IsVerified] BIT DEFAULT (0),
	[Otp] NVARCHAR(100) NULL,
	[EntryDate] DATETIME DEFAULT(GETDATE()), 
    [LastUpdateDate] DATETIME NULL DEFAULT (GETDATE()),
	CONSTRAINT FK_UserPasswordManager_UserMaster FOREIGN KEY (UserName) REFERENCES dbo.UserMaster(UserName)
)
