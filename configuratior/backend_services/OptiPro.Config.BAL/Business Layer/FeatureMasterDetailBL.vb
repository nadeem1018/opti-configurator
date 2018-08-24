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
Public Class FeatureMasterDetailBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
    'Function is called from the LoginController.js to be Executed
    Public Shared Function GetFeatureList(ByVal objAddFeature As FeatureMasterDetailModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = FeatureMasterDetailDL.GetFeatureList(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    ''' <summary>
    ''' This Function is Used to get the Details of the Features According to the Features Seleced From the Lookup 
    ''' </summary>
    ''' <param name="objAddFeature"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetFeatureDetail(ByVal objAddFeature As FeatureMasterDetailModel) As DataTable
        Dim pdtFeatureDetail As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtFeatureDetail = FeatureMasterDetailDL.GetFeatureDetail(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtFeatureDetail
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    ''' <summary>
    ''' function to get the List of Item frm the Item master
    ''' </summary>
    ''' <param name="objAddFeature"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function GetItemList(ByVal objAddFeature As FeatureMasterDetailModel) As DataTable
        Dim pdtItemList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.ItemList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtItemList = FeatureMasterDetailDL.GetItemList(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtItemList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    ''' <summary>
    ''' buisness Layer to Get all the Feature Except the Selected Feature in the Header
    ''' </summary>
    ''' <param name="objAddFeature"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function GetFeatureListExceptSelectedFeature(ByVal objAddFeature As FeatureMasterDetailModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = FeatureMasterDetailDL.GetFeatureListExceptSelectedFeature(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    ''' <summary>
    ''' Function to add Feature Master Detail Buisness LAyer 
    ''' table:OPCONFIG_FEATUREHDRMASTER,OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="objAddFeature"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function AddFeatureMasterDetail(ByVal objAddFeatureMasterDetail As FeatureMasterDetailModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataSet = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataSet)(objAddFeatureMasterDetail.AddFeatureMaster)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureMasterDetailDL.AddFeatureMasterDetail(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return psStatus = ex.ToString
        End Try
    End Function
    ''' <summary>
    ''' Buisness Layer to Update the Data in TAble
    ''' Table :OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="oUpdateFeatureMasterDetail"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function UpdateDataInFeatureDetail(ByVal oUpdateFeatureMasterDetail As FeatureMasterDetailModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(oUpdateFeatureMasterDetail.UpdateFeatureMaster)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureMasterDetailDL.UpdateDataInFeatureDetail(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return psStatus = ex.ToString
        End Try
    End Function


    ''' <summary>
    ''' Buisness Layer to Delete the Data 
    ''' Table:OPCONFIG_FEATUREDTL
    ''' </summary>
    ''' <param name="oDeleteFeatureMasterDetail"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function DeleteDataFromFeatureDetail(ByVal oDeleteFeatureMasterDetail As FeatureMasterDetailModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(oDeleteFeatureMasterDetail.DeleteFeatureMaster)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = FeatureMasterDetailDL.UpdateDataInFeatureDetail(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return psStatus = ex.ToString
        End Try
    End Function
   


End Class
