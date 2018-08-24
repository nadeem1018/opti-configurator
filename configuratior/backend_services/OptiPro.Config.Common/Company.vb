Imports System.Configuration



Public Class Company
    Private msCompanyKey As String
    Private mECompanyDBType As OptiPro.Config.Common.OptiProConfigCommon.WMSDatabaseType
    Private mERequireConnectionType As OptiPro.Config.Common.OptiProConfigCommon.WMSRequireConnectionType
    Private msServerName As String
    Private msDbServerName As String
    Private msCompanyDbName As String
    Private msCompanyDbUserName As String
    Private msCompanyDbUserPassword As String
    Private msDIServerDataBaseType As String
    Private msDataBaseLanguage As String
    Private msLicenceServer As String
    Private msPort As String
    Private msSuperUser As String
    Private msHanaDbAssemblyProvider As String
    Private msCompanyServer As String
    Private msLicenseServer As String
    Private msPrinterServerIP As String

    Private Shared _key() As Byte = {132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, _
       91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64}
    Private Shared _iv() As Byte = {83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11}

    Public Property LicenseServer As String
        Set(value As String)
            msLicenseServer = value
        End Set
        Get
            Return msLicenseServer
        End Get
    End Property


    Public Property PrinterServerIP As String
        Set(value As String)
            msPrinterServerIP = value
        End Set
        Get
            Return msPrinterServerIP
        End Get
    End Property

    Public Property CompanyServer As String
        Set(value As String)
            msCompanyServer = value
        End Set
        Get
            Return msCompanyServer
        End Get
    End Property

    Public Property HanaAssemblyProvider As String
        Set(value As String)
            msHanaDbAssemblyProvider = value
        End Set
        Get
            Return msHanaDbAssemblyProvider
        End Get
    End Property


    Public Property SuperUser As String
        Set(value As String)
            msSuperUser = value
        End Set
        Get
            Return msSuperUser
        End Get
    End Property

    Public Property LicenceServer As String
        Set(value As String)
            msLicenceServer = value
        End Set
        Get
            Return msLicenceServer
        End Get
    End Property

    Public Property Port As String
        Set(value As String)
            msPort = value
        End Set
        Get
            Return msPort
        End Get
    End Property


    Public Property DIServerDatabaseType As String
        Set(value As String)
            msDIServerDataBaseType = value
        End Set
        Get
            Return msDIServerDataBaseType
        End Get
    End Property


    Public Property DatabaseLanguage As String
        Set(value As String)
            msDataBaseLanguage = value
        End Set
        Get
            Return msDataBaseLanguage
        End Get
    End Property



    Public Property CompanyDbUserPassword As String
        Set(value As String)
            msCompanyDbUserPassword = value
        End Set
        Get
            Return msCompanyDbUserPassword
        End Get
    End Property


    Public Property CompanyDbUserName As String
        Set(value As String)
            msCompanyDbUserName = value
        End Set
        Get
            Return msCompanyDbUserName
        End Get
    End Property


    Public Sub New()

    End Sub

    Public Property CompanyKey As String
        Get
            Return msCompanyKey
        End Get
        'Set(ByVal value As String)
        Private Set(ByVal value As String)
            msCompanyKey = value
        End Set
    End Property

    Public Property CompanyDBType As OptiPro.Config.Common.OptiProConfigCommon.WMSDatabaseType
        Set(value As OptiPro.Config.Common.OptiProConfigCommon.WMSDatabaseType)
            mECompanyDBType = value
        End Set
        Get
            Return mECompanyDBType
        End Get
    End Property

    Public Property RequireConnectionType As OptiPro.Config.Common.WMSRequireConnectionType
        Set(value As OptiPro.Config.Common.WMSRequireConnectionType)
            mERequireConnectionType = value
        End Set
        Get
            Return mERequireConnectionType
        End Get
    End Property



    Public Property CompanyDbName As String
        Set(value As String)
            msCompanyDbName = value
        End Set
        Get
            Return msCompanyDbName
        End Get
    End Property



    Public Property DBServerName As String
        Get
            Return msDbServerName
        End Get
        Set(ByVal value As String)
            msDbServerName = value
        End Set
    End Property


    Public Shared Function GetCompanyInstance(ByVal pObjCache As System.Web.HttpContext) As OptiPro.Config.Common.Company
        Dim pObjCompany As New Company
        Dim psConnectionString As String = ""
        Dim CryptographyFactory As New CryptoFactory()
        Dim Cryptographer As ICrypto = CryptographyFactory.MakeCryptographer()
        Dim psDirectory As String = AppDomain.CurrentDomain.BaseDirectory & "\Configuration\Configuration.config"
        'Logger.WriteTextLog("Directory path " & psDirectory)
        'Dim psDirectory As String = AppDomain.CurrentDomain.BaseDirectory & "\AdminPortalConfiguration\OptiAdminHanaConfiguration.config"
        Dim ObjFileMap As New ExeConfigurationFileMap()
        ObjFileMap.ExeConfigFilename = psDirectory
        Dim ObjConfiguration As Configuration = ConfigurationManager.OpenMappedExeConfiguration(ObjFileMap, ConfigurationUserLevel.None)
        'Logger.WriteTextLog("Connection Parameters: " & Admin_Common.SFDCCommon.WMS_ConnectionStringParams)
        If (pObjCache.Cache(OptiPro.Config.Common.OptiProConfigCommon.WMS_ConnectionStringParams) Is Nothing) Then
            pObjCompany.DBServerName = ObjConfiguration.AppSettings.Settings.Item("DBServer").Value
            'Logger.WriteTextLog("DBServer : " & pObjCompany.DBServerName)
            pObjCompany.CompanyDbUserName = ObjConfiguration.AppSettings.Settings.Item("DBUserId").Value
            'Logger.WriteTextLog("DBUserId : " & pObjCompany.CompanyDbUserName)
            pObjCompany.CompanyDbUserPassword = ObjConfiguration.AppSettings.Settings.Item("DBPassword").Value
            'Logger.WriteTextLog("DBPassword : " & pObjCompany.CompanyDbUserPassword)
            pObjCompany.DIServerDatabaseType = ObjConfiguration.AppSettings.Settings.Item("DIServerDataBaseType").Value
            'Logger.WriteTextLog("DIServerDataBaseType : " & pObjCompany.DIServerDatabaseType)
            pObjCompany.DatabaseLanguage = ObjConfiguration.AppSettings.Settings.Item("DatabaseLanguage").Value
            'Logger.WriteTextLog("DatabaseLanguage : " & pObjCompany.DatabaseLanguage)
            pObjCompany.LicenceServer = ObjConfiguration.AppSettings.Settings.Item("LicenceServer").Value
            'Logger.WriteTextLog("LicenceServer : " & pObjCompany.LicenceServer)
            pObjCompany.Port = ObjConfiguration.AppSettings.Settings.Item("Port").Value
            'Logger.WriteTextLog("Port : " & pObjCompany.Port)
            pObjCompany.SuperUser = ObjConfiguration.AppSettings.Settings.Item("SuperUserId").Value
            ' Logger.WriteTextLog("SuperUserId : " & pObjCompany.SuperUser)
            If ObjConfiguration.AppSettings.Settings.Item("DBServerType").Value = "2" Then
                pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase
            Else
                pObjCompany.CompanyDBType = WMSDatabaseType.SQLDatabase
            End If
            'Logger.WriteTextLog("DBServerType : " & pObjCompany.CompanyDBType)
            Try
                '  pObjCompany.HanaAssemblyProvider = ObjConfiguration.AppSettings.Settings.Item("HanaAssemblyProvider").Value
            Catch ex As Exception
                pObjCompany.HanaAssemblyProvider = ""
            End Try

            If pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase AndAlso Not pObjCompany.DBServerName.Contains(":30015") Then
                pObjCompany.DBServerName = pObjCompany.DBServerName & ":30015"
            End If


            pObjCompany.CompanyServer = ObjConfiguration.AppSettings.Settings.Item("CompanyServer").Value
            'Logger.WriteTextLog("CompanyServer : " & pObjCompany.CompanyServer)
            pObjCompany.LicenceServer = ObjConfiguration.AppSettings.Settings.Item("SAPLicenseServer").Value
            'Logger.WriteTextLog("SAPLicenseServer : " & pObjCompany.LicenceServer)

            psConnectionString = pObjCompany.DBServerName & ";" & pObjCompany.CompanyDbUserName & ";" & pObjCompany.CompanyDbUserPassword & ";" & ObjConfiguration.AppSettings.Settings.Item("DBServerType").Value & ";" & pObjCompany.DIServerDatabaseType & ";" & pObjCompany.DatabaseLanguage & ";" & pObjCompany.LicenceServer & ";" & pObjCompany.Port & ";" & pObjCompany.SuperUser & ";" & pObjCompany.HanaAssemblyProvider & ";" & pObjCompany.CompanyServer & ";" & pObjCompany.LicenceServer
            pObjCache.Cache(OptiPro.Config.Common.OptiProConfigCommon.WMS_ConnectionStringParams) = psConnectionString
            Return pObjCompany
        End If

        psConnectionString = pObjCache.Cache(OptiPro.Config.Common.OptiProConfigCommon.WMS_ConnectionStringParams)
        Dim psConString() As String = psConnectionString.Split(";")
        pObjCompany.DBServerName = psConString(0)
        pObjCompany.CompanyDbUserName = psConString(1)
        pObjCompany.CompanyDbUserPassword = psConString(2)
        If psConString(3) = "1" Then
            pObjCompany.CompanyDBType = WMSDatabaseType.SQLDatabase
        Else
            pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase
        End If
        pObjCompany.DIServerDatabaseType = psConString(4)
        pObjCompany.DatabaseLanguage = psConString(5)
        pObjCompany.LicenceServer = psConString(6)
        pObjCompany.Port = psConString(7)
        pObjCompany.SuperUser = psConString(8)
        pObjCompany.HanaAssemblyProvider = psConString(9)
        pObjCompany.CompanyServer = psConString(10)
        pObjCompany.LicenceServer = psConString(11)

        Return pObjCompany

    End Function




End Class
