
Public Class BaseModel
    Private msGetPSURL As String

    Public Property GetPSURL As String
        Set(value As String)

            msGetPSURL = value
        End Set
        Get
            Return msGetPSURL
        End Get
    End Property
End Class
