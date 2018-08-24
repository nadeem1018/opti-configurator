Public Module Enumerations


    Public Enum B1DecimalSettingTypeEnum As Integer
        Amounts = 1
        Prices = 2
        Rates = 3
        Quantities = 4
        Percent = 5
        Units = 6
        DecimalsInQuery = 7
    End Enum

    Public Enum DBServerTypeEnum As Integer
        MSSQL = 1
        DB_2 = 2
        SYBASE = 3
        MSSQL2005 = 4
        MAXDB = 5
        MSSQL2008 = 6
        HANADB = 9 ' Enum of Hana in SBOComapny Mayank
    End Enum

    Public Enum DateFormatEnum
        dd_MM_yy = 0
        dd_MM_yyyy = 1
        MM_dd_yy = 2
        MM_dd_yyyy = 3
        yyyy_MM_dd = 4
        dd_MMMM_yyyy = 5
    End Enum

    Public Enum AllocationCallerScreen
        Issue = 1
        Allocation = 2
    End Enum
    Public Enum StockCallerScreen
        Issue = 1
        Allocation = 2
        IssueBackFlash = 3
    End Enum
#Region "Report"
    Public Enum LookupLoadOptionEnum As Integer
        E_BMM_LOOKUPDETAIL = 1
        E_ALL = E_BMM_LOOKUPDETAIL

    End Enum

    Public Enum ReportLoadOptionEnum As Integer
        E_BMM_MDRPTDETAIL = 1
        E_BMM_MDRPTPARAMS = 2
        E_BMM_MDPRINTSET = 3
        E_BMM_MDAUTHZ = 4
        E_BMM_RPTCUSTOM = 5
        E_BMM_RPTLAYOUT = 6
        E_ALL = E_BMM_MDRPTPARAMS Or E_BMM_MDRPTDETAIL Or E_BMM_MDPRINTSET Or E_BMM_MDAUTHZ Or E_BMM_RPTLAYOUT

    End Enum

    'Public Enum ParameterTypeEnum As Integer
    '    TypBigInt = System.Data.SqlDbType.BigInt
    '    TypBinary = System.Data.SqlDbType.Binary
    '    TypBit = System.Data.SqlDbType.Bit
    '    TypChar = System.Data.SqlDbType.Char
    '    TypDate = System.Data.SqlDbType.Date
    '    TypDateTime = System.Data.SqlDbType.DateTime
    '    TypDEcimal = System.Data.SqlDbType.Decimal
    '    TypFloat = System.Data.SqlDbType.Float
    '    TypInteger = System.Data.SqlDbType.Int
    '    TypMoney = System.Data.SqlDbType.Money
    '    TypNChar = System.Data.SqlDbType.NChar
    '    TypNtext = System.Data.SqlDbType.NText
    '    TypNvarchar = System.Data.SqlDbType.NVarChar
    '    TypReal = System.Data.SqlDbType.Real
    '    TypText = System.Data.SqlDbType.Text
    '    TypVarchar = System.Data.SqlDbType.VarChar
    '    TypVariant = System.Data.SqlDbType.Variant
    'End Enum

    'Public Enum ControlTypeEnum As Integer
    '    CheckBox = 121 'SAPbouiCOM.BoFormItemTypes.it_CHECK_BOX
    '    ComboBox = 113 'SAPbouiCOM.BoFormItemTypes.it_COMBO_BOX
    '    Edit = 16 'SAPbouiCOM.BoFormItemTypes.it_EDIT
    '    StaticText = 8 'SAPbouiCOM.BoFormItemTypes.it_STATIC
    '    Seperator = 100 ''SAPbouiCOM.BoFormItemTypes.it_RECT
    'End Enum

    'Public Enum FieldTypeEnum As Integer
    '    TypAlphaNumeric = 1 'SAPbouiCOM.BoFieldsType.ft_AlphaNumeric
    '    TypDate = 4 'SAPbouiCOM.BoFieldsType.ft_Date
    '    TypFloat = 5
    '    TypInteger = 2
    '    TypMeasure = 10
    '    TypNotDefined = 0
    '    TypPercent = 12
    '    TypPrice = 8
    '    TypQuantity = 7
    '    TypRate = 9
    '    TypShortNum = 6
    '    TypSum = 11
    '    TypText = 3
    'End Enum

    'Public Enum PaperOrientEnum As Integer
    '    DefaultOrient = 0 'CrystalDecisions.Shared.PaperOrientation.DefaultPaperOrientation
    '    Portrait = 1
    '    Landscape = 2
    'End Enum

    'Public Enum PaperSizeEnum As Integer
    '    DefaultPaperSize = 0 'CrystalDecisions.Shared.PaperSize.DefaultPaperSize
    '    Paper10x14 = 16
    '    Paper11x17 = 17
    '    PaperA3 = 8
    '    PaperA4 = 9
    '    PaperA4Small = 10
    '    PaperA5 = 11
    '    PaperB4 = 12
    '    PaperB5 = 13
    '    PaperExecutive = 7
    '    PaperLegal = 5
    '    PaperLetter = 1

    'End Enum

    'Public Enum ReportType As Integer
    '    CR = 1
    '    Form = 2
    '    Both = 3
    'End Enum

    'Public Enum ReportStatus As Integer
    '    Active = 1
    '    Inactive = 2
    'End Enum

    'Public Enum ReportOption As Integer
    '    Standard = 1
    '    Custom = 2
    'End Enum

    ''Public Enum ReportPermission As Integer
    ''    Full = 1
    ''    Read = 2
    ''    None = 3
    ''End Enum

    'Public Enum ParamSourceEnum As Integer
    '    Report = 1
    '    Manual = 2
    'End Enum

