Imports System.Data.SqlClient

Imports OptiPro.Config.Common
Public Class CompanySQLConnection
    Implements IConnection


    Private sapTransCntr As Integer
    Private bmmTransCntr As Integer
    Private mobjCompany As OptiPro.Config.Common.Company
    Private mobjTransaction As SqlTransaction
    Private mobjConnection As SqlConnection

    Private _key() As Byte = {132, 42, 53, 124, 75, 56, 87, 38, 9, 10, 161, 132, 183, _
      91, 105, 16, 117, 218, 149, 230, 221, 212, 235, 64}


    Public Sub New(ByVal cmp As OptiPro.Config.Common.Company)
        'Logger.WriteTextLog("Log: LoginDL CompanySQlConnection db: ")
        Me.mobjCompany = cmp
    End Sub

    Public Sub New(ByVal cmp As OptiPro.Config.Common.Company, ByVal vsKey As String)
        mobjCompany = cmp


    End Sub

#Region "Company DB Operations Methods"

    Public Property CompanyDBConnection As System.Data.Common.DbConnection Implements IConnection.CompanyDBConnection
        Get
            Return mobjConnection
        End Get
        Set(value As System.Data.Common.DbConnection)
            mobjConnection = value
        End Set
    End Property


    Public Function BeginTransaction(Optional ByRef isolationLvl As System.Data.IsolationLevel = IsolationLevel.Unspecified) As Integer Implements IConnection.BeginTransaction
        'Dim retVal As Integer = mobjCompany.BeginTransaction
        '
        'Return retVal
    End Function

    Public Function CommitTransaction() As Integer Implements IConnection.CommitTransaction

        '  Return Me.mobjCompany.CommitTransaction()
    End Function


    Public Function RollBackTransaction() As Integer Implements IConnection.RollBackTransaction
        'Return Me.mobjCompany.RollBackTransaction()
    End Function

    ''' <summary>
    ''' Executes SQL Query and returns no of rows affected. 
    ''' </summary>
    ''' <param name="sqlQry"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function ExecuteQuery(ByVal sqlQry As String) As Integer Implements IConnection.ExecuteQuery
        Dim pobjSQLCommand As SqlCommand = Nothing
        Try
            pobjSQLCommand = New SqlCommand
            pobjSQLCommand.Connection = Me.mobjConnection
            pobjSQLCommand.CommandText = sqlQry
            pobjSQLCommand.CommandType = CommandType.Text
            Return pobjSQLCommand.ExecuteNonQuery()
            'Catch ex As Exception
            '    pbSuccess = False
        Finally
            pobjSQLCommand.Dispose()
            pobjSQLCommand = Nothing
        End Try
    End Function

    ''' <summary>
    ''' Returns a dataset based on a command text.
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function ExecuteDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                   ByVal ParamArray Params() As MfgDBParameter) As DataSet Implements IConnection.ExecuteDataset
        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)

        If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
            Return SQLDBHelper.ExecuteDataset(Me.mobjConnection, commandType, commandtext)
        Else
            Return SQLDBHelper.ExecuteDataset(Me.mobjConnection, commandType, commandtext, hanaParams)
        End If
    End Function

    ''' <summary>
    ''' Executes scalar command text and return single value
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function ExecuteScalar(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal ParamArray Params() As MfgDBParameter) As Object Implements IConnection.ExecuteScalar

        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)

        Dim pobj As Object
        If mobjTransaction Is Nothing = True OrElse mobjTransaction.Connection Is Nothing = True Then
            Dim conStr As String
            If Me.mobjConnection.ConnectionString.ToUpper().IndexOf("PASSWORD=") <= 0 Then
                conStr = OptiPro.Config.Common.ConnectionStringBuilder.GetConnectionString(Me.mobjCompany.DBServerName, Me.mobjCompany.CompanyDbName, _
                                              Me.mobjCompany.CompanyDbUserName, _
                                        OptiPro.Config.Common.ConnectionStringBuilder.DecryptString(Me.mobjCompany.CompanyDbUserPassword, _key), _
                                        True, mobjCompany)
            Else
                conStr = Me.mobjConnection.ConnectionString
            End If
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                'pobj = SQLDBHelper.ExecuteScalar(conStr, commandType, commandtext)
                pobj = SQLDBHelper.ExecuteScalar(mobjConnection, commandType, commandtext)
            Else
                'pobj = SQLDBHelper.ExecuteScalar(conStr, commandType, commandtext, hanaParams)
                pobj = SQLDBHelper.ExecuteScalar(mobjConnection, commandType, commandtext, hanaParams)
            End If
        Else
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                pobj = SQLDBHelper.ExecuteScalar(mobjTransaction, commandType, commandtext, hanaParams)
            Else
                pobj = SQLDBHelper.ExecuteScalar(mobjTransaction, commandType, commandtext, hanaParams)
            End If
        End If


        Return pobj
    End Function

    ''' <summary>
    ''' Executes scalar command text and return single value
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function ExecuteScalar(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal sqltohanaparser As Boolean, ByVal ParamArray Params() As MfgDBParameter) As Object Implements IConnection.ExecuteScalar
        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)
        Dim pobj As Object
        If mobjTransaction Is Nothing = True OrElse mobjTransaction.Connection Is Nothing = True Then
            Dim conStr As String
            If Me.mobjConnection.ConnectionString.ToUpper().IndexOf("PASSWORD=") <= 0 Then
                conStr = OptiPro.Config.Common.ConnectionStringBuilder.GetConnectionString(Me.mobjCompany.DBServerName, Me.mobjCompany.CompanyDbName, _
                                              Me.mobjCompany.CompanyDbUserName, _
                                        OptiPro.Config.Common.ConnectionStringBuilder.DecryptString(Me.mobjCompany.CompanyDbUserPassword, _key), _
                                        True, mobjCompany)
            Else
                conStr = Me.mobjConnection.ConnectionString
            End If

            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                'pobj = SQLDBHelper.ExecuteScalar(conStr, commandType, commandtext, sqltohanaparser, hanaParams)
                pobj = SQLDBHelper.ExecuteScalar(Me.mobjConnection, commandType, commandtext, sqltohanaparser, hanaParams)
            Else

                'pobj = SQLDBHelper.ExecuteScalar(conStr, commandType, commandtext, sqltohanaparser, hanaParams)
                pobj = SQLDBHelper.ExecuteScalar(mobjConnection, commandType, commandtext, sqltohanaparser, hanaParams)
            End If
        Else
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                pobj = SQLDBHelper.ExecuteScalar(mobjTransaction, commandType, commandtext, sqltohanaparser, hanaParams)
            Else
                pobj = SQLDBHelper.ExecuteScalar(mobjTransaction, commandType, commandtext, sqltohanaparser, hanaParams)
            End If
        End If
        Return pobj
    End Function

    Public Function ExecuteNonQuery(ByVal commandtext As String, ByVal commandType As CommandType, _
                                    ByVal ParamArray Params() As MfgDBParameter) As Integer Implements IConnection.ExecuteNonQuery

        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)
        If mobjTransaction Is Nothing = True OrElse mobjTransaction.Connection Is Nothing = True Then
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                Return SQLDBHelper.ExecuteNonQuery(Me.mobjConnection, commandType, commandtext, hanaParams)
            Else
                Return SQLDBHelper.ExecuteNonQuery(Me.mobjConnection, commandType, commandtext, hanaParams)
            End If
        Else
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                Return SQLDBHelper.ExecuteNonQuery(mobjTransaction, commandType, commandtext, hanaParams)
            Else
                Return SQLDBHelper.ExecuteNonQuery(mobjTransaction, commandType, commandtext, hanaParams)
            End If
        End If
    End Function

    Public Function ExecuteNonQuery(ByVal commandtext As String, ByVal commandType As CommandType, _
                        ByVal sqltohanaparser As Boolean, ByVal ParamArray Params() As MfgDBParameter) As Integer Implements IConnection.ExecuteNonQuery
        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)
        If mobjTransaction Is Nothing = True OrElse mobjTransaction.Connection Is Nothing = True Then
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                Return SQLDBHelper.ExecuteNonQuery(Me.mobjConnection, commandType, commandtext, sqltohanaparser)
            Else
                Return SQLDBHelper.ExecuteNonQuery(Me.mobjConnection, commandType, commandtext, sqltohanaparser, hanaParams)
            End If
        Else
            If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
                Return SQLDBHelper.ExecuteNonQuery(mobjTransaction, commandType, commandtext, sqltohanaparser)
            Else
                Return SQLDBHelper.ExecuteNonQuery(mobjTransaction, commandType, commandtext, sqltohanaparser, hanaParams)
            End If
        End If
    End Function

    Public Function ExecuteReader(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal ParamArray Params() As MfgDBParameter) As IDataReader Implements IConnection.ExecuteReader
        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)
        If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
            Return SQLDBHelper.ExecuteReader(Me.mobjConnection, commandType, commandtext)
        Else
            Return SQLDBHelper.ExecuteReader(Me.mobjConnection, commandType, commandtext, hanaParams)
        End If
    End Function

    Public Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                ByVal ds As DataSet, ByVal tablename As String, _
                                ByVal ParamArray Params() As MfgDBParameter) Implements IConnection.FillDataset
        Dim pstableName(0) As String
        pstableName(0) = tablename
        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(Params)
        If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, MissingSchemaAction.AddWithKey)
        Else
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, MissingSchemaAction.AddWithKey, hanaParams)
        End If

    End Sub

    Public Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                     ByVal ds As DataSet, ByVal tablename As String, _
                                     ByVal missingSchemaAction As MissingSchemaAction, _
                                     ByVal ParamArray params() As MfgDBParameter) Implements IConnection.FillDataset
        Dim pstableName(0) As String
        pstableName(0) = tablename


        Dim hanaParams() As SqlParameter = GetDBSpecificParameter(params)
        If hanaParams Is Nothing OrElse hanaParams.Count <= 0 Then
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, missingSchemaAction)
        Else
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, missingSchemaAction, hanaParams)
        End If

    End Sub

    Public Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                     ByVal ds As DataSet, ByVal sqltohanaparser As Boolean, _
                                     ByVal tablename As String, ByVal ParamArray params() As MfgDBParameter) Implements IConnection.FillDataset
        Dim pstableName(0) As String
        pstableName(0) = tablename

        Dim sqlParams() As SqlParameter = GetDBSpecificParameter(params)
        If sqlParams Is Nothing OrElse sqlParams.Count <= 0 Then
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, MissingSchemaAction.AddWithKey)
        Else
            SQLDBHelper.FillDataset(Me.mobjConnection, commandType, commandtext, ds, pstableName, MissingSchemaAction.AddWithKey, sqlParams)
        End If
    End Sub

    Public Sub UpdateDataSet(ByVal insertCommand As IDbCommand, ByVal deleteCommand As IDbCommand, _
                            ByVal updateCommand As IDbCommand, ByVal ds As DataSet, ByVal tableName As String) _
                        Implements IConnection.UpdateDataSet

        insertCommand.Connection = Me.mobjConnection
        updateCommand.Connection = Me.mobjConnection
        deleteCommand.Connection = Me.mobjConnection

        SQLDBHelper.UpdateDataset(insertCommand, deleteCommand, updateCommand, ds, tableName)
    End Sub

    Private Function GetDBSpecificParameter(ParamArray params() As MfgDBParameter) As IDbDataParameter() Implements IConnection.GetDBSpecificParameter

        Dim pObjParamBuilder As New DBParamBuilder(mobjCompany)
        If params Is Nothing Then
            Return Nothing
        Else
            Dim dbParams(params.Count - 1) As SqlParameter
            For idx As Integer = 0 To params.Count - 1
                Dim dbPrm = pObjParamBuilder.GetParameter(params(idx))
                dbParams(idx) = dbPrm
            Next
            Return dbParams
        End If
    End Function
#End Region


    Public Function GetCommandBuilder(ByVal psSQL As String, ByVal pObjConnection As System.Data.Common.DbConnection, ParamArray params() As MfgDBParameter) As System.Data.Common.DbCommandBuilder Implements IConnection.GetCommandBuilder
        Try
            Dim dbParams() As SqlParameter = GetDBSpecificParameter(params)
            Dim pObjCommand As New SqlCommand(psSQL, pObjConnection)
            OptiPro.Config.DAL.SQLDBHelper.AttachParameters(pObjCommand, dbParams)
            Dim pObjSQLDA As New SqlDataAdapter(pObjCommand)
            Dim pObjCommandBuilder As New SqlCommandBuilder(pObjSQLDA)
            Return pObjCommandBuilder
        Catch ex As Exception
            ErrorLogging.LogError(ex)
        End Try
    End Function
End Class
