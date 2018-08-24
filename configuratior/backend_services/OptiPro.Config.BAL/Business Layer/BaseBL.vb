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
Public Class BaseBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
   

    'This Function will get the URL to be hitted for Authentication
    Public Shared Function GetPSURL(ByVal objgetPSURL As BaseModel) As String
        Try
            'Create a String Variable to get the value from DataLayer
            Dim psURLStr As String
            ' Create a DataTable to deserialize the JSON object
            Dim objdtPSURL As DataTable = JsonConvert.DeserializeObject(Of DataTable)(objgetPSURL.GetPSURL)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psURLStr = BaseDL.GetPSURL(objdtPSURL, mObjCompany)
            Return psURLStr
        Catch ex As Exception
            ErrorLogging.LogError(ex)
        End Try
        Return Nothing
    End Function


End Class
