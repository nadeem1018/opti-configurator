'---------------------------------------------------------------------------------------
Option Strict On
Option Explicit On
'---------------------------------------------------------------------------------------
Imports System.Xml
Imports System.Linq
Imports System.Reflection
Imports System.IO
Imports System.Runtime.InteropServices

'---------------------------------------------------------------------------------------

'---------------------------------------------------------------------------------------
'Utilities
'---------------------------------------------------------------------------------------
Public Class Utilites

    Private Sub New()
        MyBase.New()
    End Sub

    ''' <summary>
    ''' Returns formatted string as per the culture used by the current thread.
    ''' </summary>
    ''' <param name="format"></param>
    ''' <param name="arg"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function StringFormat(ByVal format As String, ByVal ParamArray arg() As Object) As String
        If Not String.IsNullOrWhiteSpace(format) Then
            Return String.Format(System.Globalization.CultureInfo.CurrentCulture, format, arg)
        Else
            Return ""
        End If
    End Function


    Public Shared Function NullToString(ByVal o As Object) As String
        If o Is Nothing OrElse IsDBNull(o) Then
            Return ""
        Else
            Return CType(o, String).Trim
        End If
    End Function

    Public Shared Function NullToDouble(ByVal o As Object) As Double
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            'Return CType(o.ToString.Replace(Application.CurrentCulture.NumberFormat.NumberDecimalSeparator, "."), Double)
            Return CType(o, Double)
        End If
    End Function

    Public Shared Function NullToBoolean(ByVal o As Object) As Boolean
        If o Is Nothing OrElse IsDBNull(o) Then
            Return False
        Else
            Return CType(o, Boolean)
        End If
    End Function

    Public Shared Function NullToDecimal(ByVal o As Object) As Decimal
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            'Return CType(o.ToString.Replace(Application.CurrentCulture.NumberFormat.NumberDecimalSeparator, "."), Decimal)
            Return CType(o, Decimal)
        End If
    End Function

    Public Shared Function NullToShort(ByVal o As Object) As Short
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            Return CType(o, Short)
        End If
    End Function

    Public Shared Function NullToInteger(ByVal o As Object) As Integer
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            Return CType(o, Integer)
        End If
    End Function

    Public Shared Function NullToDate(ByVal o As Object) As DateTime
        If o Is Nothing OrElse IsDBNull(o) Or NullToString(o) = "" Then
            Return DateTime.MinValue
        Else
            Return CType(o, DateTime)
        End If
    End Function

    Public Shared Function NullToSingle(ByVal o As Object) As Single
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            Return CType(o, Single)
        End If
    End Function

    Public Shared Function NullToLong(ByVal o As Object) As Long
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            If o.ToString().Trim() = "" Then o = 0 ''Added By Nikhilesh 15 Jan 2015
            Return CType(o, Long)
        End If
    End Function

    ''' <summary>
    ''' Converts to minimum sql date if dt is minimum .net date else returns the date.
    ''' </summary>
    ''' <param name="dt"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetMinSqlDate(ByVal dt As DateTime) As Date
        If dt = #12:00:00 AM# Then
            Return DateSerial(1900, 1, 1)
        Else
            Return dt
        End If
    End Function

    Public Shared Function GetMaxnSqlDate(ByVal dt As DateTime) As Date
        If dt = #12:00:00 AM# Then
            Return DateSerial(9999, 1, 1)
        Else
            Return dt
        End If
    End Function

    ''' <summary>
    '''   This function converts .NET DateTime data to SQL server DateTime
    ''' in .NET min value = #Jan 1, 0001 12:00:00 PM"; in sql min value = Jan 1, 1753
    ''' </summary>
    ''' <param name="o"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function NETToSQLDate(ByVal o As DateTime) As Object
        If o = #12:00:00 AM# Then
            'Abhishek/18-Jan-2007
            'Return DateSerial(1753, 1, 1)
            Return DBNull.Value
        Else
            Return o
        End If
    End Function

    ''' <summary>
    ''' Returns numeric part of an alpha numeric string
    ''' For example for a string XYZ0001 0001 would be returned
    ''' </summary>
    ''' <param name="inputStr"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetNumPart(ByVal inputStr As String) As String
        Dim piCounter As Integer
        Dim psNumPart As String = ""
        inputStr = inputStr.Trim
        If Microsoft.VisualBasic.Information.IsNumeric(inputStr) Then
            Return inputStr
        End If
        For piCounter = 1 To Len(inputStr)
            If Not Microsoft.VisualBasic.Information.IsNumeric(Microsoft.VisualBasic.Right(inputStr, piCounter)) Then
                Return Microsoft.VisualBasic.Right(inputStr, piCounter - 1)
                ' Exit For
            End If
        Next

        Return ""
    End Function

    ''' <summary>
    ''' Finds weather a string is blank
    ''' </summary>
    ''' <param name="s"></param>
    ''' <returns></returns>
    ''' <remarks>Function returns true if string is nothing or string only contains white spaces.
    ''' For example function returns true for a string with value "   "
    ''' </remarks>
    Public Shared Function IsBlank(ByVal s As String) As Boolean
        If s Is Nothing = True OrElse s.Trim = "" Then
            Return True
        End If
        Return False

    End Function

    ''' <summary>
    ''' 
    ''' </summary>
    ''' <param name="xmlValue"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' Gopal/July-15-14
    Public Shared Function ParseXMLvalue(ByVal xmlValue As String) As String

        'Return String.Concat("![CDATA[", txt, "]]")
        Dim pxmlValue As String = xmlValue
        pxmlValue = xmlValue.Replace("&", "&amp;")
        pxmlValue = pxmlValue.Replace("<", "&lt;")
        pxmlValue = pxmlValue.Replace(">", "&gt;")
        pxmlValue = pxmlValue.Replace(Chr(39), "&quot;")
        pxmlValue = pxmlValue.Replace("'", "&apos;")
        Return pxmlValue

    End Function

    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlHeaderOpeningTag(ByVal dttableName As String) As String
        Dim sxml As String = String.Format("<?xml version=""1.0"" encoding=""utf-16"" ?><DataTable Uid=""{0}""><Rows>", dttableName)
        Return sxml
    End Function
    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlHeaderClosingTag() As String
        Dim sxml As String = "</Rows></DataTable>"
        Return sxml
    End Function
    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlRowCellOpeningTag() As String
        Dim sxml As String = "<Row><Cells>"
        Return sxml
    End Function
    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlRowCellClosingTag() As String
        Dim sxml As String = "</Cells></Row>"
        Return sxml
    End Function

    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlCellOpeningTag() As String
        Dim sxml As String = "<Cell>"
        Return sxml
    End Function
    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlCellClosingTag() As String
        Dim sxml As String = "</Cell>"
        Return sxml
    End Function
    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlCellColumnTag(ByVal colName As String) As String
        Dim sxml As String = StringFormat("<ColumnUid>{0}</ColumnUid>", colName)
        Return sxml
    End Function

    ''' Gopal/July-15-14
    Public Shared Function GetDataTableXmlRowValueTag(cellValue As String) As String
        If cellValue Is Nothing Then
            cellValue = NullToString(cellValue)
        End If
        Dim sxml As String = String.Format("<Value>{0}</Value>", ParseXMLvalue(cellValue))
        Return sxml
    End Function

    'Gopal/July-15-14
    Public Shared Function GetDateSerialized(dateVal As Date) As String

        Dim sxml As String = ""

        If dateVal <> #12:00:00 AM# Then
            sxml = StringFormat("{0}{1}{2}", dateVal.Year, dateVal.Month.ToString.PadLeft(2, "0"c), dateVal.Day.ToString.PadLeft(2, "0"c))
        End If

        Return sxml
    End Function

    ''' <summary>
    ''' Increments an alphanumeric string
    ''' Example: For XYZ0001 XYZ0002 would be returned
    ''' </summary>
    ''' <param name="inputStr"></param>
    ''' <returns>an alphanumeric string incremented by 1</returns>
    ''' <remarks></remarks>
    Public Shared Function IncrementAlphaNumericNumber(ByVal inputStr As String) As String
        Dim psNextBatchNumber2 As String = inputStr

        Dim psNumPart As String = GetNumPart(psNextBatchNumber2)
        psNextBatchNumber2 = Strings.Left(psNextBatchNumber2, Len(psNextBatchNumber2) - Len(psNumPart))
        psNumPart = Format(Val(psNumPart) + 1, Strings.StrDup(Strings.Len(psNumPart), "0"))
        psNextBatchNumber2 = psNextBatchNumber2 & psNumPart
        Return psNextBatchNumber2
    End Function

    Public Shared Function TimeToMinutes(ByVal Time As String) As Double
        Dim psTime As String

        Dim psHours As String
        Dim psMinuts As String
        Dim piHours As Integer
        Dim piMinuts As Integer
        Dim piTotalMinuts As Double = 0


        psTime = Time
        If Not psTime Is Nothing And psTime.Trim <> ":" And psTime <> "" Then
            psHours = psTime.Substring(0, 2)

            psMinuts = psTime.Substring(3, 2)
            If psHours <> "" Then
                piHours = CType(psHours, Integer)
            End If
            If psMinuts <> "" Then
                piMinuts = CType(psMinuts, Integer)
            End If
            piTotalMinuts = piHours * 60 + piMinuts
        End If

        Return piTotalMinuts
    End Function 'TimeToMinuts(ByVal Time As String) As Double

    '---------------------------------------------------------------------------------------

    '---------------------------------------------------------------------------------------
    'GetCompanyConnectionString
    '---------------------------------------------------------------------------------------
    'Public Shared Function GetCompanyConnectionString() As String
    '    '---------------------------------------------------------------------------------------
    '    'Function Name  :   GetCompanyConnectionString
    '    'Purpose        :   Returns the Company Connection String from App.Config of Application
    '    'Parameters     :   None
    '    'Return Type    :   Company Connection String
    '    'Created By     :   INFOCUS/Manish Chhetia/03rd July 2006
    '    'Modified By    :
    '    'Modification   :
    '    '---------------------------------------------------------------------------------------

    '    Dim psCompanyConnectionString As String

    '    psCompanyConnectionString = Convert.ToString(ConfigurationData.GetSectionValue("connectionStrings", "CompanyConnection"))
    '    Return psCompanyConnectionString

    'End Function
    '---------------------------------------------------------------------------------------

    '---------------------------------------------------------------------------------------
    'GetAdminConnectionString
    '---------------------------------------------------------------------------------------
    'Public Shared Function GetAdminConnectionString() As String
    '    '---------------------------------------------------------------------------------------
    '    'Function Name  :   GetAdminConnectionString
    '    'Purpose        :   Returns the Admin Connection String from App.Config of Application
    '    'Parameters     :   None
    '    'Return Type    :   Administration Database Connection String
    '    'Created By     :   INFOCUS/Manish Chhetia/03rd July 2006
    '    'Modified By    :
    '    'Modification   :
    '    '---------------------------------------------------------------------------------------

    '    Dim psAdminConnectionString As String
    '    psAdminConnectionString = Convert.ToString(ConfigurationData.GetSectionValue("connectionStrings", "SysAdminConnection"))

    '    Return psAdminConnectionString

    'End Function
    '---------------------------------------------------------------------------------------

    'Jayesh/13/02/08
    ''' <summary>
    ''' First Check BMM Login user wise report folder then return MDB path for report file.
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetReportMDBPath() As String
        '1. First check report folder and mdb for login user
        '2. if not found then copy it from centrilize location to user folder
        '3. return the path


        'If User wise enviroment folder is required --> (Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData))
        Dim psMDBPathForUser As String
        Dim psTargatMDBFile As String
        Dim psSourceMDBFile As String
        Static pbIsFirstTime As Boolean = True
        Dim psLoginUser As String = ""
        'TODO: Need to change Path
        'psLoginUser =ConfigurationData.GetLoggedInUser()
        Dim psCurrentReportPath As String  'If Relative path then pick from the current location else set absolute path
        Dim psTmpPath As String = ""
        'TODO: Need to change Path
        'psTmpPath = ConfigurationData.GetAppSectionValue("ReportPath")

        If IO.Path.GetPathRoot(psTmpPath) <> "\" Then
            psCurrentReportPath = psTmpPath
        Else
            psCurrentReportPath = My.Application.Info.DirectoryPath & psTmpPath
        End If


        'Jayesh/11/08/08  - in current path if UNC then user-rights issue
        'check user folder path
        'psMDBPathForUser = psCurrentReportPath & "\" & ConfigurationData.GetLoggedInUser
        psMDBPathForUser = My.Computer.FileSystem.SpecialDirectories.Temp & "\" & psLoginUser
        If System.IO.Directory.Exists(psMDBPathForUser) = False Then
            System.IO.Directory.CreateDirectory(psMDBPathForUser)
        End If

        'Set the source and targat file
        psSourceMDBFile = psCurrentReportPath & "\Report.mdb"
        psTargatMDBFile = psMDBPathForUser & "\Report.mdb"

        'for first time it will always copy file
        If pbIsFirstTime = True Then
            FileCopy(psSourceMDBFile, psTargatMDBFile)
            pbIsFirstTime = False
        End If

        'now again check targat file in it.
        'Note: Condition for just in case after the first time is mdb file is some-how
        'deleted for move orelse if user change in the current context then it will 
        'copy file again -- do not remove this condition.   Jayesh/14/02/08
        If System.IO.File.Exists(psTargatMDBFile) = False Then
            FileCopy(psSourceMDBFile, psTargatMDBFile)
        End If

        'Now return the path
        Return psMDBPathForUser

    End Function   'GetReportMDBPath() As String

    'Jayesh/13/02/08
    ''' <summary>
    ''' For copy disk files 
    ''' </summary>
    ''' <param name="sourceFileName"></param>
    ''' <param name="TargatFileName"></param>
    ''' <remarks>Use to copy MDB File from source to user specific.</remarks>
    Public Shared Sub FileCopy(ByVal sourceFileName As String, ByVal TargatFileName As String)

        If String.IsNullOrEmpty(sourceFileName) = False _
           AndAlso String.IsNullOrEmpty(TargatFileName) = False Then

            'If IO.File.Exists(sourceFileName) = False Then
            'Muffu 16 Feb 2008 
            If IO.File.Exists(sourceFileName) = True Then
                IO.File.Copy(sourceFileName, TargatFileName, True)
            Else
                ErrorLogging.LogError("Error in copying file, Source not found.....")
            End If
        Else
            ErrorLogging.LogError("Error in copying file, Invalid Source/Targat File Name.....")
        End If

    End Sub   'FileCopy(ByVal sourceFileName As String, ByVal TargatFileName As String)

    'Public Shared Function GetReportPath() As String

    '    'Dim configurationAppSettings As System.Configuration.AppSettingsReader = New System.Configuration.AppSettingsReader
    '    Dim psReportPath As String

    '    ' ''psReportPath = My.Application.Info.DirectoryPath
    '    'psReportPath = My.Application.Info.DirectoryPath & CType(configurationAppSettings.GetValue("ReportPath", GetType(System.String)), String)

    '    'Jayesh: 6/8/07
    '    'If Relative path then pick from the current location else set absolute path

    '    Dim psTmpPath As String = ""
    '    'TODO: Need to change Path
    '    'psTmpPath = ConfigurationData.GetAppSectionValue("ReportPath")

    '    If IO.Path.GetPathRoot(psTmpPath) <> "\" Then
    '        psReportPath = psTmpPath
    '    Else
    '        psReportPath = My.Application.Info.DirectoryPath & psTmpPath
    '    End If

    '    Return psReportPath
    '    'Return ConfigurationData.GetAppSectionValue("ReportPath")
    'End Function

    Public Shared Function GetTargetPackage() As String
        'Dim pobjSettings As System.Configuration.AppSettingsReader = New System.Configuration.AppSettingsReader
        'Dim psPackage As String

        'psPackage = CType(pobjSettings.GetValue("TargetPackage", GetType(System.String)), String)
        'Return psPackage
        'TODO:Need to change path
        Return ""
        'Return ConfigurationData.GetAppSectionValue("TargetPackage")
    End Function

    ''' <summary>
    ''' Gets application startup path
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared ReadOnly Property MyApplicationPath As String
        Get
            Return ""
        End Get
    End Property
    ''' <summary>
    ''' Returns company name from configuration.xml
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetCompanyName() As String
        'TODO:Need to change path
        Return ""
        'Return ConfigurationData.GetAppSectionValue("CompanyId")

    End Function

    '---------------------------------------------------------------------------------------
    'GetIFaceConnectionString
    '---------------------------------------------------------------------------------------
    Public Shared Function GetIFaceConnectionString() As String
        '---------------------------------------------------------------------------------------
        'Function Name  :   GetIFaceConnectionString
        'Purpose        :   Returns the Interface Connection String from App.Config of Application
        'Parameters     :   None
        'Return Type    :   Interface Database Connection String
        'Created By     :   INFOCUS/Manish Chhetia/03rd July 2006
        'Modified By    :
        'Modification   :
        '---------------------------------------------------------------------------------------

        Dim psIFaceConnectionString As String = ""
        'TODO: Need to change path
        'psIFaceConnectionString = Convert.ToString(ConfigurationData.GetSectionValue("connectionStrings", "IFaceConnection"))
        Return psIFaceConnectionString

    End Function

    ''' <summary>
    ''' Rounds a fractional number to next whole number. For example 1.3 would be rounded to 2
    ''' </summary>
    ''' <param name="number"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function RoundNumberToNextWholeNumber(ByVal number As Double) As Long
        'If number - Fix(number) <> 0 Then
        '    Return CInt(Fix(number) + 1)
        'Else
        '    Return CInt(Fix(number))
        'End If
        'muffu 31 May 2008
        Return CLng(System.Math.Ceiling(number))
    End Function

    Public Shared Function NETToDBNullDate(ByVal o As DateTime) As Object
        If o = #12:00:00 AM# Then
            'Return New Nullable(Of Date)
            Return DBNull.Value
        Else
            Return o
        End If
    End Function

    'Muffaddal 2 Apr 2007 replacing single quote with two single quotes to avoid error while row filteration
    ''' <summary>
    ''' Parses a data row filter and replaces specical characters like single quotes
    ''' meant to be used only for string type of value
    ''' </summary>
    ''' <param name="rowFilter"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function ParseRowFilter(ByVal rowFilter As String) As String
        If String.IsNullOrEmpty(rowFilter) Then Return ""
        Return rowFilter.Replace("'", "''")
    End Function

    'muffu -Saturday, May 19, 2007 converting the NaN or Inifinty with Zero
    ''' <summary>
    ''' parses the object value for infinity and not an Number (NaN) and replace it by Zero
    ''' </summary>
    ''' <param name="o"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function NaNToDouble(ByVal o As Object) As Double
        Dim pdValue As Double = NullToDouble(o)
        If Double.IsNaN(pdValue) = True OrElse Double.IsInfinity(pdValue) = True Then
            Return 0.0
        Else
            Return pdValue
        End If
    End Function

    'Abhishek/22-May-2007
    ''' <summary>
    ''' Gets time part form a date
    ''' </summary>
    ''' <param name="wholeDate"></param>
    ''' <returns>Date</returns>
    ''' <remarks></remarks>
    Public Shared Function GetTimePartFromDate(ByVal wholeDate As Date) As Date
        Dim pdtTime As Date
        pdtTime = pdtTime.Add(New TimeSpan(wholeDate.Hour, wholeDate.Minute, wholeDate.Second))
        Return pdtTime
    End Function

    Public Shared Function ConvertArrayToINStringClause(ByVal array As String()) As String
        Dim pobjSbldr As New System.Text.StringBuilder
        For piLoop As Integer = 0 To array.GetLength(0) - 1
            If piLoop < array.GetLength(0) - 1 Then
                pobjSbldr.Append("'" & array(piLoop) & "', ")
            Else
                pobjSbldr.Append("'" & array(piLoop) & "'")
            End If
        Next

        Return pobjSbldr.ToString

    End Function
    'parag 09-sept-2009
    ''' <summary>
    ''' Returns minimum supported sql server date
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared ReadOnly Property MinSQLDate() As Date
        Get
            Return DateSerial(1753, 1, 1)
        End Get
    End Property

    ''' <summary>
    ''' Parag 08 oct 09 Scr 17405
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared ReadOnly Property QuantityDecimalPlaces() As Integer
        Get
            Dim piDecimalPlaces As Integer
            'TODO: Need to change path to read default values
            'piDecimalPlaces = CInt(ConfigurationData.GetAppSectionValue("QuantityDecimalPlaces"))
            Return piDecimalPlaces
        End Get
    End Property

    Public Shared Function MinutesToTime(ByVal Minuts As Double) As String
        Dim piHours As Integer
        Dim piMinuts As Integer
        Dim psMinuts As String = ""
        If Minuts <> 0 Then
            piHours = CType(Fix(Minuts / 60), Integer)
            piMinuts = CType(Minuts - (piHours * 60), Integer)

            'psMinuts = CType(piHours, String) + ":" + CType(piMinuts, String)
            'Muffu 22 Sept 2007
            'To format the date and time
            psMinuts = Format(piHours, "00") + ":" + Format(piMinuts, "00")
        Else
            psMinuts = "00:00"
        End If 'If Minuts <> 0 Then

        Return psMinuts

    End Function 'MinutsoTime(ByVal Minuts As Double) As String

