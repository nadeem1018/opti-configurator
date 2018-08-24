Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("FeatureHeader")>
Public Class FeatureHeaderController
    Inherits ApiController

    Private objSampleBL As FeatureHeaderBL
    Public Sub New()
        objSampleBL = New FeatureHeaderBL
    End Sub


    <HttpPost, HttpGet>
    <Route("AddFeatures")>
    Public Function AddFeatures(ByVal Feature As FeatureHeaderModel) As String
        Return FeatureHeaderBL.AddFeatures(Feature)
    End Function


    <HttpPost, HttpGet>
  <Route("GetAllFeatures")>
    Public Function GetAllFeatures(ByVal Feature As FeatureHeaderModel) As String
        Return FeatureHeaderBL.AddFeatures(Feature)
    End Function


    <HttpPost, HttpGet>
  <Route("DeleteFeatures")>
    Public Function DeleteFeatures(ByVal Feature As FeatureHeaderModel) As String
        Return FeatureHeaderBL.DeleteFeatures(Feature)
    End Function

    <HttpPost, HttpGet>
  <Route("UpdateFeatures")>
    Public Function UpdateFeatures(ByVal Feature As FeatureHeaderModel) As String
        Return FeatureHeaderBL.UpdateFeatures(Feature)
    End Function

    <HttpPost, HttpGet>
  <Route("GetModelTemplateItem")>
    Public Function GetModelTemplateItem(ByVal oModelTemplateItem As FeatureHeaderModel) As DataTable
        Return FeatureHeaderBL.GetModelTemplateItem(oModelTemplateItem)
    End Function


    <HttpPost, HttpGet>
  <Route("GetItemCodeGenerationReference")>
    Public Function GetItemCodeGenerationReference(ByVal oItemCodeGenerationReference As FeatureHeaderModel) As DataTable
        Return FeatureHeaderBL.GetItemCodeGenerationReference(oItemCodeGenerationReference)
    End Function


    <HttpPost, HttpGet>
  <Route("CheckDuplicateFeatureCode")>
    Public Function CheckDuplicateFeatureCode(ByVal oCheckDuplicateFeatureCode As FeatureHeaderModel) As DataTable
        Return FeatureHeaderBL.CheckDuplicateFeatureCode(oCheckDuplicateFeatureCode)
    End Function
    'Controller to get all Data From Service
    <HttpPost, HttpGet>
  <Route("GetAllData")>
    Public Function GetAllData(ByVal oGetAllData As FeatureHeaderModel) As DataTable
        Return FeatureHeaderBL.GetAllData(oGetAllData)
    End Function

    <HttpPost, HttpGet>
 <Route("GetAllDataOnBasisOfSearchCriteria")>
    Public Function GetAllDataOnBasisOfSearchCriteria(ByVal oGetAllData As FeatureHeaderModel) As DataTable
        Return FeatureHeaderBL.GetAllDataOnBasisOfSearchCriteria(oGetAllData)
    End Function



End Class