Imports Microsoft.VisualBasic
Imports System.Data.Sql
Imports System.Data
Imports System.Text


Public Class IniFile
    Private strFilename As String

    ''' <summary>
    ''' Declare INI Functions
    ''' </summary>
    ''' <param name="lpApplicationName"></param>
    ''' <param name="lpKeyName"></param>
    ''' <param name="lpDefault"></param>
    ''' <param name="lpReturnedString"></param>
    ''' <param name="nSize"></param>
    ''' <param name="lpFileName"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>

    Private Declare Ansi Function GetPrivateProfileString _
    Lib "kernel32.dll" Alias "GetPrivateProfileStringA" _
    (ByVal lpApplicationName As String, _
    ByVal lpKeyName As String, ByVal lpDefault As String, _
    ByVal lpReturnedString As System.Text.StringBuilder, _
    ByVal nSize As Integer, ByVal lpFileName As String) _
    As Integer

    Private Declare Ansi Function WritePrivateProfileString _
    Lib "kernel32.dll" Alias "WritePrivateProfileStringA" _
    (ByVal lpApplicationName As String, _
    ByVal lpKeyName As String, ByVal lpString As String, _
    ByVal lpFileName As String) As Integer

    Private Declare Ansi Function GetPrivateProfileInt _
    Lib "kernel32.dll" Alias "GetPrivateProfileIntA" _
    (ByVal lpApplicationName As String, _
    ByVal lpKeyName As String, ByVal nDefault As Integer, _
    ByVal lpFileName As String) As Integer

    Private Declare Ansi Function FlushPrivateProfileString _
    Lib "kernel32.dll" Alias "WritePrivateProfileStringA" _
    (ByVal lpApplicationName As Integer, _
    ByVal lpKeyName As Integer, ByVal lpString As Integer, _
    ByVal lpFileName As String) As Integer



    Public Sub New(ByVal sStrFileName As String)
        strFilename = sStrFileName
    End Sub

    ''' <summary>
    ''' ' Returns a string from your INI file
    ''' </summary>
    ''' <param name="Section"></param>
    ''' <param name="Key"></param>
    ''' <param name="Default"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function GetString(ByVal Section As String, ByVal Key As String, ByVal [Default] As String) As String
        ' Returns a string from your INI file
        Dim intCharCount As Integer
        Dim objResult As New System.Text.StringBuilder(256)
        intCharCount = GetPrivateProfileString(Section, Key, [Default], objResult, objResult.Capacity, strFilename)
        If intCharCount > 0 Then
            ' GetString = Left(objResult.ToString, intCharCount)
            Return Left(objResult.ToString, intCharCount)
        End If
        Return Nothing
    End Function

    ''' <summary>
    ''' Returns an integer from your INI file
    ''' </summary>
    ''' <param name="Section"></param>
    ''' <param name="Key"></param>
    ''' <param name="Default"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function GetInteger(ByVal Section As String, ByVal Key As String, ByVal [Default] As Integer) As Integer
        ' Returns an integer from your INI file
        Return GetPrivateProfileInt(Section, Key, [Default], strFilename)
    End Function

    ''' <summary>
    '''  Writes a string to your INI file
    ''' </summary>
    ''' <param name="Section"></param>
    ''' <param name="Key"></param>
    ''' <param name="Value"></param>
    ''' <remarks></remarks>
    Public Sub WriteString(ByVal Section As String, ByVal Key As String, ByVal Value As String)
        ' Writes a string to your INI file
        WritePrivateProfileString(Section, Key, Value, strFilename)
        Flush()
    End Sub

    ''' <summary>
    ''' Stores all the cached changes to your INI file
    ''' </summary>
    ''' <remarks></remarks>
    Private Sub Flush()
        ' Stores all the cached changes to your INI file
        FlushPrivateProfileString(0, 0, 0, strFilename)
    End Sub



End Class
