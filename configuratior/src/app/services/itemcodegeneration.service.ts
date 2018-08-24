import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class ItemcodegenerationService {

  config_params: any;
  common_params = new CommonData();
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  //save data
  saveData(ItemCodeGenerationData): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { AddItemGeneration: JSON.stringify(ItemCodeGenerationData) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/AddItemGeneration", jObject, this.common_params.httpOptions);
  }
  //get data
  getItemCodeGenerationByCode(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { ItemList: JSON.stringify(ItemCode) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetDataByItemCode", jObject, this.common_params.httpOptions);
  }
  DeleteData(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { DeleteItemGeneration: JSON.stringify(ItemCode) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/DeleteItemGenerationCode", jObject, this.common_params.httpOptions);
  }
  viewItemGenerationData(CompanyDBID: string): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetRecord: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetItemGenerationData", jObject, this.common_params.httpOptions);
  }
  getItemCodeReference(ItemCode): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { DeleteItemGeneration: JSON.stringify(ItemCode) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ItemGeneration/GetItemCodeReference", jObject, this.common_params.httpOptions);
  }


}
