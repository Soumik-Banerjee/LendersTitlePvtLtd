CREATE TABLE [dbo].[ShiftMaster] (
    [ShiftID]         INT           IDENTITY (1, 1) NOT NULL,
    [ShiftName]       NVARCHAR (50) NOT NULL,
    [StartTime]       TIME (7)      NOT NULL,
    [EndTime]         TIME (7)      NOT NULL,
    [GraceMinutes]    INT           DEFAULT ((15)) NULL,
    [HalfDayMinutes]  INT           NOT NULL,
    [FullDayMinutes]  INT           NOT NULL,
    [OvertimeAllowed] BIT           DEFAULT ((0)) NULL,
    [IsNightShift]    BIT           DEFAULT ((0)) NULL,
    [IsActive]        BIT           DEFAULT ((1)) NULL,
    [EntryDate]       DATETIME      DEFAULT (getdate()) NULL,
    CONSTRAINT [PK_ShiftMaster] PRIMARY KEY CLUSTERED ([ShiftID] ASC)
);

