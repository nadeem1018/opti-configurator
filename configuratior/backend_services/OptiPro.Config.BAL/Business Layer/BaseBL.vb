Imports OptiPro.Config.Service
Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.Common
Imports OptiPro.Config.DAL
Imports Newtonsoft.Json
Imports System.Data
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.ComponentModel
Imports System.Reflection
Imports System.Web
Imports OptiPro.Config.Entity

Imports System.Web.Caching
Imports System.Configuration
Public Class BaseBL
    Public Const SFDClicence = "SFD"
    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
   

    'This Function will get the URL to be hitted for Authentication
    Public Shared Function GetPSURL(ByVal objgetPSURL As BaseModel) As String
        Try
            'Create a String Variable to get the value from DataLayer
            Dim psURLStr As String
            ' Create a DataTable to deserialize the JSON object
            Dim objdtPSURL As DataTable = JsonConvert.DeserializeObject(Of DataTable)(objgetPSURL.GetPSURL)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psURLStr = BaseDL.GetPSURL(objdtPSURL, mObjCompany)
            Return psURLStr
        Catch ex As Exception
            ErrorLogging.LogError(ex)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetMenuRecord(ByVal objgetMenu As BaseModel) As DataTable
        Dim pdGetData As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objgetMenu.GetMenuRecord)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdGetData = BaseDL.GetMenuRecord(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdGetData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

#Region "License Code"

    Public Shared Function BMGFDecrypt(vsPassword) As String
        '****************************************************************************************************
        ' Function Name : BMGFDecrypt
        ' Description   : BMGFDecrypt Password String
        ' Arguments     : Password String , BMEVali String
        '
        ' Return Value  :
        ' Creator       : Deepak Porwal
        ' Modification  :
        ' Modified by   :
        ' Date          : 17/01/2017
        '****************************************************************************************************
        Try
            Dim piLength As Integer
            Dim piCount As Integer
            Dim piMainCounter As Integer
            Dim psStoreChar As String
            Dim psTempStore As String = ""
            Dim psCharPairs() As String

            Dim BMEValiStr As String = "eworkplace"

            piLength = Len(BMEValiStr)
            psCharPairs = Split(vsPassword, " ")

            For piMainCounter = 0 To UBound(psCharPairs) - 1
                piCount = piMainCounter + 1
                psStoreChar = Asc(Mid$(BMEValiStr, (piCount Mod piLength) - piLength * ((piCount Mod piLength) = 0), 1))
                psTempStore = psTempStore & Chr(CInt(psCharPairs(piMainCounter)) - CInt(psStoreChar))
            Next
            BMGFDecrypt = psTempStore
        Catch ex As Exception
            ErrorLogging.LogError(ex.Message)
        End Try
    End Function

    Public Shared Function BMGFEncrypt(vsPassword) As String
        '****************************************************************************************************
        ' Function Name : BMGFEncrypt
        ' Description   : Encrypt Password String
        ' Arguments     : Password String , BMEVali String
        '
        ' Return Value  :
        ' Creator       : Deepak Porwal
        ' Modification  :
        ' Modified by   :
        ' Date          : 17/01/2017
        '****************************************************************************************************
        Try
            Dim piLength As Integer
            Dim piCount As Integer
            Dim psStoreChar As String
            Dim psTempStore As String = ""

            Dim BMEValiStr As String = "eworkplace"

            piLength = Len(BMEValiStr)
            For piCount = 1 To Len(vsPassword)
                psStoreChar = Asc(Mid$(BMEValiStr, (piCount Mod piLength) - piLength * ((piCount Mod piLength) = 0), 1))
                psTempStore = psTempStore & (Asc(Mid$(vsPassword, piCount, 1)) + psStoreChar) & " "
            Next

            BMGFEncrypt = psTempStore
        Catch ex As Exception
            ErrorLogging.LogError(ex)
        End Try
    End Function

    'Public Shared Function GetLicenseData(ByVal oUsername As BaseModel) As DataSet
    '    'Dim pdtdtLicenceData As DataTable = Nothing

    '    Dim pdtdtLicenceData As DataTable = Newtonsoft.Json.JsonConvert.DeserializeObject(Of DataTable)(oUsername.Username)
    '    ' Dim UserId As String = "ashish"
    '    Dim UserId As String = pdtdtLicenceData.Rows(0)("Username").ToString
    '    ' Modifiled by Roopesh Dube - 14 Jun 2017
    '    Dim typ As Type
    '    Dim pobjLicManager As Object
    '    Dim pbValidLicense As Boolean
    '    Dim psErrorString As String = String.Empty
    '    Dim psWarningString As String = String.Empty
    '    Dim pbstatus

    '    Dim g As Guid
    '    Try
    '        ' Create and display the value of two GUIDs.
    '        g = Guid.NewGuid()
    '        Dim pobjLICData As New DataSet
    '        Dim dt As New DataTable
    '        dt.Columns.Add("UserExceed")
    '        dt.Columns.Add("GUID")
    '        dt.Columns.Add("ErrMessage")
    '        Dim appPath As String
    '        pbValidLicense = True
    '        Dim mobjLicenceManager As New OptiProLicenseManager.clsLicManager
    '        'pobjLicManager = CreateObject("BatchMasterLicenseManager.clsLicManager")
    '        pobjLicManager = mobjLicenceManager
    '        If pobjLicManager Is Nothing Then
    '            'Session("LicenceError") = "Cannot Create ActiveX Component - while accessing license"
    '            'Return False
    '        End If
    '        '"..\BMPOSConfiguration"
    '        appPath = AppDomain.CurrentDomain.BaseDirectory & "Configuration"
    '        Dim pObjCompany As OptiPro.Config.Common.Company = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    '        pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
    '        pObjCompany.CompanyDbName = pdtdtLicenceData.Rows(0)("DataBase").ToString
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)

    '        Dim connStr As String = ObjIConnection.CompanyDBConnection.ConnectionString
    '        'ErrorLogging.LogError("GetLicenseData: " + appPath)
    '        pbstatus = pobjLicManager.BMGFCheckECONLicense(SFDClicence, True, appPath, "LICsettings.ini",
    '                        "OPTMSFDC", pbValidLicense,
    '                         psErrorString, psWarningString, Nothing, connStr)

    '        If pbstatus = False Or pbValidLicense = False Then
    '            If (psErrorString.ToString().Contains("214")) Then
    '                If (ResetLogin(UserId) = False) Then
    '                    dt.Rows.Add("false", g.ToString(), psErrorString)
    '                Else
    '                    'pbstatus = pobjLicManager.BMGFLogin()
    '                    ' pbstatus = pobjLicManager.BMGFPOSLogin(SFDClicence, g.ToString(), obj.LoginId.ToString().ToUpper())
    '                    pbstatus = pobjLicManager.BMGFWebLogin(SFDClicence, g.ToString(), UserId.ToString().ToUpper())
    '                    If pbstatus = True Then
    '                        'Session("LicManager") = pobjLicManager
    '                        'Return True
    '                        dt.Rows.Add("true", g.ToString(), psWarningString)
    '                        ' AddLicenseToCache(obj.LoginId.ToString().ToUpper(), g.ToString(), pobjLicManager)
    '                        AddLicenseToCache(UserId.ToString().ToUpper(), g.ToString(), pobjLicManager)
    '                        ' AddLoggedInUserCache(obj.LoginId.ToString().ToUpper(), g.ToString())
    '                        AddLoggedInUserCache(UserId.ToString().ToUpper(), g.ToString())
    '                    Else
    '                        dt.Rows.Add("false", g.ToString(), "Error in License.")
    '                    End If
    '                End If
    '            Else
    '                dt.Rows.Add("false", g.ToString(), psErrorString)
    '            End If

    '        Else
    '            'pbstatus = pobjLicManager.BMGFLogin()
    '            ' pbstatus = pobjLicManager.BMGFPOSLogin(SFDClicence, g.ToString(), obj.LoginId.ToString().ToUpper())
    '            pbstatus = pobjLicManager.BMGFWebLogin(SFDClicence, g.ToString(), UserId.ToString().ToUpper())
    '            'pbstatus = pobjLicManager.BMGFWebLogin("WMS", g.ToString(), UserId.ToString().ToUpper())

    '            If pbstatus = True Then
    '                'Session("LicManager") = pobjLicManager
    '                'Return True
    '                dt.Rows.Add("true", g.ToString(), psWarningString)
    '                ' AddLicenseToCache(obj.LoginId, g.ToString(), pobjLicManager)
    '                AddLicenseToCache(UserId, g.ToString(), pobjLicManager)
    '                ' AddLoggedInUserCache(obj.LoginId, g.ToString())
    '                AddLoggedInUserCache(UserId, g.ToString())
    '            Else
    '                dt.Rows.Add("false", g.ToString(), "Error in License.")
    '            End If
    '        End If
    '        pobjLICData.Tables.Add(dt.Copy())
    '        pobjLICData.Tables(0).TableName = "LICData"
    '        Return pobjLICData
    '    Catch ex As Exception
    '        ErrorLogging.LogError("GetLicenseData: " + ex.ToString())
    '        Return Nothing
    '    End Try
    'End Function

    Public Shared Sub AddLicenseToCache(ByVal psUserId As String, ByVal psGuid As String, ByVal pObjLic As Object)
        Try
            'Roopesh Dube
            'Store LicenseManagaer BME COM Object to server
            '14 Jun 2017

            'Dim oLic As Object = CType(HttpRuntime.Cache.Item(psUserId.ToUpper.Trim + psGuid), Object)
            Dim oLic As Object = CType(HttpRuntime.Cache.Item(psGuid), Object)
            If oLic Is Nothing Then
                'HttpRuntime.Cache.Insert(psUserId.ToUpper.Trim + psGuid, pObjLic, Nothing, System.Web.Caching.Cache.NoAbsoluteExpiration, System.Web.Caching.Cache.NoSlidingExpiration, CacheItemPriority.Normal, Nothing)
                HttpRuntime.Cache.Insert(psGuid, pObjLic, Nothing, System.Web.Caching.Cache.NoAbsoluteExpiration, System.Web.Caching.Cache.NoSlidingExpiration, CacheItemPriority.Normal, Nothing)

                'HttpRuntime.Cache.Insert(psUserId.ToUpper.Trim, Obj1)
                Exit Sub

            End If
        Catch ex As Exception
            ErrorLogging.LogError("AddLicenseToCache" + ex.ToString())
        End Try
    End Sub


    Public Shared Function GetLicenseFromCache(ByVal psUserId As String, ByVal psGuid As String) As Object
        'Roopesh Dube
        'Get stored LicenseManagaer BME COM Object from server to call BMLogout function
        '14 Jun 2017
        Try
            'Dim oLic As Object = CType(HttpRuntime.Cache(psUserId.ToUpper.Trim + psGuid), Object)
            ErrorLogging.LogError("User id: " + psUserId.ToString())
            ErrorLogging.LogError("GU id: " + psGuid.ToString())
            Dim oLic As Object = CType(HttpRuntime.Cache(psGuid), Object)
            ErrorLogging.LogError("oLic " + oLic.ToString())
            Return oLic
        Catch ex As Exception
            ErrorLogging.LogError("GetLicenseFromCache: " + ex.ToString())
            Return Nothing
        End Try
    End Function

    Public Shared Sub RemoveLicenseFromcache(ByVal psUserId As String, ByVal psGuid As String)
        'Roopesh Dube
        'Remove stored LicenseManagaer BME COM Object from server after call BMLogout function
        '15 Jun 2017
        Try
            'HttpRuntime.Cache.Remove(psUserId.ToUpper.Trim + psGuid)
            HttpRuntime.Cache.Remove(psGuid)
        Catch ex As Exception
            ErrorLogging.LogError("RemoveLicenseFromcache: " + ex.ToString())
        End Try
    End Sub

    Public Shared Sub AddLoggedInUserCache(ByVal psUserId As String, ByVal psGuid As String)
        Try
            'Roopesh Dube
            'Store Logged in user information and last transaction time stamp
            '15 Jun 2017
            Dim pobjUserData As New DataSet
            Dim oLic As DataSet = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)
            If oLic Is Nothing Then
                Dim dt As New DataTable

                dt.Columns.Add("UserName")
                dt.Columns.Add("GUID")
                dt.Columns.Add("LastTransactionTime")

                dt.Rows.Add(psUserId.ToUpper().Trim, psGuid.ToString(), DateTime.Now)
                pobjUserData.Tables.Add(dt.Copy())
                pobjUserData.Tables(0).TableName = "LoggedUserData"

                HttpRuntime.Cache.Insert("POSLoggedInUser", pobjUserData, Nothing, System.Web.Caching.Cache.NoAbsoluteExpiration, System.Web.Caching.Cache.NoSlidingExpiration, CacheItemPriority.Normal, Nothing)
                Exit Sub
            Else
                oLic.Tables("LoggedUserData").Rows.Add(psUserId, psGuid, DateTime.Now)

            End If
        Catch ex As Exception
            ErrorLogging.LogError("AddLoggedInUserCache" + ex.ToString())
        End Try
    End Sub

    Public Shared Sub RemoveLoggedInUserCache(ByVal psUserId As String, ByVal psGuid As String)
        'Roopesh Dube
        'Remove stored LoggedInUserCache 
        '15 Jun 2017
        Try
            Dim oLic As DataSet = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)
            Dim icount As Integer = 0
            Dim iUserCount As Integer = 0

            If Not oLic Is Nothing Then
                If oLic.Tables("LoggedUserData").Rows.Count > 0 Then
                    iUserCount = oLic.Tables("LoggedUserData").Rows.Count
                End If

                For icount = 0 To iUserCount - 1
                    If (oLic.Tables("LoggedUserData").Rows(icount)("GUID").ToString() = psGuid) Then
                        oLic.Tables("LoggedUserData").Rows.RemoveAt(icount)
                        oLic.Tables("LoggedUserData").AcceptChanges()
                        Exit For
                    End If
                Next
            End If

        Catch ex As Exception
            ErrorLogging.LogError("RemoveLoggedInUserCache: " + ex.ToString())
        End Try
    End Sub

    Public Shared Sub UpdateLoggedInUserCache(ByVal psUserId As String, ByVal psGuid As String)
        'Roopesh Dube
        'Update TimeStamp for LoggedInUserCache 
        '15 Jun 2017
        Dim iUserCount As Integer = 0
        Try
            Dim icount As Integer = 0
            Dim oLic As DataSet = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)
            If Not oLic Is Nothing Then
                If oLic.Tables("LoggedUserData").Rows.Count > 0 Then
                    iUserCount = oLic.Tables("LoggedUserData").Rows.Count
                End If

                For icount = 0 To iUserCount - 1
                    If (oLic.Tables("LoggedUserData").Rows(icount)("GUID").ToString() = psGuid) Then
                        oLic.Tables("LoggedUserData").Rows(icount)("LastTransactionTime") = DateTime.Now
                        oLic.Tables("LoggedUserData").AcceptChanges()
                    End If
                Next

            End If
        Catch ex As Exception
            ErrorLogging.LogError("UpdateLoggedInUserCache: " + ex.ToString())
        End Try
    End Sub

    Public Shared Function ResetLogin(ByVal obj As Object) As Boolean
        'Roopesh Dube
        'Reset License
        '15 Jun 2017
        Dim iUserCount As Integer = 0
        Try
            Dim pstmpGUID As String = String.Empty
            Dim pstmpUserID As String = String.Empty
            Dim pCurrentDateTime As DateTime = DateTime.Now 'Current Time for comparisson
            Dim pIdleTime As Integer = 30 ' In minutes from config

            'Get LogoutIdleTime
            Dim psDirectory As String = AppDomain.CurrentDomain.BaseDirectory & "\Configuration\Configuration.config"
            Dim ObjFileMap As New ExeConfigurationFileMap()
            ObjFileMap.ExeConfigFilename = psDirectory
            Dim ObjConfiguration As System.Configuration.Configuration = ConfigurationManager.OpenMappedExeConfiguration(ObjFileMap, ConfigurationUserLevel.None)

            If Not IsNothing(ObjConfiguration.AppSettings.Settings.Item("LogoutIdleTime")) Then
                pIdleTime = ObjConfiguration.AppSettings.Settings.Item("LogoutIdleTime").Value
            End If

            'Get LogoutIdleTime

            Dim oLic As DataSet = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)

            If Not oLic Is Nothing Then

                Dim findRow As DataRow()
                If oLic.Tables(0).Rows.Count > 0 Then
                    findRow = oLic.Tables(0).[Select]("", "LastTransactionTime asc")
                End If

                For icount As Integer = 0 To findRow.Length - 1
                    If (DateDiff(DateInterval.Minute, findRow(icount)("LastTransactionTime"), pCurrentDateTime) >= pIdleTime) Then
                        'If user idle for define time forcefully logout the user
                        pstmpGUID = findRow(icount)("GUID")
                        pstmpUserID = findRow(icount)("UserName")
                        Exit For
                    End If
                Next

                If (pstmpGUID = "") Then
                    'idle user not found
                    Return False
                    Exit Function
                End If

                If oLic.Tables("LoggedUserData").Rows.Count > 0 Then
                    iUserCount = oLic.Tables("LoggedUserData").Rows.Count
                End If

                For icount = 0 To iUserCount - 1
                    If (pstmpGUID = oLic.Tables("LoggedUserData").Rows(icount)("GUID")) Then
                        oLic.Tables("LoggedUserData").Rows.RemoveAt(icount)
                        oLic.Tables("LoggedUserData").AcceptChanges()
                        Exit For
                    End If
                Next
            End If

            Dim pobjLicManager As Object
            Dim pbstatus

            pobjLicManager = GetLicenseFromCache("", pstmpGUID)

            If Not pobjLicManager Is Nothing Then
                'pbstatus = pobjLicManager.BMGFLogout()
                ' pbstatus = pobjLicManager.BMGFPOSLogout(SFDClicence, pstmpGUID, pstmpUserID.ToUpper())
                pbstatus = pobjLicManager.BMGFWebLogout(SFDClicence, pstmpGUID, pstmpUserID.ToUpper())
                If pbstatus = True Then
                    RemoveLicenseFromcache("", pstmpGUID)
                    Return True
                End If
            End If


        Catch ex As Exception
            ErrorLogging.LogError("ResetLogin: " + ex.ToString())
            Return False
        End Try
    End Function

    Public Shared Function IsLicAuthenticateForTransaction(ByVal psUserId As String, ByVal psGuid As String, ByRef psErrorMsg As String) As Boolean

        Try
            'ErrorLogging.LogError("OUT :# UserName='" & psUserId.Trim() & "' And GUID='" & psGuid & "' And LastTransactionTime = " & DateTime.Now)
            Dim pdtLicenseTable As DataSet
            Dim GUIDforUser As String
            Dim DateDiffInMin As Double
            If Not IsNothing(HttpRuntime.Cache.Item("POSLoggedInUser")) Then
                pdtLicenseTable = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)
                If Not Nothing Is pdtLicenseTable Then
                    If (pdtLicenseTable.Tables("LoggedUserData").Select("UserName='" & psUserId.Trim() & "' And GUID='" & psGuid & "'").Length > 0) Then
                        'Changes for the Guid ....Check for the GUID Corresponding to the Login Guid and Then Check For the IDLE time 
                        For iUpdate = 0 To pdtLicenseTable.Tables("LoggedUserData").Rows.Count - 1
                            GUIDforUser = pdtLicenseTable.Tables("LoggedUserData").Rows(iUpdate).Item("GUID")
                            'Check for the User ID in Cache and User Id form Controller
                            If (GUIDforUser = psGuid) Then
                                Dim LastTransactionTime As String = pdtLicenseTable.Tables("LoggedUserData").Rows(iUpdate).Item("LastTransactionTime")
                                Dim LastTransactionTimeDate As DateTime = Convert.ToDateTime(LastTransactionTime)
                                DateDiffInMin = (DateTime.Now - LastTransactionTimeDate).TotalMinutes
                            End If

                        Next
                        Dim pIdleTime As Double = 30 ' In minutes from config

                        'Get LogoutIdleTime
                        Dim psDirectory As String = AppDomain.CurrentDomain.BaseDirectory & "\Configuration\Configuration.config"
                        Dim ObjFileMap As New ExeConfigurationFileMap()
                        ObjFileMap.ExeConfigFilename = psDirectory
                        Dim ObjConfiguration As System.Configuration.Configuration = ConfigurationManager.OpenMappedExeConfiguration(ObjFileMap, ConfigurationUserLevel.None)

                        If Not IsNothing(ObjConfiguration.AppSettings.Settings.Item("LogoutIdleTime")) Then
                            pIdleTime = ObjConfiguration.AppSettings.Settings.Item("LogoutIdleTime").Value
                        End If
                        If pIdleTime >= DateDiffInMin Then
                            pdtLicenseTable.Tables("LoggedUserData").Select("UserName='" & psUserId.Trim() & "' And GUID='" & psGuid & "'")(0).Item("LastTransactionTime") = DateTime.Now
                            'ErrorLogging.LogError("IN :# UserName='" & psUserId.Trim() & "' And GUID='" & psGuid & "' And LastTransactionTime = " & DateTime.Now)
                            HttpRuntime.Cache.Item("POSLoggedInUser") = pdtLicenseTable
                            Return True
                        End If
                    End If
                End If
            End If
        Catch ex As Exception
            ErrorLogging.LogError("IsLicAuthenticateForTransaction: " + ex.ToString)
        End Try
        psErrorMsg = "7001"
        Return False
    End Function

    Public Shared Function getHTTPRuntime() As DataSet
        Dim pdsLicense As DataSet
        pdsLicense = CType(HttpRuntime.Cache.Item("POSLoggedInUser"), DataSet)
        Return pdsLicense
    End Function


    'Begin Added by Deepak Porwal on 31/Jul/2017 SCR No.98551
    Public Shared Function CreateTableForLicenseMsg() As DataSet
        Dim ds As New DataSet
        Dim dt As New DataTable

        dt.Columns.Add("UserExceed")
        dt.Columns.Add("GUID")
        dt.Columns.Add("ErrMessage")
        dt.Columns.Add("ErrorNo")

        ds.Tables.Add(dt)
        ds.Tables(0).TableName = "LICDATA"
        Return ds
    End Function

#End Region

End Class
