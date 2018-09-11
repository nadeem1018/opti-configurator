Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("RuleWorkBench")>
Public Class RuleWorkBenchController
    Inherits ApiController

    Private objSampleBL As RuleWorkBenchBL
    Public Sub New()
        objSampleBL = New RuleWorkBenchBL
    End Sub
    ''' <summary>
    ''' vb Controller to get the List of all the Feture from the Fature Header
    ''' </summary>
    ''' <param name="oFeatureList"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>


    <HttpPost, HttpGet>
   <Route("GetAllFeatureForRuleWorkBench")>
    Public Function GetAllFeatureForRuleWorkBench(ByVal oFeatureList As RuleWorkBenchModel) As DataTable
        Return RuleWorkBenchBL.GetAllFeatureForRuleWorkBench(oFeatureList)
    End Function

    <HttpPost, HttpGet>
   <Route("GetAllDetailsForFeature")>
    Public Function GetAllDetailsForFeature(ByVal oFeatureList As RuleWorkBenchModel) As DataTable
        Return RuleWorkBenchBL.GetAllDetailsForFeature(oFeatureList)
    End Function

    <HttpPost, HttpGet>
   <Route("GetAllModelsForRuleWorkBench")>
    Public Function GetAllModelsForRuleWorkBench(ByVal oFeatureList As RuleWorkBenchModel) As DataTable
        Return RuleWorkBenchBL.GetAllModelsForRuleWorkBench(oFeatureList)
    End Function


    <HttpPost, HttpGet>
   <Route("AddUpdateDataForRuleWorkBench")>
    Public Function AddUpdateDataForRuleWorkBench(ByVal oFeatureList As RuleWorkBenchModel) As String
        Return RuleWorkBenchBL.AddUpdateDataForRuleWorkBench(oFeatureList)
    End Function


    <HttpPost, HttpGet>
   <Route("CheckValidModelEntered")>
    Public Function CheckValidModelEntered(ByVal oFeatureList As RuleWorkBenchModel) As String
        Return RuleWorkBenchBL.CheckValidModelEntered(oFeatureList)
    End Function


    <HttpPost, HttpGet>
   <Route("CheckValidFeatureEntered")>
    Public Function CheckValidFeatureEntered(ByVal oFeatureList As RuleWorkBenchModel) As String
        Return RuleWorkBenchBL.CheckValidFeatureEntered(oFeatureList)
    End Function
   
   






End Class