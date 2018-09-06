
Public Class BaseModel
    Private msGetPSURL As String
    Private msGetMenuRecord As String

    Public Property GetPSURL As String
        Set(value As String)

            msGetPSURL = value
        End Set
        Get
            Return msGetPSURL
        End Get
    End Property


    Public Property GetMenuRecord As String
        Set(value As String)

            msGetMenuRecord = value
        End Set
        Get
            Return msGetMenuRecord
        End Get
    End Property


End Class
