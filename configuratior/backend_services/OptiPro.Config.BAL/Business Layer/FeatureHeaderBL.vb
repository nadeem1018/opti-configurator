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


    Public Shared Function GetAllData(ByVal objGetAllData As FeatureHeaderModel) As DataTable
        Dim pdtGetData As DataTable
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



End Class
