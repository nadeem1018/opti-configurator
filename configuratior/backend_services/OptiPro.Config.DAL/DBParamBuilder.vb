
Imports System.Collections.Generic
Imports System.Data
Imports System.Text
Imports System.Data.Common

Friend Class DBParamBuilder

    Private _assemblyProvider As AssemblyProvider = Nothing
    Private mobjCompany As OptiPro.Config.Common.Company

    Friend Sub New(ByVal vobjCmp As OptiPro.Config.Common.Company)
        _assemblyProvider = New AssemblyProvider(vobjCmp)
        mobjCompany = vobjCmp
    End Sub

    Friend Function GetParameter(parameter As MfgDBParameter) As DbParameter
        If parameter Is Nothing Then
            Return Nothing
        End If
        Dim dbParam As DbParameter = GetParameter()

        dbParam.ParameterName = parameter.ParamName
        dbParam.Value = parameter.Paramvalue
        dbParam.Direction = parameter.ParamDirection


        dbParam.Size = parameter.Size
        dbParam.SourceColumn = parameter.SourceColumn
        dbParam.SourceColumnNullMapping = parameter.SourceColumnNullableMapping
        dbParam.SourceVersion = DataRowVersion.Default
        If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
            CType(dbParam, Sap.Data.Hana.HanaParameter).IsNullable = parameter.IsNullable
            CType(dbParam, Sap.Data.Hana.HanaParameter).Offset = parameter.Offset
            CType(dbParam, Sap.Data.Hana.HanaParameter).Precision = parameter.Precision
            CType(dbParam, Sap.Data.Hana.HanaParameter).Scale = parameter.Scale
            CType(dbParam, Sap.Data.Hana.HanaParameter).HanaDbType = CType(GetParamDBTypeValue(parameter.Dbtype), Sap.Data.Hana.HanaDbType)
        Else
            CType(dbParam, System.Data.SqlClient.SqlParameter).IsNullable = parameter.IsNullable
            CType(dbParam, System.Data.SqlClient.SqlParameter).Offset = parameter.Offset
            CType(dbParam, System.Data.SqlClient.SqlParameter).Precision = parameter.Precision
            CType(dbParam, System.Data.SqlClient.SqlParameter).Scale = parameter.Scale
            CType(dbParam, System.Data.SqlClient.SqlParameter).SqlDbType = CType(GetParamDBTypeValue(parameter.Dbtype), System.Data.SqlDbType)
        End If

        Return dbParam
    End Function

    Friend Function GetParameterCollection(parameterCollection As DbParameterCollection) As List(Of DbParameter)
        Dim dbParamCollection As New List(Of DbParameter)()
        Dim dbParam As DbParameter = Nothing
        For Each param As MfgDBParameter In parameterCollection.Parameters
            dbParam = GetParameter(param)
            dbParamCollection.Add(dbParam)
        Next

        Return dbParamCollection
    End Function



