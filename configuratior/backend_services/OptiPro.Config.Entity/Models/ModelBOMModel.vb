
Public Class ModelBOMModel
    Private msFeatureList As String
   

    Public Property FeatureList As String
        Set(value As String)

            msFeatureList = value
        End Set
        Get
            Return msFeatureList
        End Get
    End Property

    


End Class
