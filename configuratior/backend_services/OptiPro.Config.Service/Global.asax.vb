Imports System.Web.Http
Imports System.Web.Optimization

Public Class WebApiApplication
    Inherits System.Web.HttpApplication

    Sub Application_Start()
        AreaRegistration.RegisterAllAreas()
        GlobalConfiguration.Configure(AddressOf WebApiConfig.Register)
        FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters)
        RouteConfig.RegisterRoutes(RouteTable.Routes)
        BundleConfig.RegisterBundles(BundleTable.Bundles)
    End Sub

    Private Sub WebApiApplication_PostAuthenticateRequest(sender As Object, e As EventArgs) Handles Me.PostAuthenticateRequest

    End Sub


    Public Overrides Sub Init()
        MyBase.Init()
    End Sub

    Sub Application_BeginRequest()

        If Request.Headers.AllKeys.Contains("Origin") And Request.HttpMethod = "OPTIONS" Then
            Response.Flush()
        End If

    End Sub
End Class