#Region "Private Methods"
    Private Function GetParameter() As DbParameter
        Dim dbParam As DbParameter = _assemblyProvider.Factory.CreateParameter()

        Return dbParam
    End Function

    Private Function GetParamDBTypeValue(ByVal veDbType As BMMDbType) As Integer
        Dim piDBTypeEnumVal As Integer


        Select Case veDbType
            'Case NutDbType.SQL_BigInt
            '    piDBTypeEnumVal = SqlDbType.BigInt

            Case BMMDbType.SQL_Binary
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.VarBinary
                Else
                    piDBTypeEnumVal = SqlDbType.Binary
                End If
            Case BMMDbType.SQL_Bit
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.VarBinary
                Else
                    piDBTypeEnumVal = SqlDbType.Bit
                End If

            Case BMMDbType.SQL_Char
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.VarChar
                Else
                    piDBTypeEnumVal = SqlDbType.Char
                End If

                'Case NutDbType.SQL_Date
                '    piDBTypeEnumVal = SqlDbType.Date
            Case BMMDbType.SQL_DateTime
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Date
                Else
                    piDBTypeEnumVal = SqlDbType.DateTime
                End If

            Case BMMDbType.SQL_DateTime2
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.SecondDate
                Else
                    piDBTypeEnumVal = SqlDbType.DateTime2
                End If

            Case BMMDbType.SQL_DateTimeOffset
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Integer
                Else
                    piDBTypeEnumVal = SqlDbType.DateTimeOffset
                End If

                'Case NutDbType.SQL_Decimal
                '    piDBTypeEnumVal = SqlDbType.Decimal
                'Case NutDbType.SQL_Float
                '    piDBTypeEnumVal = SqlDbType.Float
                'Case NutDbType.SQL_Image
                '    piDBTypeEnumVal = SqlDbType.Image
                'Case NutDbType.SQL_Int
                '    piDBTypeEnumVal = SqlDbType.Int
                'Case NutDbType.SQL_Money
                '    piDBTypeEnumVal = SqlDbType.Money
            Case BMMDbType.SQL_NChar
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.NVarChar
                Else
                    piDBTypeEnumVal = SqlDbType.NChar
                End If

            Case BMMDbType.SQL_NText
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Text
                Else
                    piDBTypeEnumVal = SqlDbType.NText
                End If

                'Case NutDbType.SQL_NVarChar
                '    piDBTypeEnumVal = SqlDbType.NVarChar
                'Case NutDbType.SQL_Real
                '    piDBTypeEnumVal = SqlDbType.Real
            Case BMMDbType.SQL_SmallDateTime
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Date
                Else
                    piDBTypeEnumVal = SqlDbType.SmallDateTime
                End If

                'Case NutDbType.SQL_SmallInt
                '    piDBTypeEnumVal = SqlDbType.SmallInt
                'Case NutDbType.SQL_SmallMoney
                '    piDBTypeEnumVal = SqlDbType.SmallMoney
                'Case NutDbType.SQL_Structured
                '    piDBTypeEnumVal = SqlDbType.Structured
                'Case NutDbType.SQL_Text
                '    piDBTypeEnumVal = SqlDbType.Text
                'Case NutDbType.SQL_Time
                '    piDBTypeEnumVal = SqlDbType.Time
                'Case NutDbType.SQL_TimeStamp
                '    piDBTypeEnumVal = SqlDbType.Timestamp
                'Case NutDbType.SQL_TinyInt
                '    piDBTypeEnumVal = SqlDbType.TinyInt
                'Case NutDbType.SQL_UDT
                '    piDBTypeEnumVal = SqlDbType.Udt
                'Case NutDbType.SQL_UniqueIdentifier
                '    piDBTypeEnumVal = SqlDbType.UniqueIdentifier
                'Case NutDbType.SQL_VarBinary
                '    piDBTypeEnumVal = SqlDbType.VarBinary
                'Case NutDbType.SQL_VarChar
                '    piDBTypeEnumVal = SqlDbType.VarChar
                'Case NutDbType.SQL_Variant
                '    piDBTypeEnumVal = SqlDbType.Variant
                'Case NutDbType.SQL_XML
                '    piDBTypeEnumVal = SqlDbType.Xml
            Case BMMDbType.HANA_AlphaNum
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.AlphaNum
                Else
                    piDBTypeEnumVal = SqlDbType.NVarChar
                End If
            Case BMMDbType.HANA_BigInt
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.BigInt
                Else
                    piDBTypeEnumVal = SqlDbType.BigInt
                End If
            Case BMMDbType.HANA_Blob
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Blob
                Else
                    piDBTypeEnumVal = SqlDbType.Image
                End If

            Case BMMDbType.HANA_Date
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Date
                Else
                    piDBTypeEnumVal = SqlDbType.Date
                End If

            Case BMMDbType.HANA_Decimal
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Decimal
                Else
                    piDBTypeEnumVal = SqlDbType.Decimal
                End If

            Case BMMDbType.HANA_Double
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Double
                Else
                    piDBTypeEnumVal = SqlDbType.Float
                End If

            Case BMMDbType.HANA_Integer
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Integer
                Else
                    piDBTypeEnumVal = SqlDbType.Int
                End If

            Case BMMDbType.HANA_NClob
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.NClob
                Else
                    piDBTypeEnumVal = SqlDbType.Image
                End If

            Case BMMDbType.HANA_NVarChar
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.NVarChar
                Else
                    piDBTypeEnumVal = SqlDbType.NVarChar
                End If
            Case BMMDbType.HANA_Real
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Real
                Else
                    piDBTypeEnumVal = SqlDbType.Money
                End If

            Case BMMDbType.HANA_ShortText
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.ShortText
                Else
                    piDBTypeEnumVal = SqlDbType.NVarChar
                End If
            Case BMMDbType.HANA_SmallDecimal
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.SmallDecimal
                Else
                    piDBTypeEnumVal = SqlDbType.Decimal
                End If
            Case BMMDbType.HANA_SmallInt
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.SmallInt
                Else
                    piDBTypeEnumVal = SqlDbType.SmallInt
                End If
            Case BMMDbType.HANA_TableType
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.TableType
                Else
                    piDBTypeEnumVal = SqlDbType.Structured
                End If
            Case BMMDbType.HANA_Text
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.Text
                Else
                    piDBTypeEnumVal = SqlDbType.Text
                End If
            Case BMMDbType.HANA_TimeStamp
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.TimeStamp
                Else
                    piDBTypeEnumVal = SqlDbType.Timestamp
                End If
            Case BMMDbType.HANA_TinyInt
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.TinyInt
                Else
                    piDBTypeEnumVal = SqlDbType.TinyInt
                End If
            Case BMMDbType.HANA_VarBinary
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.VarBinary
                Else
                    piDBTypeEnumVal = SqlDbType.VarBinary
                End If
            Case BMMDbType.HANA_VarChar
                If mobjCompany.CompanyDBType = OptiPro.Config.Common.WMSDatabaseType.HANADatabase Then
                    piDBTypeEnumVal = Sap.Data.Hana.HanaDbType.VarChar
                Else
                    piDBTypeEnumVal = SqlDbType.VarChar
                End If
        End Select
        Return piDBTypeEnumVal
    End Function

#End Region
End Class



