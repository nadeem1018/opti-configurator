Public Enum BMMDbType As Integer
    'SQL_BigInt = 1
    'SQL_Binary = 2
    'SQL_Bit = 3
    'SQL_Char = 4
    'SQL_Date = 5
    'SQL_DateTime = 6
    'SQL_DateTime2 = 7
    'SQL_DateTimeOffset = 8
    'SQL_Decimal = 9
    'SQL_Float = 10
    'SQL_Image = 11
    'SQL_Int = 12
    'SQL_Money = 13
    'SQL_NChar = 14
    'SQL_NText = 15
    SQL_NVarChar = 16
    'SQL_Real = 17
    'SQL_SmallDateTime = 18
    'SQL_SmallInt = 19
    'SQL_SmallMoney = 20
    'SQL_Structured = 21
    'SQL_Text = 22
    'SQL_Time = 23
    'SQL_TimeStamp = 24
    'SQL_TinyInt = 25
    'SQL_UDT = 26
    'SQL_UniqueIdentifier = 27
    'SQL_VarBinary = 28
    'SQL_VarChar = 29
    'SQL_Variant = 30
    'SQL_XML = 31

    SQL_Binary = 2 'HANA_VarBinary 
    SQL_Bit = 3 'HANA_VarBinary 
    SQL_Char = 4 'HANA_VarChar
    SQL_DateTime = 6 'HANA_Date 
    SQL_DateTime2 = 7 'HANA_SecondDate 
    SQL_DateTimeOffset = 8 'HANA_Integer 
    SQL_NChar = 14 'HANA_VarChar
    SQL_NText = 15 'HANA_Text 
    SQL_SmallDateTime = 18 'HANA_Date 
    HANA_AlphaNum = 32 'SQL_NVarChar 
    HANA_BigInt = 33 'SQL_BigInt 
    HANA_Blob = 34    'SQL_Image
    HANA_Clob = 35    'SQL_Image
    HANA_Date = 36 'SQL_Date 
    HANA_Decimal = 37 'SQL_Decimal 
    HANA_Double = 38 'SQL_Float 
    HANA_Image = 39  'SQL_Image 
    HANA_Integer = 40    'SQL_Int 
    HANA_NClob = 41    'SQL_Image
    HANA_NVarChar = 42    'SQL_NVarChar 
    HANA_Real = 43    'SQL_Money 
    HANA_SecondDate = 44    'SQL_DateTime2 
    HANA_ShortText = 45 'SQL_NVarChar 
    HANA_SmallDecimal = 46    'SQL_Decimal 
    HANA_SmallInt = 47    'SQL_SmallInt 
    HANA_TableType = 48 'SQL_Structured 
    HANA_Text = 49    'SQL_NText 
    HANA_Time = 50    'SQL_Time 
    HANA_TimeStamp = 51    'SQL_TimeStamp 
    HANA_TinyInt = 52    'SQL_TinyInt 
    HANA_VarBinary = 53    'SQL_VarBinary 
    HANA_VarChar = 54    'SQL_NVarChar 

End Enum
<CLSCompliant(True)> _
Public Interface IConnection


#Region "Company DB Operations Methods"
    Property CompanyDBConnection As System.Data.Common.DbConnection

    Function BeginTransaction(Optional ByRef isolationLvl As System.Data.IsolationLevel = IsolationLevel.Unspecified) As Integer

    Function CommitTransaction() As Integer
    Function RollBackTransaction() As Integer
    Function GetCommandBuilder(ByVal psSQL As String, ByVal pObjConnection As System.Data.Common.DbConnection, ParamArray params() As MfgDBParameter) As System.Data.Common.DbCommandBuilder



    ''' <summary>
    ''' Executes SQL Query and returns no of rows affected. 
    ''' </summary>
    ''' <param name="sqlQry"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Function ExecuteQuery(ByVal sqlQry As String) As Integer

    ''' <summary>
    ''' Returns a dataset based on a command text.
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Function ExecuteDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                   ByVal ParamArray Params() As MfgDBParameter) As DataSet

    ''' <summary>
    ''' Executes scalar command text and return single value
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Function ExecuteScalar(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal ParamArray Params() As MfgDBParameter) As Object


    ''' <summary>
    ''' Executes scalar command text and return single value
    ''' </summary>
    ''' <param name="commandtext"></param>
    ''' <param name="commandType"></param>
    ''' <param name="Params"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Function ExecuteScalar(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal sqltohanaparser As Boolean, ByVal ParamArray Params() As MfgDBParameter) As Object
    Function ExecuteNonQuery(ByVal commandtext As String, ByVal commandType As CommandType, _
                                    ByVal ParamArray Params() As MfgDBParameter) As Integer

    Function ExecuteNonQuery(ByVal commandtext As String, ByVal commandType As CommandType, _
                        ByVal sqltohanaparser As Boolean, ByVal ParamArray Params() As MfgDBParameter) As Integer
    Function ExecuteReader(ByVal commandtext As String, ByVal commandType As CommandType, _
                                  ByVal ParamArray Params() As MfgDBParameter) As IDataReader

    Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                ByVal ds As DataSet, ByVal tablename As String, _
                                ByVal ParamArray Params() As MfgDBParameter)
    Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                     ByVal ds As DataSet, ByVal tablename As String, _
                                     ByVal missingSchemaAction As MissingSchemaAction, _
                                     ByVal ParamArray params() As MfgDBParameter)
    Overloads Sub FillDataset(ByVal commandtext As String, ByVal commandType As CommandType, _
                                     ByVal ds As DataSet, ByVal sqltohanaparser As Boolean, _
                                     ByVal tablename As String, ByVal ParamArray params() As MfgDBParameter)

    Sub UpdateDataSet(ByVal insertCommand As IDbCommand, ByVal deleteCommand As IDbCommand, _
                            ByVal updateCommand As IDbCommand, ByVal ds As DataSet, ByVal tableName As String)
    Function GetDBSpecificParameter(ParamArray params() As MfgDBParameter) As IDbDataParameter()
#End Region



End Interface
