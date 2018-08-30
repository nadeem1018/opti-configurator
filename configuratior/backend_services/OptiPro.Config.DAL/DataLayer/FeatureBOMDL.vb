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


Public Class FeatureBOMDL


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

    Public Shared Function GetFeatureDetail(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psFeatureID As Integer
            Dim psSQL As String = String.Empty
            Dim pdsFeatureDetail As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Get the Feature ID From the Datatable 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting featureID and it will be of Integer
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureDetail)
            'get the Result of Query in Dataset
            pdsFeatureDetail = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            'Returns A DataTable 
            Return pdsFeatureDetail.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    ''' <summary>
    ''' Funtion to get the Item List from the Table for the Grid
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetItemForFeatureBOM(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemForFeatureBOM)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    ''' <summary>
    ''' Get the Feature List for the Grid,All the Features will come Except the selected Feture
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetFeatureListExceptSelectedFeature(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            Dim psFeatureID As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Get the Feature ID From the Datatable 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting featureID and it will be of Integer
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListExceptSelectedFeature)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function AddFeatureMasterDetail(ByVal objDataSet As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataSet.Tables(0).Rows(0)("CompanyDBId"))
            'get the Parameters Values from 

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)


            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting featureID and it will be of Integer
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psCompanyDBId

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListExceptSelectedFeature)
            iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
            psStatus = ex.ToString
        End Try
        Return psStatus
    End Function
    ''' <summary>
    ''' This Function is USed to Insert the Data tin the Header Table 
    ''' Table :OPCONFIG_FEATUREHDRMASTER
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <param name="CompanyDBId"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function AddDataInFeatureHeader(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company, ByVal CompanyDBId As String) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer

            Dim psCreatedBy As String

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Get the User from the User Interface  
            psCreatedBy = NullToString(objDataTable.Rows(0)("CreatedUser"))

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(2) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@COMPANY"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psCompanyDBId

            'Parameter 1 consistig of UserID and its Datatype will be nvarchar
            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@USERID"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psCreatedBy

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddDataInFeatureHeader)
            'get the Query in the Database
            iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

            'if more than one Record is Inserted the we will return the status as True
            If iInsert > 0 Then
                psStatus = "True"
            Else
                'If the record are not Inserted then the we will Return False
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
            psStatus = ex.ToString
        End Try
        Return psStatus
    End Function

    ''' <summary>
    ''' This Function is Used to Insert the Data in the Feature Detail 
    ''' Tables : OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function AddDataInFeatureDetail(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer

            Dim psItemKey, psValue, psDisplayName, psDefault, psRemarks, psCreatedBy, psAttachment As String

            Dim piType, piLineNo, piHeaderFeatureId As Integer

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get theIem Key From the User Interface 
            psItemKey = NullToString(objDataTable.Rows(0)("ItemKey"))
            'get the Value of Item or Feature from the User Interface
            psValue = NullToString(objDataTable.Rows(0)("ItemValue"))
            'Get the Product Group Id 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
            'get the Deafult Value for the String 
            psDefault = NullToString(objDataTable.Rows(0)("Default"))
            'Get theRamrks VAlue frm the USer Interface 
            psRemarks = NullToString(objDataTable.Rows(0)("Remarks"))
            'get the USer name 
            psCreatedBy = NullToString(objDataTable.Rows(0)("UserId"))
            'get the Attachment Folder Path from the User Interfac 
            psAttachment = NullToString(objDataTable.Rows(0)("Attachment"))
            'get the Type it  will be a Integer VAlue 
            piType = NullToInteger(objDataTable.Rows(0)("Type"))
            'get the Value for Line Number 
            piLineNo = NullToInteger(objDataTable.Rows(0)("LineNo"))
            'Get the Feaure Header id 
            piHeaderFeatureId = NullToInteger(objDataTable.Rows(0)("HeaderId"))


            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(11) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMTYPE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piType

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@LINENO"
            pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(1).Paramvalue = piLineNo

            pSqlParam(2) = New MfgDBParameter
            pSqlParam(2).ParamName = "@HEADERFEATUREID"
            pSqlParam(2).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(2).Paramvalue = piHeaderFeatureId

            pSqlParam(3) = New MfgDBParameter
            pSqlParam(3).ParamName = "@ITEMKEY"
            pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(3).Paramvalue = psItemKey

            pSqlParam(4) = New MfgDBParameter
            pSqlParam(4).ParamName = "@ITEMVALUE"
            pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(4).Paramvalue = psValue

            pSqlParam(5) = New MfgDBParameter
            pSqlParam(5).ParamName = "@DISPLAYNAME"
            pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(5).Paramvalue = psDisplayName

            pSqlParam(6) = New MfgDBParameter
            pSqlParam(6).ParamName = "@DEFAULT"
            pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(6).Paramvalue = psDefault

            pSqlParam(7) = New MfgDBParameter
            pSqlParam(7).ParamName = "@REMARKS"
            pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(7).Paramvalue = psRemarks

            pSqlParam(8) = New MfgDBParameter
            pSqlParam(8).ParamName = "@ATTACHMENT"
            pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(8).Paramvalue = psAttachment

            pSqlParam(9) = New MfgDBParameter
            pSqlParam(9).ParamName = "@COMPANYID"
            pSqlParam(9).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(9).Paramvalue = psCompanyDBId


            pSqlParam(10) = New MfgDBParameter
            pSqlParam(10).ParamName = "@USERID"
            pSqlParam(10).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(10).Paramvalue = psCreatedBy

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddDataInFeatureDetail)
            iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

            If iInsert > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatus
    End Function
    ''' <summary>
    ''' ThisFunctin is Used to Update the Data in the Table 
    ''' Table :OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function UpdateDataInFeatureDetail(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iUpdate As Integer

            Dim psItemKey, psValue, psDisplayName, psDefault, psRemarks, psModifiedby, psAttachment As String
            Dim piType, piLineNo, piHeaderFeatureId As Integer
            Dim piFeatureID As Integer

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get theIem Key From the User Interface 
            psItemKey = NullToString(objDataTable.Rows(0)("ItemKey"))
            'get the Value of Item or Feature from the User Interface
            psValue = NullToString(objDataTable.Rows(0)("ItemValue"))
            'Get the Product Group Id 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
            'get the Deafult Value for the String 
            psDefault = NullToString(objDataTable.Rows(0)("Default"))
            'Get theRamrks VAlue frm the USer Interface 
            psRemarks = NullToString(objDataTable.Rows(0)("Remarks"))
            'get the USer name 
            psModifiedby = NullToString(objDataTable.Rows(0)("UserId"))
            'get the Attachment Folder Path from the User Interfac 
            psAttachment = NullToString(objDataTable.Rows(0)("Attachment"))
            'get the Type it  will be a Integer VAlue 
            piType = NullToInteger(objDataTable.Rows(0)("Type"))
            'get the Value for Line Number 
            piLineNo = NullToInteger(objDataTable.Rows(0)("LineNo"))
            'Get the Feaure Header id 
            piHeaderFeatureId = NullToInteger(objDataTable.Rows(0)("HeaderId"))
            'get the Feature Id 
            piFeatureID = NullToString(objDataTable.Rows(0)("FeatureID"))


            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(11) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMTYPE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piType

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@ITEMKEY"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psItemKey

            pSqlParam(2) = New MfgDBParameter
            pSqlParam(2).ParamName = "@ITEMVALUE"
            pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(2).Paramvalue = psValue

            pSqlParam(3) = New MfgDBParameter
            pSqlParam(3).ParamName = "@DISPLAYNAME"
            pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(3).Paramvalue = psDisplayName

            pSqlParam(4) = New MfgDBParameter
            pSqlParam(4).ParamName = "@DEFAULT"
            pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(4).Paramvalue = psDefault

            pSqlParam(5) = New MfgDBParameter
            pSqlParam(5).ParamName = "@REMARKS"
            pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(5).Paramvalue = psRemarks

            pSqlParam(6) = New MfgDBParameter
            pSqlParam(6).ParamName = "@ATTACHMENT"
            pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(6).Paramvalue = psAttachment

            pSqlParam(7) = New MfgDBParameter
            pSqlParam(7).ParamName = "@COMPANYID"
            pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(7).Paramvalue = psCompanyDBId


            pSqlParam(8) = New MfgDBParameter
            pSqlParam(8).ParamName = "@USERID"
            pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(8).Paramvalue = psModifiedby

            pSqlParam(9) = New MfgDBParameter
            pSqlParam(9).ParamName = "@FEATUREID"
            pSqlParam(9).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(9).Paramvalue = piFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_UpdateDataInFeatureDetail)
            iUpdate = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

            If iUpdate > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatus
    End Function


    ''' <summary>
    ''' ThisFunctin is Used to Delete  the Data from the  Table 
    ''' Table :OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function DeleteDataFromFeatureDetail(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            'Variabe to get CompanyDBID
            Dim psCompanyDBId As String = String.Empty
            'Variable for Sql Query
            Dim psSQL As String = String.Empty
            'Variable Decalared for Executing no of Records Deleted
            Dim iDelete As Integer
            'Variable for the FEature ID 
            Dim piFeatureID As Integer
            'get the Feature Id 
            piFeatureID = NullToString(objDataTable.Rows(0)("FeatureID"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter


            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = piFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteDataFromFeatureDetail)
            iDelete = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

            If iDelete > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatus
    End Function



    ''' <summary>
    ''' Thhis Function is USed to Generate the GUID
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GenerateGUIDNo() As String
        Dim psGUID As String = ""
        psGUID = (Guid.NewGuid()).ToString("D")
        Return psGUID
    End Function

End Class
