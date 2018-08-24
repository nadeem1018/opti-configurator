
Imports System.Collections.Generic
Imports System.Text
Imports System.Collections
Imports System.Reflection
Imports System.Data.Common



''' <summary>
''' A Singlton class which provides and loads the necessary assembly
''' </summary>
Friend Class AssemblyProvider
    Private Shared _assemblyProvider As AssemblyProvider = Nothing

    Private _providerName As String = String.Empty
    Private _providerRow As DataRow = Nothing
    Public ReadOnly Property ProviderName As String
        Get
            Return _providerName
        End Get
    End Property
    'Public Sub New()
    '    _providerName = Configuration.GetProviderName(Configuration.DefaultConnection)
    'End Sub

    Public Sub New(cmp As OptiPro.Config.Common.Company)
        If cmp.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
            _providerName = "Sap.Data.Hana"

            Dim dt As New DataTable
            Dim cols(3) As DataColumn
            Dim psProvider As String

            cols(0) = New DataColumn("Name", Type.GetType("System.String"))
            cols(1) = New DataColumn("Description", Type.GetType("System.String"))
            cols(2) = New DataColumn("InvariantName", Type.GetType("System.String"))
            cols(3) = New DataColumn("AssemblyQualifiedName", Type.GetType("System.String"))
            dt.Columns.AddRange(cols)

            _providerRow = dt.NewRow
            dt.Rows.Add(_providerRow)
            _providerRow("Name") = "SAP HANA Data Provider"
            _providerRow("Description") = ".NET Framework Data Provider for SAP HANA"
            _providerRow("InvariantName") = "Sap.Data.Hana"
            psProvider = cmp.HanaAssemblyProvider   ' Configuration.ConfigurationManager.AppSettings.Item("HanaProvider")
            If String.IsNullOrEmpty(psProvider) = True Then
                psProvider = "Sap.Data.Hana.HanaFactory, Sap.Data.Hana.v3.5, Version=1.0.9.0, Culture=neutral, PublicKeyToken=0326b8ea63db4bc4"
                'psProvider = "Sap.Data.Hana.HanaFactory, Sap.Data.Hana.v3.5, Version=1.0.102.0, Culture=neutral, PublicKeyToken=0326b8ea63db4bc4"
            End If
            _providerRow("AssemblyQualifiedName") = psProvider
            '"Sap.Data.Hana.HanaFactory, Sap.Data.Hana.v3.5, Version=1.0.9.0, Culture=neutral, PublicKeyToken=0326b8ea63db4bc4"
        Else
            _providerName = "System.Data.SqlClient"
        End If
    End Sub


#Region "Refactored Code"
    Friend ReadOnly Property Factory() As DbProviderFactory
        Get
            Dim dbFactory As DbProviderFactory
            If OptiPro.Config.Common.Utilites.NullToString(_providerName).Trim.ToUpper = "SAP.DATA.HANA" Then
                'Get specific version of Hana DB provider.
                'dbFactory = DbProviderFactories.GetFactory(_providerRow)
                '  dbFactory = DbProviderFactories.GetFactory(_providerRow)
                dbFactory = DbProviderFactories.GetFactory(_providerName)
            Else
                dbFactory = DbProviderFactories.GetFactory(_providerName)
            End If

            Return dbFactory
        End Get
    End Property

#End Region

#Region "Internal Methods and Properties"



    'public static AssemblyProvider GetInstance(string providerName)
    '{
    '    if (_assemblyProvider == null)
    '    {
    '        _assemblyProvider = new AssemblyProvider(providerName);
    '    }
    '    return _assemblyProvider;
    '}

#End Region


End Class



