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
            Dim pressLoaction As String = String.Empty
            Dim rowid As String = String.Empty
            Dim psFeatureid As Integer
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            If objDataTable.Columns.Contains("FeatureCode") Then
                '  get the FeatureID,
                psFeatureid = NullToInteger(objDataTable.Rows(0)("featureCode"))
                pressLoaction = NullToString(objDataTable.Rows(0)("pressLocation"))
                rowid = NullToString(objDataTable.Rows(0)("rowid"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psFeatureid = 0
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

            If psFeatureid > 0 Then
                Dim pSqlParam(1) As MfgDBParameter
                'Parameter 0 consisting featureID and it will be of Integer
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@FEATUREID"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = psFeatureid
                ' Get the Query on the basis of objIQuery
                If pressLoaction = "Detail" Then
                    If rowid = 1 Then
                        psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListExceptSelectedFeature)
                    Else
                        psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListExceptSelectedItem)
                    End If


                Else
                    psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureListForSelectedFeature)
                End If

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
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureID"))

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
            Dim psItemKey As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
           
            ' psCompanyDBId = "DEVQAS2BRANCHING"
            psItemKey = NullToString(objDataTable.Rows(0)("ItemKey"))
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
            pSqlParam(0).ParamName = "@ITEMKEY"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemKey
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemForFeatureBOM)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
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


