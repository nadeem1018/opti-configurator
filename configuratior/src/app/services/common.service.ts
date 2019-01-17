import { Injectable } from '@angular/core';import { parse } from 'querystring';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  common_params = new CommonData();
  public logged_in_company = sessionStorage.selectedComp;
  public config_params: any = "";
  constructor(private httpclient: HttpClient) {
    
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    console.log("the config param  - ", this.config_params);
   }
  config_parameter;

  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }
 
 
  async get_config() {
    let config_call = await fetch( this.common_params.get_current_url() +  "/assets/data/json/config.json");
    let config_data = await config_call.json();
    let language_call = await fetch(this.common_params.get_current_url() + "/assets/data/json/i18n/" + config_data['locale'] + ".json");
    let language_data = await language_call.json();
    
    sessionStorage.setItem('system_config', JSON.stringify(config_data));
    sessionStorage.setItem('current_lang', JSON.stringify(language_data));
  }

 /*  async set_language(language) {
    let service_call = await fetch( this.common_params.get_current_url() + "/assets/data/json/i18n/" + language + ".json");
    let data = await service_call.json();
    console.log(data);
    sessionStorage.setItem('current_lang', JSON.stringify(data));
  } */

   /* public get_config(){
    let service_call = this.httpclient.get("../../assets/data/json/config.json");
   
    service_call.subscribe( data => {
        sessionStorage.setItem('system_config', JSON.stringify(data));
      });
  } */


  /* public set_language(language){
    let service_call = this.httpclient.get("../../assets/data/json/i18n/" + language +".json");
    service_call.subscribe(data => {
      sessionStorage.setItem('current_lang', JSON.stringify(data));
    });
  } */

  //This will get he service according to user settings done on Admin Portal
  getMenuRecord(): Observable<any>{
    //this.config_params.product_code = 'CNF';
    if (this.config_params == undefined || this.config_params == "") {
      this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    }
    let jObject = { Menus: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') }]) }
    return this.httpclient.post(sessionStorage.getItem('psURL') + "/api/login/GetMenuRecord", jObject, this.common_params.httpOptions);
  }

   //This will get he service according to user settings done on Admin Portal
   getPermissionDetails(): Observable<any>{
    let jObject = { Permission: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') , MenuId:  sessionStorage.getItem('currentMenu') }]) }
    return this.httpclient.post(sessionStorage.getItem('psURL') + "/api/login/GetPermissionDetails", jObject, this.common_params.httpOptions);
  }

  // save session data
  private isLoggedInData = new BehaviorSubject<any>(sessionStorage.getItem('isLoggedIn'));
  currentIsLoggedInDataData = this.isLoggedInData.asObservable();

  public setisLoggedInData() {
    this.isLoggedInData.next(sessionStorage.getItem('isLoggedIn'));
  }



  RemoveLoggedInUser(): Observable<any> {
    var jObject = { GUID: sessionStorage.getItem("GUID"), LoginId: sessionStorage.getItem("loggedInUser") };
    return this.httpclient.post(this.config_params.service_url + "/Login/RemoveLoggedInUser", jObject, this.common_params.httpOptions);
  } 

  signOut(toastr: ToastrService, router: Router){
    let language:any = JSON.parse(sessionStorage.getItem('current_lang'));  
    toastr.success('', language.session_stopped, this.common_params.toast_config);
    /* sessionStorage.clear();
    localStorage.clear(); */
    let login_page = this.common_params.application_path + '/index.html#login';
        
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('selectedComp');
    sessionStorage.removeItem('loggedInUser');
    
    // this.router.navigateByUrl('/login');
   
    setTimeout(()=>{   
      this.setisLoggedInData();
      router.navigateByUrl('/login');
    }, 1000);
  }

  // get company details 
  GetCompanyDetails(selectedCompID, service_url): Observable<any> {
   
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetPSURL: JSON.stringify([{ CompanyDBID: selectedCompID }]) };
    //Return the response form the API  
    return this.httpclient.post(service_url + "/Base/GetCompanyDetails", jObject, this.common_params.httpOptions);
  }

  //Get Server Date
  GetServerDate(): Observable<any> {
   
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetPSURL: JSON.stringify([{ CompanyDBID: sessionStorage.getItem('selectedComp') }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Base/GetServerDate", jObject, this.common_params.httpOptions);
  }

}
