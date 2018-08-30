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
    <Route("GetFeatureList")>
    Public Function GetFeatureList(ByVal oFeatureList As ModelBOMModel) As DataTable
        Return ModelBOMBL.GetFeatureList(oFeatureList)
    End Function

   





End Class