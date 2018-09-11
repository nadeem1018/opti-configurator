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


Public Class RuleWorkBenchDL

    Public Shared Function GetAllFeatureForRuleWorkBench(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsGetData As New DataSet
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllFeatureForRuleWorkBench)
                pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllDetailsForFeature(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsGetData As New DataSet
            Dim psFeatureId As Integer = 29
            Dim tempDV As DataView
            Dim tempDV1, tempDVfeatureData As DataView
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllDetailsForFeature)
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'Create a Datatable 
            Dim objdtFeatureData As New DataTable
            'Add Column to the Datatable 
            objdtFeatureData.Columns.Add("Item", GetType(String))
            'Add Column to the Datatable 
            objdtFeatureData.Columns.Add("DisplayName", GetType(String))
            objdtFeatureData.Columns.Add("FeatureId", GetType(String))
            Dim psChildFeatureID As Integer
            For iRecordDetail As Integer = 0 To pdsGetData.Tables(0).Rows.Count - 1
                tempDV = New DataView(pdsGetData.Tables(0))
                'Filter the Data  According  to Feature ID
                tempDV.RowFilter = StringFormat("OPTM_FEATUREID ='{0}'", psFeatureId)
                tempDVfeatureData = New DataView(objdtFeatureData)
                tempDVfeatureData.RowFilter = StringFormat("FeatureId ='{0}'", psFeatureId)
                If tempDVfeatureData.Count = 0 Then
                    If tempDV.Count > 0 Then
                        For irecord As Integer = 0 To tempDV.Count - 1
                            psChildFeatureID = NullToInteger(tempDV(irecord)("OPTM_CHILDFEATUREID"))
                            If psChildFeatureID > 0 Then
                                tempDV1 = New DataView(pdsGetData.Tables(0))
                                'Filter the Data  According  to Feature ID
                                tempDV1.RowFilter = StringFormat("OPTM_FEATUREID ='{0}'", psChildFeatureID)
                                If tempDV1.Count > 0 Then
                                    For iItemrecord As Integer = 0 To tempDV1.Count - 1
                                        If tempDV1(iItemrecord)("OPTM_ITEMKEY").LENGTH > 0 Then
                                            objdtFeatureData.Rows.Add(tempDV1(iItemrecord)("OPTM_ITEMKEY"), tempDV1(iItemrecord)("OPTM_DISPLAYNAME"), tempDV1(iItemrecord)("OPTM_FEATUREID"))
                                        ElseIf tempDV1(iItemrecord)("OPTM_VALUE").LENGTH > 0 Then
                                            objdtFeatureData.Rows.Add(tempDV1(iItemrecord)("OPTM_VALUE"), tempDV1(iItemrecord)("OPTM_DISPLAYNAME"), tempDV1(iItemrecord)("OPTM_FEATUREID"))
                                        Else
                                            psFeatureId = psChildFeatureID
                                            Exit For
                                        End If
                                    Next
                                End If
                            ElseIf tempDV(irecord)("OPTM_ITEMKEY").LENGTH > 0 Then
                                objdtFeatureData.Rows.Add(tempDV(irecord)("OPTM_ITEMKEY"), tempDV(irecord)("OPTM_DISPLAYNAME"), tempDV(irecord)("OPTM_FEATUREID"))
                            ElseIf tempDV(irecord)("OPTM_VALUE").LENGTH > 0 Then
                                objdtFeatureData.Rows.Add(tempDV(irecord)("OPTM_VALUE"), tempDV(irecord)("OPTM_DISPLAYNAME"), tempDV(irecord)("OPTM_FEATUREID"))
                            End If
                        Next
                    End If
                End If
            Next
            Return objdtFeatureData
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function




    Public Shared Function GetAllModelsForRuleWorkBench(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsGetData As New DataSet
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllModelsForRuleWorkBench)
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

   
    Public Shared Function CheckValidModelEntered(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim piModelId As Integer
            Dim psSQL As String = String.Empty
            Dim pdsModelList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
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
            'Parameter 0 consisting featureID and it will be of Integer
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@MODELID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piModelId
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckValidModelEntered)
            pdsModelList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            If (pdsModelList.Tables(0).Rows(0)("TOTALCOUNT") > 0) Then
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


    Public Shared Function CheckValidFeatureEntered(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim piFeatureId As Integer
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            piFeatureId = NullToInteger(objDataTable.Rows(0)("FeatureId"))
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
            pSqlParam(0).Paramvalue = piFeatureId
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckValidFeatureEntered)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            If (pdsFeatureList.Tables(0).Rows(0)("TOTALCOUNT") > 0) Then
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

    

