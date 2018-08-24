Public Class VersionInfo

  Public Shared Function GetProductVersion() As String
    'Return "16.02.01.01.000"
    Return "1.0.0"
  End Function


  Public Shared Function CheckVersion() As String
    Try





    Catch ex As Exception

        End Try
        Return Nothing
  End Function



End Class
