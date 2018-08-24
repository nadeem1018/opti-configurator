Public Class ConnectionFactory

    Private Shared _key() As Byte = {132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, _
   91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64}
    Private Shared mobjConnection As IConnection = Nothing

    Public Shared Function GetConnectionInstance(ByVal oCompany As OptiPro.Config.Common.Company) As IConnection
        'Logger.WriteTextLog("Log: LoginDL CompanySQlConnection db: ")
        If oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
            mobjConnection = New CompanyHanaConnection(oCompany)
        ElseIf oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.SQLDatabase Then
            mobjConnection = New CompanySQLConnection(oCompany)
        End If
        SetConnection(oCompany)
        Return mobjConnection
    End Function

    Private Shared Sub SetConnection(ByVal oCompany As OptiPro.Config.Common.Company)
        'Logger.WriteTextLog("Log: LoginDL SetConnection ")
        Dim psConnectionString As String = OptiPro.Config.Common.ConnectionStringBuilder.GetConnectionString(oCompany.DBServerName, oCompany.CompanyDbName, _
                                             oCompany.CompanyDbUserName, oCompany.CompanyDbUserPassword, True, oCompany)
        Dim pObjDbConnection As System.Data.Common.DbConnection = Nothing

        If oCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection Then
            If oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.SQLDatabase Then
                pObjDbConnection = New SqlClient.SqlConnection(psConnectionString)
            Else
                pObjDbConnection = New Sap.Data.Hana.HanaConnection(psConnectionString)
            End If
            mobjConnection.CompanyDBConnection = pObjDbConnection
        ElseIf oCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.SysAdminConnection Then
            If oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.SQLDatabase Then
                pObjDbConnection = New SqlClient.SqlConnection(psConnectionString)
            Else
                pObjDbConnection = New Sap.Data.Hana.HanaConnection(psConnectionString)
            End If
            mobjConnection.CompanyDBConnection = pObjDbConnection
        ElseIf oCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.LicenseConnection Then
            If oCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.SQLDatabase Then
                'Megha/29 JUN 16
                psConnectionString = "Server=" & oCompany.DBServerName & ";User ID=" & oCompany.CompanyDbUserName & ";Password=" & oCompany.CompanyDbUserPassword & ";Database=OptiProLicenseManager"
                pObjDbConnection = New SqlClient.SqlConnection(psConnectionString)
            Else
                psConnectionString = "Server=" & oCompany.DBServerName & ";UserID=" & oCompany.CompanyDbUserName & ";Password=" & oCompany.CompanyDbUserPassword & ";CS=OPTIPROLICENSEMANAGER"

                'psConnectionString = oCompany.DBServerName & ";" & oCompany.CompanyDbUserName & ";" & oCompany.CompanyDbUserPassword & ";" & oCompany.DIServerDatabaseType & ";" & oCompany.DatabaseLanguage & ";" & oCompany.LicenceServer & ";" & oCompany.Port & ";" & oCompany.SuperUser & ";" & oCompany.HanaAssemblyProvider & ";" & oCompany.CompanyServer & ";" & oCompany.LicenceServer
                pObjDbConnection = New Sap.Data.Hana.HanaConnection(psConnectionString)
            End If
            mobjConnection.CompanyDBConnection = pObjDbConnection
        End If


    End Sub



End Class
