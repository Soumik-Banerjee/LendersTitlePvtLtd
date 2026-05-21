CREATE TABLE LedgerMaster
(
    AutoID                INT IDENTITY(1,1) PRIMARY KEY,

    Branch                  NVARCHAR(50),

    LedgerCode              NVARCHAR(50) NOT NULL,
    LedgerName              NVARCHAR(200) NOT NULL,
    DisplayName             NVARCHAR(200) NULL,

    BusinessCompanyName     NVARCHAR(250) NULL,

    MobileNo1               NVARCHAR(20) NOT NULL,
    MobileNo2               NVARCHAR(20) NULL,

    EmailId                 NVARCHAR(150) NULL,
    WhatsappNo              NVARCHAR(20) NULL,

    PanNo                   NVARCHAR(20) NULL,
    GstNo                   NVARCHAR(20) NULL,
    AadhaarNo               NVARCHAR(20) NULL,

    MothersName             NVARCHAR(200) NULL,

    Education               NVARCHAR(100) NULL,

    MaritalStatus           NVARCHAR(50) NULL,

    SpouseName              NVARCHAR(200) NULL,
    SpouseAge               INT NULL,
    SpouseOccupation        NVARCHAR(150) NULL,

    NoOfDependent           INT NULL,

    PlaceOfBirth            NVARCHAR(150) NULL,

    ResidenceAddressProof   NVARCHAR(150) NULL,

    ResidenceOwnershipType  NVARCHAR(100) NULL,
    -- Own / Rental / Family Owned / Company Provided etc

    ResidenceLandmark       NVARCHAR(250) NULL,

    YearsAtCurrentCity      DECIMAL(5,2) NULL,
    YearsAtCurrentAddress   DECIMAL(5,2) NULL,

    PermanentAddress        NVARCHAR(MAX) NULL,
    PermanentLandmark       NVARCHAR(250) NULL,

    OfficeAddress           NVARCHAR(MAX) NULL,
    OfficeLandmark          NVARCHAR(250) NULL,

    Reference1Name          NVARCHAR(200) NULL,
    Reference1Relationship  NVARCHAR(100) NULL,
    Reference1ContactNo     NVARCHAR(20) NULL,
    Reference1Address       NVARCHAR(MAX) NULL,

    Reference2Name          NVARCHAR(200) NULL,
    Reference2Relationship  NVARCHAR(100) NULL,
    Reference2ContactNo     NVARCHAR(20) NULL,
    Reference2Address       NVARCHAR(MAX) NULL,

    CoApplicantName         NVARCHAR(200) NULL,
    CoApplicantMobileNo     NVARCHAR(20) NULL,
    CoApplicantEmail        NVARCHAR(150) NULL,
    CoApplicantMotherName   NVARCHAR(200) NULL,

    Obligations             DECIMAL(18,2) NULL,
    Salary                  DECIMAL(18,2) NULL,

    CibilScore              INT NULL,

    LoanDetails             NVARCHAR(MAX) NULL,

    DPD                     INT NULL,

    JobVintage              NVARCHAR(100) NULL,

    ABB                     DECIMAL(18,2) NULL,

    Remarks                 NVARCHAR(MAX) NULL,

    IsActive                BIT NOT NULL DEFAULT(1),

    CreatedBy               INT NULL,
    CreatedAt               DATETIME NOT NULL DEFAULT(GETDATE()),

    UpdatedBy               INT NULL,
    UpdatedAt               DATETIME NULL,

    IsDeleted               BIT NOT NULL DEFAULT(0)
);