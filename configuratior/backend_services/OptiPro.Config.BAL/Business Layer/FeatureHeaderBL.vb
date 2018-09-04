Imports OptiPro.Config.Service
Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.Common
Imports OptiPro.Config.DAL
Imports Newtonsoft.Json
Imports System.Data
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.ComponentModel
Imports System.Reflection
Imports System.Web
Imports OptiPro.Config.Entity
Public Class FeatureHeaderBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
    'Function is called from the LoginController.js to be Executed
    Public Shared Function AddFeatures(ByVal objAddFeature As FeatureHeaderModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.Feature)

            ''-----------------------------------Code For Licence -------------------------------------------------
            'Dim psLicenceErrMsg As String = ""
            'If Not (BaseBL.IsLicAuthenticateForTransaction(pdtDetails.Rows(0).Item("Username"), pdtDetails.Rows(0).Item("GUID"), psLicenceErrMsg)) Then
            '    Dim dsLICServiceDs As DataSet
            '    Dim pRow As DataRow
            '    dsLICServiceDs = CreateTableForLicenseMsg()
            '    pRow = dsLICServiceDs.Tables(0).NewRow
            '    pRow("ErrorMsg") = psLicenceErrMsg
            '    pRow("ErrorNo") = psLicenceErrMsg
            '    dsLICServiceDs.Tables(0).Rows.Add(pRow)
            '    psStatus = dsLICServiceDs.Tables(0).Rows(0).Item("ErrorMsg").ToString
            '    Return psStatus
            'End If
            ''----------------------------------Code For Licence End Here -------------------------------------------------------------

            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureHeaderDL.AddFeatures(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function
    'Function is called from the LoginController.js to be Executed
    Public Shared Function DeleteFeatures(ByVal objDelete As FeatureHeaderModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDelete.DeleteFeature)

            ''-----------------------------------Code For Licence -------------------------------------------------
            'Dim psLicenceErrMsg As String = ""
            'If Not (BaseBL.IsLicAuthenticateForTransaction(pdtDetails.Rows(0).Item("Username"), pdtDetails.Rows(0).Item("GUID"), psLicenceErrMsg)) Then
            '    Dim dsLICServiceDs As DataSet
            '    Dim pRow As DataRow
            '    dsLICServiceDs = CreateTableForLicenseMsg()
            '    pRow = dsLICServiceDs.Tables(0).NewRow
            '    pRow("ErrorMsg") = psLicenceErrMsg
            '    pRow("ErrorNo") = psLicenceErrMsg
            '    dsLICServiceDs.Tables(0).Rows.Add(pRow)
            '    psStatus = dsLICServiceDs.Tables(0).Rows(0).Item("ErrorMsg").ToString
            '    Return psStatus
            'End If
            ''----------------------------------Code For Licence End Here -------------------------------------------------------------

            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureHeaderDL.DeleteFeatures(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function UpdateFeatures(ByVal objDelete As FeatureHeaderModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDelete.UpdateFeature)

            ''-----------------------------------Code For Licence -------------------------------------------------
            'Dim psLicenceErrMsg As String = ""
            'If Not (BaseBL.IsLicAuthenticateForTransaction(pdtDetails.Rows(0).Item("Username"), pdtDetails.Rows(0).Item("GUID"), psLicenceErrMsg)) Then
            '    Dim dsLICServiceDs As DataSet
            '    Dim pRow As DataRow
            '    dsLICServiceDs = CreateTableForLicenseMsg()
            '    pRow = dsLICServiceDs.Tables(0).NewRow
            '    pRow("ErrorMsg") = psLicenceErrMsg
            '    pRow("ErrorNo") = psLicenceErrMsg
            '    dsLICServiceDs.Tables(0).Rows.Add(pRow)
            '    psStatus = dsLICServiceDs.Tables(0).Rows(0).Item("ErrorMsg").ToString
            '    Return psStatus
            'End If
            ''----------------------------------Code For Licence End Here -------------------------------------------------------------

            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureHeaderDL.UpdateFeatures(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetModelTemplateItem(ByVal objModelTemplateItem As FeatureHeaderModel) As DataTable
        Dim pdtModelTemplateItem As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objModelTemplateItem.ModelItem)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtModelTemplateItem = FeatureHeaderDL.GetModelTemplateItem(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtModelTemplateItem
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function GetItemCodeGenerationReference(ByVal objGetItemCodeGenerationReference As FeatureHeaderModel) As DataTable
        Dim pdtModelTemplateItem As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetItemCodeGenerationReference.ItemCodeGenerationReference)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtModelTemplateItem = FeatureHeaderDL.GetItemCodeGenerationReference(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtModelTemplateItem
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function CheckDuplicateFeatureCode(ByVal objCheckDuplicateFeatureCode As FeatureHeaderModel) As DataTable
        Dim pdtCheckDuplicateFeature As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.FeatureCode)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtCheckDuplicateFeature = FeatureHeaderDL.CheckDuplicateFeatureCode(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtCheckDuplicateFeature
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function GetAllData(ByVal objGetAllData As FeatureHeaderModel) As String
        Dim pdtGetData As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetAllData.GetRecord)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtGetData = FeatureHeaderDL.GetAllData(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtGetData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetAllDataOnBasisOfSearchCriteria(ByVal objGetAllData As FeatureHeaderModel) As DataTable
        Dim pdtGetData As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetAllData.GetRecord)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtGetData = FeatureHeaderDL.GetAllDataOnBasisOfSearchCriteria(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtGetData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function GetRecordById(ByVal objCheckDuplicateFeatureCode As FeatureHeaderModel) As DataTable
        Dim pdtCheckDuplicateFeature As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.FeatureCode)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtCheckDuplicateFeature = FeatureHeaderDL.GetRecordById(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtCheckDuplicateFeature
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function ImportDataFromExcel(ByVal objCheckDuplicateFeatureCode As FeatureHeaderModel) As String
        Dim psStatusImport As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            Dim pCompanyDBId As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.GetRecord)
            pCompanyDBId = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.FeatureCode)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatusImport = FeatureHeaderDL.ImportDataFromExcel(pdtDetails, pCompanyDBId, mObjCompany)
            'Return the Datasetset
            Return psStatusImport
        Catch ex As Exception
            Return Nothing
        End Try
    End Function



    Public Shared Function ChkValidItemTemplate(ByVal objCheckDuplicateFeatureCode As FeatureHeaderModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            Dim pCompanyDBId As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.GetRecord)

            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureHeaderDL.ChkValidItemTemplate(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function ChkValidItemCodeGeneration(ByVal objCheckDuplicateFeatureCode As FeatureHeaderModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            Dim pCompanyDBId As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateFeatureCode.GetRecord)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureHeaderDL.ChkValidItemCodeGeneration(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function CreateTableForLicenseMsg() As DataSet
        Dim ds As New DataSet
        Dim dt As New DataTable

        dt.Columns.Add("ErrorMsg")
        dt.Columns.Add("ErrorNo")

        ds.Tables.Add(dt)
        ds.Tables(0).TableName = "LICDATA"
        Return ds
    End Function


    'Public Shared Function GetDataByFeatureID(ByVal objGetAllData As FeatureHeaderModel) As DataTable
    '    Dim pdtGetData As DataTable
    '    Try
    '        Dim pdtDetails As DataTable = Nothing
    '        ' Deserialize JSON Object in DataTable Send through the Service
    '        pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetAllData.GetRecord)
    '        'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
    '        pdtGetData = FeatureHeaderDL.GetDataByFeatureID(pdtDetails, mObjCompany)
    '        'Return the Datasetset
    '        Return pdtGetData
    '    Catch ex As Exception
    '        Return Nothing
    '    End Try
    'End Function



End Class