#Region "Add Update Delete Through Update dataset "
    Public Shared Function AddUpdateDataForRuleWorkBench(ByVal objDataset As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            'Variable to get the Company ID
            Dim psCompanyDBId As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataset.Tables(0).Rows(0)("CompanyDBId"))
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
            pdsModelBOMData = RuleWorkBenchDL.GetAllSavedData(objDataset, objCmpnyInstance)
            'PreaParing the Dataset ,Which Entry is to be Updated and Added
            PrepareRuleWBData(objDataset, pdsModelBOMData, objCmpnyInstance)
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
    Public Shared Function GetAllSavedData(ByVal objDataset As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataSet
        Try
            'Variable ffr the Company DBID
            Dim psCompanyDBId As String
            'Variable to get the SQl Query
            Dim psSQLHDR, psSQLDTL, psSQLItem As String
            'Variable for the Item Code 
            Dim piRuleID As Integer
            'Declare a Data set in which we will pass to UI
            Dim dsRecord As New DataSet
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            'Get the Company Name
            psCompanyDBId = NullToString(objDataset.Tables(0).Rows(0)("CompanyDBId"))
            'Company Connection
            pObjCompany.CompanyDbName = psCompanyDBId
            'get the the Item Code Key 
            piRuleID = NullToInteger(objDataset.Tables(0).Rows(0).Item("RuleId"))
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@RULEID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piRuleID
            ' Get the Query on the basis of objIQuery
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataFromRuleHDR)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLHDR, CommandType.Text, dsRecord, "OPCONFIG_RULEHEADER", pSqlParam)
            psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataFromRuleInput)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLDTL, CommandType.Text, dsRecord, "OPCONFIG_RULEINPUT", pSqlParam)
            psSQLItem = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetSavedDataFromRuleOutput)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQLItem, CommandType.Text, dsRecord, "OPCONFIG_RULEOUTPUT", pSqlParam)
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

    Private Shared Sub PrepareRuleWBData(ByVal objdsRuleWB As DataSet, ByRef tempds As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company)
        'Variable Declaration for Datarow
        Dim pdr As DataRow
        'variable to get Item Code
        Dim psRuleId As Integer
        'DataTable to get the Server DateTime
        Dim pdtServerDate As DataTable
        'varriable for Server Date Time
        Dim dtServerDate As DateTime
        'get the Data for the Record 
        Dim tempDtRecord As DataTable
        'Get the Company DB 
        Dim psCmapnyDBID As String = NullToString(objdsRuleWB.Tables(0).Rows(0)("CompanyDBId"))
        'Function to get the Server Date Time
        pdtServerDate = BaseDL.GetServerDate(psCmapnyDBID, objCmpnyInstance)
        'Get Server Date
        dtServerDate = pdtServerDate.Rows(0)("DATEANDTIME")
        'get the DataView
        Dim tempDV As DataView = Nothing
        Dim tempDVReferalCheck As DataView = Nothing

        For Each iModelBOMHdrRow As DataRow In objdsRuleWB.Tables(0).Rows
            'get Item Code
            psRuleId = OptiPro.Config.Common.Utilites.NullToInteger(iModelBOMHdrRow("ModelId"))
            psCmapnyDBID = OptiPro.Config.Common.Utilites.NullToString(iModelBOMHdrRow("CompanyDBId"))
            tempDV = New DataView(tempds.Tables("OPCONFIG_RULEHEADER"))
            tempDV.RowFilter = StringFormat("OPTM_MODELID ='{0}' AND OPTM_COMPANYID='{1}'", psRuleId, psCmapnyDBID)
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_READYTOUSE") = NullToString(iModelBOMHdrRow("ReadyToUse"))
                tempDV(0)("OPTM_MODIFIEDBY") = NullToString(iModelBOMHdrRow("CreatedUser"))
                tempDV(0)("OPTM_MODIFIEDDATETIME") = dtServerDate
            Else
                pdr = tempds.Tables("OPCONFIG_RULEHEADER").NewRow()
                pdr("OPTM_RULECODE") = NullToInteger(iModelBOMHdrRow("rule_code"))
                pdr("OPTM_DESCRIPTION") = NullToString(iModelBOMHdrRow("description"))
                pdr("OPTM_EFFECTIVEFROM") = NullToString(iModelBOMHdrRow("effective_from"))
                pdr("OPTM_EFFECTIVETO") = NullToString(iModelBOMHdrRow("effective_to"))
                pdr("OPTM_DISCONTINUE") = NullToString(iModelBOMHdrRow("discontinue"))
                pdr("OPTM_APPLICABLEFOR") = NullToString(iModelBOMHdrRow("applicablefor"))
                pdr("OPTM_COMPANYID") = NullToString(iModelBOMHdrRow("CompanyDBId"))
                pdr("OPTM_CREATEDBY") = NullToString(iModelBOMHdrRow("CreatedUser"))
                pdr("OPTM_CREATEDDATETIME") = dtServerDate
                tempds.Tables("OPCONFIG_RULEHEADER").Rows.Add(pdr)
            End If
        Next
        For Each childRow As DataRow In objdsRuleWB.Tables(1).Rows
            'get the feature id for the child table
            Dim psChildRuleId As Integer
            'get the line id from the ui 
            Dim piSeqId, piRowId As Integer
            Dim psValue As String
            'get feture id
            psChildRuleId = OptiPro.Config.Common.Utilites.NullToInteger(childRow("RuleId"))
            'get the Seq id 
            piSeqId = OptiPro.Config.Common.Utilites.NullToString(childRow("rowindex"))
            'get the Row ID
            piRowId = OptiPro.Config.Common.Utilites.NullToString(childRow("rowindex"))
            'new data view for the  detail table
            tempDV = New DataView(tempds.Tables("OPCONFIG_RULEINPUT"))
            'filter data according to the feature id and line id 
            tempDV.RowFilter = StringFormat("OPTM_RULEID ='{0}'AND OPTM_SEQID='{1}' AND OPTM_ROWID='{2}'", psChildRuleId, piSeqId, piRowId)
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_LINENO") = childRow("rowindex")
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
                    pdr("OPTM_ITEMKEY") = childRow("type_value")
                End If
                If childRow("type") = 3 Then
                    pdr("OPTM_CHILDMODELID") = childRow("type_value")
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
        Dim seqlist1 As String = ""
        tempDV = New DataView(objdsRuleWB.Tables(1))
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
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_MBOMDTL"))
            deletedFGDV.RowFilter = String.Format("OPTM_LINENO Not in (" & seqlist1 & ") and IsNull(OPTM_LINENO, 0) <> 0")
            Dim tempRow As DataRow = Nothing
            For fgRowCnt As Integer = deletedFGDV.Count - 1 To 0 Step -1
                tempRow = deletedFGDV(fgRowCnt).Row
                tempRow.Delete()
            Next
        Else
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_MBOMDTL"))
            deletedFGDV.RowFilter = String.Format("IsNull(OPTM_LINENO, 0) <> 0")
            Dim tempRow As DataRow = Nothing
            For fgRowCnt As Integer = deletedFGDV.Count - 1 To 0 Step -1
                tempRow = deletedFGDV(fgRowCnt).Row
                tempRow.Delete()
            Next

        End If
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
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteDataFromMBOMHDR)
            iDeleteRecordHDR = (ObjIConnection.ExecuteNonQuery(psSQLHDR, CommandType.Text, pSqlParam))
            If iDeleteRecordHDR > 0 Then
                psSQLDTL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteDataFromMBOMDTL)
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
            psSQLHDR = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDetailForModelByModelID)
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



    Public Shared Function GetDataForExplodeViewForModelBOM(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psFeatureID As Integer
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataForExplodeViewForModelBOM)
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

            For iRecord As Integer = 0 To pdsFeatureDetail.Tables(0).Rows.Count - 1
                'variable to get parent Feature ID
                Dim tempParentModelID As String
                'variable to get Item key 
                Dim tempitemkey As String
                'avariable to get value for Item Value
                Dim tempFeature As String
                tempParentModelID = NullToString(pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_MODELID"))
                tempitemkey = NullToString((pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_ITEMKEY")))
                tempFeature = NullToString((pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_FEATUREID")))
                Dim tempChildId As String = NullToString(pdsFeatureDetail.Tables(0).Rows(iRecord)("OPTM_CHILDMODELID"))
                'dataView
                Dim tempDV As DataView
                Dim tempDV1, tempDataView2, tempDataView3 As DataView
                'get the data from the Parent Table 
                tempDV = New DataView(pdsFeatureDetail.Tables(0))
                'Filter the Data  According  to Feature ID
                tempDV.RowFilter = StringFormat("OPTM_MODELID ='{0}'", tempParentModelID)

                tempDataView2 = New DataView(pdsFeatureDetail.Tables(0))
                tempDataView2.RowFilter = StringFormat("OPTM_CHILDMODELID ='{0}'", tempParentModelID)

                tempDataView3 = New DataView(objdtOrderedData)
                tempDataView3.RowFilter = StringFormat("component ='{0}' ", tempParentModelID)
                Dim tempDVCount As Integer = tempDataView3.Count - 1

                If tempDataView3.Count = 0 Then
                    tempDVCount = 0
                Else
                    tempDVCount = tempDataView3.Count - 1
                End If

                If tempDataView2.Count = 0 And tempDataView3.Count = 0 Then
                    objdtOrderedData.Rows.Add(counter, "", tempParentModelID, 0)
                    counter = counter + 1
                End If
                If tempChildId.Length = 0 Then
                    If tempitemkey.Length > 0 Then
                        tempChildId = tempitemkey
                    Else
                        tempChildId = tempFeature
                    End If
                End If
                tempDV1 = New DataView(objdtOrderedData)
                tempDV1.RowFilter = StringFormat("component ='{0}' and ParentId = '{1}'", tempChildId, tempParentModelID)
                Dim piLevel As Integer = 1
                piLevel = NullToInteger(tempDataView3(tempDVCount)("level")) + 1
                If tempDV1.Count = 0 Then
                    If tempDV.Count > 0 Then

                        For iChildRecord As Integer = 0 To tempDV.Count - 1
                            'piLevel = piLevel + 1
                            Dim psParentId As String = NullToInteger(tempDV(iChildRecord)("OPTM_MODELID"))
                            Dim psChildID As String = NullToString((tempDV(iChildRecord)("OPTM_CHILDMODELID")))
                            Dim pschildItemKey As String = NullToString((tempDV(iChildRecord)("OPTM_ITEMKEY")))
                            Dim psChildFeatureID As String = NullToString((tempDV(iChildRecord)("OPTM_FEATUREID")))
                            If (psChildID.Length > 0) Then
                                objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_CHILDMODELID"), piLevel)
                                counter = counter + 1
                            ElseIf ((pschildItemKey.Length > 0)) Then
                                objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_ITEMKEY"), piLevel)
                                counter = counter + 1
                            ElseIf psChildFeatureID.Length > 0 Then
                                objdtOrderedData.Rows.Add(counter, psParentId, tempDV(iChildRecord)("OPTM_FEATUREID"), piLevel)
                                counter = counter + 1
                            End If
                        Next
                        'Else
                        '    objdtOrderedData.Rows.Add(counter, "", tempParentFeatureID, 0)
                        '    counter = counter + 1
                    End If
                End If
                If (tempitemkey.Length > 0) And tempDataView3.Count = 0 Then

                    piLevel = piLevel + 1
                    objdtOrderedData.Rows.Add(counter, tempParentModelID, tempitemkey, piLevel)
                    counter = counter + 1
                ElseIf (tempFeature.Length > 0) And tempDataView3.Count = 0 Then
                    piLevel = piLevel + 1
                    objdtOrderedData.Rows.Add(counter, tempParentModelID, tempFeature, piLevel)
                    counter = counter + 1
                End If
            Next
            Return objdtOrderedData
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllRecordForModelBOMForCyclicCheck(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllRecordForModelBOMForCyclicCheck)
            pdsRecord = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsRecord.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

End Class
