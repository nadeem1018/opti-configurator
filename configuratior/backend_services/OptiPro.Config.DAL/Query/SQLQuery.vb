Imports OptiPro.Config.Common.Utilites
Public Class SQLQuery
    Implements IQuery

    Public Function GetQuery(vsQueryId As String) As String Implements IQuery.GetQuery
        Dim psQuery As String = ""
        Dim MyMethod As System.Reflection.MethodInfo = GetType(SQLQuery).GetMethod(vsQueryId)
        psQuery = NullToString(MyMethod.Invoke(Me, Nothing))
        Return psQuery
    End Function

#Region "Feature Header "
    'Sql Query to Inset the Data into the Feature Header 
    Function AddFeatures() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDR"" (""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PHOTO"",""OPTM_CREATEDBY"",""OPTM_CREATEDDATE"",""OPTM_MODIFIEDBY"",""OPTM_MODIFIEDDATE"",""OPTM_TYPE"",""OPTM_MODELTEMPLATEITEM"",""OPTM_ITEMCODEGENREF"",""OPTM_STATUS"",""OPTM_EFFECTIVEDATE"",""OPTM_FEATURECODE"",""OPTM_ACCESSORY"") VALUES(@DISPLAYNAME,@FEATUREDESC,@PHOTOPATH,@CREATEDBY,GETDATE(),@MODIFIEDBY,GETDATE(),@TYPE,@MODELTEMPLATEITEM,@ITEMCODEREFERENCE,@STATUS,@EFFECTIVEDATE,@FEATURECODE,@ACCESSORY)"
        Return psSQL
    End Function

    'Sql Query to Delete the Feature By the Feature ID 
    Function DeleteFeatures() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=@FEATUREID"
        Return psSQL
    End Function
    Function UpdateFeatures() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREHDR"" SET ""OPTM_DISPLAYNAME"" =@DISPLAYNAME,""OPTM_FEATUREDESC""=@FEATUREDESC,""OPTM_PHOTO""=@PHOTOPATH,""OPTM_MODIFIEDBY""=@MODIFIEDBY,""OPTM_MODIFIEDDATE""=GETDATE(),""OPTM_TYPE""=@TYPE,""OPTM_MODELTEMPLATEITEM""=@MODELTEMPLATEITEM,""OPTM_ITEMCODEGENREF""=@ITEMCODEGENREF,""OPTM_STATUS""=@STATUS,""OPTM_EFFECTIVEDATE""=@EFFECTIVEDATE,""OPTM_ACCESSORY""=@ACCESSORY WHERE ""OPTM_FEATUREID""=@FEATUREID"
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
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATURECODE"") AS ""TOTALCOUNT""  FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATURECODE""=@FEATURECODE "
        Return psSQL
    End Function

    Function GetAllData() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"" EXCEPT Select  top @STARTCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function
    Function GetAllSavedRecord() As String
        Dim psSQL As String = "Select top @ENDCOUNT OPTM_FEATURECODE,OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"" EXCEPT Select top @STARTCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"" "
        Return psSQL
    End Function
    Function GetAllDataOnBasisOfSearchCriteria() As String
        Dim psSQL As String = "Select TOP @ENDCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR""  WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR  ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_TYPE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_STATUS"" LIKE '%@SEARCHSTRING%' EXCEPT Select  top @STARTCOUNT OPTM_FEATURECODE,OPTM_TYPE,OPTM_DISPLAYNAME,format(OPTM_EFFECTIVEDATE,'dd/MM/yyyy') AS ""OPTM_EFFECTIVEDATE"",OPTM_STATUS,OPTM_FEATUREID From ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR  ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_TYPE"" LIKE '%@SEARCHSTRING%' OR ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_STATUS"" LIKE '%@SEARCHSTRING%'"
        Return psSQL
    End Function
    'Function GetAllDataOnBasisOfSearchCriteria() As String
    '    Dim psSQL As String = "SELECT * FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_DISPLAYNAME"" LIKE '%@SEARCHSTRING%' OR ""OPTM_FEATUREDESC"" LIKE '%@SEARCHSTRING%' OR ""OPTM_MODELTEMPLATEITEM"" LIKE '%@SEARCHSTRING%' OR ""OPTM_ITEMCODEGENREF"" LIKE '%@SEARCHSTRING%' OR ""OPTM_FEATURECODE"" LIKE '%@SEARCHSTRING%'"
    '    Return psSQL
    'End Function
    Function GetTotalCountOfRecord() As String
        Dim psSQL As String = "SELECT COUNT(""OPTM_FEATUREID"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function

    Function GetRecordById() As String
        Dim psSql As String = "SELECT ""OPTM_FEATURECODE"",""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"" ,""OPTM_FEATUREDESC"",""OPTM_PHOTO"",""OPTM_TYPE"",""OPTM_MODELTEMPLATEITEM"",""OPTM_ITEMCODEGENREF"",""OPTM_STATUS"",""OPTM_EFFECTIVEDATE"",""OPTM_ACCESSORY"" from ""OPCONFIG_FEATUREHDR"" WHERE OPTM_FEATUREID =@FEATUREID"
        Return psSql
    End Function
