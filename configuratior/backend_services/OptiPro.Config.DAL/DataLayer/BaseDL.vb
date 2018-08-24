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
End Class
