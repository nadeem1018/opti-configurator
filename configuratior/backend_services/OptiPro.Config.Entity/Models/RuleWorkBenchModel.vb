
Public Class RuleWorkBenchModel
    Private msFeatureList As String
    Private msFeatureDetails As String
    Private msModelList As String
    Private msAddRule As String

    Public Property FeatureList As String
        Set(value As String)

            msFeatureList = value
        End Set
        Get
            Return msFeatureList
        End Get
    End Property


    Public Property FeatureDetails As String
        Set(value As String)
            msFeatureDetails = value
        End Set
        Get
            Return msFeatureDetails
        End Get
    End Property

    Public Property ModelList As String
        Set(value As String)
            msModelList = value
        End Set
        Get
            Return msModelList
        End Get
    End Property

    Public Property AddRule As String
        Set(value As String)
            msAddRule = value
        End Set
        Get
            Return msAddRule
        End Get
    End Property
End Class