#End Region



#Region "Item Generation"
    'SQl Query to add the data in Item Generation Table 
    Function AddItemGeneration() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_ITEMCODEGENERATION"" (""OPTM_CODE"",""OPTM_CODESTRING"",""OPTM_TYPE"",""OPTM_OPERATION"",""OPTM_CREATEDBY"",""OPTM_CREATEDATETIME"",""OPTM_LINEID"")VALUES(@ITEMCODE,@ITEMSTRING,@TYPE,@OPERATIONTYPE,'John',GETDATE(),@LINEID)"
        Return psSQL
    End Function


    'SQL Query to Delete the Item Generation Code From the Database
    Function DeleteItemGenerationCode() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE"" =@ITEMCODE"
        Return psSQL
    End Function

    'SQl Query to Check Count of Duplicate Entry
    Function CheckDuplicateItemCode() As String
        Dim psSQL As String = "SELECT  COUNT(""OPTM_CODE"") FROM  ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE"" =@ITEMCODE"
        Return psSQL
    End Function

    'Sql Query to Update  the Data of the Generated Item
    Function UpdateDataofGeneratedItem() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_ITEMCODEGENERATION"" SET ""OPTM_CODESTRING"" =@ITEMSTRING,""OPTM_TYPE"" =@TYPE,""OPTM_OPRERATION"" =@OPERATIONTYPE ,""OPTM_MODIFIEDBY""=@USERNAME,""OPTM_MODIFIEDDATETIME"" =GETDATE() where ""OPTM_CODE""=@ITEMCODE"
        Return psSQL
    End Function

    Function GetDataByItemCode() As String
        Dim psSQL As String = "SELECT * FROM ""OPCONFIG_ITEMCODEGENERATION"" WHERE ""OPTM_CODE"" =@ITEMCODE"
        Return psSQL
    End Function

    Function GetItemGenerationData() As String
        Dim psSQL As String = "SELECT TOP @ENDCOUNT OPICG.OPTM_CODE AS ""Code"",STUFF((SELECT '' + SUB.OPTM_CODESTRING AS ""text()"" FROM ""OPCONFIG_ITEMCODEGENERATION"" AS  SUB WHERE SUB.""OPTM_CODE"" = OPICG.""OPTM_CODE"" FOR XML PATH('') ), 1, 1, '' ) AS ""FinalString"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" GROUP BY ""OPTM_CODE"" EXCEPT SELECT TOP @STARTCOUNT ""OPICG"".""OPTM_CODE"" AS ""Code"", STUFF((SELECT '' + ""SUB"".""OPTM_CODESTRING"" AS ""text()"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as  ""SUB"" WHERE SUB.OPTM_CODE = OPICG.OPTM_CODE FOR XML PATH('') ), 1, 1, '' ) AS ""FinalString"" FROM  ""OPCONFIG_ITEMCODEGENERATION"" as OPICG GROUP BY OPTM_CODE"
        Return psSQL
    End Function

    Function GetItemGenerationDataBySearchCriteria() As String
        Dim psSQL As String = "SELECT TOP @ENDCOUNT OPICG.OPTM_CODE AS ""Code"",STUFF((SELECT '' + SUB.OPTM_CODESTRING AS ""text()"" FROM ""OPCONFIG_ITEMCODEGENERATION"" AS  SUB WHERE SUB.""OPTM_CODE"" = OPICG.""OPTM_CODE"" FOR XML PATH('') ), 1, 1, '' ) AS ""FinalString"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" WHERE ""OPTM_CODE"" LIKE '%@SEARCHSTRING%' GROUP BY ""OPTM_CODE"" EXCEPT SELECT TOP @STARTCOUNT ""OPICG"".""OPTM_CODE"" AS ""Code"", STUFF((SELECT '' + ""SUB"".""OPTM_CODESTRING"" AS ""text()"" FROM ""OPCONFIG_ITEMCODEGENERATION"" as  ""SUB"" WHERE SUB.""OPTM_CODE"" = ""OPICG"".""OPTM_CODE"" FOR XML PATH('') ), 1, 1, '') AS ""FinalString"" FROM  ""OPCONFIG_ITEMCODEGENERATION"" as ""OPICG"" WHERE ""OPTM_CODE"" LIKE '%@SEARCHSTRING%' GROUP BY OPTM_CODE"
        Return psSQL
    End Function

    Function GetTotalCountOfRecordForItemGeneration() As String
        Dim psSQL As String = "SELECT  COUNT( DISTINCT ""OPTM_CODE"") AS ""TOTALCOUNT"" FROM ""OPCONFIG_ITEMCODEGENERATION"""
        Return psSQL
    End Function

    Function GetItemCodeReference() As String
        Dim psSQL As String = "SELECT COUNT(*) AS ""ROWCOUNT"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_ITEMCODEGENREF""=?"
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


