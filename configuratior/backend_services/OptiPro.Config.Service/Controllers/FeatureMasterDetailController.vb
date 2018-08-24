Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("FeatureMasterDetail")>
Public Class FeatureMasterDetailController
    Inherits ApiController

    Private objSampleBL As FeatureMasterDetailBL
    Public Sub New()
        objSampleBL = New FeatureMasterDetailBL
    End Sub
    ''' <summary>
    ''' vb Controller to get the List of all the Feture from the Fature Header
    ''' </summary>
    ''' <param name="oFeatureList"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <HttpPost, HttpGet>
    <Route("GetFeatureList")>
    Public Function GetFeatureList(ByVal oFeatureList As FeatureMasterDetailModel) As DataTable
        Return FeatureMasterDetailBL.GetFeatureList(oFeatureList)
    End Function

    ''' <summary>
    ''' vb Controller alls the buisnesss layer and it is used t get the Details of the Features According to Featre ID 
    ''' </summary>
    ''' <param name="oFeatureDetail"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <HttpPost, HttpGet>
    <Route("GetFeatureDetail")>
    Public Function GetFeatureDetail(ByVal oFeatureDetail As FeatureMasterDetailModel) As DataTable
        Return FeatureMasterDetailBL.GetFeatureDetail(oFeatureDetail)
    End Function
    'VbController to get the Item List f Item is Selected in the Lookup
    <HttpPost, HttpGet>
    <Route("GetItemList")>
    Public Function GetItemList(ByVal oFeatureDetail As FeatureMasterDetailModel) As DataTable
        Return FeatureMasterDetailBL.GetItemList(oFeatureDetail)
    End Function

    'Vb Controller to get the Feature Except the Selecccted Feature ,This Feature are for the Grid Level
    <HttpPost, HttpGet>
    <Route("GetFeatureListExceptSelectedFeature")>
    Public Function GetFeatureListExceptSelectedFeature(ByVal oFeatureDetail As FeatureMasterDetailModel) As DataTable
        Return FeatureMasterDetailBL.GetFeatureListExceptSelectedFeature(oFeatureDetail)
    End Function

    'Vb Controller to add the Feature 
    <HttpPost, HttpGet>
   <Route("AddFeatureMasterDetail")>
    Public Function AddFeatureMaster(ByVal oAddFeatureMasterDetail As FeatureMasterDetailModel) As String
        Return FeatureMasterDetailBL.AddFeatureMasterDetail(oAddFeatureMasterDetail)
    End Function

    'Vb Controller to Update the Feature Detail Table 
    <HttpPost, HttpGet>
  <Route("UpdateDataInFeatureDetail")>
    Public Function UpdateDataInFeatureDetail(ByVal oUpdateFeatureMasterDetail As FeatureMasterDetailModel) As String
        Return FeatureMasterDetailBL.UpdateDataInFeatureDetail(oUpdateFeatureMasterDetail)
    End Function

    'vb Controller to Delete the Data from the FEature Detail TAble 
    <HttpPost, HttpGet>
  <Route("DeleteDataFromFeatureDetail")>
    Public Function DeleteDataFromFeatureDetail(ByVal oDeleteFeatureMasterDetail As FeatureMasterDetailModel) As String
        Return FeatureMasterDetailBL.DeleteDataFromFeatureDetail(oDeleteFeatureMasterDetail)
    End Function





End Class