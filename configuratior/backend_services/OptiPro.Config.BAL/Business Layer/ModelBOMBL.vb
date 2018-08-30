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
Public Class ModelBOMBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
    'Function is called from the LoginController.js to be Executed
    Public Shared Function GetFeatureList(ByVal objAddFeature As ModelBOMModel) As DataTable
        Dim pdFeatureList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddFeature.FeatureList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdFeatureList = ModelBOMDL.GetFeatureList(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdFeatureList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    

End Class
