CREATE TABLE [dbo].[UserSessions] (
    [SessionId]      NVARCHAR(100) PRIMARY KEY,
    [UserName]       NVARCHAR(100) NOT NULL,
    [FullName]       NVARCHAR(255) NULL,
    [LoginAt]        DATETIME NOT NULL DEFAULT(GETDATE()),
    [LastActivityAt] DATETIME NOT NULL DEFAULT(GETDATE()),
    [AbsoluteExpiryAt] DATETIME NOT NULL,
    [DeviceInfo]     NVARCHAR(500) NULL,
    [IPAddress]      NVARCHAR(50) NULL,
    [IsActive]       BIT NOT NULL DEFAULT(1),
    [BrowserName]    NVARCHAR(100) NULL,
    [OSName]         NVARCHAR(100) NULL,
    [DeviceType]     NVARCHAR(50) NULL,
    [LogoutAt]       DATETIME2(0) NULL,
    [RevokedBy]      NVARCHAR(100) NULL,
    [RevokeReason]   NVARCHAR(500) NULL,
    CONSTRAINT FK_UserSessions_UserMaster FOREIGN KEY (UserName) REFERENCES dbo.UserMaster(UserName)
);
