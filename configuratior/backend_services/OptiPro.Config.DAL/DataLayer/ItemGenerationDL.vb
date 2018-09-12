Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.Common
Imports OptiPro.Config.DAL
Imports System.Data
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.Web
Imports System.ComponentModel
Imports System.Reflection
Imports OptiPro.Config.Common.Utilites


Public Class ItemGenerationDL
    'Function to Add Features to Feature Header 
    Public Shared Function AddItemGeneration1(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer

            Dim psItemCode, psItemTye, psItemString, psOperationType, psCreatedBy As String
            Dim piLineID As Integer
            For recordCount = 0 To objDataTable.Rows.Count - 1
                'Get the Company Name
                psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

                'get the ItemCode name  
                'psItemCode = NullToString(objDataTable.Rows(0)("ItemCode"))
                psItemCode = NullToString(objDataTable.Rows(recordCount)("codekey"))
                'get the ItemType
                psItemTye = NullToString(objDataTable.Rows(recordCount)("stringtype"))
                'Get the ItemString 
                psItemString = NullToString(objDataTable.Rows(recordCount)("string"))
                'get Photo path as String 
                psOperationType = NullToString(objDataTable.Rows(recordCount)("operations"))
                'get the Username 
                '  psCreatedBy = NullToString(objDataTable.Rows(0)("CreatedUser"))
                'get the Line ID
                piLineID = NullToString(objDataTable.Rows(recordCount)("rowindex"))

                'Now assign the Company object Instance to a variable pObjCompany
                Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
                pObjCompany.CompanyDbName = psCompanyDBId
                pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
                'Now get connection instance i.e SQL/HANA
                Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
                'Now we will connect to the required Query Instance of SQL/HANA
                Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

                Dim pSqlParam(4) As MfgDBParameter
                'Parameter 0 consisting itemCode and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@ITEMCODE"
                pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(0).Paramvalue = psItemCode

                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@ITEMSTRING"
                pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(1).Paramvalue = psItemString

                pSqlParam(2) = New MfgDBParameter
                pSqlParam(2).ParamName = "@TYPE"
                pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(2).Paramvalue = psItemTye

                pSqlParam(3) = New MfgDBParameter
                pSqlParam(3).ParamName = "@OPERATIONTYPE"
                pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(3).Paramvalue = psOperationType

                'pSqlParam(4) = New MfgDBParameter
                'pSqlParam(4).ParamName = "@USERNAME"
                'pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
                'pSqlParam(4).Paramvalue = psCreatedBy

                pSqlParam(4) = New MfgDBParameter
                pSqlParam(4).ParamName = "@LINEID"
                pSqlParam(4).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(4).Paramvalue = piLineID

                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddItemGeneration)

                iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

                If iInsert > 0 Then
                    psStatus = "True"
                Else
                    psStatus = "False"
                End If
            Next
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatus
    End Function

    ''' <summary>
    ''' Funtion to get the Item List from the Table OITM for the Grid
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetItemListForGeneration(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemList)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    'Function to Delete the Item Generation from the TAble  
    Public Shared Function DeleteItemGenerationCode(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iDelete As Integer
            Dim psItemCode As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            'Assign the DB Name
            pObjCompany.CompanyDbName = psCompanyDBId
            'Get the Connection Instance 
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            For irecord As Integer = 0 To objDataTable.Rows.Count - 1
                'get the ItemCode name  
                psItemCode = NullToString(objDataTable.Rows(irecord)("ItemCode"))
                Dim pSqlParam(1) As MfgDBParameter
                'Parameter 0 consisting itemCode and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@ITEMCODE"
                pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(0).Paramvalue = psItemCode
                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteItemGenerationCode)
                'Execute the Query 
                iDelete = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
                If iDelete > 0 Then
                    psStatus = "True"
                Else
                    psStatus = "False"
                End If
            Next

            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatus
    End Function

    Public Shared Function CheckDuplicateItemCode(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psItemCode As String
            Dim pdsItemCodeCount As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the ItemCode name  
            psItemCode = NullToString(objDataTable.Rows(0)("codekey"))
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
            pSqlParam(0).ParamName = "@ITEMCODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemCode
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateItemCode)
            pdsItemCodeCount = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            If pdsItemCodeCount.Tables(0).Rows(0).Item("Column1") > 0 Then


            End If

            Return pdsItemCodeCount.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function
    ''' <summary>
    ''' Function to Update the Data for Generated  Item or Lot Serial
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function UpdateDataofGeneratedItem(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer

            Dim psItemCode, psItemTye, psItemString, psOperationType, psModifiedUserName As String
            Dim piLineID As Integer

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the ItemCode name  
            psItemCode = NullToString(objDataTable.Rows(0)("ItemCode"))
            'get the ItemType
            psItemTye = NullToString(objDataTable.Rows(0)("ItemType"))
            'Get the ItemString 
            psItemString = NullToString(objDataTable.Rows(0)("ItemString"))
            'get Photo path as String 
            psOperationType = NullToString(objDataTable.Rows(0)("OperationType"))
            'get the Username
            psModifiedUserName = NullToString(objDataTable.Rows(0)("Username"))

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(5) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar

            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMSTRING"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemString

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@TYPE"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psItemTye

            pSqlParam(2) = New MfgDBParameter
            pSqlParam(2).ParamName = "@OPERATIONTYPE"
            pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(2).Paramvalue = psOperationType

            pSqlParam(3) = New MfgDBParameter
            pSqlParam(3).ParamName = "@USERNAME"
            pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(3).Paramvalue = psModifiedUserName

            pSqlParam(4) = New MfgDBParameter
            pSqlParam(4).ParamName = "@ITEMCODE"
            pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(4).Paramvalue = psItemCode


            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_UpdateDataofGeneratedItem)
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
    ''' Datalayer to get the Item Code According to Item 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetDataByItemCode(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsItemData As DataSet
            'VARIABLE TO GET THE ITEM CODE
            Dim psItemCode As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the ItemCode name  
            psItemCode = NullToString(objDataTable.Rows(0)("ItemCode"))
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
            pSqlParam(0).ParamName = "@ITEMCODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemCode

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataByItemCode)
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsItemData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function
    ''' <summary>
    ''' Function to get The Server Date and Time 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetServerDate(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsServerDate As DataSet
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetServerDate)
            pdsServerDate = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsServerDate.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    ''' <summary>
    ''' Function to Add and Update the the Item COde Generation using the Update DataSet Method
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function AddItemGeneration(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            'Variable to get the Company ID
            Dim psCompanyDBId As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

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
            pdsItemCodeGen = ItemGenerationDL.GetAllSavedData(objDataTable, objCmpnyInstance)
            'PreaParing the Dataset ,Which Entry is to be Updated and Added
            PrepareItemCodeGenerationData(objDataTable, pdsItemCodeGen, objCmpnyInstance)
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
    Public Shared Function GetAllSavedData(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataSet
        Try
            'Variable ffr the Company DBID
            Dim psCompanyDBId As String
            'Variable to get the SQl Query
            Dim psSQL As String
            'Variable for the Item Code 
            Dim psItemCode As String
            'Declare a Data set in which we will pass to UI
            Dim dsRecord As New DataSet
            'Used To The Company Instance
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'Company Connection
            pObjCompany.CompanyDbName = psCompanyDBId
            'get the the Item Code Key 
            psItemCode = objDataTable.Rows(0).Item("codekey")
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting itemCode and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMCODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemCode
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetDataByItemCode)
            'This method will fill the same dataset with table ParentTable
            ObjIConnection.FillDataset(psSQL, CommandType.Text, dsRecord, "OPCONFIG_ITEMCODEGENERATION", pSqlParam)
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

    Private Shared Sub PrepareItemCodeGenerationData(ByVal objdsGenItem As DataTable, ByRef tempds As DataSet, ByVal objCmpnyInstance As OptiPro.Config.Common.Company)
        'Variable Declaration for Datarow
        Dim pdr As DataRow
        'variable to get Item Code
        Dim psItemCode As String
        'Integer Variable for LineID
        Dim piLineID As Integer
        'DataTable to get the Server DateTime
        Dim pdtServerDate As DataTable
        'varriable for Server Date Time
        Dim dtServerDate As DateTime
        'Function to get the Server Date Time
        pdtServerDate = GetServerDate(objdsGenItem, objCmpnyInstance)
        'Get Server Date
        dtServerDate = pdtServerDate.Rows(0)("DATEANDTIME")
        'get the DataView
        Dim tempDV As DataView = Nothing

        For Each AuthRow As DataRow In objdsGenItem.Rows
            'get Item Code
            psItemCode = OptiPro.Config.Common.Utilites.NullToString(AuthRow("codekey"))
            'Get Line ID
            piLineID = OptiPro.Config.Common.Utilites.NullToInteger(AuthRow("rowindex"))
            tempDV = New DataView(tempds.Tables("OPCONFIG_ITEMCODEGENERATION"))
            tempDV.RowFilter = StringFormat("OPTM_CODE ='{0}'and OPTM_LINEID= '{1}'", psItemCode, piLineID)
            '  tempDV.RowFilter = StringFormat("OPTM_USERGROUP ='{1}' AND OPTM_ROLEID ='{2}'", AuthCode, UserCode, Roles)
            If tempDV.Count > 0 Then
                tempDV(0)("OPTM_CODESTRING") = AuthRow("string")
                tempDV(0)("OPTM_TYPE") = NullToInteger(AuthRow("stringtype"))
                tempDV(0)("OPTM_OPERATION") = NullToInteger(AuthRow("operations"))
                tempDV(0)("OPTM_MODIFIEDBY") = NullToString(AuthRow("CreatedUser"))
                tempDV(0)("OPTM_MODIFIEDDATETIME") = dtServerDate
            Else
                pdr = tempds.Tables("OPCONFIG_ITEMCODEGENERATION").NewRow()
                pdr("OPTM_CODE") = AuthRow("codekey")
                pdr("OPTM_CODESTRING") = AuthRow("string")
                pdr("OPTM_TYPE") = AuthRow("stringtype")
                pdr("OPTM_OPERATION") = AuthRow("operations")
                pdr("OPTM_CREATEDBY") = AuthRow("CreatedUser")
                pdr("OPTM_CREATEDATETIME") = dtServerDate
                pdr("OPTM_LINEID") = AuthRow("rowindex")
                tempds.Tables("OPCONFIG_ITEMCODEGENERATION").Rows.Add(pdr)
            End If
        Next
        Dim seqlist1 As String = ""
        tempDV = New DataView(objdsGenItem)
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
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_ITEMCODEGENERATION"))
            deletedFGDV.RowFilter = String.Format("OPTM_LINEID Not in (" & seqlist1 & ") and IsNull(OPTM_LINEID, 0) <> 0")
            Dim tempRow As DataRow = Nothing
            For fgRowCnt As Integer = deletedFGDV.Count - 1 To 0 Step -1
                tempRow = deletedFGDV(fgRowCnt).Row
                tempRow.Delete()
            Next
        Else
            Dim deletedFGDV As DataView = New System.Data.DataView(tempds.Tables("OPCONFIG_ITEMCODEGENERATION"))
            deletedFGDV.RowFilter = String.Format("IsNull(OPTM_LINEID, 0) <> 0")
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



    Public Shared Function GetItemGenerationData(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsItemData As DataSet
            Dim psTotalCount As Integer
            Dim piPageLimit As Integer
            If objDataTable.Columns.Contains("SearchString") Then
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
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemGenerationDataBySearchCriteria)
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
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemGenerationData)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
            End If
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'function to get Total Count of Record 
            Dim dtTotalCount As DataTable
            dtTotalCount = GetTotalCountOfRecordForItemGeneration(psCompanyDBId, objCmpnyInstance)
            psTotalCount = NullToInteger(dtTotalCount.Rows(0)("TOTALCOUNT"))
            'Create a Datatable 
            Dim objdtOrderedData As New DataTable
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("Select", GetType(String))
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("#", GetType(Integer))
            'Add Column to the Datatable 
            objdtOrderedData.Columns.Add("Code", GetType(String))
            'Add new Column to Datatble 
            objdtOrderedData.Columns.Add("FinalString", GetType(String))
            'Add Column 
            objdtOrderedData.Columns.Add("Action", GetType(String))
            Dim Counter As Integer = 1
            'Loop to Insert Value to Action and Sequence 
            For irow As Integer = 0 To pdsItemData.Tables(0).Rows.Count - 1
                objdtOrderedData.Rows.Add(pdsItemData.Tables(0).Rows(irow)("Code"), Counter, pdsItemData.Tables(0).Rows(irow)("Code"), pdsItemData.Tables(0).Rows(irow)("FinalString"), pdsItemData.Tables(0).Rows(irow)("Code"))
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
    Public Shared Function GetItemCodeReference(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsItemData As DataSet = Nothing
            Dim psItemDataRowCount As String = String.Empty
            'VARIABLE TO GET THE ITEM CODE
            Dim psItemCode As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the ItemCode name  
            psItemCode = NullToString(objDataTable.Rows(0)("ItemCode"))
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
            pSqlParam(0).ParamName = "@ITEMCODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemCode

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemCodeReference)
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))

            If (pdsItemData.Tables(0).Rows.Count > 0) Then
                If (pdsItemData.Tables(0).Rows(0).Item("ROWCOUNT") = 0) Then
                    psItemDataRowCount = "False"
                Else
                    psItemDataRowCount = "True"
                End If
            Else
                psItemDataRowCount = "False"
            End If

            Return psItemDataRowCount
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetTotalCountOfRecordForItemGeneration(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTotalCountOfRecordForItemGeneration)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function




End Class
