
Public Class ItemGenerationModel
    Private msAddItemGeneration As String
    Private msItemList As String
    Private msDeleteItemGeneration As String
    Private msGetRecord As String


    Public Property AddItemGeneration As String
        Set(value As String)

            msAddItemGeneration = value
        End Set
        Get
            Return msAddItemGeneration
        End Get
    End Property

    Public Property ItemList As String
        Set(value As String)

            msItemList = value
        End Set
        Get
            Return msItemList
        End Get
    End Property

    Public Property DeleteItemGeneration As String
        Set(value As String)

            msDeleteItemGeneration = value
        End Set
        Get
            Return msDeleteItemGeneration
        End Get
    End Property

    Public Property GetRecord As String
        Set(value As String)

            msGetRecord = value
        End Set
        Get
            Return msGetRecord
        End Get
    End Property


   


End Class
