CREATE TABLE [dbo].[UserMaster] (
    [AutoID]    INT            IDENTITY (1, 1) NOT NULL,
    Branch nvarchar(50) not null,
    [UserName]  NVARCHAR (100) NOT NULL,
    [FullName]  NVARCHAR (255) NULL,
    [UserImg]   NVARCHAR(MAX) NULL,
    [EmailID]   NVARCHAR (100) NOT NULL,
    [PriPhnNo]  NVARCHAR (20)  NOT NULL,
    [SecPhnNo]  NVARCHAR (20) NULL,
    [WhatsappNo]  NVARCHAR(20) NULL,
    [Address] NVARCHAR(255) NULL,
    [Role] NVARCHAR(20) NOT NULL 
        DEFAULT ('Employee')
        CHECK ([Role] IN ('Admin', 'Employee')), 
    [IsActive]  BIT            NULL,
    [IsDefault] BIT            NULL,    
    [EntryDate] DATETIME DEFAULT(GETDATE())
    PRIMARY KEY CLUSTERED ([UserName] ASC)
);