#End Region

    ''' <summary>
    ''' Exception Return Type
    ''' </summary>
    ''' <remarks></remarks>
    Public Enum ExceptionTypeEnum As Integer
        Critical = 1
        Warning = 2
        Information = 3
    End Enum

    Public Enum NavigationEnum
        First = 0
        Previous = 1
        [Next] = 2
        Last = 3
        Current = 4
    End Enum

    Public Enum VerticalName As Integer

        NutritionLabelling = 1
        Ingredient = 2
        USDAIntegration = 3

    End Enum

    Public Enum NavigationResults
        Success = 0
        BOF = 1
        EOF = 2
        NoRecords = 3
        CurrentRecordNotFound = 4
        Failure = 5
    End Enum

    

#Region "UDO"

    Public Enum enumUDOObjType

        Master = 1
        Document = 2

    End Enum


#End Region


#Region "Menu Manager Enums"
    Public Enum MenuItemType As Integer
        ''' <summary>Level 1 Menu</summary>
        Menu1 = 1
        ''' <summary>Level 2 Menu</summary>
        Menu2 = 2
        ''' <summary>Level 3 Menu</summary>
        Menu3 = 3
        ''' <summary>Master Screen</summary>
        MasterScreen = 4
        ''' <summary>Transactional Screen</summary>
        TransactionScreen = 5
        ''' <summary>Report</summary>
        Report = 6
        ''' <summary>Utility</summary>
        Utility
        ''' <summary>Exe</summary>
        Exe = 7
        ''' <summary>URL</summary>
        URL = 8
        ''' <summary>Custom Screen</summary>
        CustomScreen = 9
        ''' <summary>Custom Report</summary>
        CustomReport = 10
    End Enum

    Public Enum MenuEnumeration
        FileMenu = 0
        MoveFirstMenu = 1
        MovePreviousMenu = 2
        MoveNextMenu = 3
        MoveLastMenu = 4
    End Enum
#End Region

#Region "Localization"

    Public Enum LocalizationMsgCatEnum As Integer
        Approval = 1
        Inventory = 2
        Formula = 3
        BOM = 4
        Costing = 5
        Laboratory = 6
        Production = 7
        MRP = 8
        MPS = 9
        MSDS = 10
        Custom = 11
        SAP = 12
    End Enum

    Public Enum Language

        Hebrew = 1
        English = 3
        Polish = 5
        English_UK = 8
        German = 9
        Danish = 11
        Norwegian = 12
        Italian = 13
        Hungarian = 14
        ChineseSimplified = 15
        Dutch = 16
        Finnish = 17
        Greek = 18
        Portuguese = 19
        Swedish = 20
        French = 22
        Spanish = 23
        Russian = 24
        Spanish_LA = 25
        Czech = 26
        Slovak = 27
        Korean = 28
        Portuguese_BR = 29
        'Galician
        Japanese = 30
        'Latvian
        TraditionalChineese = 35


    End Enum

#End Region

#Region "UI Customization"
    Public Enum EventTypeButton As Integer
        Itempressed = 1
        Click = 2
    End Enum
    Public Enum EventTypeCombobox As Integer
        ComboSelect = 1
    End Enum
    Public Enum EventTypeCheckbox As Integer
        Itempressed = 1
        Click = 2
    End Enum
    Public Enum EventTypeTextBox As Integer
        KeyDown = 1
        Validate = 2
        TextChange = 3
    End Enum
    Public Enum EventTypeGrid As Integer
        KeyDown = 1
        Validate = 2
        CellChange = 3
        RowChange = 4
    End Enum
    Public Enum EventTypeAction As Integer
        Before = 1
        After = 2
    End Enum
    Public Enum CustomiztionType As Integer
        Header = 1
        Detail = 2
        CustomMenu = 3
    End Enum
    Public Enum CustomControlType As Integer
        Caption = 1
        EditText = 2
        Button = 3
        Combobox = 4
        Checkbox = 5
        Grid = 6
    End Enum

    Public Enum FunctionType As Integer
        ExternalExe = 1
        Document = 2
        Web = 3
        SQL = 4
        CustomReport = 5
        CustomFunction = 6
    End Enum
#End Region

#Region "BMM Setup"
    Public Enum ShelfLifeRestrictionType
        Block = 0
        Warning = 1
    End Enum
#End Region

#Region "External EXE"
    Public Enum OperationRequiredEnum As Integer
        INSERT_REPORTS = 0
        WRITE_FORMSETTING = 1
        REPAIR_MENUS = 2
        DBUPGRADE_BMM = 3
        DBUPGRADE_NUTRA = 4
        WRITE_FORMSETTING_NUTRA = 5
        GENERATE_EXCEL_PHY = 6
        OPEN_EXCEL_PHY = 7
        GETFORECAST_EXCEL = 8
        CREATE_LANG_SRF = 9
    End Enum
#End Region


    'Bhupendra Singh 11-Feb-15----------S
    Public Enum CostingAnalysisProperties
        FillQty = 1
        FormulaMaterialCost = 2
        FormulaConsumableCost = 3
        FormulaMaterialOHCost = 4
        FormulaLaborMachineCost = 5
        FormulaLaborOHCost = 6
        FormulaMaterialLossCost = 7
        FormulaLossConstantCost = 8
        BOMItemCost = 9
        BOMConsumableCost = 10
        BOMItemOHCost = 11
        BOMLaborMachineCost = 12
        BOMLaborOHCost = 13
        FixedLaborCost = 14
        FixedOHCost = 15
        SetupLaborCost = 16
        SetupOHCost = 17
        FormulaVariableLaborCost = 18
        FormulaVariableOHCost = 19
        ByproductCost = 20
        ByproductOHCost = 21
        TotalFormulaCost = 22
        TotalCost = 23
    End Enum



    Public Enum CostingLineTypeEnum As Integer
        Material = 1
        Labor = 2
        BoilerPlate = 3
        FormulaConsumable = 4
        BOMConsumable = 5
        BOMItem = 6
        FinishedGood = 7
        ByProduct = 8
    End Enum

    Public Enum FGCostby  ''Added By Nikhilesh Patidar 22 May 2015

        BatchStdCost = 0
        ItemStdCost = 1
    End Enum

    ''' <summary>
    ''' SAPbobui.BoFieldsType
    ''' </summary>
    ''' <remarks>SAPbobui.BoFieldsType</remarks>
    Public Enum SAPUDFFieldType ''Added By Nikhilesh Patidar 13 Dec 2015
        ft_NotDefined = 0
        ft_AlphaNumeric = 1
        ft_Integer = 2
        ft_Text = 3
        ft_Date = 4
        ft_Float = 5
        ft_ShortNumber = 6
        ft_Quantity = 7
        ft_Price = 8
        ft_Rate = 9
        ft_Measure = 10
        ft_Sum = 11
        ft_Percent = 12
    End Enum

#Region "UOM"

    Public Enum UnitConversionScopeType As Integer
        GlobalScope = 0
        ItemWise = 2
    End Enum

#End Region
    Public Enum SAPDBTYPE
        HANADataLayer = 9
        MSSQLDataLayer = 2
    End Enum

    Public Enum DataLayerSubType
        InventoryDataLayer = 1
        FormulaDataLayer = 2
        BOMDataLayer = 3
        QCDataLayer = 4
        LaboratoryDataLayer = 5
        CostingDataLayer = 6
        CommonDataLayer = 7
        UOMDataLayer = 8
        SAPDataLayer = 9
        ReportDataLayer = 10
        MSDSDataLayer = 11
        BMMSetUpDataLayer = 12
        ApprovalDataLayer = 13
        ItemDetailDataLayer = 14
        PlanningDataLayer = 15
        SystemFormDataLayer = 16
        ProductionDataLayer = 17
        LookupDataLayer = 18
    End Enum

End Module
