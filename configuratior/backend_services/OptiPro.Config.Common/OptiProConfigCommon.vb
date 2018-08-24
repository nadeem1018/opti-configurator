
Public Module OptiProConfigCommon

    Public Const WMS_AdminConnectionStringKey As String = "AdminConnectionString"
    Public Const WMS_CompanyConnectionStringKey As String = "CompanyConnectionString"
    Public Const WMS_ConnectionStringParams As String = "ConnectionStringParams"
    Public Const WMS_CompaniesDefaults As String = "CompaniesDefaultSettings"
    Public Const WMS_LicenseTable As String = "LicenseTable"
    Public Const WMS_Guid As String = "Guid"
    Public Const WMS_LicenceErrorCode As Integer = 7000


    Private _key() As Byte = {132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, _
     91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64}
    Private _iv() As Byte = {83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11}
    Dim CryptographyFactory As New CryptoFactory()
    Dim Cryptographer As ICrypto = CryptographyFactory.MakeCryptographer()

    Public Enum WMSDatabaseType As Integer
        HANADatabase = 1
        SQLDatabase = 2
    End Enum

    Public Enum WMSRequireConnectionType As Integer
        CompanyConnection = 1
        SysAdminConnection = 2
        LicenseConnection = 3
    End Enum

    Public Function Encrypt(ByVal psKey As String) As String
        Return Cryptographer.Encrypt(psKey, _key)
    End Function

    Public Function Decrypt(ByVal psKey As String) As String
        Return Cryptographer.Decrypt(psKey, _key)
    End Function


    Public Function CreateTableForLicense() As DataTable
        Dim pdt As New DataTable
        Dim pObjDC As New DataColumn("SNO")
        pObjDC.AutoIncrement = True
        pObjDC.AutoIncrementSeed = 1
        pObjDC.AutoIncrementStep = 1

        pdt.Columns.Add(pObjDC)
        pdt.Columns.Add("Company", GetType(String))
        pdt.Columns.Add("User", GetType(String))
        pdt.Columns.Add("Guid", GetType(String))
        pdt.Columns.Add("LoginTime", GetType(DateTime))
        pdt.Columns.Add("LastTransTime", GetType(DateTime))
        'pdt.Columns.Add("databaseId", GetType(String))

        pdt.Columns.Add("LoginTime1", GetType(String))
        pdt.Columns.Add("LastTransTime1", GetType(String))

        Return pdt
    End Function



End Module
