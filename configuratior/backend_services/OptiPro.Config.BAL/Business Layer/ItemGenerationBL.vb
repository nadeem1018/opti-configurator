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
Public Class ItemGenerationBL

    Private Shared mObjCompany As OptiPro.Config.Common.Company

    Public Sub New()
        'Get the Current Comapny instance
        mObjCompany = OptiPro.Config.Common.Company.GetCompanyInstance(HttpContext.Current)
    End Sub
    ''' <summary>
    ''' Function to add new item Generation in the Database
    ''' </summary>
    ''' <param name="objAddItemGeneration"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function AddItemGeneration(ByVal objAddItemGeneration As ItemGenerationModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddItemGeneration.AddItemGeneration)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = ItemGenerationDL.AddItemGeneration(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    ''' <summary>
    ''' function to get the List of Item frm the Item master
    ''' </summary>
    ''' <param name="objAddFeature"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function GetItemListForGeneration(ByVal objItemListGeneration As ItemGenerationModel) As DataTable
        Dim pdtItemList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objItemListGeneration.ItemList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtItemList = ItemGenerationDL.GetItemListForGeneration(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtItemList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function
    ''' <summary>
    ''' Buisness LAyer to Delete the Generated ItmCode 
    ''' </summary>
    ''' <param name="objDeleteItemGenerationCode"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Public Shared Function DeleteItemGenerationCode(ByVal objDeleteItemGenerationCode As ItemGenerationModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objDeleteItemGenerationCode.DeleteItemGeneration)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = ItemGenerationDL.DeleteItemGenerationCode(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function
    ''' <summary>
    ''' Function to check if Serials are already Generated in Database or not 
    ''' </summary>
    ''' <param name="objCheckDuplicateItemCode"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function CheckDuplicateItemCode(ByVal objCheckDuplicateItemCode As ItemGenerationModel) As DataTable
        Dim pdtItemList As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objCheckDuplicateItemCode.ItemList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtItemList = ItemGenerationDL.CheckDuplicateItemCode(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtItemList
        Catch ex As Exception
            Return Nothing
        End Try
    End Function
    ''' <summary>
    ''' Buisness Layer to Update the Data of the Generated Item 
    ''' </summary>
    ''' <param name="objAddItemGeneration"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function UpdateDataofGeneratedItem(ByVal objAddItemGeneration As ItemGenerationModel) As String
        Dim psStatus As String = String.Empty
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objAddItemGeneration.AddItemGeneration)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psStatus = ItemGenerationDL.UpdateDataofGeneratedItem(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psStatus
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    ''' <summary>
    ''' Buisnesss Layer to get the Item Code according to the Item Code
    ''' </summary>
    ''' <param name="objGetDataByItemCode"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetDataByItemCode(ByVal objGetDataByItemCode As ItemGenerationModel) As DataTable
        Dim pdtItemData As DataTable
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetDataByItemCode.ItemList)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            pdtItemData = ItemGenerationDL.GetDataByItemCode(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return pdtItemData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function


    Public Shared Function GetItemGenerationData(ByVal objGetItemGenerationData As ItemGenerationModel) As String
        Dim psItemData As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetItemGenerationData.GetRecord)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psItemData = ItemGenerationDL.GetItemGenerationData(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psItemData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Public Shared Function GetItemCodeReference(ByVal objGetItemGenerationData As ItemGenerationModel) As String
        Dim psItemData As String
        Try
            Dim pdtDetails As DataTable = Nothing
            ' Deserialize JSON Object in DataTable Send through the Service
            pdtDetails = JsonConvert.DeserializeObject(Of DataTable)(objGetItemGenerationData.DeleteItemGeneration)
            'Get the result from DataLayer Function in a DataSet by just passing Required Paramenters
            psItemData = ItemGenerationDL.GetItemCodeReference(pdtDetails, mObjCompany)
            'Return the Datasetset
            Return psItemData
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

End Class