#Region "Time functions"

    ''' <summary>
    ''' Convert DD:HH:MM Time Format into Number of Minutes
    ''' </summary>
    ''' <param name="DaysAndHours"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' MUFFU
    Public Shared Function DaysToMinutes(ByVal DaysAndHours As String) As Double
        Dim psDaysAndHours As String

        Dim psDays As String
        Dim psHours As String
        Dim psMinuts As String
        Dim piDays As Integer
        Dim piHours As Integer
        Dim piMinuts As Integer
        Dim piTotalMinuts As Double = 0

        psDaysAndHours = DaysAndHours
        If Not psDaysAndHours Is Nothing And psDaysAndHours.Trim <> ":" And psDaysAndHours <> "" Then
            psDays = psDaysAndHours.Substring(0, 2)
            psHours = psDaysAndHours.Substring(3, 2)
            psMinuts = psDaysAndHours.Substring(6, 2)

            If psDays <> "" Then
                piDays = CType(psDays, Integer)
            End If
            If psHours <> "" Then
                piHours = CType(psHours, Integer)
            End If
            If psMinuts <> "" Then
                piMinuts = CType(psMinuts, Integer)
            End If
            piTotalMinuts = piDays * 1440 + piHours * 60 + piMinuts
        End If

        Return piTotalMinuts
    End Function

    ''' <summary>
    ''' Returns DD:HH:MM Time Format String
    ''' </summary>
    ''' <param name="Minuts">Number of minutes</param>
    ''' <returns>Time in DD:HH:MM Format String</returns>
    ''' <remarks></remarks>
    ''' MUFFU
    Public Shared Function MinutesToDays(ByVal Minuts As Double) As String
        Dim piDays As Integer
        Dim piHours As Double
        Dim piMinuts As Integer
        Dim psMinuts As String = ""
        If Minuts <> 0 Then
            piDays = CType(Fix(Minuts / 1440), Integer)
            piHours = CType((Fix(Minuts - (piDays * 1440)) / 60), Double)
            If piHours < 1 Then
                piHours = 0
            Else
                piHours = Fix(piHours)
            End If
            piMinuts = CType(Minuts - (piHours * 60 + piDays * 1440), Integer)
            'Muffu 22 Sept 2007
            'To format the date and time
            'psMinuts = CType(piDays, String) + ":" + CType(piHours, String) + ":" + CType(piMinuts, String)
            psMinuts = Format(piDays, "00") + ":" + Format(piHours, "00") + ":" + Format(piMinuts, "00")
        Else
            psMinuts = "00:00:00"
        End If 'If Minuts <> 0 Then

        Return psMinuts

    End Function 'MinutsoTime(ByVal Minuts As Double) As String

    ''' <summary>
    ''' Returns Time (Valid range 00:00 to 23:59) in HH:MM Format String
    ''' </summary>
    ''' <param name="timeInMinutes">Number of Minutes</param>
    ''' <returns>Time in HH:MM Format</returns>
    ''' <remarks></remarks>
    ''' <exception cref="System.ApplicationException">Throws ApplicationException if invalid value is entered</exception>
    ''' RAVEENDRA 
    Public Shared Function ConvertMinutesToTimeHHMMFormat(ByVal timeInMinutes As Integer) As String
        If IsValidClockTime(timeInMinutes) = False Then
            Throw New ApplicationException("time in Minutes should be between 0 to 1439")
        End If

        Dim piHours As Integer
        Dim piMinutes As Integer
        piHours = timeInMinutes \ 60
        piMinutes = timeInMinutes Mod 60
        Return Format(piHours, "00") & ":" & Format(piMinutes, "00")
    End Function

    ''' <summary>
    ''' Returns Time (Duration in Minutes) in HH:MM Format String
    ''' </summary>
    ''' <param name="timeInMinutes">Number of Minutes</param>
    ''' <returns>Time (Duration) in HH:MM Format</returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA
    ''' 
    Public Shared Function ConvertMinutesToDurationHHMMFormat(ByVal timeInMinutes As Integer) As String
        Dim piHours As Integer
        Dim piMinutes As Integer

        piHours = timeInMinutes \ 60
        piMinutes = timeInMinutes Mod 60

        Return Format(piHours, "00") & ":" & Format(piMinutes, "00")
    End Function





    ''' <summary>
    ''' 
    ''' </summary>
    ''' <param name="timeString">Time in string format</param>
    ''' <returns>Time (Duration) in HH:MM Format</returns>
    ''' <remarks></remarks>
    Public Shared Function ConvertTimeStringtoHHMMTime(ByVal timeString As String) As String
        timeString = If(timeString, "").Trim
        Dim reg As New System.Text.RegularExpressions.Regex("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$")
        If Not reg.IsMatch(timeString) Then

            If timeString.Length < 3 AndAlso timeString.Length > 1 Then
                timeString = timeString + "00"
            End If

            Dim regx As New System.Text.RegularExpressions.Regex("(\d{2})(\d{2})")
            timeString = regx.Replace(timeString, "$1:$2")
        End If
        Return timeString
    End Function

    ''' <summary>
    ''' Convert HH:MM Time Format String into integer
    ''' </summary>
    ''' <param name="timeInMinutes"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 13 AUGUST 2010
    Public Shared Function ConvertTimeMinutesToDouble(ByVal timeInMinutes As String, Optional isvalidate As Boolean = True) As Double
        Dim pdblTimeInMinutes As Double = 0
        If isvalidate = True AndAlso IsValidTimeInHHMMFormat(timeInMinutes) Then
            Dim psArray() As String = timeInMinutes.Split(":"c)

            Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()

            pdblTimeInMinutes = piList(0) * 60 + piList(1)
        ElseIf isvalidate = False Then
            Dim psArray() As String = timeInMinutes.Split(":"c)

            Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()

            pdblTimeInMinutes = piList(0) * 60 + piList(1)
        Else
            Throw New ApplicationException("Time is not in valid Format (HH:MM)")
        End If

        Return pdblTimeInMinutes

    End Function

    ''' <summary>
    ''' Convert HH:MM Time Format String into integer
    ''' Hours value can be from two digits upto six digits
    ''' </summary>
    ''' <param name="timeInMinutes"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 13 AUGUST 2010
    Public Shared Function ConvertDurationMinutesToDouble(ByVal timeInMinutes As String) As Double
        Dim pdblTimeInMinutes As Double = 0

        If String.IsNullOrEmpty(timeInMinutes) Then
            timeInMinutes = "00:00"
        End If

        If IsValidDurationInHHMMFormat(timeInMinutes) Then
            Dim psArray() As String = timeInMinutes.Split(":"c)

            Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()

            pdblTimeInMinutes = piList(0) * 60 + piList(1)
        Else
            Throw New ApplicationException("Time is not in valid Format (HH:MM)")
        End If

        Return pdblTimeInMinutes

    End Function

    ''' <summary>
    ''' Validate HH:MM Time Format String
    ''' </summary>
    ''' <param name="timeInHHMMFormat"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 13 AUGUST 2010
    Public Shared Function IsValidTimeInHHMMFormat(ByVal timeInHHMMFormat As String) As Boolean
        timeInHHMMFormat = If(timeInHHMMFormat, "").Trim
        Dim reg As New System.Text.RegularExpressions.Regex("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$")
        Return reg.IsMatch(timeInHHMMFormat)
    End Function

    ''' <summary>
    ''' Validate HH:MM Time Format String
    ''' </summary>
    ''' <param name="timeInHHMMFormat"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 13 AUGUST 2010
    Public Shared Function IsValidTime(ByVal timeInHHMMFormat As String) As Boolean
        timeInHHMMFormat = If(timeInHHMMFormat, "").Trim
        Dim reg As New System.Text.RegularExpressions.Regex("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$")
        Return reg.IsMatch(timeInHHMMFormat)
    End Function

    ''' <summary>
    ''' Valides if time in minutes if a valid time from midnignt
    ''' all values except from 0 to 1439 are invlid
    ''' </summary>
    ''' <param name="timeInMinutes"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 13 AUGUST 2010
    Public Shared Function IsValidClockTime(ByVal timeInMinutes As Integer) As Boolean
        If 0 <= timeInMinutes AndAlso timeInMinutes <= 1439 Then '(1439 = 23* 60 + 59)
            Return True
        End If
        Return False
    End Function

    ''' <summary>
    ''' Validate Time Duration in HH:MM Format String
    ''' </summary>
    ''' <param name="timeInHHMMFormat"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 16 AUGUST 2010
    Public Shared Function IsValidDurationInHHMMFormat(ByVal timeInHHMMFormat As String) As Boolean
        timeInHHMMFormat = If(timeInHHMMFormat, "").Trim
        Dim reg As New System.Text.RegularExpressions.Regex("^([0-9]{1,6}):([0-5][0-9])$")
        Return reg.IsMatch(timeInHHMMFormat)
    End Function

    '-----------Bhupendra Singh 23-SEP-2013---------
    '----------------Start---------------
    Public Shared Function IsValidURL(ByVal url As String) As Boolean
        url = If(url, "").Trim
        'Dim reg As New System.Text.RegularExpressions.Regex("^(http(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$")
        'Dim reg As New System.Text.RegularExpressions.Regex("^(https?|ftp|file)://.+$")
        Dim reg As New System.Text.RegularExpressions.Regex("^((https?|ftp)://|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$")
        Return reg.IsMatch(url)
    End Function
    '----------------END-----------------
    ''' <summary>
    ''' Return Time Duration in HH:MM Format String
    ''' </summary>
    ''' <param name="timeInHHMMFormat"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' Bhupendra Singh  ON 3 OCT 2012
    Public Shared Function TimeInHNumFormat(ByVal timeInHHMMFormat As String) As String
        Dim time As String = ""
        If timeInHHMMFormat.Contains(":") Then
            timeInHHMMFormat = timeInHHMMFormat.Replace(":", "")
            timeInHHMMFormat = timeInHHMMFormat.Trim
        End If
        Dim reg As New System.Text.RegularExpressions.Regex("\d+")
        Dim m As System.Text.RegularExpressions.Match
        m = reg.Match(timeInHHMMFormat)
        time = m.Value
        Return time
    End Function

    Public Shared Function TimeInHHMM(ByVal time As String, ByVal mask As String, ByVal tempTime As String) As String
        Dim timeFormatHHMM As String = ""
        If mask = "00:00" Then

            Dim sHour As String = "00"
            Dim sMinutes As String = "00"
            If time.Length = 4 Then
                sHour = time.Substring(0, 2)
                sMinutes = time.Substring(2, 2)
            ElseIf time.Length = 3 Then
                sHour = "0" & time.Substring(0, 1)
                sMinutes = time.Substring(1, 2)
            ElseIf time.Length = 2 Then
                sHour = "00"
                sMinutes = time
            ElseIf time.Length = 1 Then
                sHour = "00"
                sMinutes = time
            ElseIf time.Length >= 5 Then
                sHour = time.Substring(time.Length - 4, 2)
                sMinutes = time.Substring(time.Length - 2, 2)
            End If
            Dim piHours As Integer = NullToInteger(sHour)
            Dim piMinutes As Integer = NullToInteger(sMinutes)
            If piHours >= 24 Or piMinutes >= 60 Then
                timeFormatHHMM = tempTime
            Else
                timeFormatHHMM = Format(piHours, "00") & ":" & Format(piMinutes, "00")
            End If


        ElseIf mask = "12:00AM" Then
            Dim sHour As String = "12"
            Dim sMinutes As String = "00"
            Dim pStr As String = ""
            If time.Length = 4 Then
                sHour = time.Substring(0, 2)
                sMinutes = time.Substring(2, 2)

            ElseIf time.Length = 3 Then
                sHour = "0" & time.Substring(0, 1)
                sMinutes = time.Substring(1, 2)
            ElseIf time.Length = 2 Then
                sMinutes = time
            ElseIf time.Length = 1 Then
                sMinutes = time
                pStr = "PM"
            ElseIf time.Length >= 5 Then
                sHour = time.Substring(time.Length - 4, 2)
                sMinutes = time.Substring(time.Length - 2, 2)
            End If
            Dim piHours As Integer = NullToInteger(sHour)
            Dim piMinutes As Integer = NullToInteger(sMinutes)
            If piHours = 12 Then
                pStr = "PM"
            ElseIf piHours > 12 And piHours < 24 Then
                piHours = piHours - 12
                pStr = "PM"
            ElseIf piHours = 0 Then
                piHours = 12
                pStr = "AM"
            Else
                pStr = "AM"
            End If
            If piHours >= 24 Or piMinutes >= 60 Then
                timeFormatHHMM = tempTime
            Else
                timeFormatHHMM = Format(piHours, "00") & ":" & Format(piMinutes, "00") + pStr
            End If


        ElseIf mask = "12:00" Then
            'Bhupendra Singh 30-OCT-2012---------
            '----------Start-----------------------
            Dim sHour As String = "00"
            Dim sMinutes As String = "00"
            If time.Length = 4 Then
                sHour = time.Substring(0, 2)
                sMinutes = time.Substring(2, 2)
            ElseIf time.Length = 3 Then
                sHour = "0" & time.Substring(0, 1)
                sMinutes = time.Substring(1, 2)
            ElseIf time.Length = 2 Then
                sHour = "00"
                sMinutes = time
            ElseIf time.Length = 1 Then
                sHour = "00"
                sMinutes = time
            ElseIf time.Length >= 5 Then
                sHour = time.Substring(0, time.Length - 2)
                sMinutes = time.Substring(time.Length - 2, 2)
            End If
            Dim piHours As Integer = NullToInteger(sHour)
            Dim piMinutes As Integer = NullToInteger(sMinutes)
            If piMinutes > 60 Then
                timeFormatHHMM = tempTime
            Else
                timeFormatHHMM = Format(piHours, "00") & ":" & Format(piMinutes, "00")
            End If
            '----------End-------------------------

            'Dim piHours As Integer
            'Dim piMinutes As Integer
            'Dim intTime As Integer
            'intTime = NullToInteger(time)
            'piHours = intTime \ 60
            'piMinutes = intTime Mod 60

            'timeFormatHHMM = Format(piHours, "00") & ":" & Format(piMinutes, "00")
        End If

        Return timeFormatHHMM
    End Function

    '-----------Bhupendra Singh 3-OCT-2012----------------
    '----------------Function For validate Time in HH:MM
    Public Shared Function IsValidDurationHHMM(ByVal timeInHHMMFormat As String, ByVal mask As String) As Boolean

        timeInHHMMFormat = If(timeInHHMMFormat, "").Trim
        Dim pattern As String = ""
        If mask = "00:00" Then
            pattern = "^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$"
        ElseIf mask = "12:00AM" Then
            pattern = "^((0?[1-9])|(1[0-2]))(((:|\s)[0-5]+[0-9]+))[A|a|P|p][M|m]$"
        ElseIf mask = "12:00" Then
            pattern = "^([0-9]{1,6}):([0-5][0-9])$"
        End If

        Dim reg As New System.Text.RegularExpressions.Regex(pattern)
        Return reg.IsMatch(timeInHHMMFormat)
    End Function
    '-----------------------End---------------------------
#End Region

    ''' <summary>
    ''' Convert integer value to enum value
    ''' </summary>
    ''' <typeparam name="T">Type of Enum</typeparam>
    ''' <typeparam name="U">Type of Value to be converted</typeparam>
    ''' <param name="value">Value to be converted</param>
    ''' <param name="defaultValue">Default Value to be return</param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' Raveendra on 23 Sep 2010
    Public Shared Function IntToEnum(Of T, U)(ByVal value As U, ByVal defaultValue As T) As T
        Dim enumValue As T
        If ([Enum].IsDefined(GetType(T), value)) Then
            enumValue = DirectCast(DirectCast(value, Object), T)
        Else
            enumValue = defaultValue
        End If

        Return enumValue
    End Function

    Public Shared Function IntToEnum(Of T)(ByVal value As Integer, ByVal defaultValue As T) As T
        Dim enumValue As T
        If ([Enum].IsDefined(GetType(T), value)) Then
            enumValue = DirectCast(DirectCast(value, Object), T)
        Else
            enumValue = defaultValue
        End If

        Return enumValue
    End Function

