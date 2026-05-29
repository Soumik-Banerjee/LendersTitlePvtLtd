CREATE TABLE dbo.UserSessions
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    -- Session Information
    SessionId UNIQUEIDENTIFIER NOT NULL,
    
    -- User Information
    UserName NVARCHAR(100) NOT NULL,
    FullName NVARCHAR(200) NULL,

    -- Session Timing
    LoginAt DATETIME2(0) NOT NULL,
    LastActivityAt DATETIME2(0) NOT NULL,
    AbsoluteExpiryAt DATETIME2(0) NOT NULL,

    -- Device / Network Information
    DeviceInfo NVARCHAR(500) NULL,
    IPAddress NVARCHAR(100) NULL,

    -- Session Status
    IsActive BIT NOT NULL DEFAULT(1),

    -- Audit
    CreatedAt DATETIME2(0) NOT NULL DEFAULT(GETDATE()),
    UpdatedAt DATETIME2(0) NULL, 
    [BrowserName] NVARCHAR(100) NULL,
    [OSName] NVARCHAR(100) NULL,
    [DeviceType] NVARCHAR(50) NULL,
    [LogoutAt] DATETIME2(0) NULL,
    [RevokedBy] NVARCHAR(100) NULL,
    [RevokeReason] NVARCHAR(500) NULL 
);
GO

-- =====================================================
-- INDEXES
-- =====================================================

-- Fast lookup by SessionId
CREATE UNIQUE NONCLUSTERED INDEX IX_UserSessions_SessionId
ON dbo.UserSessions(SessionId);
GO

-- Fast lookup by UserName
CREATE NONCLUSTERED INDEX IX_UserSessions_UserName
ON dbo.UserSessions(UserName);
GO

-- Active session filtering
CREATE NONCLUSTERED INDEX IX_UserSessions_IsActive
ON dbo.UserSessions(IsActive);
GO

-- Session cleanup / expiry jobs
CREATE NONCLUSTERED INDEX IX_UserSessions_AbsoluteExpiryAt
ON dbo.UserSessions(AbsoluteExpiryAt);
GO