#Region "Add Update Delete Through Update dataset "
    Public Shared Function AddUpdateFeatureBOMData(ByVal ObjDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            'Variable to get the Company ID
            Dim psCompanyDBId As String
            'Get the Company Name
            psCompanyDBId = NullToString(ObjDataTable.Rows(0)("CompanyDBId"))

            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            'get the Company Connection
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            'variable Declaration for Table Name
            Dim psForTable As String
            'Variable Declare 
            Dim psSQLforDS As String
            ' Declaring Variable
            Dim bUpdate As Boolean
            'New DataSet 
            Dim pdsItemCodeGen As DataSet
            'Get all the Saved Record For the Particular Item Code
            pdsItemCodeGen = FeatureBOMDL.GetAllSavedData(ObjDataTable, objCmpnyInstance)
            'PreaParing the Dataset ,Which Entry is to be Updated and Added
            PrepareFeatureBOMData(ObjDataTable, pdsItemCodeGen, objCmpnyInstance)
            For index As Integer = 0 To pdsItemCodeGen.Tables.Count - 1
                'Get the Table Name
                psForTable = pdsItemCodeGen.Tables.Item(index).TableName
                'Get the Table structure with a Generic Query
                psSQLforDS = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTableStructure)
                'at runtime we will replace the "select * from ...." query with the Table name at current Index
                psSQLforDS = psSQLforDS.Replace("@TABLENAME", psForTable)
                'Call method with coresponding params needed
                bUpdate = updateDataSetToDataBase(psSQLforDS, pdsItemCodeGen, psForTable, ObjIConnection)
            Next
            If (bUpdate = True) Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
        Catch ex As Exception
            ErrorLogging.LogError(ex)
            psStatus = ex.Message().ToString
        End Try
        Return psStatus
    End Function

    ''Function to Get all the Save Data According to the Item Code
    Public Shared Function GetAllSavedData(ByVal ObjDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataSet
        Try
            'Variable ffr the Company DBID
            Dim psCompanyDBId As String
            'Variable to get the SQl Query
            Dim psSQLHDR, psSQLDTL As String
            'Variable for the Item Code 
            Dim psFeatureid As Integer
            'Declare a Data set in which we will pass to UI
            Dim dsRecord As New DataSet
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            'Get the Company Name
            psCompanyDBId = NullToString(ObjDataTable.Rows(0)("CompanyDBId"))
            'Company Connection
            pObjCompany.CompanyDbName = psCompanyDBId
            'get the the Item Code Key 
            psFeatureid = ObjDataTable.Rows(0).Item("FeatureId")
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psFeatureid
            ' Get the Query on the basis of objIQuery
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataByFeatureCodeFromHDR)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLHDR, CommandType.Text, dsRecord, "OPCONFIG_FEATUREBOMHDR", pSqlParam)
            psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataByFeatureCodeFromDTL)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLDTL, CommandType.Text, dsRecord, "OPCONFIG_FEATUREBOMDTL", pSqlParam)
            Return dsRecord
        Catch ex As Exception
            ErrorLogging.LogError(ex)
            Return Nothing
        End Try
    End Function

    ''' <summary>
    ''' Function to Prepare Dataset ,which Line need to Updated and Which Lines need to Added
    ''' </summary>
    ''' <param name="objdsGenItem"></param>
    ''' <param name="tempds"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <remarks></remarks>

    Private Shared Sub PrepareFeatureBOMData(ByVal objdsFeatureBOM As DataTable, ByRef tempds As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company)
        'Variable Declaration for Datarow
        Dim pdr As DataRow
        'variable to get Item Code
        Dim psFeatureId As Integer
        'Integer Variable for LineID
        Dim piLineID As Integer
        'DataTable to get the Server DateTime
        Dim pdtServerDate As DataTable
        'varriable for Server Date Time
        Dim dtServerDate As DateTime
        'Get the Company DB 
        Dim psCmapnyDBID As String = NullToString(objdsFeatureBOM.Rows(0)("CompanyDBId"))
        ' Dim psCmapnyDBID As String = "DEVQAS2BRANCHING"
        'Function to get the Server Date Time
        pdtServerDate = BaseDL.GetServerDate(psCmapnyDBID, objCmpnyInstance)
        'Get Server Date
        dtServerDate = pdtServerDate.Rows(0)("DATEANDTIME")
        'get the DataView
        Dim tempDV As DataView = Nothing
        Dim tempDVReferalCheck As DataView = Nothing
        Dim tempDtRecord As DataTable
        For Each iFeaturetHdrRow As DataRow In objdsFeatureBOM.Rows
            'get Item Code
            psFeatureId = OptiPro.Config.Common.Utilites.NullToInteger(iFeaturetHdrRow("FeatureId"))
            tempDV = New DataView(tempds.Tables("OPCONFIG_FEATUREBOMHDR"))
            tempDV.RowFilter = StringFormat("OPTM_FEATUREID ='{0}'", psFeatureId)
            '  tempDV.RowFilter = StringFormat("OPTM_USERGROUP ='{1}' AND OPTM_ROLEID ='{2}'", AuthCode, UserCode, Roles)
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_MODIFIEDBY") = NullToString(iFeaturetHdrRow("CreatedUser"))
                tempDV(0)("OPTM_MODIFIEDDATE") = dtServerDate
            Else
                pdr = tempds.Tables("OPCONFIG_FEATUREBOMHDR").NewRow()
                pdr("OPTM_FEATUREID") = NullToInteger(iFeaturetHdrRow("FeatureId"))
                pdr("OPTM_COMPANYID") = NullToString(iFeaturetHdrRow("CompanyDBId"))
                pdr("OPTM_CREATEDBY") = NullToString(iFeaturetHdrRow("CreatedUser"))
                pdr("OPTM_CREATEDATE") = dtServerDate
                tempds.Tables("OPCONFIG_FEATUREBOMHDR").Rows.Add(pdr)
            End If
        Next
        'get all record from the Datatable
        tempDtRecord = GetAllRecordForCyclicCheck(psCmapnyDBID, objCmpnyInstance)
        'These will execute and add and update datain the detail table 
        For Each childRow As DataRow In objdsFeatureBOM.Rows
            'get the feature id for the child table
            Dim psChildFeatureId As Integer
            Dim psvalue As String
            'get the line id from the ui 
            Dim psLineId As Integer
            'get feture id
            psChildFeatureId = OptiPro.Config.Common.Utilites.NullToInteger(childRow("FeatureId"))
            'get the line id 
            psLineId = OptiPro.Config.Common.Utilites.NullToString(childRow("rowindex"))
            'new data view for the  detail table
            tempDV = New DataView(tempds.Tables("OPCONFIG_FEATUREBOMDTL"))
            'filter data according to the feature id and line id 
            tempDV.RowFilter = StringFormat("OPTM_FEATUREID ='{0}'and OPTM_LINENO='{1}'", psChildFeatureId, psLineId)
            'get the value for the value
            psvalue = OptiPro.Config.Common.Utilites.NullToString(childRow("type_value"))
            ''------------This Code is Used to check the Cyclic Dependency for the Feature,if F1 consist F2 Then F2 cannot Consist F1
            'If childRow("type") = 1 Then
            '    tempDVReferalCheck = New DataView(tempDtRecord)
            '    tempDVReferalCheck.RowFilter = StringFormat("OPTM_CHILDFEATUREID ='{0}' AND OPTM_FEATUREID ='{1}'", psFeatureId, psvalue)
            'End If
            ''-------------End Of the Referal Check --------------------
            'If the no record present then we will add and update 
            If tempDVReferalCheck.Count = 0 Then
                'if data is already present then we willupdate the data 
                If tempDV.Count > 0 Then
                    ''feature id
                    tempDV(0)("OPTM_FEATUREID") = childRow("FeatureId")
                    'type may be item or odel
                    tempDV(0)("OPTM_TYPE") = childRow("type")
                    'get the line number
                    tempDV(0)("OPTM_LINENO") = childRow("rowindex")
                    'get the child feature id 
                    If childRow("type") = 1 Then
                        tempDV(0)("OPTM_CHILDFEATUREID") = childRow("type_value")
                    End If
                    If childRow("type") = 2 Then
                        tempDV(0)("OPTM_ITEMKEY") = childRow("type_value")
                    Else
                        tempDV(0)("OPTM_ITEMKEY") = ""
                    End If
                    If childRow("type") = 3 Then
                        tempDV(0)("OPTM_VALUE") = childRow("type_value")
                    Else
                        tempDV(0)("OPTM_VALUE") = ""
                    End If
                    'get the display name 
                    tempDV(0)("OPTM_DISPLAYNAME") = childRow("display_name")
                    'get attachment ppath
                    If childRow.Table.Columns.Contains("attachment") Then
                        tempDV(0)("OPTM_ATTACHMENT") = childRow("attachment")
                    Else
                        tempDV(0)("OPTM_ATTACHMENT") = ""
                    End If
                    'get the Remarks
                    If childRow.Table.Columns.Contains("attachment") Then
                        'get the remarks
                        tempDV(0)("OPTM_REMARKS") = childRow("remark")
                    Else
                        tempDV(0)("OPTM_REMARKS") = ""
                    End If
                    'get company id
                    tempDV(0)("OPTM_COMPANYID") = childRow("CompanyDBId")
                    'get created user
                    tempDV(0)("OPTM_CREATEDBY") = childRow("createduser")
                    'get created date time 
                    tempDV(0)("OPTM_CREATEDATETIME") = dtServerDate
                    'get the Quantity
                    tempDV(0)("OPTM_Quantity") = childRow("quantity")
                Else
                    'if no record is found then we will add new record to the table 
                    pdr = tempds.Tables("OPCONFIG_FEATUREBOMDTL").NewRow()
                    'get the feature id
                    pdr("OPTM_FEATUREID") = childRow("FeatureId")
                    pdr("OPTM_TYPE") = childRow("type")
                    If childRow("type") = 1 Then
                        pdr("OPTM_CHILDFEATUREID") = childRow("type_value")
                    End If
                    If childRow("type") = 2 Then
                        pdr("OPTM_ITEMKEY") = childRow("type_value")
                    Else
                        pdr("OPTM_ITEMKEY") = ""
                    End If
                    If childRow("type") = 3 Then
                        pdr("OPTM_VALUE") = childRow("type_value")
                    Else
                        pdr("OPTM_VALUE") = ""
                    End If
                    pdr("OPTM_LINENO") = childRow("rowindex")
                    pdr("OPTM_DISPLAYNAME") = childRow("display_name")
                    pdr("OPTM_DEFAULT") = childRow("default")
                    pdr("OPTM_REMARKS") = childRow("remark")
                    pdr("OPTM_ATTACHMENT") = childRow("attachment")
                    pdr("OPTM_COMPANYID") = childRow("CompanyDBId")
                    pdr("OPTM_CREATEDBY") = childRow("CreatedUser")
                    pdr("OPTM_CREATEDATETIME") = dtServerDate
                    pdr("OPTM_QUANTITY") = childRow("quantity")
                    tempds.Tables("OPCONFIG_FEATUREBOMDTL").Rows.Add(pdr)
                End If
            End If
        Next
        Dim seqlist1 As String = ""
        tempDV = New DataView(objdsFeatureBOM)
        If tempDV.Count > 0 Then
            ' Filter Data According to row 
            tempDV.RowFilter = String.Format("IsNull(rowindex, 0) <> 0")
        End If
        For Each row In tempDV
            'For Getting the Sequence Number 
            If seqlist1 <> "" Then
                seqlist1 = seqlist1 & "," & "'" & NullToInteger(row("rowindex")) & "'"
            Else
                seqlist1 = "'" & NullToInteger(row("rowindex")) & "'"
            End If
        Next
        'if the Sequence is Present then Delete the Row 
        If seqlist1.Length > 0 Then
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_FEATUREBOMDTL"))
            deletedFGDV.RowFilter = String.Format("OPTM_LINENO Not in (" & seqlist1 & ") and IsNull(OPTM_LINENO, 0) <> 0")
            Dim tempRow As DataRow = Nothing
            For fgRowCnt As Integer = deletedFGDV.Count - 1 To 0 Step -1
                tempRow = deletedFGDV(fgRowCnt).Row
                tempRow.Delete()
            Next
        Else
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_FEATUREBOMDTL"))
            deletedFGDV.RowFilter = String.Format("IsNull(OPTM_LINENO, 0) <> 0")
            Dim tempRow As DataRow = Nothing
            For fgRowCnt As Integer = deletedFGDV.Count - 1 To 0 Step -1
                tempRow = deletedFGDV(fgRowCnt).Row
                tempRow.Delete()
            Next
        End If
    End Sub
    'This method will help to Update the Data set into the Database
    Public Shared Function updateDataSetToDataBase(psSQLforDS As String, objdsBatchSerialLinkData As DataSet, psForTable As String, ObjIConnection As IConnection) As Boolean
        Try
            Dim ObjInsertCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQLforDS, ObjIConnection.CompanyDBConnection, Nothing).GetInsertCommand()
            Dim ObjUpdateCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQLforDS, ObjIConnection.CompanyDBConnection, Nothing).GetUpdateCommand()
            Dim ObjDeleteCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQLforDS, ObjIConnection.CompanyDBConnection, Nothing).GetDeleteCommand()
            ObjIConnection.UpdateDataSet(ObjInsertCommand, ObjDeleteCommand, ObjUpdateCommand, objdsBatchSerialLinkData, psForTable)
            Return True
        Catch ex As Exception
            'If any error occurs we will return false
            ErrorLogging.LogError(ex)
            Return False
        End Try
    End Function
#End Region


    Public Shared Function GetDataForCommonView(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsItemData As DataSet
            Dim psTotalCount As Integer
            Dim piPageLimit As Integer
            If objDataTable.Columns.Contains("PageLimit") Then
                '  get Search String,
                piPageLimit = NullToInteger(objDataTable.Rows(0)("PageLimit"))
            Else
                'if there is no Column then we will be Coonsider page Limit as 25 
                piPageLimit = 25
            End If
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'psCompanyDBId = "DEVQAS2BRANCHING"
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim psSearchString As String
            'Variable to Fet Starting Limit and The End Limit
            Dim piStartCount, piEndCount As Integer
            Dim piPageNumber As Integer
            'get the PAge Number which is Coming from UI 
            ' piPageNumber = NullToInteger(objDataTable.Rows(0)("PageNumber"))
            piPageNumber = NullToInteger(objDataTable.Rows(0)("PageNumber"))
            'get the Search String 
            If objDataTable.Columns.Contains("SearchString") Then
                '  get the Model Template Item,
                psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psSearchString = ""
            End If
            'logic to get the End Count 
            piEndCount = piPageNumber * piPageLimit
            'Logic to get the Starting Count 
            If piPageNumber = 1 Then
                piStartCount = 0
            Else
                piStartCount = piEndCount - piPageLimit + 1
            End If
            If psSearchString.Length > 0 Then
                Dim pSqlParam(3) As MfgDBParameter
                'Parameter 0 consisting warehouse and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@STARTCOUNT"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = piStartCount

                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@ENDCOUNT"
                pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(1).Paramvalue = piEndCount

                pSqlParam(3) = New MfgDBParameter
                pSqlParam(3).ParamName = "@SEARCHSTRING"
                pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(3).Paramvalue = psSearchString

                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForCommonViewBySearchCriteria)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
                'here we need to Replace the Serach String 
                psSQL = psSQL.Replace("@SEARCHSTRING", psSearchString)
            Else
                Dim pSqlParam(2) As MfgDBParameter
                'Parameter 0 consisting warehouse and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@ENDCOUNT"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = piEndCount

                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@STARTCOUNT"
                pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(1).Paramvalue = piStartCount

                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForCommonView)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
            End If
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'function to get Total Count of Record 
            Dim dtTotalCount As DataTable
            dtTotalCount = GetTotalCountOfRecordForFeatureBOM(psCompanyDBId, objCmpnyInstance)
            psTotalCount = NullToInteger(dtTotalCount.Rows(0)("TOTALCOUNT"))
            'Create a Datatable 
            Dim objdtOrderedData As New DataTable
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("#", GetType(Integer))
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("ID", GetType(String))
            'Add new Column to Datatble 
            objdtOrderedData.Columns.Add("DISPLAYNAME", GetType(String))
            'Add new Column to Datatble 
            objdtOrderedData.Columns.Add("Action", GetType(String))
            Dim Counter As Integer = 1
            'Loop to Insert Value to Action and Sequence 
            For irow As Integer = 0 To pdsItemData.Tables(0).Rows.Count - 1
                objdtOrderedData.Rows.Add(Counter, pdsItemData.Tables(0).Rows(irow)("OPTM_FEATUREID"), pdsItemData.Tables(0).Rows(irow)("OPTM_DISPLAYNAME"), pdsItemData.Tables(0).Rows(irow)("OPTM_FEATUREID"))
                Counter = Counter + 1
            Next
            Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()
            serializer.MaxJsonLength = Integer.MaxValue
            Dim rows As New Collection
            Dim final_array As New Collection
            Dim row As Dictionary(Of String, Object) = Nothing
            For Each dr As DataRow In objdtOrderedData.Rows
                Dim temp_array As New Collection
                row = New Dictionary(Of String, Object)()
                For Each dc As DataColumn In objdtOrderedData.Columns
                    temp_array.Add(dr.Item(dc))
                Next
                rows.Add(temp_array)
            Next
            final_array.Add(rows)
            final_array.Add(psTotalCount)
            Return serializer.Serialize(final_array)
            ' Return objdtOrderedData
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetTotalCountOfRecordForFeatureBOM(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = objCompanyDBID
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTotalCountOfRecordForFeatureBOM)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllRecordForCyclicCheck(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsRecord As DataSet
            'Get the Company Name
            psCompanyDBId = objCompanyDBID
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllRecordForCyclicCheck)
            pdsRecord = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsRecord.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function GetDataByFeatureID(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataSet

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQLHDR As String = String.Empty
            Dim psSQLDTL As String = String.Empty
            Dim dsRecord As New DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim psFeatureId As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the ItemCode name  
            psFeatureId = NullToInteger(objDataTable.Rows(0)("FeatureId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureId
            ' Get the Query on the basis of objIQuery
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetFeatureDetail)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLHDR, CommandType.Text, dsRecord, "FeatureHeader", pSqlParam)
            psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataByFeatureCodeFromDTL)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLDTL, CommandType.Text, dsRecord, "FeatureDetail", pSqlParam)
            Return dsRecord
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function DeleteFeatureFromHDRandDTL(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQLHDR As String = String.Empty
            Dim psSQLDTL As String = String.Empty
            Dim iDeleteRecordHDR, iDeleteRecordDTL As Integer
            Dim dsRecord As New DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim psFeatureId As Integer
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

            For iRecord As Integer = 0 To objDataTable.Rows.Count - 1
                'get the ItemCode name  
                psFeatureId = NullToInteger(objDataTable.Rows(iRecord)("FeatureId"))
                Dim pSqlParam(1) As MfgDBParameter
                'Parameter 0 consisting itemCode and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@FEATUREID"
                pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(0).Paramvalue = psFeatureId
                ' Get the Query on the basis of objIQuery
                psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteDataFromHDR)
                iDeleteRecordHDR = (ObjIConnection.ExecuteNonQuery(psSQLHDR, CommandType.Text, pSqlParam))
                If iDeleteRecordHDR > 0 Then
                    psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteDataFromDTL)
                    iDeleteRecordDTL = (ObjIConnection.ExecuteNonQuery(psSQLDTL, CommandType.Text, pSqlParam))
                    If iDeleteRecordDTL > 0 Then
                        psStatus = "True"
                    Else
                        psStatus = "False"
                    End If
                End If
            Next

            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
            psStatus = ex.Message.ToString
        End Try
        Return psStatus
    End Function


    Public Shared Function GetDataForExplodeViewForFeatureBOM(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psFeatureID As String = NullToString(objDataTable.Rows(0)("FeatureID"))
            Dim psSQL As String = String.Empty
            Dim pdsFeatureDetail As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Get the Feature ID From the Datatable 
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForExplodeViewForFeatureBOM)
            'get the Result of Query in Dataset
            pdsFeatureDetail = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'Returns A DataTable 
            'Create a Datatable 
            Dim objdtOrderedData As New DataTable
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("sequence", GetType(Integer))
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("parentId", GetType(String))
            'Add new Column to Datatble 
            objdtOrderedData.Columns.Add("component", GetType(String))
            'Add Column 
            objdtOrderedData.Columns.Add("level", GetType(String))
            Dim counter As Integer = 1
            'For iRecord As Integer = 0 To pdsFeatureDetail.Tables(0).Rows.Count - 1
            '    'variable to get parent Feature ID
            '    Dim tempParentFeatureID As Integer
            '    'variable to get Item key 
            '    Dim tempitemkey As String
            '    'avariable to get value for Item Value
            '    Dim tempvalue As String
            '    tempParentFeatureID = NullToInteger(pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_FEATUREID"))
            '    tempitemkey = NullToString((pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_ITEMKEY")))
            '    tempvalue = NullToString((pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_VALUE")))
            '    Dim tempChildId As String = NullToString(pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_CHILDFEATUREID"))
            '    'dataView
            '    Dim tempDV As DataView
            '    Dim tempDV1, tempDataView2, tempDataView3 As DataView
            '    'get the data from the Parent Table 
            '    tempDV = New DataView(pdsFeatureDetail.Tables(0))
            '    'Filter the Data  According  to Feature ID
            '    tempDV.RowFilter = StringFormat("OPTM_FEATUREID ='{0}'", tempParentFeatureID)
            '    'filter the Data According to the Child Feature ID from the table 
            '    tempDataView2 = New DataView(pdsFeatureDetail.Tables(0))
            '    tempDataView2.RowFilter = StringFormat("OPTM_CHILDFEATUREID ='{0}'", tempParentFeatureID)
            '    'Filter the Data which we are Making and Find the Count of it 
            '    tempDataView3 = New DataView(objdtOrderedData)
            '    tempDataView3.RowFilter = StringFormat("component ='{0}' ", tempParentFeatureID)
            '    Dim tempDVCount As Integer = tempDataView3.Count - 1

            '    If tempDataView3.Count = 0 Then
            '        tempDVCount = 0
            '    Else
            '        tempDVCount = tempDataView3.Count - 1
            '    End If

            '    'this will get all the Parents with parent ID as blank 
            '    If tempDataView2.Count = 0 And tempDataView3.Count = 0 Then
            '        objdtOrderedData.Rows.Add(counter, "", tempParentFeatureID, 0)
            '        counter = counter + 1
            '    End If

            '    If tempChildId.Length = 0 Then
            '        If tempitemkey.Length > 0 Then
            '            tempChildId = tempitemkey
            '        Else
            '            tempChildId = tempvalue
            '        End If
            '    End If
            '    tempDV1 = New DataView(objdtOrderedData)
            '    tempDV1.RowFilter = StringFormat("component ='{0}' and ParentId = '{1}'", tempChildId, tempParentFeatureID)
            '    Dim piLevel As Integer = 1
            '    'if tempDVView Count 
            '    If tempDataView3.Count > 0 Then
            '        piLevel = NullToInteger(tempDataView3(tempDVCount)("level")) + 1
            '    End If

            '    If tempDV1.Count = 0 Then
            '        If tempDV.Count > 0 Then
            '            For iChildRecord As Integer = 0 To tempDV.Count - 1
            '                'piLevel = piLevel + 1
            '                Dim psParentId As String = NullToInteger(tempDV(iChildRecord)("OPTM_FEATUREID"))
            '                Dim psChildID As String = NullToString((tempDV(iChildRecord)("OPTM_CHILDFEATUREID")))
            '                If (psChildID.Length > 0) Then
            '                    objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_CHILDFEATUREID"), piLevel)
            '                    counter = counter + 1
            '                ElseIf NullToString((tempDV(iChildRecord)("OPTM_ITEMKEY").Length > 0)) Then
            '                    objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_ITEMKEY"), piLevel)
            '                    counter = counter + 1
            '                ElseIf NullToString((tempDV(iChildRecord)("OPTM_VALUE").Length > 0)) Then
            '                    objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_VALUE"), piLevel)
            '                    counter = counter + 1
            '                End If
            '            Next
            '            'Else
            '            '    objdtOrderedData.Rows.Add(counter, "", tempParentFeatureID, 0)
            '            '    counter = counter + 1
            '        End If
            '    End If
            '    If (tempitemkey.Length > 0) And tempDataView3.Count = 0 Then

            '        piLevel = piLevel + 1
            '        objdtOrderedData.Rows.Add(counter, tempParentFeatureID, tempitemkey, piLevel)
            '        counter = counter + 1
            '    ElseIf (tempvalue.Length > 0) And tempDataView3.Count = 0 Then
            '        piLevel = piLevel + 1
            '        objdtOrderedData.Rows.Add(counter, tempParentFeatureID, tempvalue, piLevel)
            '        counter = counter + 1
            '    End If
            'Next
            Dim tempDV As DataView
            Dim psChildFeatureID As String
            Dim piLevel As Integer = 0
            'to fill for the Parent dATA 
            objdtOrderedData.Rows.Add(counter, "", psFeatureID, 0)
            counter = counter + 1
            For iRecordDetail As Integer = 0 To pdsFeatureDetail.Tables(0).Rows.Count - 1
                piLevel = piLevel + 1
                tempDV = New DataView(pdsFeatureDetail.Tables(0))
                tempDV.RowFilter = String.Format("OPTM_FEATUREID IN (" & psFeatureID & ")")
                'to fill Parent record 
                If tempDV.Count > 0 Then
                    psFeatureID = "0"
                    For irecord As Integer = 0 To tempDV.Count - 1
                        If NullToString(tempDV(irecord)("OPTM_ITEMKEY")).Length > 0 Then
                            objdtOrderedData.Rows.Add(counter, tempDV(irecord)("OPTM_FEATUREID"), tempDV(irecord)("OPTM_ITEMKEY"), piLevel)
                            counter = counter + 1
                        ElseIf NullToString(tempDV(irecord)("OPTM_VALUE")).Length > 0 Then
                            objdtOrderedData.Rows.Add(counter, tempDV(irecord)("OPTM_FEATUREID"), tempDV(irecord)("OPTM_VALUE"), piLevel)
                            counter = counter + 1
                        Else
                            objdtOrderedData.Rows.Add(counter, tempDV(irecord)("OPTM_FEATUREID"), tempDV(irecord)("OPTM_CHILDFEATUREID"), piLevel)
                            counter = counter + 1
                            psChildFeatureID = tempDV(irecord)("OPTM_CHILDFEATUREID")
                            psFeatureID = psFeatureID & "," & "'" & psChildFeatureID & "'"
                        End If
                    Next
                End If
            Next
            Return objdtOrderedData
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function CheckValidFeatureIdEnteredForFeatureBOM(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim dsRecord As New DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim psFeatureId As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the ItemCode name  
            psFeatureId = NullToString(objDataTable.Rows(0)("FeatureId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureId
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckValidFeatureIdEnteredForFeatureBOM)
            'This method will fill the same dataset with table ParentTable
            dsRecord = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            If dsRecord.Tables(0).Rows(0)("TOTALCOUNT") > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
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