#Region "FileOpenDialog"

   

    


    

#End Region


#Region "FolderOpenDialog"

    
   

#End Region

#Region "SaveOpenDialog"





#End Region

#Region "Reflection"


#End Region

    '=============== Decimal Setting Code==============


    Public Shared Function IsNullableType(ByVal vobjType As System.Type) As Boolean
        Return (vobjType.IsGenericType) AndAlso (vobjType.GetGenericTypeDefinition() Is GetType(Nullable(Of )))
    End Function
    Public Shared Function GetTypeFromNullable(ByVal vobjType As System.Type) As System.Type
        Return Nullable.GetUnderlyingType(vobjType)
    End Function

#Region "Current Local Decimal Setting "
    ''' <summary>
    ''' This function will return invariant (culture insensitive string value of respective date type(double, decimal, date, datetime, integer, string)
    ''' </summary>
    ''' <param name="vObj"> valid object of type date, datetime, decimal, double, string, integer etc. </param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetInvariantLocalXMLString(vObj As Object, vobjType As System.Type) As String

        Dim stringVal As String = ""
        Select Case True
            Case IsNullableType(vobjType)
                Dim underLyingType As System.Type = GetTypeFromNullable(vobjType)
                Select Case True
                    Case underLyingType Is GetType(System.Decimal)
                        stringVal = NullToDecimal(vObj).ToString(System.Globalization.CultureInfo.InvariantCulture)
                    Case underLyingType Is GetType(System.Double)
                        stringVal = NullToDecimal(vObj).ToString(System.Globalization.CultureInfo.InvariantCulture)
                    Case underLyingType Is GetType(System.DateTime)
                        If vObj IsNot Nothing Then
                            stringVal = GetDateSerialized(NullToDate(vObj))
                        Else
                            stringVal = ""
                        End If
                    Case underLyingType Is GetType(System.Int16)
                        stringVal = NullToInteger(vObj).ToString()
                    Case underLyingType Is GetType(System.Int32)
                        stringVal = NullToInteger(vObj).ToString()
                    Case underLyingType Is GetType(System.Int64)
                        stringVal = NullToInteger(vObj).ToString()
                    Case Else
                        stringVal = NullToString(vObj).ToString()
                End Select

            Case vobjType Is GetType(System.Decimal) OrElse _
                vobjType Is GetType(System.Double)
                stringVal = NullToDecimal(vObj).ToString(System.Globalization.CultureInfo.InvariantCulture)
            Case TypeOf vObj Is Date OrElse TypeOf vObj Is DateTime
                stringVal = GetDateSerialized(NullToDate(vObj))
            Case TypeOf vObj Is Integer
                stringVal = NullToInteger(vObj).ToString
            Case TypeOf vObj Is String
                stringVal = NullToString(vObj).Trim
            Case Else
                stringVal = ""
        End Select

        Return stringVal
    End Function

    Public Shared Function GetInvariantLocalXMLString(vObj As Object) As String
        Dim stringVal As String = "0"
        If TypeOf vObj Is Decimal OrElse TypeOf vObj Is Double _
            OrElse TypeOf vObj Is Nullable(Of Double)() OrElse TypeOf vObj Is Nullable(Of Decimal)() Then
            stringVal = NullToDecimal(vObj).ToString(System.Globalization.CultureInfo.InvariantCulture)
        End If

        Return stringVal
    End Function


#End Region


    ''' <summary>
    ''' Returns numeric string in current culture locale from SAP locale. This function swaps SAP locale decimal and thousand separator with current culture decimal and thousand separator from the numeric string.
    ''' </summary>
    ''' <param name="vSAPLocaleNumberString">numeric string in SAP Locale.</param>
    ''' <param name="rCompany">company object to read decimal and thousand separator</param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    'Public Shared Function GetCultureLocaleNumericString(ByVal vSAPLocaleNumberString As String, ByRef rCompany As Manufacturing.Common.Company) As String
    '    Try
    '        If Not String.IsNullOrWhiteSpace(vSAPLocaleNumberString) Then
    '            Return GetCurrentCultureLocaleNumStrFromInvariantStr(vSAPLocaleNumberString)
    '        Else
    '            Return "0"
    '        End If
    '    Catch ex As Exception
    '        ErrorLogging.LogError(ex)
    '        Return vSAPLocaleNumberString
    '    End Try
    'End Function

    ''' <summary>
    ''' Returns numeric string in current culture locale from invariant culture locale. 
    ''' </summary>
    ''' <param name="vInvariantNumberString">numeric string in invariant culture Locale.</param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetCurrentCultureLocaleNumStrFromInvariantStr(ByVal vInvariantNumberString As String) As String
        Try
            If Not String.IsNullOrWhiteSpace(vInvariantNumberString) Then
                Dim cltCurrentCulture As System.Globalization.CultureInfo
                cltCurrentCulture = System.Globalization.CultureInfo.CreateSpecificCulture(System.Globalization.CultureInfo.CurrentCulture.Name)
                Dim currentCultureDecimalSeparator As String = cltCurrentCulture.NumberFormat.NumberDecimalSeparator
                Dim currentCultureThousandSeparator As String = cltCurrentCulture.NumberFormat.NumberGroupSeparator
                Dim pCurrentCultureNumberString As String = ""

                For Each c As Char In vInvariantNumberString
                    If c = "."c Then
                        c = CType(currentCultureDecimalSeparator, Char)
                    ElseIf c = ","c Then
                        c = CType(currentCultureThousandSeparator, Char)
                    End If
                    pCurrentCultureNumberString = String.Concat(pCurrentCultureNumberString, c)
                Next
                Return pCurrentCultureNumberString
            Else
                Return vInvariantNumberString
            End If
        Catch ex As Exception
            ErrorLogging.LogError(ex)
            Return vInvariantNumberString
        End Try
    End Function

    '=============== Decimal Setting Code==============

    ''' <summary>
    ''' Check whether given value is numeric or not on Current Culture
    ''' </summary>
    ''' <param name="val"></param>
    ''' <param name="numberStyle"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' RAVEENDRA ON 27 OCT 2010
    Public Shared Function IsNumeric(ByVal val As String, ByVal numberStyle As System.Globalization.NumberStyles) As Boolean
        Dim result As Double
        Return Double.TryParse(val, numberStyle, System.Globalization.CultureInfo.CurrentCulture, result)
    End Function

    Public Shared Function AllowKeyDown(ByVal viCharPressed As Integer) As Boolean
        If ((viCharPressed > 31 AndAlso viCharPressed < 127) OrElse viCharPressed = 8 OrElse viCharPressed = 36) _
            AndAlso viCharPressed <> 9 Then
            Return False
        End If
        Return True
    End Function

    Public Shared ReadOnly Property ResourcePath() As String
        Get
            'Gopal/Nov-27-13---------------Start
            'Return String.Concat(MyApplicationPath, "\", System.Configuration.ConfigurationManager.AppSettings.Get("ResourcePath"))

            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ResourcePath")
            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\BMMResource.MDB"
            End If

            Return String.Concat(MyApplicationPath, "\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property

    Public Shared ReadOnly Property ServerResourcePath() As String
        Get
            'Gopal/Nov-27-13---------------Start
            ''Vaibhav 7-Sep-2013 changed server installation path
            ''Return String.Concat("\B1_SHR\Addon\BMM\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            'Return String.Concat("\BMM_B1_SHR\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath")

            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\BMMResource.mdb"
            End If

            Return String.Concat("\B1_SHF\BMM_B1_SHR\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property

    'Vaibhav 09-Apr-2014 --------------Start
    Public Shared ReadOnly Property ResourceXMLPath() As String
        Get
            'Gopal/Nov-27-13---------------Start
            'Return String.Concat(MyApplicationPath, "\", System.Configuration.ConfigurationManager.AppSettings.Get("ResourcePath"))

            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ResourceXMLPath")
            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\BMMResource.xml"
            End If

            Return String.Concat(MyApplicationPath, "\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property

    'Mohammad Nadeem/25June-14
    Public Shared ReadOnly Property ResourceXMLPathMSDSResource() As String
        Get
            'Gopal/Nov-27-13---------------Start
            'Return String.Concat(MyApplicationPath, "\", System.Configuration.ConfigurationManager.AppSettings.Get("ResourcePath"))

            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourceXMLPathMSDSResource")
            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\_MSDSResource.xml"
            End If

            Return String.Concat(MyApplicationPath, "\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property
    Public Shared ReadOnly Property ResourceXMLPathMSDSControlCaptions() As String
        Get
            'Gopal/Nov-27-13---------------Start
            'Return String.Concat(MyApplicationPath, "\", System.Configuration.ConfigurationManager.AppSettings.Get("ResourcePath"))

            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourceXMLPathMSDSControlCaptions")
            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\ControlCaptionMSDS.xml"
            End If

            Return String.Concat(MyApplicationPath, "\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property
    'Mohammad Nadeem/25June-14


    Public Shared ReadOnly Property ServerResourceXMlPath() As String
        Get
            'Gopal/Nov-27-13---------------Start
            ''Vaibhav 7-Sep-2013 changed server installation path
            ''Return String.Concat("\B1_SHR\Addon\BMM\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            'Return String.Concat("\BMM_B1_SHR\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourceXMLPath")

            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\BMMResource.xml"
            End If
            Return String.Concat("\B1_SHF\BMM_B1_SHR\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property

    'Mohammad Nadeem/25June-14,Property for External exe resource
    Public Shared ReadOnly Property ServerResourceXMlPathForMSDSResource() As String
        Get
            'Gopal/Nov-27-13---------------Start
            ''Vaibhav 7-Sep-2013 changed server installation path
            ''Return String.Concat("\B1_SHR\Addon\BMM\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            'Return String.Concat("\BMM_B1_SHR\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourceXMLPathMSDSResource")

            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\_MSDSResource.xml"
            End If
            Return String.Concat("\B1_SHF\BMM_B1_SHR\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property
    Public Shared ReadOnly Property ServerResourceXMlPathForMSDSControlCaptions() As String
        Get
            'Gopal/Nov-27-13---------------Start
            ''Vaibhav 7-Sep-2013 changed server installation path
            ''Return String.Concat("\B1_SHR\Addon\BMM\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            'Return String.Concat("\BMM_B1_SHR\", System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourcePath"))
            Dim resPath As String = System.Configuration.ConfigurationManager.AppSettings.Get("ServerResourceXMLPathMSDSControlCaptions")

            If String.IsNullOrWhiteSpace(resPath) Then
                resPath = "Resource\ControlCaptionMSDS.xml"
            End If
            Return String.Concat("\B1_SHF\BMM_B1_SHR\", resPath)
            'Gopal/Nov-27-13---------------End
        End Get
    End Property
    'Mohammad Nadeem/25June-14

    'Vaibhav 09-Apr-2014 --------------End

    ' ''' <summary>
    ' ''' Check whether given value is numeric or not on specified culture
    ' ''' </summary>
    ' ''' <param name="val"></param>
    ' ''' <param name="numberStyle"></param>
    ' ''' <returns></returns>
    ' ''' <remarks></remarks>
    ' ''' RAVEENDRA ON 27 OCT 2010
    'Public Shared Function IsNumeric(ByVal val As String, ByVal numberStyle As System.Globalization.NumberStyles, ByVal culture As System.Globalization.CultureInfo) As Boolean
    '    Dim result As Double
    '    Return Double.TryParse(val, numberStyle, culture, result)
    'End Function

#Region "RoundToSAPB1Defaults"
    'Gopal/March-03-12


    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's quantity decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToQuantityDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.QuantityDecimalPlaces)
    '    Else
    '        Return value
    '    End If

    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's price decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToPriceDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.PriceDecimalPlaces)
    '    Else
    '        Return value
    '    End If
    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's rates decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToRatesDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.RatesDecimalPlaces)
    '    Else
    '        Return value
    '    End If
    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's amount decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToAmountDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.AmountsDecimalPlaces)
    '    Else
    '        Return value
    '    End If
    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's query decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToQueryDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return (Math.Round(value, company.CompanyDefaults.QueryDecimalPlaces))
    '    Else
    '        Return value
    '    End If
    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's percent decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToPercentDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.PercentDecimalPlaces)
    '    Else
    '        Return value
    '    End If
    'End Function

    ' ''' <summary>
    ' ''' Round given value to SAP B1 default setting's unit decimals
    ' ''' </summary>
    ' ''' <param name="value"></param>
    ' ''' <param name="company"></param>
    ' ''' <remarks></remarks>
    'Public Shared Function RoundToUnitsDecimals(ByVal value As Decimal, ByVal company As Manufacturing.Common.Company) As Decimal
    '    If company IsNot Nothing AndAlso company.CompanyDefaults IsNot Nothing Then
    '        Return Math.Round(value, company.CompanyDefaults.UnitsDecimalPlaces)
    '    Else
    '        Return value
    '    End If
    'End Function

#End Region

    Public Const BmmBusinessDll As String = "BMM_Business.dll"

    ''' <summary>
    ''' Get all the types from given assembly name.
    ''' </summary>
    ''' <param name="assName"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetAssemblyTypes(ByVal assName As String) As Dictionary(Of String, String)

        Dim dic As New Dictionary(Of String, String)
        Dim assemblyPath As String
        Dim typesInAssembly As Type()
        Dim docName As String

        If String.IsNullOrWhiteSpace(assName) Or IsNothing(assName) Then
            assemblyPath = Utilites.MyApplicationPath & "\" & BmmBusinessDll
        Else
            assemblyPath = assName
        End If
        Dim MyAssembly As System.Reflection.Assembly = System.Reflection.Assembly.LoadFrom(assemblyPath)

        typesInAssembly = MyAssembly.GetTypes()

        'If AssemblyPath = Utilites.MyApplicationPath & "\BMM_Business.dll" Then
        If assemblyPath.ToString.ToUpper.Contains(BmmBusinessDll.ToUpper) Then
            For pictr As Integer = 0 To typesInAssembly.Count - 1
                If typesInAssembly(pictr).Name.Contains("Manager") Then
                    docName = typesInAssembly(pictr).[Namespace] + "." + typesInAssembly(pictr).Name
                    If Not dic.ContainsKey(docName) Then
                        dic.Add(docName, docName)
                    End If
                End If
            Next

        Else

            For pictr As Integer = 0 To typesInAssembly.Count - 1
                'If TypesInAssembly(pictr).Name.Contains("Manager") Then
                docName = typesInAssembly(pictr).[Namespace] + "." + typesInAssembly(pictr).Name
                If Not dic.ContainsKey(docName) Then
                    dic.Add(docName, docName)
                End If
                'End If
            Next

        End If

        Return dic
    End Function

    ''' <summary>
    ''' Get all the methods in the given assembly and type.
    ''' </summary>
    ''' <param name="docName"></param>
    ''' <param name="assName"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetTypeMethods(ByVal docName As String, ByVal assName As String) As Dictionary(Of String, String)
        Dim dic As New Dictionary(Of String, String)
        Dim AssemblyPath As String
        If String.IsNullOrWhiteSpace(assName) Or IsNothing(assName) Then
            AssemblyPath = Utilites.MyApplicationPath & "\" & BmmBusinessDll
        Else
            AssemblyPath = assName
        End If
        Dim MyAssembly As System.Reflection.Assembly = System.Reflection.Assembly.LoadFrom(AssemblyPath)
        Dim MethodsCollection As System.Reflection.MethodInfo() = MyAssembly.GetType(docName).GetMethods()
        For Each m As MethodInfo In MethodsCollection
            If Not dic.ContainsKey(m.Name) Then
                dic.Add(m.Name, m.Name)
            End If
        Next
        Return dic
    End Function

    ''' <summary>
    ''' Gets all files fileinfo in the given directory path with all the comma seperated extension list.
    ''' </summary>
    ''' <param name="dirPath"></param>
    ''' <param name="ext"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' Gopal/June-30-11
    Public Shared Function GetFiles(dirPath As String, ext As String) As FileInfo()
        ' Pointer to our directory 

        If dirPath Is Nothing Then
            Return Nothing
        End If

        Dim dinfo As New DirectoryInfo(dirPath)
        Dim exts As String() = ext.Split(","c)
        Dim finfo As FileInfo()() = New FileInfo(exts.Length - 1)() {}
        Dim i As Integer = 0

        For Each e As String In exts
            ' get files from the directory as a files collection 

            finfo(i) = dinfo.GetFiles(e)
            i += 1
        Next

        Dim tlength As Integer = 0

        For i = 0 To finfo.Length - 1
            tlength += finfo(i).Length
        Next

        Dim res As FileInfo() = New FileInfo(tlength - 1) {}
        Dim j As Integer = 0
        Dim rindex As Integer = 0

        For i = 0 To finfo.Length - 1
            For j = 0 To finfo(i).Length - 1
                res(rindex) = finfo(i)(j)
                rindex += 1
            Next
        Next

        Return res
    End Function


    Public Shared Sub SearchFile(ByVal fileTosearch As String, ByVal fileExtension As String, ByRef searchedFilePath As String)
        For Each drive As DriveInfo In My.Computer.FileSystem.Drives
            If drive.DriveType = DriveType.Fixed Then
                For Each d As String In Directory.GetDirectories(drive.Name)
                    DirSearch(d, fileTosearch, fileExtension, searchedFilePath)
                Next
            End If
        Next

    End Sub

    Public Shared Sub DirSearch(ByVal sDir As String, ByVal fileTosearch As String, ByVal fileExtension As String, ByRef searchedFilePath As String)
        Dim dir As String
        Dim dirfile As String
        Try
            For Each dir In Directory.GetDirectories(sDir)
                For Each dirfile In Directory.GetFiles(dir, fileExtension)
                    If dirfile.ToUpper.Contains(fileTosearch.ToUpper) Then
                        searchedFilePath = dirfile
                    End If
                Next
                DirSearch(dir, fileTosearch, fileExtension, searchedFilePath)
            Next
        Catch ex As Exception

        End Try
    End Sub

    'Const currentAssemblyKey As String = "CurrentReflectionAssemblyBase"

    'Private Function ReflectionOnlyLoadFrom(assemblyPath As String) As Assembly

    '    Dim currentAd As AppDomain = AppDomain.CreateDomain("TestDomain")
    '    Dim customResolveHandler As New ResolveEventHandler(AddressOf CustomReflectionOnlyResolver)

    '    'currentAd.ReflectionOnlyAssemblyResolve, AddressOf customResolveHandler
    '    AddHandler currentAd.ReflectionOnlyAssemblyResolve, customResolveHandler

    '    ' Store the base directory from which we're loading in ALS
    '    currentAd.SetData(currentAssemblyKey, Path.GetDirectoryName(assemblyPath))

    '    ' Now load the assembly, and force the dependencies to be resolved
    '    Dim assembly__1 As Assembly = Assembly.ReflectionOnlyLoadFrom(assemblyPath)
    '    Dim types As Type() = assembly__1.GetTypes()

    '    ' Lastly, reset the ALS entry and remove our handler
    '    currentAd.SetData(currentAssemblyKey, Nothing)
    '    RemoveHandler currentAd.ReflectionOnlyAssemblyResolve, customResolveHandler

    '    Return assembly__1
    'End Function

    'Private Function CustomReflectionOnlyResolver(sender As Object, e As ResolveEventArgs) As Assembly
    '    Dim name As New AssemblyName(e.Name)
    '    Dim assemblyPath As String = Path.Combine(DirectCast(AppDomain.CurrentDomain.GetData(currentAssemblyKey), String), name.Name + ".dll")

    '    If File.Exists(assemblyPath) Then
    '        ' The dependency was found in the same directory as the base
    '        Return Assembly.ReflectionOnlyLoadFrom(assemblyPath)
    '    Else
    '        ' Wasn't found on disk, hopefully we can find it in the GAC...
    '        Return Assembly.ReflectionOnlyLoad(name.Name)
    '    End If
    'End Function


    'Gopal/Nov-11-11
    '----------------------------
    Public Shared Function GetReportPath() As String
        Dim pbSuccess As Boolean = True
        Dim rptPath As String
        rptPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\BMMSAP\"
        If IO.Directory.Exists(rptPath & "\Report") = False Then
            Try
                IO.Directory.CreateDirectory(rptPath & "\Report")
                'rptPath = rptPath & "\Report"
            Catch ex As Exception
                Return ""
            End Try
        End If
        rptPath = rptPath & "\Report"
        Return rptPath

    End Function

    Public Shared Sub EncodeFile(ByVal filename As String, ByRef buf As Byte())
        Dim ofile As FileStream
        Dim fileSize As Integer
        ofile = New FileStream(filename, System.IO.FileMode.Open)
        fileSize = CInt(ofile.Length)

        buf = New Byte(fileSize - 1) {}
        Dim br As New BinaryReader(ofile)
        buf = br.ReadBytes(fileSize)
        ofile.Close()


    End Sub

    Public Shared Function DecodeFile(ByVal filename As String, ByVal buf As Byte()) As String

        Dim ofile As FileStream
        Dim rptname As String
        Dim rptPath As String
        rptname = filename 'System.IO.Path.GetFileName(filename)
        rptPath = GetReportPath()
        rptPath = rptPath & "\" & rptname
        ofile = New FileStream(rptPath, System.IO.FileMode.Create)
        ofile.Write(buf, 0, buf.Length)
        ofile.Close()
        Return rptPath
    End Function

    Public Shared Function DecodeFile(ByVal filename As String, ByVal buf As Byte(), ByVal path As String) As String

        Dim ofile As FileStream
        Dim rptname As String
        Dim rptPath As String
        rptname = filename 'System.IO.Path.GetFileName(filename)
        rptPath = path & "\" & rptname
        ofile = New FileStream(rptPath, System.IO.FileMode.Create)
        ofile.Write(buf, 0, buf.Length)
        ofile.Close()
        Return rptPath
    End Function
#Region "DDHHMM Format"
    Public Shared Function ConvertMinutesToTimeDDHHMMFormat(ByVal timeInMinutes As Integer) As String
        Dim piHours As Integer
        Dim piMinutes As Integer
        Dim minValue As Integer
        Dim Days As Integer
        Days = timeInMinutes \ 1440
        minValue = timeInMinutes - (Days * 1440)
        piHours = minValue \ 60
        piMinutes = minValue Mod 60

        Return Format(Days, "0000") & ":" & Format(piHours, "00") & ":" & Format(piMinutes, "00")
    End Function

    Public Shared Function IsValidDDHHMMToDouble(ByVal timeInMinutes As String) As Boolean
        Dim Retvalue As Boolean = True
        Dim pdblTimeInMinutes As Integer = 0
        Dim DaysDur As Integer
        If timeInMinutes <> "" Then
            If IsValidTimeInDDHHMMFormat(timeInMinutes) Then
                Dim psArray() As String = timeInMinutes.Split(":"c)

                Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()
                'Ashwin Airen 07-July-2014
                'Scr No. 10611
                'DaysDur = piList(0) * 1400
                DaysDur = piList(0) * 1440
                pdblTimeInMinutes = DaysDur + (piList(1) * 60) + piList(2)
                Retvalue = True
            Else
                Retvalue = False
            End If
        Else
            Retvalue = True
        End If
        Return Retvalue

    End Function

    Public Shared Function ConvertDDHHMMToDouble(ByVal timeInMinutes As String) As Integer
        Dim pdblTimeInMinutes As Integer = 0
        Dim DaysDur As Integer
        If timeInMinutes <> "" Then
            If IsValidTimeInDDHHMMFormat(timeInMinutes) Then
                Dim psArray() As String = timeInMinutes.Split(":"c)

                Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()
                'Ashwin Airen 07-July-2014
                'Scr No. 10611
                'DaysDur = piList(0) * 1400
                DaysDur = piList(0) * 1440
                pdblTimeInMinutes = DaysDur + (piList(1) * 60) + piList(2)
            Else
                Throw New ApplicationException("Time is not in valid Format (DDDD:HH:MM)")
            End If
        End If
        Return pdblTimeInMinutes

    End Function

    Public Shared Function IsValidTimeInDDHHMMFormat(ByVal timeInHHMMFormat As String) As Boolean
        timeInHHMMFormat = If(timeInHHMMFormat, "").Trim
        Dim reg As New System.Text.RegularExpressions.Regex("^([0-9][0-9][0-9][0-9]):([0-1]?[0-9]|2[0-3]):([0-5][0-9])$")
        Return reg.IsMatch(timeInHHMMFormat)
    End Function

#End Region
    '----------------------------


    ''' <summary>
    ''' SAP Date("YYYYMMDD") To System Date
    ''' </summary>
    ''' <param name="vdate">"YYYYMMDD"</param>
    ''' <returns>Date</returns>
    ''' <remarks>SAP Date("YYYYMMDD") To System Date</remarks>
    Public Shared Function ConvertSAPDateToDate(ByVal vdate As String) As Date
        If NullToString(vdate).Trim() = "" Then
            vdate = ConvertDateToSAPDate(Now.Date)
        End If
        Dim pdate As Date
        Dim psyear As String = Left(vdate, 4)
        Dim pMonth As String = Left(Right(vdate, 4), 2)
        Dim pDay As String = Right(vdate, 2)
        pdate = New Date(NullToInteger(psyear), NullToInteger(pMonth), NullToInteger(pDay))
        Return pdate
    End Function

    ''' <summary>
    ''' System Date To SAP Date("YYYYMMDD")
    ''' </summary>
    ''' <param name="vdate">Date</param>
    ''' <returns>String("YYYYMMDD")</returns>
    ''' <remarks>System Date To SAP Date("YYYYMMDD")</remarks>
    Public Shared Function ConvertDateToSAPDate(ByVal vdate As Date) As String
        Dim pdate As String
        Dim psyear As String = vdate.Year.ToString
        Dim pMonth As String
        Dim pDay As String

        If #12:00:00 AM# = vdate Then
            Return ""
        End If
        If vdate.Month.ToString.Length = 1 Then
            pMonth = "0" & vdate.Month.ToString
        Else
            pMonth = vdate.Month.ToString
        End If

        If vdate.Day.ToString.Length = 1 Then
            pDay = "0" & vdate.Day.ToString
        Else
            pDay = vdate.Day.ToString
        End If
        pdate = psyear & pMonth & pDay
        Return pdate
    End Function

    ''' <summary>
    ''' Convert Minute to HH:MM Format
    ''' </summary>
    ''' <param name="timeInMinutes">minutes</param>
    ''' <returns>Return string HH:MM Formate</returns>
    ''' <remarks></remarks>
    Public Shared Function ConvertMinutesToSAPDurationHHMMFormat(ByVal timeInMinutes As Integer) As String
        Dim piHours As Integer
        Dim piMinutes As Integer
        Dim pstimeinminutes As String = timeInMinutes.ToString

        If pstimeinminutes.Length = 4 Then
            piHours = CType(Val(Left(pstimeinminutes, 2)), Integer)
            piMinutes = CType(Val(Right(pstimeinminutes, 2)), Integer)
        ElseIf pstimeinminutes.Length = 3 Then
            piHours = CType(Val(Left(pstimeinminutes, 1)), Integer)
            piMinutes = CType(Val(Right(pstimeinminutes, 2)), Integer)
        ElseIf pstimeinminutes.Length = 2 Or pstimeinminutes.Length = 1 Then
            piMinutes = CType(Val(pstimeinminutes), Integer)
        ElseIf pstimeinminutes.Length > 4 Then
            Return ConvertSAPLongTimeHHMMToMinuteString(timeInMinutes)
        End If

        'piHours = timeInMinutes \ 60
        'piMinutes = timeInMinutes Mod 60

        Return Format(piHours, "00") & ":" & Format(piMinutes, "00")
    End Function


    ''' <summary>
    ''' Covert HH:MM Format To SAP Minute formate (HHMM)
    ''' </summary>
    ''' <param name="timeInMinutes">string (HH:MM)</param>
    ''' <returns>SAP Minute formate (HHMM)</returns>
    ''' <remarks></remarks>
    Public Shared Function ConvertDurationMinutesSAPToDouble(ByVal timeInMinutes As String) As Double
        Dim pdblTimeInMinutes As Double = 0

        If String.IsNullOrEmpty(timeInMinutes) Then
            timeInMinutes = "00:00"
        End If
        If timeInMinutes.ToUpper.EndsWith("M") = True Then ''Added By Nikhilesh Patidar 14 July 2015
            Dim pdtemp As Date = DateTime.Parse(timeInMinutes)
            Dim pshour As String = Format(pdtemp.Hour, "00")
            Dim psminute As String = Format(pdtemp.Minute, "00")
            timeInMinutes = pshour & ":" & psminute
        End If

        pdblTimeInMinutes = CType(Val(timeInMinutes.Replace(":", "")), Double)
        'If IsValidDurationInHHMMFormat(timeInMinutes) Then
        '    Dim psArray() As String = timeInMinutes.Split(":"c)

        '    Dim piList As List(Of Integer) = (From i In psArray Select Integer.Parse(i)).ToList()

        '    pdblTimeInMinutes = piList(0) * 60 + piList(1)
        'Else
        '    Throw New ApplicationException("Time is not in valid Format (HH:MM)")
        'End If

        Return pdblTimeInMinutes

    End Function

    Public Shared Function ConvertSAPTimeMinutesToSystemMinutesDouble(ByVal timeInMinutes As Integer, Optional isvalidate As Boolean = True) As Double
        Return ConvertTimeMinutesToDouble(ConvertMinutesToSAPDurationHHMMFormat(timeInMinutes), isvalidate)
    End Function

    Public Shared Function ConvertSAPTimeDDHHMMToMinuteString(ByVal timevalue As String) As String
        'ConvertMinutesToTimeDDHHMMFormat(.LeadTime)
        Dim pireturntime As Integer = NullToInteger(Val(NullToString(timevalue).Trim.Replace(":", "")))
        Dim psretval As String = Format(pireturntime, "0000:00:00")
        If IsValidTimeInDDHHMMFormat(psretval) = False Then
            psretval = Format(0, "0000:00:00")
        End If
        Return psretval
    End Function

    Public Shared Function ConvertSAPLongTimeHHMMToMinuteString(ByVal timevalue As Integer) As String
        Dim pireturntime As Integer = NullToInteger(timevalue)
        Dim psretval As String = pireturntime.ToString

        If psretval.Length <= 4 Then
            psretval = Format(pireturntime, "00:00")
        Else
            psretval = Left(psretval, psretval.Length - 2) & ":" & Right(psretval, 2)
        End If

        Return psretval
    End Function

    Public Shared Function ConvertMinuitesToSAPDurationTimeFormat(minutes As Double) As Double
        Dim psHHMM As String = MinutesToTime(minutes)
        Return NullToDouble(ConvertDurationMinutesSAPToDouble(psHHMM))
    End Function

    'Public Shared Function GetValueWithSystemCulture(ByVal vtype As System.Type, ByVal value As Object) As Object
    '    Dim pobjretval As Object = Nothing
    '    Select Case vtype.ToString()
    '        Case "System.Decimal", "System.Double"
    '            If String.IsNullOrWhiteSpace(value.ToString) = True Then
    '                pobjretval = 0
    '            Else
    '                pobjretval = value.ToString().Replace(".", Application.CurrentCulture.NumberFormat.CurrencyDecimalSeparator)
    '            End If
    '        Case "System.Date"
    '            pobjretval = ConvertSAPDateToDate(value.ToString.Trim)
    '        Case Else
    '            pobjretval = value
    '    End Select
    '    Return pobjretval
    'End Function

    'Public Shared Function GetValueWithSystemCulture(ByVal vtype As SAPUDFFieldType, ByVal value As Object) As Object
    '    Dim pobjretval As Object = Nothing
    '    Select Case vtype
    '        Case SAPUDFFieldType.ft_Float, SAPUDFFieldType.ft_Measure, SAPUDFFieldType.ft_Percent,
    '            SAPUDFFieldType.ft_Price, SAPUDFFieldType.ft_Quantity, SAPUDFFieldType.ft_Rate, SAPUDFFieldType.ft_Sum
    '            pobjretval = value.ToString().Replace(".", Application.CurrentCulture.NumberFormat.CurrencyDecimalSeparator)
    '        Case SAPUDFFieldType.ft_Date
    '            pobjretval = ConvertSAPDateToDate(value.ToString.Trim)
    '        Case Else
    '            pobjretval = value
    '    End Select
    '    Return pobjretval
    'End Function

    'Public Shared Function ConvertSystemDecimalOrDoubleValueToSAPDecimalOrDoubleValue(ByVal value As Object) As Object
    '    If value IsNot Nothing Then
    '        Return value.ToString().Replace(SystemCultureDecimalSeparator, ".")
    '    Else
    '        Return "0"
    '    End If
    'End Function

    'Public Shared Function ConvertSAPDecimalOrDoubleValueToSystemDecimalOrDoubleValue(ByVal value As Object) As Object
    '    If value IsNot Nothing Then
    '        Return value.ToString().Replace(".", SystemCultureDecimalSeparator)
    '    Else
    '        Return "0"
    '    End If
    'End Function

    Public Shared Function getSAPUDFFieldType(ByVal viindexColType As Integer) As SAPUDFFieldType
        Dim pSAPUDFFieldType As SAPUDFFieldType = SAPUDFFieldType.ft_NotDefined
        Select Case viindexColType
            Case 1
                pSAPUDFFieldType = SAPUDFFieldType.ft_AlphaNumeric
            Case 2
                pSAPUDFFieldType = SAPUDFFieldType.ft_Integer
            Case 3
                pSAPUDFFieldType = SAPUDFFieldType.ft_Text
            Case 4
                pSAPUDFFieldType = SAPUDFFieldType.ft_Date
            Case 5
                pSAPUDFFieldType = SAPUDFFieldType.ft_Float
            Case 6
                pSAPUDFFieldType = SAPUDFFieldType.ft_ShortNumber
            Case 7
                pSAPUDFFieldType = SAPUDFFieldType.ft_Quantity
            Case 8
                pSAPUDFFieldType = SAPUDFFieldType.ft_Price
            Case 9
                pSAPUDFFieldType = SAPUDFFieldType.ft_Rate
            Case 10
                pSAPUDFFieldType = SAPUDFFieldType.ft_Measure
            Case 11
                pSAPUDFFieldType = SAPUDFFieldType.ft_Sum
            Case 12
                pSAPUDFFieldType = SAPUDFFieldType.ft_Percent
            Case Else
                pSAPUDFFieldType = SAPUDFFieldType.ft_NotDefined
        End Select
        Return pSAPUDFFieldType
    End Function


    'Public Shared ReadOnly Property SystemCultureDecimalSeparator() As String
    '    Get
    '        Return Application.CurrentCulture.NumberFormat.NumberDecimalSeparator
    '    End Get
    'End Property

    'Public Shared ReadOnly Property SystemCultureGroupSeparator() As String
    '    Get
    '        Return Application.CurrentCulture.NumberFormat.NumberGroupSeparator
    '    End Get
    'End Property
End Class
'---------------------------------------------------------------------------------------