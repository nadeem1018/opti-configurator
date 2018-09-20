import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpRequest } from '@angular/common/http';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  config_params:any;
  common_params = new CommonData();
  constructor(private httpclient:HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }


  //get template items to hit API
  getCustomers(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
   let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

  //Return the response form the API  
   return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerList",jObject,this.common_params.httpOptions);
  }
}
