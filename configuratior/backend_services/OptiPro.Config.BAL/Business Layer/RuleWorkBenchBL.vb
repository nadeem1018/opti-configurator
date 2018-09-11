﻿Imports OptiPro.Config.Service
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
Public Class RuleWorkBenchBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub


    Public Shared Function GetAllFeatureForRuleWorkBench(ByVal objFeatureList As RuleWorkBenchModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objFeatureList.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = RuleWorkBenchDL.GetAllFeatureForRuleWorkBench(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetAllDetailsForFeature(ByVal objFeatureList As RuleWorkBenchModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objFeatureList.FeatureDetails)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = RuleWorkBenchDL.GetAllDetailsForFeature(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetAllModelsForRuleWorkBench(ByVal objModelList As RuleWorkBenchModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objModelList.ModelList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = RuleWorkBenchDL.GetAllModelsForRuleWorkBench(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function CheckValidModelEntered(ByVal objCheckModel As RuleWorkBenchModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckModel.ModelList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = RuleWorkBenchDL.CheckValidModelEntered(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function CheckValidFeatureEntered(ByVal objCheckFeature As RuleWorkBenchModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckFeature.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = RuleWorkBenchDL.CheckValidFeatureEntered(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function
    



   


    Public Shared Function AddUpdateDataForRuleWorkBench(ByVal objAddUpdateRule As RuleWorkBenchModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataSet = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataSet)(objAddUpdateRule.AddRule)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = RuleWorkBenchDL.AddUpdateDataForRuleWorkBench(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetDetailForModel(ByVal objGetDetailForModel As ModelBOMModel) As DataTable
        Dim pdModelDetail As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetDetailForModel.ModelBOMDetail)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdModelDetail = ModelBOMDL.GetDetailForModel(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdModelDetail
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function DeleteModelBOMFromHDRandDTL(ByVal objDeleteModelBOM As ModelBOMModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDeleteModelBOM.DeleteModel)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = ModelBOMDL.DeleteModelBOMFromHDRandDTL(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetDataByModelID(ByVal objDeleteModelBOM As ModelBOMModel) As DataSet
        Dim pdsDataByModelID As DataSet
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDeleteModelBOM.GetData)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdsDataByModelID = ModelBOMDL.GetDataByModelID(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdsDataByModelID
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetDataForCommonViewForModelBOM(ByVal objGetData As ModelBOMModel) As String
        Dim psStatus As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetData.GetData)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = ModelBOMDL.GetDataForCommonViewForModelBOM(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function GetDataForExplodeViewForModelBOM(ByVal objDeleteModelBOM As ModelBOMModel) As DataTable
        Dim pdsDataByModelID As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDeleteModelBOM.GetData)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdsDataByModelID = ModelBOMDL.GetDataForExplodeViewForModelBOM(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdsDataByModelID
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

End Class
