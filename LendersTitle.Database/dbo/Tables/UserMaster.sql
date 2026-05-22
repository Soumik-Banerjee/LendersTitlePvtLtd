CREATE TABLE [dbo].[UserMaster] (
    [AutoID]    INT            IDENTITY (1, 1) NOT NULL,
    Branch nvarchar(50) not null,
    [UserName]  NVARCHAR (100) NOT NULL,
    [FullName]  NVARCHAR (255) NULL,
    [EmailID]   NVARCHAR (100) NOT NULL,
    [PriPhnNo]  NVARCHAR (20)  NOT NULL,
    [SecPhnNo]  NVARCHAR (20),
    WhatsappNo  NVARCHAR(20),
    Address NVARCHAR(255) NULL,
    [IsActive]  BIT            NULL,
    [IsDefault] BIT            NULL,
    PRIMARY KEY CLUSTERED ([UserName] ASC)
);

