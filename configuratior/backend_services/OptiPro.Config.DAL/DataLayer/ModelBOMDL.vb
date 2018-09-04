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


    Public Shared Function GetModelList(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pressLoaction As String = String.Empty
            Dim rowid As String = String.Empty
            Dim psModelid As Integer
            Dim pdsGetData As New DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            If objDataTable.Columns.Contains("ModelID") Then
                '  get the FeatureID,
                psModelid = NullToInteger(objDataTable.Rows(0)("ModelID"))
            End If
            'get the Press Location 
            '   pressLoaction = NullToString(objDataTable.Rows(0)("pressLocation"))
            'get the ROW ID 
            '  rowid = NullToString(objDataTable.Rows(0)("rowid"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery

            If psModelid > 0 And objDataTable.Columns.Contains("ModelID") Then
                Dim pSqlParam(1) As MfgDBParameter
                'Parameter 0 consisting featureID and it will be of Integer
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@MODELID"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = psModelid

                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDetailForModel)
                pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Else

                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetModelList)
                pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            End If

            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function










    ''' <summary>
    ''' Function to get the Price list fromthe table
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetPriceList(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psItemKey As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsPriceList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            psItemKey = NullToString(objDataTable.Rows(0)("ItemKey"))
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetPriceList)
            pdsPriceList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsPriceList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetDetailForModel(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psModelID As Integer
            Dim psSQL As String = String.Empty
            Dim pdsFeatureDetail As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Get the Feature ID From the Datatable 
            psModelID = NullToInteger(objDataTable.Rows(0)("ModelID"))

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
            pSqlParam(0).ParamName = "@MODELID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psModelID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDetailForModel)
            'get the Result of Query in Dataset
            pdsFeatureDetail = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            'Returns A DataTable 
            Return pdsFeatureDetail.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

#Region "Add Update Delete Through Update dataset "
    Public Shared Function AddUpdateModelBOM(ByVal ObjDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
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
            Dim pdsModelBOMData As DataSet
            'Get all the Saved Record For the Particular Item Code
            pdsModelBOMData = ModelBOMDL.GetAllSavedData(ObjDataTable, objCmpnyInstance)
            'PreaParing the Dataset ,Which Entry is to be Updated and Added
            PrepareFeatureBOMData(ObjDataTable, pdsModelBOMData, objCmpnyInstance)
            For index As Integer = 0 To pdsModelBOMData.Tables.Count - 1
                'Get the Table Name
                psForTable = pdsModelBOMData.Tables.Item(index).TableName
                'Get the Table structure with a Generic Query
                psSQLforDS = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTableStructure)
                'at runtime we will replace the "select * from ...." query with the Table name at current Index
                psSQLforDS = psSQLforDS.Replace("@TABLENAME", psForTable)
                'Call method with coresponding params needed
                bUpdate = updateDataSetToDataBase(psSQLforDS, pdsModelBOMData, psForTable, ObjIConnection)
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
            Dim psModelID As Integer
            'Declare a Data set in which we will pass to UI
            Dim dsRecord As New DataSet
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            'Get the Company Name
            psCompanyDBId = NullToString(ObjDataTable.Rows(0)("CompanyDBId"))
            'Company Connection
            pObjCompany.CompanyDbName = psCompanyDBId
            'get the the Item Code Key 
            psModelID = ObjDataTable.Rows(0).Item("ModelId")
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@MODELID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psModelID

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@COMPANYID"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psCompanyDBId

            ' Get the Query on the basis of objIQuery
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataByModelIdFromHDR)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLHDR, CommandType.Text, dsRecord, "OPCONFIG_MBOMHDR", pSqlParam)
            psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataByModelIdFromDTL)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLDTL, CommandType.Text, dsRecord, "OPCONFIG_MBOMDTL", pSqlParam)
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
        Dim psModelId As Integer
        'DataTable to get the Server DateTime
        Dim pdtServerDate As DataTable
        'varriable for Server Date Time
        Dim dtServerDate As DateTime
        'Get the Company DB 
        Dim psCmapnyDBID As String = NullToString(objdsFeatureBOM.Rows(0)("CompanyDBId"))
        'Function to get the Server Date Time
        pdtServerDate = BaseDL.GetServerDate(psCmapnyDBID, objCmpnyInstance)
        'Get Server Date
        dtServerDate = pdtServerDate.Rows(0)("DATEANDTIME")
        'get the DataView
        Dim tempDV As DataView = Nothing
        For Each iModelBOMHdrRow As DataRow In objdsFeatureBOM.Rows
            'get Item Code
            psModelId = OptiPro.Config.Common.Utilites.NullToInteger(iModelBOMHdrRow("ModelId"))
            psCmapnyDBID = OptiPro.Config.Common.Utilites.NullToString(iModelBOMHdrRow("CompanyDBId"))
            tempDV = New DataView(tempds.Tables("OPCONFIG_MBOMHDR"))
            tempDV.RowFilter = StringFormat("OPTM_MODELID ='{0}' AND OPTM_COMPANYID='{1}'", psModelId, psCmapnyDBID)
            '  tempDV.RowFilter = StringFormat("OPTM_USERGROUP ='{1}' AND OPTM_ROLEID ='{2}'", AuthCode, UserCode, Roles)
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_READYTOUSE") = NullToString(iModelBOMHdrRow("ReadyToUse"))
                tempDV(0)("OPTM_MODIFIEDBY") = NullToString(iModelBOMHdrRow("CreatedUser"))
                tempDV(0)("OPTM_MODIFIEDDATETIME") = dtServerDate
            Else
                pdr = tempds.Tables("OPCONFIG_MBOMHDR").NewRow()
                pdr("OPTM_MODELID") = NullToInteger(iModelBOMHdrRow("ModelId"))
                pdr("OPTM_DESCRIPTION") = NullToString(iModelBOMHdrRow("description"))
                pdr("OPTM_READYTOUSE") = NullToString(iModelBOMHdrRow("readytouse"))
                pdr("OPTM_COMPANYID") = NullToString(iModelBOMHdrRow("CompanyDBId"))
                pdr("OPTM_CREATEDBY") = NullToString(iModelBOMHdrRow("CreatedUser"))
                pdr("OPTM_CREATEDDATETIME") = dtServerDate
                tempds.Tables("OPCONFIG_MBOMHDR").Rows.Add(pdr)
            End If
        Next
        'These will execute and add and update datain the detail table 
        For Each childRow As DataRow In objdsFeatureBOM.Rows
            'get the feature id for the child table
            Dim psChildModelId As Integer
            'get the line id from the ui 
            Dim psLineId As Integer
            'get feture id
            psChildModelId = OptiPro.Config.Common.Utilites.NullToInteger(childRow("ModelId"))
            'get the line id 
            psLineId = OptiPro.Config.Common.Utilites.NullToString(childRow("rowindex"))
            'new data view for the  detail table
            tempDV = New DataView(tempds.Tables("OPCONFIG_MBOMDTL"))
            'filter data according to the feature id and line id 
            tempDV.RowFilter = StringFormat("OPTM_MODELID ='{0}'and OPTM_LINENO='{1}'", psChildModelId, psLineId)
            ' tempDV.RowFilter = StringFormat("OPTM_CODE ='{0}'and OPTM_LINEID= '{1}'", psItemCode, piLineID)
            'if data is already present then we willupdate the data 
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_TYPE") = childRow("type")
                If childRow("type") = 1 Then
                    tempDV(0)("OPTM_FEATUREID") = childRow("type_value")
                End If
                If childRow("type") = 2 Then
                    tempDV(0)("OPTM_CHILDMODELID") = childRow("type_value")
                End If
                If childRow("type") = 3 Then
                    tempDV(0)("OPTM_ITEMKEY") = childRow("type_value")
                End If
                tempDV(0)("OPTM_LINENO") = childRow("rowindex")
                tempDV(0)("OPTM_DISPLAYNAME") = childRow("display_name")
                tempDV(0)("OPTM_UOM") = childRow("uom")
                tempDV(0)("OPTM_QUANTITY") = childRow("quantity")
                tempDV(0)("OPTM_MINSELECTABLE") = childRow("min_selected")
                tempDV(0)("OPTM_MAXSELECTABLE") = childRow("max_selected")
                tempDV(0)("OPTM_PROPOGATEQTY") = childRow("propagate_qty")
                tempDV(0)("OPTM_PRICESOURCE") = childRow("price_source")
                tempDV(0)("OPTM_MANDATORY") = childRow("mandatory")
                tempDV(0)("OPTM_UNIQUEIDNT") = childRow("unique_identifer")
                tempDV(0)("OPTM_COMPANYID") = childRow("CompanyDBId")
                tempDV(0)("OPTM_MODIFIEDBY") = childRow("CreatedUser")
                tempDV(0)("OPTM_MODIFIEDDATETIME") = dtServerDate

            Else
                'if no record is found then we will add new record to the table 
                pdr = tempds.Tables("OPCONFIG_MBOMDTL").NewRow()
                'get the feature id_M
                pdr("OPTM_MODELID") = childRow("ModelId")
                pdr("OPTM_TYPE") = childRow("type")
                If childRow("type") = 1 Then
                    pdr("OPTM_FEATUREID") = childRow("type_value")
                End If
                If childRow("type") = 2 Then
                    pdr("OPTM_CHILDMODELID") = childRow("type_value")
                End If
                If childRow("type") = 3 Then
                    pdr("OPTM_ITEMKEY") = childRow("type_value")
                End If
                pdr("OPTM_LINENO") = childRow("rowindex")
                pdr("OPTM_DISPLAYNAME") = childRow("display_name")
                pdr("OPTM_UOM") = childRow("uom")
                pdr("OPTM_QUANTITY") = childRow("quantity")
                pdr("OPTM_MINSELECTABLE") = childRow("min_selected")
                pdr("OPTM_MAXSELECTABLE") = childRow("max_selected")
                pdr("OPTM_PROPOGATEQTY") = childRow("propagate_qty")
                pdr("OPTM_PRICESOURCE") = childRow("price_source")
                pdr("OPTM_MANDATORY") = childRow("mandatory")
                pdr("OPTM_UNIQUEIDNT") = childRow("unique_identifer")
                pdr("OPTM_COMPANYID") = childRow("CompanyDBId")
                pdr("OPTM_CREATEDBY") = childRow("CreatedUser")
                pdr("OPTM_CREATEDATETIME") = dtServerDate
                tempds.Tables("OPCONFIG_MBOMDTL").Rows.Add(pdr)
            End If
        Next
    End Sub
    'This method will help to Update the Data set into the Database
