Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("ItemGeneration")>
Public Class ItemGenerationController
    Inherits ApiController

    Private objSampleBL As ItemGenerationBL
    Public Sub New()
        objSampleBL = New ItemGenerationBL
    End Sub
    ''' <summary>
    ''' vb Controller to add Item Generation in Item
    ''' </summary>
    ''' <param name="oAddItemGeneration"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <HttpPost, HttpGet>
    <Route("AddItemGeneration")>
    Public Function AddItemGeneration(ByVal oAddItemGeneration As ItemGenerationModel) As String
        Return ItemGenerationBL.AddItemGeneration(oAddItemGeneration)
    End Function

    <HttpPost, HttpGet>
   <Route("GetItemListForGeneration")>
    Public Function GetItemListForGeneration(ByVal oItemListGeneration As ItemGenerationModel) As DataTable
        Return ItemGenerationBL.GetItemListForGeneration(oItemListGeneration)
    End Function

    <HttpPost, HttpGet>
  <Route("DeleteItemGenerationCode")>
    Public Function DeleteItemGenerationCode(ByVal oDeleteItemGenerationCode As ItemGenerationModel) As String
        Return ItemGenerationBL.DeleteItemGenerationCode(oDeleteItemGenerationCode)
    End Function

    <HttpPost, HttpGet>
  <Route("CheckDuplicateItemCode")>
    Public Function CheckDuplicateItemCode(ByVal oCheckDuplicatItemCode As ItemGenerationModel) As DataTable
        Return ItemGenerationBL.CheckDuplicateItemCode(oCheckDuplicatItemCode)
    End Function

    <HttpPost, HttpGet>
 <Route("UpdateDataofGeneratedItem")>
    Public Function UpdateDataofGeneratedItem(ByVal oUpdateDataofGeneratedItem As ItemGenerationModel) As String
        Return ItemGenerationBL.UpdateDataofGeneratedItem(oUpdateDataofGeneratedItem)
    End Function
    'Controller to get the Item Code According to Item 
    <HttpPost, HttpGet>
 <Route("GetDataByItemCode")>
    Public Function GetDataByItemCode(ByVal oGetDataByItemCode As ItemGenerationModel) As DataTable
        Return ItemGenerationBL.GetDataByItemCode(oGetDataByItemCode)
    End Function

    <HttpPost, HttpGet>
 <Route("GetItemGenerationData")>
    Public Function GetItemGenerationData(ByVal oGetItemGenerationData As ItemGenerationModel) As DataTable
        Return ItemGenerationBL.GetItemGenerationData(oGetItemGenerationData)
    End Function

End Class