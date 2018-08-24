Public Class QueryFactory
    Private Shared mObjQueryManager As IQuery = Nothing

    ''' <summary>
    ''' 
    ''' </summary>
    ''' <param name="pObjCompany"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetInstance(ByVal pObjCompany As OptiPro.Config.Common.Company) As IQuery
        Select Case pObjCompany.CompanyDBType
            Case OptiPro.Config.Common.WMSDatabaseType.HANADatabase
                mObjQueryManager = New HanaQuery()
            Case OptiPro.Config.Common.WMSDatabaseType.SQLDatabase
                mObjQueryManager = New SQLQuery()
        End Select
        Return mObjQueryManager
    End Function

End Class
