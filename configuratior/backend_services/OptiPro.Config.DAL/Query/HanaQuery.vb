Imports OptiPro.Config.Common.Utilites
Imports System.Web
Imports System.IO
Public Class HanaQuery
    Implements IQuery

    Public Function GetQuery(vsQueryId As String) As String Implements IQuery.GetQuery
        Dim psQuery As String = ""
        Dim MyMethod As System.Reflection.MethodInfo = GetType(HanaQuery).GetMethod(vsQueryId)
        psQuery = NullToString(MyMethod.Invoke(Me, Nothing))
        Return psQuery
    End Function

#Region "Feature Header "
    'Query to Inset the Data into the Feature Header 
    Function AddFeatures() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDR"" (""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PHOTO"",""OPTM_CREATEDBY"",""OPTM_CREATEDDATE"",""OPTM_MODIFIEDBY"",""OPTM_MODIFIEDDATE"",""OPTM_TYPE"",""OPTM_MODELTEMPLATEITEM"",""OPTM_ITEMCODEGENREF"",""OPTM_STATUS"",""OPTM_EFFECTIVEDATE"",""OPTM_FEATURECODE"") VALUES(?,?,?,?,NOW(),?,NOW(),?,?,?,?,?,?)"
        Return psSQL
    End Function

    'Query to Delete the Feature By the Feature ID 
    Function DeleteFeatures() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function
    'Query to Update the Feature Using the Feature ID 
    Function UpdateFeatures() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREHDR"" SET ""OPTM_DISPLAYNAME"" =?,""OPTM_FEATUREDESC""=?,""OPTM_PRODGRPID""=?,""OPTM_PHOTO""=?,""OPTM_MODIFIEDBY""=?,""OPTM_MODIFIEDDATE""=NOW() WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetModelTemplateItem() As String
        Dim psSQL As String = "SELECT ""Code"",""Name"" FROM ""@OPTM_ITMTEMP"""
        Return psSQL
    End Function

    Function GetItemCodeGenerationReference() As String
        Dim psSQL As String = ""
        Return psSQL
    End Function

    Function CheckDuplicateFeatureCode() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATURECODE"") AS ""TOTALCOUNT""  FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATURECODE""=?"
        Return psSQL
    End Function

    Function GetAllData() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function
    ''HANA query to get tthe Record on BAsis of the Search Criteria And here paramter will be in the form of @,since we have replaced it in Datalayer
    Function GetAllDataOnBasisOfSearchCriteria() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_FEATUREDESC"" LIKE '%@SEARCHSTRING%' OR ""OPTM_MODELTEMPLATEITEM"" LIKE '%@SEARCHSTRING%' OR ""OPTM_ITEMCODEGENREF"" LIKE '%@SEARCHSTRING%' OR ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%'"
        Return psSQL
    End Function

#End Region


#Region "Feature Detail"

    Function GetFeatureList() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function

    Function GetFeatureDetail() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PRODGRPID"" ,""OPTM_PHOTO"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetItemList() As String
        Dim psSQL As String = "SELECT ""ItemCode"",""ItemName"" from ""OITM"""
        Return psSQL
    End Function

    Function GetFeatureListExceptSelectedFeature() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""DisplayName"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""<>?"
        Return psSQL
    End Function

    Function AddDataInFeatureHeader() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDRMASTER"" (""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATE"") VALUES(?,?,NOW())"
        Return psSQL
    End Function

    Function AddDataInFeatureDetail() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREDTL"" (""OPTM_TYPE"",""OPTM_LINENO"",""OPTM_HDRFEATUREID"",""OPTM_ITEMKEY"",""OPTM_VALUE"",""OPTM_DISPLAYNAME"",""OPTM_DEFAULT"",""OPTM_REMARKS"",""OPTM_ATTACHMENT"",""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATETIME"")VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW())"
        Return psSQL
    End Function

    Function UpdateDataInFeatureDetail() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREDTL"" SET ""OPTM_TYPE"" =?,""OPTM_ITEMKEY""=?,""OPTM_VALUE""=?,""OPTM_DISPLAYNAME""=?,""OPTM_DEFAULT""=?,""OPTM_REMARKS""=?,""OPTM_ATTACHMENT""=?,""OPTM_COMPANYID""=?,""OPTM_MODIFIEDBY""=?,""OPTM_MODIFIEDDATETIME""=NOW() WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function DeleteDataFromFeatureDetail() As String
        Dim psSQL As String = "DELETE FROM  ""OPCONFIG_FEATUREDTL"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function
#End Region

#Region "Item Generation"
    'hana Query to add the data in Item Generation Table 
    Function AddItemGeneration() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_ITEMCODEGENERATION""(""OPTM_CODE"",""OPTM_CODESTRING"",""OPTM_TYPE"",""OPTM_OPERATION"",""OPTM_CREATEDBY"",""OPTM_CREATEDDATETIME"")VALUES(?,?,?,?,?,NOW())"
        Return psSQL
    End Function


    'HANA Query to Delete the Item Generation Code From the Database
    Function DeleteItemGenerationCode() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE""=?"
        Return psSQL
    End Function

    Function CheckDuplicateItemCode() As String
        Dim psSQL As String = "SELECT  COUNT(""OPTM_CODE"") FROM  ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE""=?"
        Return psSQL
    End Function

    Function UpdateDataofGeneratedItem() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_ITEMCODEGENERATION"" SET ""OPTM_CODESTRING"" =?,""OPTM_TYPE"" =?,""OPTM_OPRERATION"" =?,""OPTM_MODIFIEDBY""=?,""OPTM_MODIFIEDDATETIME""=NOW() where ""OPTM_CODE""=?"
        Return psSQL
    End Function

    Function GetDataByItemCode() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE"" =?"
        Return psSQL
    End Function

    Function GetItemGenerationData() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_ITEMCODEGENERATION"""
        Return psSQL
    End Function

#End Region

#Region "Common Query"
    'This will get the server date & Time
    Function GetServerDate() As String
        Dim psSQL As String = " select Now() as ""DATEANDTIME"" from ""Dummy"""
        Return psSQL
    End Function
    'get the Table Structure For the  table
    Function GetTableStructure() As String
        Dim psSQL As String = "select * from ""@TABLENAME"" where 1=0"
        Return psSQL
    End Function
#End Region


#Region "Comman Base"
    'This will get the server date & Time
    Function GetPSURL() As String
        Dim psSQL As String = "select ""OPTM_URL"" From ""OPTM_MGSDFLT"" where ""Default_Key"" = 'OptiAdmin'"
        Return psSQL
    End Function
#End Region

End Class
