
Public Class ModelBOMModel
    Private msPriceList As String
    Private msModelBOMDetail As String
    Private msDeleteBOMDetail As String
    Private msGetData As String
    Private msModellist As String
    Private msAddModel As String
    Private msDeleteModel As String

    Public Property ModelList As String
        Set(value As String)

            msModellist = value
        End Set
        Get
            Return msModellist
        End Get
    End Property
    Public Property AddModel As String
        Set(value As String)

            msAddModel = value
        End Set
        Get
            Return msAddModel
        End Get
    End Property

    Public Property DeleteModel As String
        Set(value As String)

            msDeleteModel = value
        End Set
        Get
            Return msDeleteModel
        End Get
    End Property





    Public Property PriceList As String
        Set(value As String)

            msPriceList = value
        End Set
        Get
            Return msPriceList
        End Get
    End Property


    Public Property ModelBOMDetail As String
        Set(value As String)

            msModelBOMDetail = value
        End Set
        Get
            Return msModelBOMDetail
        End Get
    End Property

    Public Property DeleteBOMDetail As String
        Set(value As String)

            msDeleteBOMDetail = value
        End Set
        Get
            Return msDeleteBOMDetail
        End Get
    End Property

    Public Property GetData As String
        Set(value As String)

            msGetData = value
        End Set
        Get
            Return msGetData
        End Get
    End Property

End Class
