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
            'get the ItemCode name  
            psItemCode = NullToString(objDataTable.Rows(0)("ItemCode"))
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateItemCode)
            pdsItemCodeCount = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
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
                ' tempDV(0)("OPTM_MODIFIEDBY") = NullToString(AuthRow("CreatedUser"))
                tempDV(0)("OPTM_MODIFIEDDATETIME") = dtServerDate
            Else
                pdr = tempds.Tables("OPCONFIG_ITEMCODEGENERATION").NewRow()
                pdr("OPTM_CODE") = AuthRow("codekey")
                pdr("OPTM_CODESTRING") = AuthRow("string")
                pdr("OPTM_TYPE") = AuthRow("stringtype")
                pdr("OPTM_OPERATION") = AuthRow("operations")
                ' pdr("OPTM_CREATEDBY") = AuthRow("CreatedUser")
                pdr("OPTM_CREATEDATETIME") = dtServerDate
                pdr("OPTM_LINEID") = AuthRow("rowindex")
                tempds.Tables("OPCONFIG_ITEMCODEGENERATION").Rows.Add(pdr)
            End If
        Next
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



    Public Shared Function GetItemGenerationData(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable

        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsItemData As DataSet
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemGenerationData)
            pdsItemData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsItemData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


End Class
