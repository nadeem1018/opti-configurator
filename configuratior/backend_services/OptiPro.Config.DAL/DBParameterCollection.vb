Imports System.Collections.Generic
Imports System.Text

Public Class DBParameterCollection
    Private _parameterCollection As New List(Of MfgDBParameter)()

    ''' <summary>
    ''' Adds a DBParameter to the ParameterCollection
    ''' </summary>
    ''' <param name="parameter">Parameter to be added</param>
    Public Sub Add(parameter As MfgDBParameter)
        _parameterCollection.Add(parameter)
    End Sub

    ''' <summary>
    ''' Removes parameter from the Parameter Collection
    ''' </summary>
    ''' <param name="parameter">Parameter to be removed</param>
    Public Sub Remove(parameter As MfgDBParameter)
        _parameterCollection.Remove(parameter)
    End Sub

    ''' <summary>
    ''' Removes all the parameters from the Parameter Collection
    ''' </summary>
    Public Sub RemoveAll()
        _parameterCollection.RemoveRange(0, _parameterCollection.Count - 1)
    End Sub

    ''' <summary>
    ''' Removes parameter from the specified index.
    ''' </summary>
    ''' <param name="index">Index from which parameter is supposed to be removed</param>
    Public Sub RemoveAt(index As Integer)
        _parameterCollection.RemoveAt(index)
    End Sub

    ''' <summary>
    ''' Gets list of parameters
    ''' </summary>
    Friend ReadOnly Property Parameters() As List(Of MfgDBParameter)
        Get
            Return _parameterCollection
        End Get
    End Property
End Class


