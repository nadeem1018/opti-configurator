Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("FeatureMasterDetail")>
Public Class FeatureBOMController
    Inherits ApiController

    Private objSampleBL As FeatureBOMBL
    Public Sub New()
        objSampleBL = New FeatureBOMBL
    End Sub
    ''' <summary>
    ''' vb Controller to get the List of all the Feture from the Fature Header
    ''' </summary>
    ''' <param name="oFeatureList"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <HttpPost, HttpGet>
    <Route("GetFeatureList")>
    Public Function GetFeatureList(ByVal oFeatureList As FeatureBOMModel) As DataTable
        Return FeatureBOMBL.GetFeatureList(oFeatureList)
    End Function

    ''' <summary>
    ''' vb Controller alls the buisnesss layer and it is used t get the Details of the Features According to Featre ID 
    ''' </summary>
    ''' <param name="oFeatureDetail"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <HttpPost, HttpGet>
    <Route("GetFeatureDetail")>
    Public Function GetFeatureDetail(ByVal oFeatureDetail As FeatureBOMModel) As DataTable
        Return FeatureBOMBL.GetFeatureDetail(oFeatureDetail)
    End Function
    'VbController to get the Item List f Item is Selected in the Lookup
    <HttpPost, HttpGet>
    <Route("GetItemList")>
    Public Function GetItemList(ByVal oFeatureDetail As FeatureBOMModel) As DataTable
        Return FeatureBOMBL.GetItemForFeatureBOM(oFeatureDetail)
    End Function

    'Vb Controller to get the Feature Except the Selecccted Feature ,This Feature are for the Grid Level
    <HttpPost, HttpGet>
    <Route("GetFeatureListExceptSelectedFeature")>
    Public Function GetFeatureListExceptSelectedFeature(ByVal oFeatureDetail As FeatureBOMModel) As DataTable
        Return FeatureBOMBL.GetFeatureListExceptSelectedFeature(oFeatureDetail)
    End Function

    'Vb Controller to add the Feature 
    <HttpPost, HttpGet>
   <Route("AddFeatureMasterDetail")>
    Public Function AddFeatureMaster(ByVal oAddFeatureMasterDetail As FeatureBOMModel) As String
        Return FeatureBOMBL.AddFeatureMasterDetail(oAddFeatureMasterDetail)
    End Function

    'Vb Controller to Update the Feature Detail Table 
    <HttpPost, HttpGet>
  <Route("UpdateDataInFeatureDetail")>
    Public Function UpdateDataInFeatureDetail(ByVal oUpdateFeatureMasterDetail As FeatureBOMModel) As String
        Return FeatureBOMBL.UpdateDataInFeatureDetail(oUpdateFeatureMasterDetail)
    End Function

    'vb Controller to Delete the Data from the FEature Detail TAble 
    <HttpPost, HttpGet>
  <Route("DeleteDataFromFeatureDetail")>
    Public Function DeleteDataFromFeatureDetail(ByVal oDeleteFeatureMasterDetail As FeatureBOMModel) As String
        Return FeatureBOMBL.DeleteDataFromFeatureDetail(oDeleteFeatureMasterDetail)
    End Function





End Class