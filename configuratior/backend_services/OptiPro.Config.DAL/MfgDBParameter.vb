Imports System.Collections.Generic
Imports System.Data
Imports System.Text


Public Class MfgDBParameter
#Region "Public Properties"
    Public Property ParamName As String = String.Empty
    Public Property Paramvalue As Object = Nothing
    Public Property Dbtype As BMMDbType = BMMDbType.HANA_NVarChar
    Public Property ParamDirection As ParameterDirection = ParameterDirection.Input
    Public Property Value As Object
    Public Property IsNullable As Boolean = True
    Public Property LocaleId As Integer
    Public Property Offset As Integer
    Public Property Precision As Byte
    Public Property Scale As Byte
    Public Property Size As Integer
    Public Property SourceColumn As String
    Public Property SourceColumnNullableMapping As Boolean
    Public Property SourceVersion As DataRowVersion
    Public Property SqlValue As Object
    Public Property TypeName As String
    Public Property UdtTypeName As String
    Public Property XmlSchemaCollectionDatabase As String
    Public Property XmlSchemaCollectionName As String
    Public Property XmlSchemaCollectionOwningSchema As String
#End Region

#Region "Constructors"
    ''' <summary>
    ''' Defaule constructor. Paramete name, vale, type and direction needs to be assigned explicitly by using the public properties exposed.
    ''' </summary>
    Public Sub New()
    End Sub


    ''' <summary>
    ''' Creates a parameter with the name and value specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="value">Value associated with the parameter</param>
    Public Sub New(name As String, value As Object)
        Me.ParamName = name
        Me.Paramvalue = value
    End Sub

    ''' <summary>
    ''' Creates a parameter with the name and dbtype specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="dbType ">Db Type of the parameter</param>
    Public Sub New(name As String, dbType As BMMDbType)
        Me.ParamName = name
        Me.Dbtype = dbType
    End Sub

    ''' <summary>
    ''' Creates a parameter with the name and dbtype and size specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="dbType ">Db Type of the parameter</param>
    ''' <param name="size" >Size of the parameter</param>
    Public Sub New(name As String, dbType As BMMDbType, size As Integer)
        Me.ParamName = name
        Me.Dbtype = dbType
        Me.Size = size
    End Sub
    ''' <summary>
    ''' Creates a parameter with the name,dbtype,size and SourceColumnName specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="dbType ">Db Type of the parameter</param>
    ''' <param name="size" >Size of the parameter</param>
    ''' <param name="sourceColumnName" >Source column name of the associated parameter</param>
    Public Sub New(name As String, dbType As BMMDbType, size As Integer, sourceColumnName As String)
        Me.ParamName = name
        Me.Dbtype = dbType
        Me.Size = size
        Me.SourceColumn = SourceColumn
    End Sub
    ''' <summary>
    ''' Creates a parameter with the name,dbtype,size and SourceColumnName specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="dbType ">Db Type of the parameter</param>
    ''' <param name="size" >Size of the parameter</param>
    ''' <param name="sourceColumnName" >Source column name of the associated parameter</param>
    ''' <param name="sourceVersion " >Source data row version of the associated parameter</param>
    ''' <param name="precision" >Source column precision</param>
    ''' <param name="scale" >Source column scale</param>
    ''' <param name="value" >value of the associated parameter</param>
    Public Sub New(name As String, dbType As BMMDbType, size As Integer, _
                   precision As Byte, scale As Byte, sourceColumnName As String, _
                   sourceVersion As DataRowVersion, value As Object)
        Me.ParamName = name
        Me.Dbtype = dbType
        Me.Size = size
        Me.SourceColumn = SourceColumn
        Me.Scale = name
        Me.Precision = dbType
        Me.SourceColumn = SourceColumn
        Me.Value = value
    End Sub
    ''' <summary>
    ''' Creates a parameter with the name,dbtype,size and SourceColumnName specified. Default data type and direction is String and Input respectively.
    ''' </summary>
    ''' <param name="name">Parameter name</param>
    ''' <param name="dbType ">Db Type of the parameter</param>
    ''' <param name="size" >Size of the parameter</param>
    ''' <param name="sourceColumnName" >Source column name of the associated parameter</param>
    ''' <param name="sourceVersion " >Source data row version of the associated parameter</param>
    ''' <param name="precision" >Source column precision</param>
    ''' <param name="scale" >Source column scale</param>
    ''' <param name="value" >value of the associated parameter</param>
    ''' <param name="xmlSchemaCollectionOwingSchema" >The owning relational schema where the schema collection for this XML instance is located.</param>
    ''' <param name="xmlSchemaxCollectionDatabase" >The name of the database where the schema collection for this XML instance is located.</param>
    ''' <param name="xmlSchemaxCollectionName" > The name of the schema collection for this parameter.</param>
    Public Sub New(name As String, dbType As BMMDbType, size As Integer, _
                   precision As Byte, scale As Byte, sourceColumnName As String, _
                   sourceVersion As DataRowVersion, value As Object, _
                   xmlSchemaxCollectionDatabase As String, xmlSchemaCollectionOwingSchema As String, _
                   xmlSchemaxCollectionName As String)
        Me.ParamName = name
        Me.Dbtype = dbType
        Me.Size = size
        Me.SourceColumn = SourceColumn
        Me.Scale = name
        Me.Precision = dbType
        Me.SourceVersion = sourceVersion
        Me.Value = value
        Me.XmlSchemaCollectionDatabase = XmlSchemaCollectionDatabase
        Me.XmlSchemaCollectionName = Me.XmlSchemaCollectionName
        Me.XmlSchemaCollectionOwningSchema = Me.XmlSchemaCollectionOwningSchema
    End Sub
#End Region

End Class


