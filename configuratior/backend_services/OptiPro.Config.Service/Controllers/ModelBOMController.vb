Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("ModelBOM")>
Public Class ModelBOMController
    Inherits ApiController

    Private objSampleBL As ModelBOMBL
    Public Sub New()
        objSampleBL = New ModelBOMBL
    End Sub
    ''' <summary>
    ''' vb Controller to get the List of all the Feture from the Fature Header
    ''' </summary>
    ''' <param name="oFeatureList"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    

    <HttpPost, HttpGet>
   <Route("GetPriceList")>
    Public Function GetPriceList(ByVal oGetPriceList As ModelBOMModel) As DataTable
        Return ModelBOMBL.GetPriceList(oGetPriceList)
    End Function


    <HttpPost, HttpGet>
   <Route("GetModelList")>
    Public Function GetModelList(ByVal oGetModelList As ModelBOMModel) As DataTable
        Return ModelBOMBL.GetModelList(oGetModelList)
    End Function


    <HttpPost, HttpGet>
  <Route("AddUpdateModelBOM")>
    Public Function AddUpdateModelBOM(ByVal oAddModel As ModelBOMModel) As String
        Return ModelBOMBL.AddUpdateModelBOM(oAddModel)
    End Function


    <HttpPost, HttpGet>
  <Route("GetDetailForModel")>
    Public Function GetDetailForModel(ByVal oGetDetailForModel As ModelBOMModel) As DataTable
        Return ModelBOMBL.GetDetailForModel(oGetDetailForModel)
    End Function

    <HttpPost, HttpGet>
  <Route("DeleteModelBOMFromHDRandDTL")>
    Public Function DeleteModelBOMFromHDRandDTL(ByVal oDeleteModelBOM As ModelBOMModel) As String
        Return ModelBOMBL.DeleteModelBOMFromHDRandDTL(oDeleteModelBOM)
    End Function

    <HttpPost, HttpGet>
  <Route("GetDataForCommonViewForModelBOM")>
    Public Function GetDataForCommonViewForModelBOM(ByVal oGetData As ModelBOMModel) As String
        Return ModelBOMBL.GetDataForCommonViewForModelBOM(oGetData)
    End Function


    <HttpPost, HttpGet>
  <Route("GetDataByModelID")>
    Public Function GetDataByModelID(ByVal oGetDataByModelID As ModelBOMModel) As DataSet
        Return ModelBOMBL.GetDataByModelID(oGetDataByModelID)
    End Function






End Class