#End Region


    'Query to Delete the data from the Header and child table for the Model Bom Header and Child Table
    Public Shared Function DeleteModelBOMFromHDRandDTL(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQLHDR As String = String.Empty
            Dim psSQLDTL As String = String.Empty
            Dim iDeleteRecordHDR, iDeleteRecordDTL As Integer
            Dim dsRecord As New DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim piModelId As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the ItemCode name  
            piModelId = NullToInteger(objDataTable.Rows(0)("ModelId"))
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
            pSqlParam(0).ParamName = "@MODELID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piModelId

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@COMPANYID"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psCompanyDBId

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
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
            psStatus = ex.Message.ToString
        End Try
        Return psStatus
    End Function



    Public Shared Function GetDataForCommonViewForModelBOM(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
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
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForCommonViewForModelBOMBySearchCriteria)
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
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForCommonViewForModelBOM)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
            End If
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'function to get Total Count of Record 
            Dim dtTotalCount As DataTable
            dtTotalCount = GetTotalCountOfRecordForModelBOM(psCompanyDBId, objCmpnyInstance)
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
                objdtOrderedData.Rows.Add(Counter, pdsItemData.Tables(0).Rows(irow)("OPTM_MODELID"), pdsItemData.Tables(0).Rows(irow)("OPTM_DISPLAYNAME"), pdsItemData.Tables(0).Rows(irow)("OPTM_MODELID"))
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

    Public Shared Function GetTotalCountOfRecordForModelBOM(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTotalCountOfRecordForModelBOM)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetDataByModelID(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataSet
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQLHDR As String = String.Empty
            Dim psSQLDTL As String = String.Empty
            Dim dsRecord As New DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim piModelId As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the ItemCode name  
            piModelId = NullToInteger(objDataTable.Rows(0)("ModelId"))
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
            pSqlParam(0).ParamName = "@MODELID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = piModelId
            ' Get the Query on the basis of objIQuery
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDetailForModel)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLHDR, CommandType.Text, dsRecord, "ModelHeader", pSqlParam)
            psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForModelDTL)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLDTL, CommandType.Text, dsRecord, "ModelDetail", pSqlParam)
            Return dsRecord
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function
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




End Class
