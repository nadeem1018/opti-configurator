
Public Class FeatureBOMModel
    Private msFeatureList As String
    Private msFeatureDetail As String
    Private msItemList As String
    Private msAddFeatureMaster As String
    Private msUpdateFeatureMaster As String
    Private msDeleteFeatureMaster As String
    Private msAddModelBom As String


    Public Property ModelItem As String
        Set(value As String)

            msFeatureList = value
        End Set
        Get
            Return msFeatureList
        End Get
    End Property

    Public Property FeatureDetail As String
        Set(value As String)

            msFeatureDetail = value
        End Set
        Get
            Return msFeatureDetail
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


    Public Property AddFeatureMaster As String
        Set(value As String)
            msAddFeatureMaster = value
        End Set
        Get
            Return msAddFeatureMaster
        End Get
    End Property

    Public Property UpdateFeatureMaster As String
        Set(value As String)

            msUpdateFeatureMaster = value
        End Set
        Get
            Return msUpdateFeatureMaster
        End Get
    End Property

    Public Property DeleteFeatureMaster As String
        Set(value As String)

            msDeleteFeatureMaster = value
        End Set
        Get
            Return msDeleteFeatureMaster
        End Get
    End Property


    Public Property AddModelBom As String
        Set(value As String)

            msAddModelBom = value
        End Set
        Get
            Return msAddModelBom
        End Get
    End Property



End Class
