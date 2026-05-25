CREATE PROCEDURE sp_Attendance_CheckIn
(
    @UserName NVARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        ---------------------------------------------------
        -- VARIABLES
        ---------------------------------------------------

        DECLARE @Today DATE = CAST(GETDATE() AS DATE);

        DECLARE @CurrentDateTime DATETIME = GETDATE();

        DECLARE @ShiftID INT;

        DECLARE @ShiftStartTime TIME;

        DECLARE @GraceMinutes INT;

        DECLARE @AllowedCheckInTime DATETIME;

        DECLARE @LateMinutes INT = 0;

        DECLARE @StatusCode NVARCHAR(10) = 'IN';



        ---------------------------------------------------
        -- VALIDATE USER
        ---------------------------------------------------

        IF NOT EXISTS
        (
            SELECT 1
            FROM UserMaster
            WHERE UserName = @UserName
            AND IsActive = 1
        )
        BEGIN
            RAISERROR('Invalid or inactive user.', 16, 1);
            RETURN;
        END



        ---------------------------------------------------
        -- PREVENT DUPLICATE CHECK-IN
        ---------------------------------------------------

        IF EXISTS
        (
            SELECT 1
            FROM AttendanceRecords
            WHERE UserName = @UserName
            AND AttendanceDate = @Today
        )
        BEGIN
            RAISERROR('Attendance already exists for today.', 16, 1);
            RETURN;
        END



        ---------------------------------------------------
        -- FETCH USER SHIFT
        ---------------------------------------------------

        SELECT TOP 1
            @ShiftID = USM.ShiftID
        FROM UserShiftMapping USM
        WHERE USM.UserName = @UserName
        AND @Today BETWEEN USM.EffectiveFrom
                       AND ISNULL(USM.EffectiveTo, @Today)
        ORDER BY USM.EffectiveFrom DESC;



        IF @ShiftID IS NULL
        BEGIN
            RAISERROR('No shift assigned to user.', 16, 1);
            RETURN;
        END



        ---------------------------------------------------
        -- FETCH SHIFT DETAILS
        ---------------------------------------------------

        SELECT
            @ShiftStartTime = StartTime,
            @GraceMinutes = GraceMinutes
        FROM ShiftMaster
        WHERE ShiftID = @ShiftID;



        ---------------------------------------------------
        -- CALCULATE LATE MINUTES
        ---------------------------------------------------

        SET @AllowedCheckInTime =
            DATEADD
            (
                MINUTE,
                @GraceMinutes,
                CAST(@Today AS DATETIME)
                + CAST(@ShiftStartTime AS DATETIME)
            );



        IF @CurrentDateTime > @AllowedCheckInTime
        BEGIN

            SET @LateMinutes =
                DATEDIFF
                (
                    MINUTE,
                    @AllowedCheckInTime,
                    @CurrentDateTime
                );

            SET @StatusCode = 'L';

        END



        ---------------------------------------------------
        -- INSERT ATTENDANCE
        ---------------------------------------------------

        INSERT INTO AttendanceRecords
        (
            UserName,
            AttendanceDate,
            ShiftID,
            CheckInTime,
            LateMinutes,
            StatusCode,
            EntryDate
        )
        VALUES
        (
            @UserName,
            @Today,
            @ShiftID,
            @CurrentDateTime,
            @LateMinutes,
            @StatusCode,
            GETDATE()
        );



        ---------------------------------------------------
        -- SUCCESS RESPONSE
        ---------------------------------------------------

        SELECT
            1 AS Success,
            'Check-in successful.' AS Message,
            @CurrentDateTime AS CheckInTime,
            @LateMinutes AS LateMinutes,
            @StatusCode AS StatusCode;



    END TRY

    BEGIN CATCH

        SELECT
            0 AS Success,
            ERROR_MESSAGE() AS Message;

    END CATCH

END