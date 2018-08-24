
Public Class FeatureHeaderModel
    Private msAddFeature As String
    Private msDeleteFeature As String
    Private msUpdateFeature As String
    Private msModelItem As String
    Private msItemCodeGenerationReference As String
    Private msFeatureCode As String
    Private msGetRecord As String

    Public Property Feature As String
        Set(value As String)

            msAddFeature = value
        End Set
        Get
            Return msAddFeature
        End Get
    End Property

    Public Property DeleteFeature As String
        Set(value As String)

            msDeleteFeature = value
        End Set
        Get
            Return msDeleteFeature
        End Get
    End Property

    Public Property UpdateFeature As String
        Set(value As String)

            msUpdateFeature = value
        End Set
        Get
            Return msUpdateFeature
        End Get
    End Property


    Public Property ModelItem As String
        Set(value As String)

            msModelItem = value
        End Set
        Get
            Return msModelItem
        End Get
    End Property

    Public Property ItemCodeGenerationReference As String
        Set(value As String)

            msItemCodeGenerationReference = value
        End Set
        Get
            Return msItemCodeGenerationReference
        End Get
    End Property


    Public Property FeatureCode As String
        Set(value As String)

            msFeatureCode = value
        End Set
        Get
            Return msFeatureCode
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
