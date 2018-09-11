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
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDR"" (""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PHOTO"",""OPTM_CREATEDBY"",""OPTM_CREATEDDATE"",""OPTM_MODIFIEDBY"",""OPTM_MODIFIEDDATE"",""OPTM_TYPE"",""OPTM_MODELTEMPLATEITEM"",""OPTM_ITEMCODEGENREF"",""OPTM_STATUS"",""OPTM_EFFECTIVEDATE"",""OPTM_FEATURECODE"",""OPTM_ACCESSORY"") VALUES(?,?,?,?,NOW(),?,NOW(),?,?,?,?,?,?,?)"
        Return psSQL
    End Function

    'Query to Delete the Feature By the Feature ID 
    Function DeleteFeatures() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function
    'Query to Update the Feature Using the Feature ID 
    Function UpdateFeatures() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREHDR"" SET ""OPTM_DISPLAYNAME""=?,""OPTM_FEATUREDESC""=?,""OPTM_PHOTO""=?,""OPTM_MODIFIEDBY""=?,""OPTM_MODIFIEDDATE""=NOW(),""OPTM_TYPE""=?,""OPTM_MODELTEMPLATEITEM""=?,""OPTM_ITEMCODEGENREF""=?,""OPTM_STATUS""=?,""OPTM_EFFECTIVEDATE""=?,""OPTM_ACCESSORY""=? WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetModelTemplateItem() As String
        Dim psSQL As String = "SELECT ""Code"",""Name"" FROM ""@OPTM_ITMTEMP"""
        Return psSQL
    End Function

    Function GetItemCodeGenerationReference() As String
        Dim psSQL As String = "SELECT DISTINCT (""OPTM_CODE"") FROM ""OPCONFIG_ITEMCODEGENERATION"""
        Return psSQL
    End Function

    Function CheckDuplicateFeatureCode() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATURECODE"") AS ""TOTALCOUNT""  FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATURECODE""=?"
        Return psSQL
    End Function
    'here Parameter will be @ since we have used Replace in the Query
    Function GetAllData() As String
        Dim psSQL As String = "SELECT TOP @ENDCOUNT ""OPTM_FEATURECODE"",""OPTM_TYPE"",""OPTM_DISPLAYNAME"",TO_NVARCHAR(""OPTM_EFFECTIVEDATE"",'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",""OPTM_STATUS"",OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"" EXCEPT SELECT  TOP @STARTCOUNT ""OPTM_FEATURECODE"",""OPTM_TYPE"",""OPTM_DISPLAYNAME"",TO_NVARCHAR(""OPTM_EFFECTIVEDATE"",'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",""OPTM_STATUS"",OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function
    'here Parameter will be @ since we have used Replace in the Query
    Function GetAllSavedRecord() As String
        Dim psSQL As String = "Select top @ENDCOUNT * From ""OPCONFIG_FEATUREHDR"" EXCEPT Select top @STARTCOUNT * From ""OPCONFIG_FEATUREHDR"" "
        Return psSQL
    End Function

    ''HANA query to get tthe Record on BAsis of the Search Criteria And here paramter will be in the form of @,since we have replaced it in Datalayer
    Function GetAllDataOnBasisOfSearchCriteria() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,TO_NVARCHAR(""OPTM_EFFECTIVEDATE"",'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR""  WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR  ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_TYPE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_STATUS"" LIKE '%@SEARCHSTRING%' EXCEPT Select  TOP @STARTCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,TO_NVARCHAR(""OPTM_EFFECTIVEDATE"",'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID  From ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR  ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_TYPE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_STATUS"" LIKE '%@SEARCHSTRING%'"
        Return psSQL
    End Function

    Function GetTotalCountOfRecord() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function

    Function GetRecordById() As String
        Dim psSql As String = "SELECT ""OPTM_FEATURECODE"",""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"" ,""OPTM_FEATUREDESC"",""OPTM_PHOTO"",""OPTM_TYPE"",""OPTM_MODELTEMPLATEITEM"",""OPTM_ITEMCODEGENREF"",""OPTM_STATUS"",""OPTM_EFFECTIVEDATE"",""OPTM_ACCESSORY"" from ""OPCONFIG_FEATUREHDR"" WHERE OPTM_FEATUREID =?"
        Return psSql
    End Function

    Function ChkValidItemTemplate() As String
        Dim psSql As String = "SELECT COUNT(DISTINCT ""Code"") AS ""TOTALCOUNT"" FROM ""@OPTM_ITMTEMP"" WHERE ""Code""=?"
        Return psSql
    End Function

    Function ChkValidItemCodeGeneration() As String
        Dim psSql As String = "SELECT COUNT(DISTINCT ""OPTM_CODE"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE""=?"
        Return psSql
    End Function

    Function ChkReferenceForFeatureIDInFeatureBOM() As String
        Dim psSql As String = "SELECT COUNT(DISTINCT ""OPTM_FEATUREID"") AS ""FeatureCount"",COUNT(DISTINCT ""OPTM_CHILDFEATUREID"") AS ""ChildFeatureCount"" from ""OPCONFIG_FEATUREBOMDTL"" WHERE ""OPTM_FEATUREID""=? OR OPTM_CHILDFEATUREID=?"
        Return psSql
    End Function
    Function ChkReferenceForFeatureIDInModelBOM() As String
        Dim psSql As String = "SELECT COUNT(DISTINCT ""OPTM_MODELID"") AS ""ModelCount"",COUNT(DISTINCT ""OPTM_FEATUREID"") AS ""FeatureCount"",COUNT(DISTINCT ""OPTM_CHILDMODELID"") AS ""ChildModelCount"" from ""OPCONFIG_MBOMDTL"" WHERE ""OPTM_MODELID""=? OR ""OPTM_FEATUREID""=? OR ""OPTM_CHILDMODELID""=?"
        Return psSql
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
        Dim psSQL As String = "SELECT TOP @ENDCOUNT OPICG.OPTM_CODE AS ""Code"",STRING_AGG(OPTM_CODESTRING, '') AS ""FinalString"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" GROUP BY ""OPTM_CODE"" EXCEPT SELECT TOP @STARTCOUNT ""OPICG"".""OPTM_CODE"" AS ""Code"",STRING_AGG(OPTM_CODESTRING, '') AS ""FinalString"" FROM  ""OPCONFIG_ITEMCODEGENERATION"" as OPICG GROUP BY OPTM_CODE"
        Return psSQL
    End Function


    Function GetItemGenerationDataBySearchCriteria() As String
        Dim psSQL As String = "SELECT TOP @ENDCOUNT OPICG.OPTM_CODE AS ""Code"",STRING_AGG(OPTM_CODESTRING, '') AS ""FinalString"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" WHERE ""OPTM_CODE"" LIKE '%@SEARCHSTRING%' GROUP BY ""OPTM_CODE"" EXCEPT SELECT TOP @STARTCOUNT ""OPICG"".""OPTM_CODE"" AS ""Code"",STRING_AGG(OPTM_CODESTRING, '') AS ""FinalString"" FROM  ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" WHERE ""OPTM_CODE"" LIKE '%@SEARCHSTRING%' GROUP BY OPTM_CODE"
        Return psSQL
    End Function

    Function GetTotalCountOfRecordForItemGeneration() As String
        Dim psSQL As String = "SELECT COUNT( DISTINCT ""OPTM_CODE"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_ITEMCODEGENERATION"""
        Return psSQL
    End Function

    Function GetItemCodeReference() As String
        Dim psSQL As String = "SELECT COUNT(*) AS ""ROWCOUNT"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_ITEMCODEGENREF""=?"
        Return psSQL
    End Function

#End Region

#Region "Common Query"
    'This will get the server date & Time
    Function GetServerDate() As String
        Dim psSQL As String = " select Now() as ""DATEANDTIME"" from ""DUMMY"""
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

    Function GetMenus() As String
        Dim psSQL As String = "SELECT ""OPTM_MENUID"",""OPTM_MENUNAME"",OPTM_ICONPATH,""OPTM_MENUSEQ"" FROM ""OPTIPROADMIN"".""OPTM_ADMIN_MENUS"" WHERE OPTM_PROD='SFES' ORDER BY ""OPTM_MENUSEQ"""
        Return psSQL
    End Function

#End Region

#Region "Feature BOM"
    'SQL Query to get the LIst of Fetaure 
    Function GetFeatureList() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE"" ='feature' OR ""OPTM_TYPE"" ='Feature'"
        Return psSQL
    End Function

    'SQL Query to get the Details of  Feature Accordng to the Fature ID 
    Function GetFeatureDetail() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PRODGRPID"" ,""OPTM_PHOTO"",""OPTM_ACCESSORY"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    'SQL Query to get the List of the Items fom the OITM Table
    Function GetItemForFeatureBOM() As String
        Dim psSQL As String = "SELECT ""ItemKey"",""Description"",""InvUOM"" from ""OpConfig_ItemMaster"" where ""ItemKey""=?"
        Return psSQL
    End Function

    'SQL Query to get the List of all the Features Except the Selected Feature
    Function GetFeatureListForSelectedFeature() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_ACCESSORY"",""OPTM_PHOTO"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE"" ='feature' OR ""OPTM_TYPE"" ='Feature' and ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    'SQL Query to get the List of all the Features Except the Selected Feature
    Function GetFeatureListExceptSelectedFeature() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE"" ='feature' and ""OPTM_FEATUREID""<>?"
        Return psSQL
    End Function

    'SQL Query to get the List of all the Features Except the Selected Feature
    Function GetFeatureListExceptSelectedItem() As String
        Dim psSQL As String = "select ""ItemKey"",""Description"" from ""OPConfig_ItemMaster"""
        Return psSQL
    End Function

    ''SQL Query to add Feature in Feature HEader 
    'Function AddDataInFeatureHeader() As String
    '    Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDRMASTER"" (""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATE"") VALUES(@COMPANY,@USERID,GETDATE())"
    '    Return psSQL
    'End Function
    'SQLQuery to Add Detail in the Feature Detail
    'Function AddDataInFeatureDetail() As String
    '    Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREDTL"" (""OPTM_TYPE"",""OPTM_LINENO"",""OPTM_HDRFEATUREID"",""OPTM_ITEMKEY"",""OPTM_VALUE"",""OPTM_DISPLAYNAME"",""OPTM_DEFAULT"",""OPTM_REMARKS"",""OPTM_ATTACHMENT"",""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATETIME"")VALUES(@ITEMTYPE,@LINENO,@HEADERFEATUREID,@ITEMKEY,@ITEMVALUE,@DISPLAYNAME,@DEFAULT,@REMARKS,@ATTACHMENT,@COMPANYID,@USERID,GETDATE())"
    '    Return psSQL
    'End Function

    ''SQL Query to Update data in Feature Detail 
    'Function UpdateDataInFeatureDetail() As String
    '    Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREDTL"" SET ""OPTM_TYPE"" =@ITEMTYPE,""OPTM_ITEMKEY""=@ITEMKEY,""OPTM_VALUE""=@ITEMVALUE,""OPTM_DISPLAYNAME""=@DISPLAYNAME,""OPTM_DEFAULT""=@DEFAULT,""OPTM_REMARKS""=@REMARKS,""OPTM_ATTACHMENT""=@ATTACHMENT,""OPTM_COMPANYID""=@COMPANYID,""OPTM_MODIFIEDBY""=@USERID,""OPTM_MODIFIEDDATETIME""=GETDATE() WHERE ""OPTM_FEATUREID""=@FEATUREID"
    '    Return psSQL
    'End Function

    'SQL Query to Delete the Data From the Feature Detail
    Function DeleteDataFromFeatureDetail() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREDTL"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetSavedDataByFeatureCodeFromHDR() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREBOMHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetSavedDataByFeatureCodeFromDTL() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREBOMDTL"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetDataForCommonViewBySearchCriteria() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT T1.""OPTM_FEATUREID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_FEATUREBOMHDR"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_FEATUREID""=T2.""OPTM_FEATUREID"" WHERE T1.""OPTM_FEATUREID"" LIKE '%@SEARCHSTRING%'  EXCEPT Select TOP @STARTCOUNT T1.""OPTM_FEATUREID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_FEATUREBOMHDR"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_FEATUREID"" =T2.""OPTM_FEATUREID"" WHERE T1.""OPTM_FEATUREID"" LIKE '%@SEARCHSTRING%'"
        Return psSQL
    End Function

    Function GetDataForCommonView() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT T1.""OPTM_FEATUREID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_FEATUREBOMHDR"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_FEATUREID"" =T2.""OPTM_FEATUREID"" EXCEPT Select TOP @STARTCOUNT T1.""OPTM_FEATUREID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_FEATUREBOMHDR"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_FEATUREID"" =T2.""OPTM_FEATUREID"""
        Return psSQL
    End Function

    Function GetTotalCountOfRecordForFeatureBOM() As String
        Dim psSQL As String = "SELECT COUNT(DISTINCT ""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREBOMDTL"""
        Return psSQL
    End Function

    Function DeleteDataFromHDR() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREBOMHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function DeleteDataFromDTL() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREBOMDTL"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetDataForExplodeViewForFeatureBOM() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREBOMDTL"" ORDER BY OPTM_CHILDFEATUREID DESC"
        Return psSQL
    End Function

    Function GetAllRecordForCyclicCheck() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_CHILDFEATUREID"" FROM ""OPCONFIG_FEATUREBOMDTL"""
        Return psSQL
    End Function

    Function CheckValidFeatureIdEnteredForFeatureBOM() As String
        Dim psSQL As String = "SELECT COUNT (""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

#End Region
#Region "ModelBOM"
    Function GetModelList() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE"" ='model' OR ""OPTM_TYPE"" ='Model'"
        Return psSQL
    End Function

    Function GetModelListExceptSelectedFeature() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE"" ='model' OR ""OPTM_TYPE"" ='Model' and ""OPTM_FEATUREID""<>?"
        Return psSQL
    End Function

    Function GetPriceList() As String
        Dim psSQL As String = "SELECT ""PriceListID"" from ""OPConfig_PriceList"" WHERE ""ItemCode""=?"
        Return psSQL
    End Function

    Function GetDetailForModel() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATURECODE"",""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PRODGRPID"" ,""OPTM_PHOTO"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetSavedDataByModelIdFromHDR() As String
        Dim psSQL As String = "SELECT * FROM OPCONFIG_MBOMHDR WHERE ""OPTM_MODELID""=? AND OPTM_COMPANYID=?"
        Return psSQL
    End Function
    Function GetSavedDataByModelIdFromDTL() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_MBOMDTL"" WHERE ""OPTM_MODELID""=? AND OPTM_COMPANYID=?"
        Return psSQL
    End Function

    Function DeleteDataFromMBOMHDR() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_MBOMHDR"" WHERE ""OPTM_MODELID""=? AND ""OPTM_COMPANYID""=?"
        Return psSQL
    End Function

    Function DeleteDataFromMBOMDTL() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_MBOMDTL"" WHERE ""OPTM_MODELID""=? AND ""OPTM_COMPANYID""=?"
        Return psSQL
    End Function

    Function GetDataForCommonViewForModelBOMBySearchCriteria() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT T1.""OPTM_MODELID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_MBOMDTL"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_MODELID""=T2.""OPTM_FEATUREID"" WHERE T1.""OPTM_MODELID"" LIKE '%@SEARCHSTRING%'  EXCEPT Select TOP @STARTCOUNT T1.""OPTM_MODELID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_MBOMDTL"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_FEATUREID""=T2.""OPTM_FEATUREID"" WHERE T1.""OPTM_MODELID"" LIKE '%@SEARCHSTRING%'"
        Return psSQL
    End Function

    Function GetDataForCommonViewForModelBOM() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT T1.""OPTM_MODELID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_MBOMDTL"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_MODELID"" =T2.""OPTM_FEATUREID"" EXCEPT Select TOP @STARTCOUNT T1.""OPTM_MODELID"",T2.""OPTM_DISPLAYNAME"" From ""OPCONFIG_MBOMDTL"" T1 INNER JOIN ""OPCONFIG_FEATUREHDR"" T2 ON T1.""OPTM_MODELID"" =T2.""OPTM_FEATUREID"""
        Return psSQL
    End Function

    Function GetTotalCountOfRecordForModelBOM() As String
        Dim psSQL As String = "SELECT COUNT(DISTINCT ""OPTM_MODELID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_MBOMDTL"""
        Return psSQL
    End Function

    Function GetDataForModelDTL() As String
        Dim psSQL As String = "SELECT * FROM OPCONFIG_MBOMDTL WHERE ""OPTM_MODELID""=?"
        Return psSQL
    End Function

    Function GetDetailForModelByModelID() As String
        Dim psSQL As String = "SELECT T1.""OPTM_FEATURECODE"",T1.""OPTM_DISPLAYNAME"",T1.""OPTM_FEATUREDESC"",T1.""OPTM_PRODGRPID"" ,T1.""OPTM_PHOTO"",T2.""OPTM_READYTOUSE"" FROM ""OPCONFIG_FEATUREHDR"" T1 INNER JOIN ""OPCONFIG_MBOMHDR"" T2 ON T1.OPTM_FEATUREID =T2.OPTM_MODELID  WHERE T2.""OPTM_MODELID""=?"
        Return psSQL
    End Function

    Function GetDataForExplodeViewForModelBOM() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_MBOMDTL"" ORDER BY ""OPTM_CHILDMODELID"" DESC"
        Return psSQL
    End Function

    Function GetAllRecordForModelBOMForCyclicCheck() As String
        Dim psSQL As String = "SELECT ""OPTM_MODELID"",""OPTM_CHILDMODELID"" FROM ""OPCONFIG_MBOMDTL"""
        Return psSQL
    End Function
#End Region

#Region "Rule WorkBench"
    Function GetAllFeatureForRuleWorkBench() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"",""OPTM_FEATURECODE"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE""='Feature'"
        Return psSQL
    End Function

    Function GetAllModelsForRuleWorkBench() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"",""OPTM_FEATURECODE"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_TYPE""='Model'"
        Return psSQL
    End Function

    Function GetAllDetailsForFeature() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREBOMDTL"""
        Return psSQL
    End Function

    Function CheckValidModelEntered() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function CheckValidFeatureEntered() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=?"
        Return psSQL
    End Function

    Function GetSavedDataFromRuleHDR() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_RULEHEADER"" WHERE ""OPTM_RULEID""=?"
        Return psSQL
    End Function

    Function GetSavedDataFromRuleInput() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_RULEINPUT"" WHERE ""OPTM_RULEID""=?"
        Return psSQL
    End Function

    Function GetSavedDataFromRuleOutput() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_RULEOUTPUT"" WHERE ""OPTM_RULEID""=?"
        Return psSQL
    End Function

    Function GetRuleIDByGUID() As String
        Dim psSQL As String = "SELECT ""OPTM_RULEID"" FROM ""OPCONFIG_RULEHEADER"" WHERE ""OPTM_GUID""=?"
        Return psSQL
    End Function

    Function GetItemMasterDataforRuleWB() As String
        Dim psSQL As String = "SELECT * FROM ""OPConfig_ItemMaster"""
        Return psSQL
    End Function

#End Region


End Class
