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


Public Class ModelBOMDL


    'Function to get the Feature for both the Look 
    Public Shared Function GetFeatureList(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureId As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            If objDataTable.Columns.Contains("FeatureID") Then
                '  get the FeatureID,
                psFeatureId = NullToString(objDataTable.Rows(0)("FeatureID"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psFeatureId = ""
            End If
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            If psFeatureId.Length > 0 Then
                Dim pSqlParam(1) As MfgDBParameter
                'Parameter 0 consisting featureID and it will be of Integer
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@FEATUREID"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = psFeatureId

                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListExceptSelectedFeature)
                'These query will ftch all the Feature fro feature master except the Selected feature 
                pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))

            Else
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureList)
                pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            End If

            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



End Class
