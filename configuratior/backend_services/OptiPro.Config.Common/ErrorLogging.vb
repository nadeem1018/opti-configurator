Option Explicit On
Option Strict On


Public Class ErrorLogging

    Private Shared mobjLogger As Logger

    Public Shared ReadOnly Property SharedFolderPath As String
        Get
            'Jayesh 7/10/2015 - as suggested by marco 
            'Return Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "\BMMSAP\"

            If Not IO.Directory.Exists(System.AppDomain.CurrentDomain.BaseDirectory + "\WMSErrorLog") Then
                IO.Directory.CreateDirectory(System.AppDomain.CurrentDomain.BaseDirectory + "\WMSErrorLog")
            End If

            'Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments) + "\BMMSAP\"

            Return System.AppDomain.CurrentDomain.BaseDirectory + "\WMSErrorLog\"
        End Get
    End Property

    Public Shared Sub LogError(ByVal ex As Exception)
        If mobjLogger Is Nothing Then mobjLogger = New Logger
        'muffu -Tuesday, March 20, 2007 error message for both release and debug
        If TypeOf ex Is ApplicationException OrElse TypeOf ex Is OptimisticConcurrencyException OrElse TypeOf ex Is UpdateException Then



            'Parag 15 october 
            'Set Batchmaster as  titlebar caption for messagebox
            'TODO:Show SBO message
            'System.Windows.Forms.MessageBox.Show(ex.Message, "BatchMaster")
            Return
        End If

#If DEBUG Then        'System.Windows.Forms.MessageBox.Show(ex.ToString)
        'TODO:Show SBO message
        'System.Windows.Forms.MessageBox.Show(ex.ToString)
#Else
        'Abhishek/13-Sep-2007, suppress error message in release version
        'System.Windows.Forms.MessageBox.Show(ex.Message)
#End If

        Logger.WriteTextLog(ex.Message)
    End Sub

    Public Shared Sub LogError(ByVal message As String)
        If mobjLogger Is Nothing Then mobjLogger = New Logger
#If TRACE Then
        Debug.Write(message)
#End If
        Logger.WriteTextLog(message)
    End Sub

End Class
