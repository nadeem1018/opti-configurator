Imports System.IO

Public Class Logger

    Public Shared Function WriteTextLog(psLog As String) As String

        ' Dim psLog As String = Nothing
        Dim msLogFileName = AppDomain.CurrentDomain.BaseDirectory & "bin\ErrorConnectionLog.xml"
        Dim pbFileExists As Boolean = IO.File.Exists(AppDomain.CurrentDomain.BaseDirectory & "bin\ErrorLog.xml")
        Dim pobjLogFileStream As StreamWriter = Nothing

        Try

            ' Create an instance of StreamWriter to write text to log file.
            pobjLogFileStream = New StreamWriter(msLogFileName, True)
            ' Add current log text to the file.

            If pbFileExists = False Then
                pobjLogFileStream.WriteLine("LogDateTime   MachineName  UseName     Source  Message/StackTrace    ")
                pobjLogFileStream.WriteLine(New String("-"c, 200))
            End If

            pobjLogFileStream.WriteLine(psLog)
            pobjLogFileStream.WriteLine(New String("-"c, 200))

            pobjLogFileStream.Close()
        Catch ex As Exception

        Finally
            If pobjLogFileStream IsNot Nothing Then
                pobjLogFileStream.Close()
            End If
        End Try

        Return Nothing
    End Function


End Class
