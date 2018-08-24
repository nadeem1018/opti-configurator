Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.BAL
Imports OptiPro.Config.DAL
Imports Newtonsoft.Json
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.ComponentModel
Imports OptiPro.Config.Common
Public Class Common

    Public Const CacheDataBaseType As String = "DatabaseType"


    Public Enum DatabaseType
        SQLDatabase = 1
        HANADatabase = 2
    End Enum

    Public Shared Function RemoveAttributes(ByRef node As XmlNode)

        Dim strType As String = node.NodeType.ToString()

        If strType = "Element" Then
            node.Attributes.RemoveAll()
        End If

        If node.HasChildNodes Then
            For i As Integer = 0 To node.ChildNodes.Count - 1
                RemoveAttributes(node.ChildNodes(i))
            Next
        End If
    End Function


    Public Shared Function NullToBoolean(ByVal o As Object) As Boolean
        If o Is Nothing OrElse IsDBNull(o) Then
            Return False
        Else
            Return CType(o, Boolean)
        End If
    End Function
    Public Shared Function NullToDecimal(ByVal o As Object) As Decimal
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            Return CType(o, Decimal)
        End If
    End Function
    Public Shared Function NullToShort(ByVal o As Object) As Short
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            Return CType(o, Short)
        End If
    End Function
    Public Shared Function NullToInteger(ByVal o As Object) As Integer
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            Return CType(o, Integer)
        End If
    End Function
    Public Function NullToDate(ByVal o As Object) As DateTime
        If o Is Nothing OrElse IsDBNull(o) Then
            Return DateTime.MinValue
        Else
            Return CType(o, DateTime)
        End If
    End Function
    Public Function NullToSingle(ByVal o As Object) As Single
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            Return CType(o, Single)
        End If
    End Function
    Public Shared Function NullToLong(ByVal o As Object) As Long
        If o Is Nothing OrElse IsDBNull(o) Then
            Return 0
        Else
            Return CType(o, Long)
        End If
    End Function
    Public Shared Function NullToDouble(ByVal vobjVal As Object) As Double
        If vobjVal Is Nothing OrElse IsDBNull(vobjVal) Then
            Return 0
        ElseIf TypeOf (vobjVal) Is String Then
            If vobjVal.ToString = String.Empty Then Return 0
            Dim d As Double = Double.Parse(vobjVal.ToString)
            Return d
        Else
            Return Convert.ToDouble(vobjVal)
        End If

        Return Nothing
    End Function
    Public Shared Function NullToString(ByVal vobjVal As Object) As String
        If vobjVal IsNot Nothing AndAlso vobjVal IsNot DBNull.Value Then
            Return Convert.ToString(vobjVal)
        End If

        Return String.Empty
    End Function
    Public Shared Function FormatQty(ByVal viQty As Double) As String
        'Return FormatNumber(viQty, SDCUtilities.ConfigurationData.GetQuantityDecimals, TriState.True, TriState.False, TriState.False)
        ''Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)


        Return viQty


        ''Dim pdicSystemData As New Dictionary(Of String, String)
        ''If (System.Web.HttpContext.Current.Session("DIC_SystemData") IsNot Nothing) Then
        ''    pdicSystemData = CType(System.Web.HttpContext.Current.Session("DIC_SystemData"), Dictionary(Of String, String))
        ''    Return FormatNumber(viQty, Convert.ToInt64(pdicSystemData("QuantityDecimals")), TriState.True, TriState.False, TriState.False)
        ''End If
    End Function

    Public Enum BaseType As Integer
        ALL_TRNSCS = -1
        TRNSCS_WITH_OPEN_BALANCE = -2
        TRNSCS_WITH_CLOSING_BALANCE = -3
        SALES_INVOICE_TRNSC = 13
        SALES_CREDIT_MEMO_TRNSC = 14
        SALES_DELIVERY_NOTE = 15
        SALES_GOODS_RETURNED_TRNSC = 16
        SALES_ORDER_TYPE = 17
        PURCHASE_INVOICE_TRNSC = 18
        PURCHASE_CREDIT_MEMO_TRNSC = 19
        PURCHASE_GOOD_RECEIPT_PO_TRNSC = 20
        PURCHASE_GOODS_RETURN_TRNSC = 21
        PURCHASE_ORDER = 22
        SALES_QUOTATION = 23
        INCOMING_PAYMENT_TRNSC = 24
        DEPOSIT_TRNSC = 25
        JOURNAL_ENTRY_TRNSC = 30
        VENDOR_PAYMENT_TRNSC = 46
        CHECK_FOR_PAYMENT_TRNSC = 57
        STOCK_RECONCILIATION_TRNSC = 58
        GOODS_RECEIPT_PO_TRNSC = 59
        GOODS_ISSUE_TRNSC = 60
        STOCK_TRANSFER_TRNSC = 67
        WORK_INSTRUCTION = 68
        PREDATED_DEPOSIT_TRNSC = 76
        CORRECTION_INVOICE = 132
        DOWN_PAYMENT = 203
        PURCHASE_DOWN_PAYMENT = 204

    End Enum
    'Public Shared Function GetSeries(ByVal vDocType As Integer, ByVal vsConStr As String) As Int32
    '    Dim oDocuments As XmlNode
    '    Dim ds As New DIServer.BMMDISoapClient
    '    'ds.Url = SDCUtilities.ConfigurationData.GetAppSectionValue("USEDIServerPath")
    '    'ds.Timeout = System.Threading.Timeout.Infinite
    '    oDocuments = ds.GetSeries(vsConStr, vDocType.ToString)

    '    '--------------------------------------------------------

    '    Dim xdoc As New XmlDocument
    '    xdoc.LoadXml(oDocuments.InnerXml)

    '    Dim nsmgr As XmlNamespaceManager = New XmlNamespaceManager(xdoc.NameTable)
    '    nsmgr.AddNamespace("ab", "http://www.sap.com/SBO/DIS")


    '    'Dim xmlNdlst As Xml.XmlNodeList = xdoc.SelectNodes("BO")
    '    'Dim xn As Xml.XmlElement = xdoc.DocumentElement
    '    'Dim res As Xml.XmlNode = xdoc.SelectSingleNode("//ab:Series", nsmgr)
    '    Dim res As XmlNode = xdoc.FirstChild

    '    RemoveAttributes(res)
    '    Dim dsPO As New DataSet

    '    dsPO.EnforceConstraints = False
    '    dsPO.ReadXml(New System.IO.StringReader(xdoc.OuterXml))


    '    Dim nxtNumber As Integer = 0
    '    If dsPO IsNot Nothing AndAlso dsPO.Tables(0) IsNot Nothing AndAlso dsPO.Tables(0).Rows.Count = 1 Then
    '        nxtNumber = NullToInteger(Val(NullToString(dsPO.Tables(0).Rows(0)("NextNumber"))))
    '    ElseIf dsPO IsNot Nothing AndAlso dsPO.Tables(0) IsNot Nothing AndAlso dsPO.Tables(0).Rows.Count > 1 Then
    '        For piCnt As Integer = 0 To dsPO.Tables(0).Rows.Count - 1
    '            If NullToInteger(Val(NullToString(dsPO.Tables(0).Rows(0)("NextNumber")))) <> NullToInteger(Val(NullToString(dsPO.Tables(0).Rows(0)("LastNumber")))) Then
    '                nxtNumber = NullToInteger(Val(NullToString(dsPO.Tables(0).Rows(0)("NextNumber"))))
    '                Exit For
    '            End If
    '        Next
    '    End If

    '    Return nxtNumber

    'End Function


    'Public Shared Function DeleteBinTemp(ByVal Pscompany As String, ByVal PsGuid As String) As Integer
    '    Try
    '        Dim PiCount As Integer = 0
    '        Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '        pObjCompany.CompanyDbName = Pscompany
    '        pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '        Dim psSQL As String = ""
    '        psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMS_DeleteBinTemp)
    '        Dim Pprm(1) As MfgDBParameter
    '        Pprm(0) = New MfgDBParameter
    '        Pprm(0).ParamName = "@GUID"
    '        Pprm(0).Paramvalue = PsGuid
    '        Pprm(0).Dbtype = BMMDbType.HANA_NVarChar
    '        PiCount = ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, Pprm)
    '        Return PiCount
    '    Catch ex As Exception
    '        Return Nothing
    '    End Try


    'End Function



    'Public Shared Function PushDataToBinTemp(ByVal Pdstemp As DataSet,
    '                                       ByVal viDocNo As Integer, ByVal vsGUID As String, ByVal VsComapnyId As String, ByVal VsObjType As String, ByVal vsdirection As String, Optional ByVal vsNoOfLabel As Integer = 1) As Boolean

    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsComapnyId
    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""
    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMS_BinTempschema)
    '    Dim pdsBin As DataSet = ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing)
    '    pdsBin.Tables(0).TableName = "OPTM_BINTEMP"
    '    Dim pdr As DataRow
    '    Dim PiLotlineNum As Integer
    '    Dim psItemTracking As String
    '    Dim dvLot As DataView
    '    Dim PIrowid As Integer = 0
    '    If pdsBin IsNot Nothing AndAlso pdsBin.Tables("OPTM_BINTEMP") IsNot Nothing Then
    '        For piCnt As Integer = 0 To Pdstemp.Tables(0).Rows.Count - 1
    '            PiLotlineNum = Pdstemp.Tables(0).Rows(piCnt)("LineNo")
    '            psItemTracking = Pdstemp.Tables(0).Rows(piCnt)("Tracking")
    '            If Pdstemp.Tables(1).Rows.Count > 0 Then
    '                dvLot = New DataView(Pdstemp.Tables(1))
    '                dvLot.RowFilter = "LineNo='" & PiLotlineNum & "'"
    '                For piBthCnt As Integer = 0 To dvLot.Count - 1
    '                    PIrowid = GetNextSeqForBmmTemp(VsComapnyId)
    '                    pdr = pdsBin.Tables("OPTM_BINTEMP").NewRow
    '                    pdr("U_DOCNUM") = CStr(viDocNo)
    '                    pdr("U_OBJTYPE") = VsObjType
    '                    pdr("U_ITEMCODE") = Pdstemp.Tables(0).Rows(piCnt)("ItemCode")
    '                    pdr("U_WHSCODE") = Pdstemp.Tables(0).Rows(piCnt)("WhsCode")
    '                    pdr("U_LOTNO") = dvLot.Item(piBthCnt)("LotNumber")
    '                    pdr("U_QUANTITY") = dvLot.Item(piBthCnt)("LotQty")
    '                    pdr("U_BINNO") = dvLot.Item(piBthCnt)("Bin")
    '                    If IsDBNull(dvLot.Item(piBthCnt)("INVTYPE")) Or dvLot.Item(piBthCnt)("INVTYPE") = "" Then
    '                        pdr("U_INVENTORYTYPE") = "ALL"
    '                    Else
    '                        pdr("U_INVENTORYTYPE") = dvLot.Item(piBthCnt)("INVTYPE")
    '                    End If
    '                    If (Pdstemp.Tables(1).Columns.Contains("NoOfLabels")) Then
    '                        pdr("U_USER7") = NullToInteger(dvLot.Item(piBthCnt)("NoOfLabels"))
    '                    Else
    '                        pdr("U_USER7") = 0
    '                    End If

    '                    pdr("U_DIRECTION") = vsdirection
    '                    pdr("U_SCCNO") = dvLot.Item(piBthCnt)("Pallet")
    '                    pdr("U_SYSSERIAL") = NullToInteger(dvLot.Item(piBthCnt)("SYSSERIAL"))
    '                    pdr("U_PROCESSED") = 0
    '                    pdr("U_BASELINE") = piCnt
    '                    pdr("U_LINENUM") = piBthCnt
    '                    pdr("U_BMM_GUID") = vsGUID.Trim
    '                    pdr("U_BASEDOCNUM") = NullToString(0)
    '                    pdr("U_BASEDOCTYPE") = ""
    '                    pdr("DocEntry") = 0
    '                    If IsDBNull(dvLot.Item(piBthCnt)("Containers")) Or CStr(dvLot.Item(piBthCnt)("Containers")) = "" Then
    '                        pdr("U_CONTAINERNO") = "0"
    '                        pdr("U_CONTAINERMASK") = "0"
    '                    Else
    '                        pdr("U_CONTAINERNO") = NullToInteger(dvLot.Item(piBthCnt)("Containers"))
    '                        pdr("U_CONTAINERMASK") = NullToInteger(dvLot.Item(piBthCnt)("Containers"))
    '                    End If
    '                    pdr("U_ABSENTRY") = GetBinAbsEntry(NullToString(dvLot.Item(piBthCnt)("Bin")), VsComapnyId)
    '                    pdr("U_ROWID") = PIrowid
    '                    pdsBin.Tables("OPTM_BINTEMP").Rows.Add(pdr)
    '                Next
    '            End If

    '        Next
    '        Dim ObjInsertCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQL, ObjIConnection.CompanyDBConnection, Nothing).GetInsertCommand()
    '        Dim ObjUpdateCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQL, ObjIConnection.CompanyDBConnection, Nothing).GetUpdateCommand()
    '        Dim ObjDeleteCommand As DbCommand = ObjIConnection.GetCommandBuilder(psSQL, ObjIConnection.CompanyDBConnection, Nothing).GetDeleteCommand()
    '        ObjIConnection.UpdateDataSet(ObjInsertCommand, ObjDeleteCommand, ObjUpdateCommand, pdsBin, "OPTM_BINTEMP")
    '        Return True
    '    End If

    'End Function

    'Public Function GetBinTempschema(ByVal Pscompany As String) As DataSet
    '    Try


    '        Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '        pObjCompany.CompanyDbName = Pscompany
    '        pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '        Dim psSQL As String = ""
    '        Dim pObjDsCompanyList As DataSet
    '        psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMS_BinTempschema)
    '        pObjDsCompanyList = ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing)

    '        Return pObjDsCompanyList
    '    Catch ex As Exception
    '        Return Nothing
    '    End Try
    'End Function


    'Public Shared Function GetBinAbsEntry(ByVal vsBinNo As String, ByVal VsCompanyid As String) As String
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyid
    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""
    '    Dim pSqlParam(1) As MfgDBParameter
    '    pSqlParam(0) = New MfgDBParameter
    '    pSqlParam(0).ParamName = "@BINNO"
    '    pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
    '    pSqlParam(0).Paramvalue = vsBinNo
    '    Dim PsAbsEntry As String = String.Empty
    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMS_GetBinAbsEntry)
    '    PsAbsEntry = ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam)

    '    Return PsAbsEntry
    'End Function

    Public Shared Function CreateTableForDiServerMsg() As DataTable
        Dim pdt As New DataTable
        pdt.Columns.Add("ErrorMsg", GetType(String))
        pdt.Columns.Add("SuccessNo", GetType(String))
        pdt.Columns.Add("Successmsg", GetType(String))
        Return pdt
    End Function
    'Public Shared Function GetFreightDetails(ByVal VsCompanyId As String, ByVal vsDocEntry As String) As DataSet
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""
    '    Dim pObjDsPOList As DataSet

    '    Dim pSqlParam(1) As MfgDBParameter
    '    pSqlParam(0) = New MfgDBParameter
    '    pSqlParam(0).ParamName = "@DOCENTRY"
    '    pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
    '    pSqlParam(0).Paramvalue = vsDocEntry

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMS_GetFreightDetails)
    '    pObjDsPOList = ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam)
    '    pObjDsPOList.Tables(0).TableName = "POR3"
    '    Return pObjDsPOList
    'End Function
    'Public Shared Function GetServerDate(ByVal VsCompanyId As String) As String
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim PsDate As String

    '    Dim pSqlParam As New MfgDBParameter
    '    pSqlParam.Value = Nothing

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetServerDate)
    '    PsDate = (ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam))

    '    Return PsDate
    'End Function
    'Public Shared Function GetNextSeqForBmmTemp(ByVal VsCompanyId As String) As Integer
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim PiNextSeqNo As Integer
    '    Dim pSqlParam As New MfgDBParameter
    '    pSqlParam.Value = Nothing

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetNextSeqForBmmTemp)
    '    PiNextSeqNo = NullToInteger(ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam))

    '    Return PiNextSeqNo
    'End Function
    'Public Shared Function GetNextSeqForPhysicalCount(ByVal VsCompanyId As String) As Integer
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim PiNextSeqNo As Integer
    '    Dim pSqlParam As New MfgDBParameter
    '    pSqlParam.Value = Nothing

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetNextSeqForPhysicalCount)
    '    PiNextSeqNo = NullToInteger(ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam))

    '    Return PiNextSeqNo
    'End Function

    'Public Shared Function GetNextSeqForBmmSigma(ByVal VsCompanyId As String) As Integer
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim PiNextSeqNo As Integer
    '    Dim pSqlParam As New MfgDBParameter
    '    pSqlParam.Value = Nothing

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetNextSeqForBmmSigma)
    '    PiNextSeqNo = NullToInteger(ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam))

    '    Return PiNextSeqNo
    'End Function
    'Public Shared Function GetNextSeqForBmmSigmaDetail(ByVal VsCompanyId As String) As Integer
    '    Dim pObjCompany As SFDC_Common.Company = SFDC_Common.Company.GetCompanyInstance(HttpContext.Current)
    '    pObjCompany.CompanyDbName = VsCompanyId

    '    pObjCompany.RequireConnectionType = SFDC_Common.WMSRequireConnectionType.CompanyConnection
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim PiNextSeqNo As Integer
    '    Dim pSqlParam As New MfgDBParameter
    '    pSqlParam.Value = Nothing

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetNextSeqForBmmSigmaDetail)
    '    PiNextSeqNo = NullToInteger(ObjIConnection.ExecuteScalar(psSQL, CommandType.Text, pSqlParam))

    '    Return PiNextSeqNo
    'End Function

    'Public Shared Function UpdateBMM_PalletMaster(ByVal vsPalletId As String, ByVal vsDocNum As String, ByVal vsObjtype As Integer, ByVal vsBaseDoctype As Integer, ByVal vsBaseDocNum As String, ByVal pObjCompany As SFDC_Common.Company) As Boolean
    '    Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '    Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '    Dim psSQL As String = ""

    '    Dim pSqlParam(6) As MfgDBParameter
    '    pSqlParam(0) = New MfgDBParameter("@BMPALLETID", BMMDbType.HANA_NVarChar)
    '    pSqlParam(0).Paramvalue = vsPalletId

    '    pSqlParam(1) = New MfgDBParameter("@BMSTATUS", BMMDbType.HANA_NVarChar)
    '    pSqlParam(1).Paramvalue = "ISSUED"

    '    pSqlParam(2) = New MfgDBParameter("@DOCNUM", BMMDbType.HANA_NVarChar)
    '    pSqlParam(2).Paramvalue = vsDocNum

    '    pSqlParam(3) = New MfgDBParameter("@OBJTYPE", BMMDbType.HANA_Integer)
    '    pSqlParam(3).Paramvalue = vsObjtype

    '    pSqlParam(4) = New MfgDBParameter("@ISSUEDATE", BMMDbType.SQL_DateTime)
    '    pSqlParam(4).Paramvalue = Today()

    '    pSqlParam(5) = New MfgDBParameter("@BASEDOCTYPE", BMMDbType.HANA_Integer)
    '    pSqlParam(5).Paramvalue = vsBaseDoctype

    '    pSqlParam(6) = New MfgDBParameter("@BASEDOCNUM", BMMDbType.HANA_NVarChar)
    '    pSqlParam(6).Paramvalue = vsBaseDocNum

    '    Dim piCount As Integer

    '    psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_UpdateBMMPalletMaster)
    '    piCount = NullToInteger(ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

    '    If (piCount > 0) Then
    '        Return True
    '    Else
    '        Return False
    '    End If

    'End Function

    'Public Shared Function InsertInToBMM_PalletMaster(ByVal vsPalletId As String, ByVal vsLocation As String, ByVal vsBinNo As String, ByVal pObjCompany As SFDC_Common.Company, Optional ByVal vsDescription As String = "") As Boolean

    '    Try

    '        Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
    '        Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
    '        Dim psSQL As String = ""

    '        Dim pSqlParam(7) As MfgDBParameter
    '        pSqlParam(0) = New MfgDBParameter("@BMPalletId", BMMDbType.HANA_NVarChar)
    '        pSqlParam(0).Paramvalue = vsPalletId

    '        pSqlParam(1) = New MfgDBParameter("@BMStatus", BMMDbType.HANA_NVarChar)
    '        pSqlParam(1).Paramvalue = "LOCKED"

    '        pSqlParam(2) = New MfgDBParameter("@BmLocation", BMMDbType.HANA_NVarChar)
    '        pSqlParam(2).Paramvalue = vsLocation

    '        pSqlParam(3) = New MfgDBParameter("@BMBinNo", BMMDbType.HANA_NVarChar)
    '        pSqlParam(3).Paramvalue = vsBinNo

    '        pSqlParam(4) = New MfgDBParameter("@Indate", BMMDbType.SQL_DateTime)
    '        pSqlParam(4).Paramvalue = Today()

    '        pSqlParam(5) = New MfgDBParameter("@RecUserID", BMMDbType.HANA_NVarChar)
    '        pSqlParam(5).Paramvalue = pObjCompany.SuperUser

    '        pSqlParam(6) = New MfgDBParameter("@DESCRIPTION", BMMDbType.HANA_NVarChar)
    '        pSqlParam(6).Paramvalue = vsDescription
    '        Dim piCount As Integer

    '        psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_GetMaxDocEntryPalletMaster)
    '        piCount = NullToInteger(ObjIConnection.ExecuteScalar(psSQL, CommandType.Text))

    '        pSqlParam(7) = New MfgDBParameter("@DocEntry", BMMDbType.HANA_Integer)
    '        pSqlParam(7).Paramvalue = piCount

    '        psSQL = ObjIQuery.GetQuery(SFDC_Common.WMSQueryConstants.WMSQ_InsertIntoPalletMaster)
    '        piCount = NullToInteger(ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))

    '        If (piCount > 0) Then
    '            Return True
    '        Else
    '            Return False
    '        End If

    '    Catch ex As Exception
    '        Throw ex

    '    End Try

    'End Function

End Class
