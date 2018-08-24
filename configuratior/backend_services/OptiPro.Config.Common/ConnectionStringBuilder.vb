Imports OptiPro.Config.Common

Public Class ConnectionStringBuilder

    Public Shared Function GetConnectionString(ByVal serverName As String, ByVal dbName As String, _
                                                  ByVal usrName As String, ByVal password As String, _
                                                  ByVal integratedSecurity As Boolean, Optional ByVal oCompany As OptiPro.Config.Common.Company = Nothing) As String

        Try
            Dim CryptographyFactory As New CryptoFactory()
            Dim Cryptographer As ICrypto = CryptographyFactory.MakeCryptographer()
            Dim psConnectionString As String = String.Empty
            Dim psServer As String = "Server=" + serverName

            If oCompany.RequireConnectionType = WMSRequireConnectionType.SysAdminConnection Then
                If oCompany.CompanyDBType = WMSDatabaseType.HANADatabase Then
                    dbName = "SBOCOMMON"
                ElseIf oCompany.CompanyDBType = WMSDatabaseType.SQLDatabase Then
                    dbName = "SBO-COMMON"
                End If
            End If


            If oCompany IsNot Nothing AndAlso oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                If psServer.Contains(":30015") = False AndAlso String.IsNullOrEmpty(psServer) = False Then
                    psServer = psServer.Trim + ":30015"
                End If
                psConnectionString = String.Concat(psConnectionString, psServer, ";")
                psConnectionString = String.Concat(psConnectionString, "UserID=", usrName, ";")
                psConnectionString = String.Concat(psConnectionString, "Password=", password, ";")
                psConnectionString = String.Concat(psConnectionString, "CS=", dbName)
            Else
                psConnectionString = String.Concat(psConnectionString, psServer, ";")
                psConnectionString = String.Concat(psConnectionString, "User ID=", usrName, ";")
                psConnectionString = String.Concat(psConnectionString, "Password=", password, ";")
                psConnectionString = String.Concat(psConnectionString, "Database=", dbName)
            End If

            Return psConnectionString

        Catch ex As Exception
            Return String.Empty
        End Try
    End Function


    Public Shared Function EncryptString(ByVal vsStrToEncrypt As String, ByVal _Key() As Byte) As String
        Dim CryptographyFactory As New CryptoFactory()
        Dim Cryptographer As ICrypto = CryptographyFactory.MakeCryptographer()
        Return Cryptographer.Encrypt(vsStrToEncrypt, _Key)
    End Function

    Public Shared Function DecryptString(ByVal vsStrToDecrypt As String, ByVal _Key() As Byte) As String
        Dim CryptographyFactory As New CryptoFactory()
        Dim Cryptographer As ICrypto = CryptographyFactory.MakeCryptographer()
        Return Cryptographer.Decrypt(vsStrToDecrypt, _Key)
    End Function





End Class
