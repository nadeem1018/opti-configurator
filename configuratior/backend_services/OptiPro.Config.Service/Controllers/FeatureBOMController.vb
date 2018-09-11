Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("FeatureBOM")>
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

    'Vb Controller to add the Feature 
    <HttpPost, HttpGet>
   <Route("AddUpdateFeatureBOMData")>
    Public Function AddUpdateFeatureBOMData(ByVal oAddFeatureMasterDetail As FeatureBOMModel) As String
        Return FeatureBOMBL.AddUpdateFeatureBOMData(oAddFeatureMasterDetail)
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
    'Function to getthe Data for the Common View
    <HttpPost, HttpGet>
  <Route("GetDataForCommonView")>
    Public Function GetDataForCommonView(ByVal oDataForCommonView As FeatureBOMModel) As String
        Return FeatureBOMBL.GetDataForCommonView(oDataForCommonView)
    End Function

    'Function to get Data by  Feature ID
    <HttpPost, HttpGet>
 <Route("GetDataByFeatureID")>
    Public Function GetDataByFeatureID(ByVal oDataByFeatureID As FeatureBOMModel) As DataSet
        Return FeatureBOMBL.GetDataByFeatureID(oDataByFeatureID)
    End Function

    <HttpPost, HttpGet>
 <Route("DeleteFeatureFromHDRandDTL")>
    Public Function DeleteFeatureFromHDRandDTL(ByVal oDeleteFeatureMasterDetail As FeatureBOMModel) As String
        Return FeatureBOMBL.DeleteFeatureFromHDRandDTL(oDeleteFeatureMasterDetail)
    End Function


    <HttpPost, HttpGet>
 <Route("GetDataForExplodeViewForFeatureBOM")>
    Public Function GetDataForExplodeViewForFeatureBOM(ByVal oGetData As FeatureBOMModel) As DataTable
        Return FeatureBOMBL.GetDataForExplodeViewForFeatureBOM(oGetData)
    End Function

    'FUNCTION TO UPLOAD THE PATH FO THE ATTACHAMENT 
    <HttpPost, HttpGet>
   <Route("UploadFeatureBOMAttachments")>
    Public Function UploadFeatureBOMAttachments() As String
        Dim file = HttpContext.Current.Request.Form
        Dim filePath As String = ""
        Dim uploadFilePath As String()
        Try
            For idxFiles As Integer = 0 To HttpContext.Current.Request.Files.Count - 1
                Dim postedFiles As HttpPostedFile = HttpContext.Current.Request.Files(idxFiles)
                If (postedFiles.ContentLength > 0) Then
                    Dim fName As String = System.IO.Path.GetFileNameWithoutExtension(postedFiles.FileName)
                    '  Dim pbFileExists As Boolean = System.IO.File.Exists(AppDomain.CurrentDomain.BaseDirectory & "UploadFile")
                    Dim pbFileServerPath As String = AppDomain.CurrentDomain.BaseDirectory
                    If (Not System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/UploadFile/Image"))) Then
                        System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/UploadFile/Image"))
                    End If
                    filePath = HttpContext.Current.Server.MapPath("~/UploadFile/Image/" + postedFiles.FileName)
                    postedFiles.SaveAs(filePath)
                    uploadFilePath = Split(filePath, pbFileServerPath)
                End If
            Next
            Return uploadFilePath(1).ToString
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from File Upload " & ex.Message)
        End Try
        Return False
    End Function

    <HttpPost, HttpGet>
<Route("CheckValidFeatureIdEnteredForFeatureBOM")>
    Public Function CheckValidFeatureIdEnteredForFeatureBOM(ByVal oGetData As FeatureBOMModel) As String
        Return FeatureBOMBL.CheckValidFeatureIdEnteredForFeatureBOM(oGetData)
    End Function

End Class