#Region "Common Query"
    'This will get the server date & Time
    Function GetServerDate() As String
        Dim psSQL As String = " select GetDate() as ""DATEANDTIME"""
        Return psSQL
    End Function
    'SQL Query to get the Table Structure 
    Function GetTableStructure() As String
        Dim psSQL As String = "select * from ""@TABLENAME"" where 1=0"
        Return psSQL
    End Function
#End Region

#Region "Feature BOM"
    'SQL Query to get the LIst of Fetaure 
    Function GetFeatureList() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"" FROM ""OPCONFIG_FEATUREHDR"""
        Return psSQL
    End Function

    'SQL Query to get the Details of  Feature Accordng to the Fature ID 
    Function GetFeatureDetail() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""OPTM_DISPLAYNAME"",""OPTM_FEATUREDESC"",""OPTM_PRODGRPID"" ,""OPTM_PHOTO"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""=@FEATUREID "
        Return psSQL
    End Function

    'SQL Query to get the List of the Items fom the OITM Table
    Function GetItemForFeatureBOM() As String
        Dim psSQL As String = "SELECT ""ItemKey"",""Description"" from ""OpConfig_ItemMaster"""
        Return psSQL
    End Function

    'SQL Query to get the List of all the Features Except the Selected Feature
    Function GetFeatureListExceptSelectedFeature() As String
        Dim psSQL As String = "SELECT ""OPTM_FEATUREID"",""DisplayName"" FROM ""OPCONFIG_FEATUREHDR"" WHERE ""OPTM_FEATUREID""<>@FEATUREID"
        Return psSQL
    End Function

    'SQL Query to add Feature in Feature HEader 
    Function AddDataInFeatureHeader() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREHDRMASTER"" (""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATE"") VALUES(@COMPANY,@USERID,GETDATE())"
        Return psSQL
    End Function
    'SQLQuery to Add Detail in the Feature Detail
    Function AddDataInFeatureDetail() As String
        Dim psSQL As String = "INSERT INTO ""OPCONFIG_FEATUREDTL"" (""OPTM_TYPE"",""OPTM_LINENO"",""OPTM_HDRFEATUREID"",""OPTM_ITEMKEY"",""OPTM_VALUE"",""OPTM_DISPLAYNAME"",""OPTM_DEFAULT"",""OPTM_REMARKS"",""OPTM_ATTACHMENT"",""OPTM_COMPANYID"",""OPTM_CREATEDBY"",""OPTM_CREATEDATETIME"")VALUES(@ITEMTYPE,@LINENO,@HEADERFEATUREID,@ITEMKEY,@ITEMVALUE,@DISPLAYNAME,@DEFAULT,@REMARKS,@ATTACHMENT,@COMPANYID,@USERID,GETDATE())"
        Return psSQL
    End Function

    'SQL Query to Update data in Feature Detail 
    Function UpdateDataInFeatureDetail() As String
        Dim psSQL As String = "UPDATE ""OPCONFIG_FEATUREDTL"" SET ""OPTM_TYPE"" =@ITEMTYPE,""OPTM_ITEMKEY""=@ITEMKEY,""OPTM_VALUE""=@ITEMVALUE,""OPTM_DISPLAYNAME""=@DISPLAYNAME,""OPTM_DEFAULT""=@DEFAULT,""OPTM_REMARKS""=@REMARKS,""OPTM_ATTACHMENT""=@ATTACHMENT,""OPTM_COMPANYID""=@COMPANYID,""OPTM_MODIFIEDBY""=@USERID,""OPTM_MODIFIEDDATETIME""=GETDATE() WHERE ""OPTM_FEATUREID""=@FEATUREID"
        Return psSQL
    End Function

    'SQL Query to Delete the Data From the Feature Detail
    Function DeleteDataFromFeatureDetail() As String
        Dim psSQL As String = "DELETE FROM ""OPCONFIG_FEATUREDTL"" WHERE ""OPTM_FEATUREID""=@FEATUREID"
        Return psSQL
    End Function
#End Region

End Class
