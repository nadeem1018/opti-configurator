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
Imports System.Web.Script.Serialization


Public Class FeatureHeaderDL
 
    'Function to Add Features to Feature Header 
    Public Shared Function AddFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String

        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer
            Dim psIsHana As String = String.Empty
            Dim dtCheckDuplicateRecord As DataTable

            Dim psDisplayName, psFeatureDesc, psProductGroupID, psPhotoPath, psCreatedBy As String
            Dim psType, psModelTemplateItem, psItemCodeGen, psFeatureStatus, psFeatureCode, psAccessory As String
            Dim pdtEffectiveDate As DateTime

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'psCompanyDBId = "DEVQAS2BRANCHING"

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'If it is HANA then it will be true rather it will false
            If pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase Then
                psIsHana = True
            Else
                psIsHana = False
            End If
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            'get the Display NAme 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))

            If objDataTable.Columns.Contains("FeatureDesc") Then
                '  get the Model Template Item,
                psFeatureDesc = NullToString(objDataTable.Rows(0)("FeatureDesc"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psFeatureDesc = ""
            End If
            If objDataTable.Columns.Contains("PicturePath") Then
                psPhotoPath = NullToString(objDataTable.Rows(0)("PicturePath"))
            Else
                psPhotoPath = ""
            End If
            If objDataTable.Columns.Contains("CreatedUser") Then
                'Get the User 
                psCreatedBy = NullToString(objDataTable.Rows(0)("CreatedUser"))
            Else
                psCreatedBy = ""
            End If

            If objDataTable.Columns.Contains("Type") Then
                'get the type
                psType = NullToString(objDataTable.Rows(0)("Type"))
            Else
                psType = ""
            End If

            'Check whether the value of Model Temlate Item is Coming from the Ui,If There is no column then we will replace with blank
            If objDataTable.Columns.Contains("ModelTemplateItem") Then
                '  get the Model Template Item,
                psModelTemplateItem = NullToString(objDataTable.Rows(0)("ModelTemplateItem"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psModelTemplateItem = ""
            End If

            If objDataTable.Columns.Contains("ItemCodeGenerationRef") Then
                'get Item Code Generation Reference Number
                psItemCodeGen = NullToString(objDataTable.Rows(0)("ItemCodeGenerationRef"))
            Else

                'if there is no Column then we will be Cnsider it Blank
                psItemCodeGen = ""
            End If
            'get the Status of Feature
            psFeatureStatus = NullToString(objDataTable.Rows(0)("FeatureStatus"))
            'get the Effective Date and Time 
            pdtEffectiveDate = NullToDate(objDataTable.Rows(0)("EffectiveDate"))
            'get VAlue for Accessory
            psAccessory = NullToString(objDataTable.Rows(0)("Accessory"))
            'get the Feature Code 
            psFeatureCode = NullToString(objDataTable.Rows(0)("FeatureCode"))



            If objDataTable.Columns.Contains("FeatureStatus") Then
                'get the Status of Feature
                psFeatureStatus = NullToString(objDataTable.Rows(0)("FeatureStatus"))
            Else
                psFeatureStatus = ""
            End If

            If objDataTable.Columns.Contains("EffectiveDate") Then
                'get the Effective Date and Time 
                pdtEffectiveDate = NullToDate(objDataTable.Rows(0)("EffectiveDate"))
            Else
                pdtEffectiveDate = Date.Now()
            End If


            If objDataTable.Columns.Contains("Accessory") Then
                'get VAlue for Accessory
                psAccessory = NullToString(objDataTable.Rows(0)("Accessory"))
            Else
                psAccessory = ""
            End If

            If objDataTable.Columns.Contains("FeatureCode") Then
                'get the Feature Code 
                psFeatureCode = NullToString(objDataTable.Rows(0)("FeatureCode"))
            Else
                psFeatureCode = ""
            End If

            'Functtion to Check whether the Record is Already Present in Table 
            dtCheckDuplicateRecord = CheckDuplicateFeatureCode1(psCompanyDBId, psFeatureCode, objCmpnyInstance)
            'If the Record is Already Present in the TAble then Error MEssage will be Shown 
            If (dtCheckDuplicateRecord.Rows(0)("TOTALCOUNT") > 0) Then
                psStatus = "Record Already Exist"
                Return psStatus
            Else

                Dim pSqlParam(12) As MfgDBParameter
                'Parameter 0 consisting warehouse and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@DISPLAYNAME"
                pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(0).Paramvalue = psDisplayName

                'Parameter 1 Consisting of Feature Description and its Type will be nvarchar
                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@FEATUREDESC"
                pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(1).Paramvalue = psFeatureDesc

                'pSqlParam(2) = New MfgDBParameter
                'pSqlParam(2).ParamName = "@PRODUCTGROUPID"
                'pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                'pSqlParam(2).Paramvalue = psProductGroupID

                pSqlParam(2) = New MfgDBParameter
                pSqlParam(2).ParamName = "@PHOTOPATH"
                pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(2).Paramvalue = psPhotoPath

                pSqlParam(3) = New MfgDBParameter
                pSqlParam(3).ParamName = "@CREATEDBY"
                pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(3).Paramvalue = psCreatedBy

                pSqlParam(4) = New MfgDBParameter
                pSqlParam(4).ParamName = "@MODIFIEDBY"
                pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(4).Paramvalue = psCreatedBy

                pSqlParam(5) = New MfgDBParameter
                pSqlParam(5).ParamName = "@TYPE"
                pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(5).Paramvalue = psType

                pSqlParam(6) = New MfgDBParameter
                pSqlParam(6).ParamName = "@MODELTEMPLATEITEM"
                pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(6).Paramvalue = psModelTemplateItem

                pSqlParam(7) = New MfgDBParameter
                pSqlParam(7).ParamName = "@ITEMCODEREFERENCE"
                pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(7).Paramvalue = psItemCodeGen

                pSqlParam(8) = New MfgDBParameter
                pSqlParam(8).ParamName = "@STATUS"
                pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(8).Paramvalue = psFeatureStatus

                If psIsHana = True Then
                    pSqlParam(9) = New MfgDBParameter
                    pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                    pSqlParam(9).Dbtype = BMMDbType.HANA_TimeStamp
                    pSqlParam(9).Paramvalue = pdtEffectiveDate
                Else
                    pSqlParam(9) = New MfgDBParameter
                    pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                    pSqlParam(9).Dbtype = BMMDbType.SQL_DateTime
                    pSqlParam(9).Paramvalue = pdtEffectiveDate

                End If
                pSqlParam(10) = New MfgDBParameter
                pSqlParam(10).ParamName = "@FEATURECODE"
                pSqlParam(10).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(10).Paramvalue = psFeatureCode

                pSqlParam(11) = New MfgDBParameter
                pSqlParam(11).ParamName = "@ACCESSORY"
                pSqlParam(11).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(11).Paramvalue = psAccessory

                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddFeatures)

                iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
            End If
            If iInsert > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
    End Function


    ''' <summary>
    ''' Function to Delete the Feature From Feature Header 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function DeleteFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iDelete As Integer
            Dim psFeatureID As Integer
            Dim ChkReferenceForFeature As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'psCompanyDBId = "DEVQAS2BRANCHING"
            'get the Display NAme 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            ChkReferenceForFeature = ChkReferenceForFeatureID(objDataTable, objCmpnyInstance)
            If (ChkReferenceForFeature = "True") Then
                psStatus = "Reference Already Exist in Feature BOM or Model BOM"
                Return psStatus
            End If



            Dim pSqlParam(1) As MfgDBParameter 'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteFeatures)

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
    End Function

    ''' <summary>
    ''' Feature to Update the Features in Feature Header 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    Public Shared Function UpdateFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iUpdate As Integer
            Dim psFeatureID, piFeatureCode As Integer
            Dim psDisplayName, psFeatureDesc, psPicturePath, psAccessory, psPhotoPath, psModifiedBy, psModelTemplateItem, psType, psIsHana, psItemCodeGenRef, psFeatureStatus As String
            Dim pdtEffectiveDate As DateTime
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Display NAme 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
            'get the Feature Description 
            psFeatureDesc = NullToString(objDataTable.Rows(0)("FeatureDesc"))
            'get Photo path as String 
            psPhotoPath = NullToString(objDataTable.Rows(0)("PicturePath"))
            'Get the User 
            psModifiedBy = NullToString(objDataTable.Rows(0)("CreatedUser"))
            'get the Display NAme 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))
            'get the Feature Code 
            piFeatureCode = NullToInteger(objDataTable.Rows(0)("FeatureCode"))
            'get the type
            psType = NullToString(objDataTable.Rows(0)("Type"))
            'get the Effective Date and Time 
            pdtEffectiveDate = NullToDate(objDataTable.Rows(0)("EffectiveDate"))
            'get the Status
            psFeatureStatus = NullToString(objDataTable.Rows(0)("FeatureStatus"))

            If objDataTable.Columns.Contains("ModelTemplateItem") Then
                '  get the Model Template Item,
                psModelTemplateItem = NullToString(objDataTable.Rows(0)("ModelTemplateItem"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psModelTemplateItem = ""
            End If
            If objDataTable.Columns.Contains("ItemCodeGenerationRef") Then
                psItemCodeGenRef = NullToString(objDataTable.Rows(0)("ItemCodeGenerationRef"))
            Else
                psItemCodeGenRef = ""
            End If

            If objDataTable.Columns.Contains("Accessory") Then
                'get VAlue for Accessory
                psAccessory = NullToString(objDataTable.Rows(0)("Accessory"))
            Else
                psAccessory = ""
            End If
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'If it is HANA then it will be true rather it will false
            If pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase Then
                psIsHana = True
            Else
                psIsHana = False
            End If
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(12) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@DISPLAYNAME"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psDisplayName

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@FEATUREDESC"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psFeatureDesc

            pSqlParam(3) = New MfgDBParameter
            pSqlParam(3).ParamName = "@PHOTOPATH"
            pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(3).Paramvalue = psPhotoPath

            pSqlParam(4) = New MfgDBParameter
            pSqlParam(4).ParamName = "@MODIFIEDBY"
            pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(4).Paramvalue = psModifiedBy


            pSqlParam(5) = New MfgDBParameter
            pSqlParam(5).ParamName = "@TYPE"
            pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(5).Paramvalue = psType

            pSqlParam(6) = New MfgDBParameter
            pSqlParam(6).ParamName = "@MODELTEMPLATEITEM"
            pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(6).Paramvalue = psModelTemplateItem

            pSqlParam(7) = New MfgDBParameter
            pSqlParam(7).ParamName = "@ITEMCODEGENREF"
            pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(7).Paramvalue = psItemCodeGenRef

            pSqlParam(8) = New MfgDBParameter
            pSqlParam(8).ParamName = "@STATUS"
            pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(8).Paramvalue = psFeatureStatus

            If psIsHana = True Then
                pSqlParam(9) = New MfgDBParameter
                pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                pSqlParam(9).Dbtype = BMMDbType.HANA_TimeStamp
                pSqlParam(9).Paramvalue = pdtEffectiveDate
            Else
                pSqlParam(9) = New MfgDBParameter
                pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                pSqlParam(9).Dbtype = BMMDbType.SQL_DateTime
                pSqlParam(9).Paramvalue = pdtEffectiveDate

            End If

            pSqlParam(10) = New MfgDBParameter
            pSqlParam(10).ParamName = "@ACCESSORY"
            pSqlParam(10).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(10).Paramvalue = psAccessory

            pSqlParam(11) = New MfgDBParameter
            pSqlParam(11).ParamName = "@FEATUREID"
            pSqlParam(11).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(11).Paramvalue = psFeatureID


            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_UpdateFeatures)

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
    End Function
    ''' <summary>
    ''' Function to get the Model Template Item From the Database ,This Function will execeute in case if Model is Selected in UI Part
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetModelTemplateItem(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetModelTemplateItem)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    ''' <summary>
    ''' Function to get the Item Code generation on the Basis
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetItemCodeGenerationReference(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemCodeGenerationReference)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function CheckDuplicateFeatureCode1(ByVal objCompanyDBId As String, ByVal objFeatureCode As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureCode As String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = objCompanyDBId
            'get the Feature Code
            psFeatureCode = objFeatureCode
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATURECODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureCode


            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateFeatureCode)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    ''' <summary>
    ''' Function to Check Duplicate Feature Code on the Basis of Feature Code while Adding the Record
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function CheckDuplicateFeatureCode(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureCode As String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Feature Code
            psFeatureCode = NullToString(objDataTable.Rows(0)("FeatureCode"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATURECODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureCode
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateFeatureCode)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function GetAllData(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
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
            piPageNumber = NullToInteger(objDataTable.Rows(0)("PageNumber"))
            'piPageNumber = 1
            'get the Search String 
            If objDataTable.Columns.Contains("SearchString") Then
                '  get Search String,
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
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllDataOnBasisOfSearchCriteria)
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
                pSqlParam(0).ParamName = "@STARTCOUNT"
                pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(0).Paramvalue = piStartCount

                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@ENDCOUNT"
                pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
                pSqlParam(1).Paramvalue = piEndCount
                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllData)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
                'here we needto Replace the Parameter as Like is Used inthe where Clause
                psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
            End If
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            'function to get Total Count of Record 
            Dim dtTotalCount As DataTable
            dtTotalCount = GetTotalCountOfRecord(psCompanyDBId, objCmpnyInstance)
            psTotalCount = NullToInteger(dtTotalCount.Rows(0)("TOTALCOUNT"))

            Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()
            serializer.MaxJsonLength = Integer.MaxValue
            Dim rows As New Collection
            Dim final_array As New Collection
            Dim row As Dictionary(Of String, Object) = Nothing

            For Each dr As DataRow In pdsFeatureList.Tables(0).Rows
                Dim temp_array As New Collection
                row = New Dictionary(Of String, Object)()
                For Each dc As DataColumn In pdsFeatureList.Tables(0).Columns

                    '    'Dim temp_arry =[]
                    temp_array.Add(dr.Item(dc))
                    'row.Add(dr.Item(dc), dr.Item(dc))

                Next
                rows.Add(temp_array)
            Next

            'query 
            'execute
            ' valuie 

            final_array.Add(rows)
            final_array.Add(psTotalCount)

            '            output  = Array("data"=>rows,  "total_recors"=> valuie);

            Return serializer.Serialize(final_array)

            'Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    Public Shared Function GetTotalCountOfRecord(ByVal objCompanyDBID As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
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
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetTotalCountOfRecord)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllDataOnBasisOfSearchCriteria(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psSearchString As String = String.Empty
            Dim pdsGetData As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Search String
            psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@SEARCHSTRING"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psSearchString

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllDataOnBasisOfSearchCriteria)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            psSQL = psSQL.Replace("@SEARCHSTRING", psSearchString)
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetRecordById(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureCode As String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Feature Code
            psFeatureCode = NullToString(objDataTable.Rows(0)("FEATUREID"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureCode
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetRecordById)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function




    Public Shared Function GetDataByFeatureID(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psSearchString As String = String.Empty
            Dim pdsGetData As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Search String
            psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@SEARCHSTRING"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psSearchString

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllDataOnBasisOfSearchCriteria)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            psSQL = psSQL.Replace("@SEARCHSTRING", psSearchString)
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function ChkValidItemTemplate(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psTemplateItem As String = String.Empty
            Dim pdsGetData As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Search String
            psTemplateItem = NullToString(objDataTable.Rows(0)("TemplateItem"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMTEMPLATE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psTemplateItem

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_ChkValidItemTemplate)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))

            If (pdsGetData.Tables(0).Rows(0)("TOTALCOUNT") > 0) Then
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



    Public Shared Function ChkValidItemCodeGeneration(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty

            Dim psItemGenerationCode As String = String.Empty
            Dim pdsGetData As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Search String
            psItemGenerationCode = NullToString(objDataTable.Rows(0)("ItemGenerationCode"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ITEMGENERATIONCODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psItemGenerationCode

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_ChkValidItemCodeGeneration)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            If (pdsGetData.Tables(0).Rows(0)("TOTALCOUNT") > 0) Then
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


    Public Shared Function ChkReferenceForFeatureID(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psSQLMBOM As String = String.Empty
            Dim piFeatureID As Integer
            Dim pdsGetDataFBOM, pdsGetDataMBOM As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))

            'get the Search String
            piFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = piFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_ChkReferenceForFeatureIDInFeatureBOM)

            psSQLMBOM = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_ChkReferenceForFeatureIDInModelBOM)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            pdsGetDataFBOM = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            pdsGetDataMBOM = (ObjIConnection.ExecuteDataset(psSQLMBOM, CommandType.Text, pSqlParam))
            If (pdsGetDataFBOM.Tables(0).Rows(0)("TOTALCOUNT") > 0 Or pdsGetDataMBOM.Tables(0).Rows(0)("TOTALCOUNT") > 0) Then
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




    Public Shared Function ImportDataFromExcel(ByVal objDataTable As DataTable, ByVal pCompanyDBId As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String

        Dim psStatusImportexcel As String = String.Empty
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer
            Dim psIsHana As String = String.Empty
            Dim dtCheckDuplicateRecord As DataTable
            Dim psDisplayName, psFeatureDesc, psProductGroupID, psPhotoPath, psCreatedBy As String
            Dim psType, psModelTemplateItem, psItemCodeGen, psFeatureStatus, psFeatureCode, psAccessory As String
            Dim pdtEffectiveDate As String
            Dim piDuplicateCount As Integer = 0
            Dim piInsertedRecord As Integer = 0
            'Get the Company Name
            psCompanyDBId = NullToString(pCompanyDBId.Rows(0)("CompanyDBId"))

            'psCompanyDBId = "DEVQAS2BRANCHING"
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'If it is HANA then it will be true rather it will false
            If pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase Then
                psIsHana = True
            Else
                psIsHana = False
            End If
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            For iaddrecord As Integer = 0 To objDataTable.Rows.Count - 1
                'get the Display NAme 
                psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
                If objDataTable.Columns.Contains("FeatureDesc") Then
                    ' get the Model Template Item,
                    psFeatureDesc = NullToString(objDataTable.Rows(iaddrecord)("FeatureDesc"))
                Else
                    'if there is no Column then we will be Cnsider it Blank
                    psFeatureDesc = ""
                End If
                psPhotoPath = NullToString(objDataTable.Rows(iaddrecord)("PicturePath"))
                'Get the User 
                psCreatedBy = NullToString(objDataTable.Rows(iaddrecord)("CreatedUser"))
                'get the type
                psType = NullToString(objDataTable.Rows(iaddrecord)("Type"))
                'Check whether the value of Model Temlate Item is Coming from the Ui,If There is no column then we will replace with blank
                If objDataTable.Columns.Contains("ModelTemplateItem") Then
                    ' get the Model Template Item,
                    psModelTemplateItem = NullToString(objDataTable.Rows(iaddrecord)("ModelTemplateItem"))
                Else
                    'if there is no Column then we will be Cnsider it Blank
                    psModelTemplateItem = ""
                End If
                'get Item Code Generation Reference Number
                psItemCodeGen = NullToString(objDataTable.Rows(iaddrecord)("ItemCodeGenerationRef"))
                'get the Status of Feature
                psFeatureStatus = NullToString(objDataTable.Rows(iaddrecord)("FeatureStatus"))
                Dim xmlDate As String = NullToString(objDataTable.Rows(iaddrecord)("EffectiveDate"))
                Dim oDate As DateTime = DateTime.Parse(xmlDate)
                pdtEffectiveDate = oDate
                'get VAlue for Accessory
                psAccessory = NullToString(objDataTable.Rows(iaddrecord)("Accessory"))
                'get the Feature Code 
                psFeatureCode = NullToString(objDataTable.Rows(iaddrecord)("FeatureCode"))
                'Functtion to Check whether the Record is Already Present in Table 
                dtCheckDuplicateRecord = CheckDuplicateFeatureCode1(psCompanyDBId, psFeatureCode, objCmpnyInstance)
                'If the Record is Already Present in the TAble then Error MEssage will be Shown 
                If (dtCheckDuplicateRecord.Rows(0)("TOTALCOUNT") > 0) Then
                    piDuplicateCount = piDuplicateCount + 1
                    Continue For
                Else
                    Dim pSqlParam(12) As MfgDBParameter
                    'Parameter 0 consisting warehouse and it's datatype will be nvarchar
                    pSqlParam(0) = New MfgDBParameter
                    pSqlParam(0).ParamName = "@DISPLAYNAME"
                    pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(0).Paramvalue = psDisplayName

                    'Parameter 1 Consisting of Feature Description and its Type will be nvarchar
                    pSqlParam(1) = New MfgDBParameter
                    pSqlParam(1).ParamName = "@FEATUREDESC"
                    pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(1).Paramvalue = psFeatureDesc

                    pSqlParam(2) = New MfgDBParameter
                    pSqlParam(2).ParamName = "@PHOTOPATH"
                    pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(2).Paramvalue = psPhotoPath

                    pSqlParam(3) = New MfgDBParameter
                    pSqlParam(3).ParamName = "@CREATEDBY"
                    pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(3).Paramvalue = psCreatedBy

                    pSqlParam(4) = New MfgDBParameter
                    pSqlParam(4).ParamName = "@MODIFIEDBY"
                    pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(4).Paramvalue = psCreatedBy

                    pSqlParam(5) = New MfgDBParameter
                    pSqlParam(5).ParamName = "@TYPE"
                    pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(5).Paramvalue = psType

                    pSqlParam(6) = New MfgDBParameter
                    pSqlParam(6).ParamName = "@MODELTEMPLATEITEM"
                    pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(6).Paramvalue = psModelTemplateItem

                    pSqlParam(7) = New MfgDBParameter
                    pSqlParam(7).ParamName = "@ITEMCODEREFERENCE"
                    pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(7).Paramvalue = psItemCodeGen

                    pSqlParam(8) = New MfgDBParameter
                    pSqlParam(8).ParamName = "@STATUS"
                    pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(8).Paramvalue = psFeatureStatus

                    If psIsHana = True Then
                        pSqlParam(9) = New MfgDBParameter
                        pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                        pSqlParam(9).Dbtype = BMMDbType.HANA_TimeStamp
                        pSqlParam(9).Paramvalue = oDate
                    Else
                        pSqlParam(9) = New MfgDBParameter
                        pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                        pSqlParam(9).Dbtype = BMMDbType.SQL_DateTime
                        pSqlParam(9).Paramvalue = oDate

                    End If
                    pSqlParam(10) = New MfgDBParameter
                    pSqlParam(10).ParamName = "@FEATURECODE"
                    pSqlParam(10).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(10).Paramvalue = psFeatureCode

                    pSqlParam(11) = New MfgDBParameter
                    pSqlParam(11).ParamName = "@ACCESSORY"
                    pSqlParam(11).Dbtype = BMMDbType.HANA_NVarChar
                    pSqlParam(11).Paramvalue = psAccessory

                    ' Get the Query on the basis of objIQuery
                    psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddFeatures)

                    iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
                    piInsertedRecord = piInsertedRecord + 1
                End If
            Next
            psStatusImportexcel = "Total Record Inserted :" + (piInsertedRecord).ToString + " and DuplicateRecord: " + (piDuplicateCount).ToString
            Return psStatusImportexcel
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return psStatusImportexcel
    End Function


    'Public Shared Function GetItemCodeGenerationReference(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
    '    Try
    '        'we will Show 25 Record Per Page so Record Limit is Set to 25
    '        Dim piPageLimit As Integer = 25
    '        Dim psCompanyDBId As String = String.Empty
    '        Dim psSQL As String = String.Empty
    '        Dim psSearchString As String
    '        'Variable to Fet Starting Limit and The End Limit
    '        Dim piStartCount, piEndCount As Integer
    '        Dim piPageNumber As Integer
    '        'get the PAge Number which is Coming from UI 
    '        piPageNumber = NullToInteger(objDataTable.Rows(0)("PageNumber"))
    '        'logic to get the End Count 
    '        piEndCount = piPageNumber * piPageLimit
    '        'Logic to get the Starting Count 
    '        piStartCount = piEndCount - piPageLimit + 1
    '        'if there is Search String then we wil  Fetch Record According t the Search String
    '        Dim pdsFeatureList As DataSet
    '        'Get the Company Name
    '        psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
    '        'get the Feature Code
    '        psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
    '        If psSearchString.Length > 0 Then
    '            'if there is Search String then we wil  Fetch Record According t the Search String
    '            Dim dtsearchedRecord As DataTable
    '            dtsearchedRecord = GetAllSavedRecordOnBasisOfSearchCriteria(piStartCount, piEndCount, psSearchString, psCompanyDBId, objCmpnyInstance)
    '            'We will return the Sorted Record onthe basis of search
    '            Return dtsearchedRecord
    '        End If
    '        'Now assign the Company object Instance to a variable pObjCompany
    '        Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
    '        pObjCompany.CompanyDbName = psCompanyDBId
    '        pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
    '        'Now get connection instance i.e SQL/HANA
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        'Now we will connect to the required Query Instance of SQL/HANA
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

    '        Dim pSqlParam(2) As MfgDBParameter
    '        'Parameter 0 consisting warehouse and it's datatype will be nvarchar
    '        pSqlParam(0) = New MfgDBParameter
    '        pSqlParam(0).ParamName = "@STARTCOUNT"
    '        pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
    '        pSqlParam(0).Paramvalue = piStartCount

    '        pSqlParam(1) = New MfgDBParameter
    '        pSqlParam(1).ParamName = "@ENDCOUNT"
    '        pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
    '        pSqlParam(1).Paramvalue = piEndCount

    '        ' Get the Query on the basis of objIQuery
    '        psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllSavedRecord)
    '        'here we needto Replace the Parameter as Like is Used inthe where Clause
    '        psSQL = psSQL.Replace("@STARTCOUNT", piStartCount)
    '        'here we needto Replace the Parameter as Like is Used inthe where Clause
    '        psSQL = psSQL.Replace("@ENDCOUNT", piEndCount)
    '        pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
    '        Return pdsFeatureList.Tables(0)
    '    Catch ex As Exception
    '        Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
    '    End Try
    '    Return Nothing
    'End Function


    'Public Shared Function GetAllSavedRecordOnBasisOfSearchCriteria(ByVal objStartCount As Integer, ByVal ObjEndCount As Integer, ByVal ObjSearchString As String, ByVal ObjCompanyDBId As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
    '    Try


    '        'if there is Search String then we wil  Fetch Record According t the Search String
    '        Dim psCompanyDBId, psSearchString, psSQL As String
    '        Dim piStartIndex, piEndIndex As Integer
    '        Dim pdsFeatureList As DataSet
    '        'Get the Company Name
    '        psCompanyDBId = ObjCompanyDBId
    '        'get the Seacrch String 
    '        psSearchString = ObjSearchString
    '        'get the Starting Index for the Search 
    '        piStartIndex = objStartCount
    '        'get the End Index for the Search 
    '        piEndIndex = ObjEndCount
    '        'if there is Search String then we wil  Fetch Record According t the Search String

    '        'Now assign the Company object Instance to a variable pObjCompany
    '        Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
    '        pObjCompany.CompanyDbName = psCompanyDBId
    '        pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
    '        'Now get connection instance i.e SQL/HANA
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        'Now we will connect to the required Query Instance of SQL/HANA
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '        Dim pSqlParam(1) As MfgDBParameter
    '        'Parameter 0 consisting warehouse and it's datatype will be nvarchar
    '        pSqlParam(0) = New MfgDBParameter
    '        pSqlParam(0).ParamName = "@STARTCOUNT"
    '        pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
    '        pSqlParam(0).Paramvalue = piStartIndex

    '        pSqlParam(1) = New MfgDBParameter
    '        pSqlParam(1).ParamName = "@ENDCOUNT"
    '        pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
    '        pSqlParam(1).Paramvalue = piEndIndex
    '        ' Get the Query on the basis of objIQuery
    '        psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllSavedRecordOnBasisOfSearchCriteria)
    '        pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
    '        Return pdsFeatureList.Tables(0)
    '    Catch ex As Exception
    '        Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
    '    End Try
    '    Return Nothing
    'End Function

End Class
