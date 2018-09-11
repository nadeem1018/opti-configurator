Imports System.Net
Imports System.Web.Http
Imports OptiPro.Config.Common
Imports OptiPro.Config.Entity
Imports OptiPro.Config.BAL

<RoutePrefix("Base")>
Public Class BaseController
    Inherits ApiController

    Private objSampleBL As BaseBL
    Public Sub New()
        objSampleBL = New BaseBL
    End Sub

    <HttpPost, HttpGet>
    <Route("GetPSURL")>
    Public Function GetPSURL(ByVal Base As BaseModel) As String
        Return BaseBL.GetPSURL(Base)
    End Function

    '<HttpPost, HttpGet> _
    '<Route("GetPermissionDetails")>
    'Public Function GetPermissionDetails(ByVal Base As BaseModel) As DataTable
    '    Return BaseBL.GetPermissionDetails(Base)
    'End Function

End Class