Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.Common
Imports OptiPro.Config.DAL
Imports System.Data
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.ComponentModel
Imports System.Reflection
Imports OptiPro.Config.Common.Utilites


Public Class BaseDL


    'Function used to get URL to be hitted
    Public Shared Function GetPSURL(ByVal objDataSet As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Try
            Dim pdsObjPSURL As DataSet
            Dim psURL As String = ""
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance

            pObjCompany.CompanyDbName = objDataSet.Rows(0)("CompanyDBId").ToString()

            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection

            'Now get the Required connection type as 1 for Company Connection
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get the Required connection type as 1 for Company Connection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            'Execute Query From the Header table
            Dim psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiPro_Config_GetPSURL)
            'Get the data into the dataset
            pdsObjPSURL = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))

            If pdsObjPSURL.Tables.Count > 0 Then
                psURL = pdsObjPSURL.Tables(0).Rows(0)("OPTM_URL").ToString()

                If psURL.Length > 0 Then
                    Return psURL
                Else
                    ErrorLogging.LogError("No URL found in the Data Base")
                    Return "No URL found in the Data Base"
                End If
            End If

        Catch ex As Exception
            ErrorLogging.LogError(ex)
            Return Nothing
        End Try
    End Function

    Public Shared Function GetServerDate(ByVal ObjCompanyId As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsServerDate As DataSet
            'Get the Company Name
            psCompanyDBId = ObjCompanyId
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetServerDate)
            pdsServerDate = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsServerDate.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function GetMenuRecord(ByVal ObjDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            'Variable to get the SQl Query
            Dim psSQL As String
            Dim dsRecord As New DataSet
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.SysAdminConnection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetMenus)
            'This method will fill the same dataset with table ParentTable
            dsRecord = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return dsRecord.Tables(0)
        Catch ex As Exception
            ErrorLogging.LogError(ex)
            Return Nothing
        End Try
    End Function

    'Public Shared Function GetPermissionDetails(ByVal ObjDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
    '    Try
    '        'Variable to get the SQl Query
    '        Dim psSQL As String
    '        'Used To The Company Instance
    '        Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
    '        pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.SysAdminConnection
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

    '        ' Get the Query on the basis of objIQuery
    '        Dim psSQL As String = ObjIQuery.GetQuery(SFDC_Common.SFDCQueryConstants.SFDClogin_PermissionRecordCount)
    '        'Create New Dataset 
    '        Dim pObjDsPermission As New DataSet
    '        'New Parameter For the Count Chek 
    '        Dim pSqlParam(0) As MfgDBParameter
    '        pSqlParam(0) = New MfgDBParameter
    '        pSqlParam(0).ParamName = "@USERCODE"
    '        pSqlParam(0).Paramvalue = psUserName
    '        pObjDsPermission = ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam)

    '        'New Param For the Getting Permission According To the Menus 
    '        Dim pSqlParam1(1) As MfgDBParameter
    '        pSqlParam1(0) = New MfgDBParameter
    '        pSqlParam1(0).ParamName = "@USERCODE"
    '        pSqlParam1(0).Paramvalue = psUserName

    '        pSqlParam1(1) = New MfgDBParameter
    '        pSqlParam1(1).ParamName = "@MENUID"
    '        pSqlParam1(1).Paramvalue = psMenuID
    '        'These Function is Used to Check From the DataSet ,If the UserCount is Greater than Zero then Auth User Table Else from Define Roles Table
    '        If (pObjDsPermission.Tables(0).Rows(0).Item("USERCOUNT") > 0) Then
    '            'If Count is Greater than Zero than Authorization TAble is Used 
    '            psSQL = ObjIQuery.GetQuery(SFDC_Common.SFDCQueryConstants.SFDClogin_PermissionAUTHRUSERScreen)
    '        Else
    '            'If no Count is Found then Check from the Roles Screen 
    '            psSQL = ObjIQuery.GetQuery(SFDC_Common.SFDCQueryConstants.SFDClogin_PermissionRolesScreen)
    '        End If
    '        'Execute the Query and Fill the Dataset 
    '        pObjDsPermission = ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam1)
    '        'Return the Data Table
    '        Return pObjDsPermission.Tables(0)
    '    Catch ex As Exception
    '        ErrorLogging.LogError(ex)
    '        Return Nothing
    '    End Try
    'End Function
End Class
