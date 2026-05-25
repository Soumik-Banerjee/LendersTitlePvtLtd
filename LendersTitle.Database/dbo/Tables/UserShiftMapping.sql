CREATE TABLE [dbo].[UserShiftMapping]
(
	AutoID INT IDENTITY(1,1),
    UserName NVARCHAR(100) NOT NULL,
    ShiftID INT NOT NULL,
    EffectiveFrom DATE NOT NULL,
    EffectiveTo DATE NULL,
    EntryDate DATETIME DEFAULT(GETDATE()),

    CONSTRAINT PK_UserShiftMapping PRIMARY KEY (AutoID),
    CONSTRAINT FK_UserShiftMapping_UserMaster FOREIGN KEY (UserName) REFERENCES UserMaster(UserName),
    CONSTRAINT FK_UserShiftMapping_ShiftMaster FOREIGN KEY (ShiftID) REFERENCES ShiftMaster(ShiftID)
)
