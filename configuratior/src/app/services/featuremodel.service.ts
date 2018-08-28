import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class FeaturemodelService {
  config_params:any;
  common_params = new CommonData();
  constructor(private httpclient:HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

   
  //Submit feature bom data
  saveData(featureBom):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
      //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ Feature: JSON.stringify(featureBom) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/AddFeatures", jObject, this.common_params.httpOptions);
    }
    
    //get template items to hit API
  getTemplateItems(CompanyDBID:string):Observable<any>{
     //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

   //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetModelTemplateItem",jObject,this.common_params.httpOptions);
   }

    
    //get template items to hit API
  getGeneratedItems(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ItemCodeGenerationReference: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
       
  //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetItemCodeGenerationReference",jObject,this.common_params.httpOptions);
  }
      //get template items to hit API
  getAllViewData(CompanyDBID:string,search:string,PageNumber:any,record_per_page:any):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
   let jObject = { GetRecord: JSON.stringify([{ CompanyDBID: "SFDCDB", SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page}]) };
  //Return the response form the API  
   return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetAllData",jObject,this.common_params.httpOptions);
  }
      //get template items to hit API
      GetRecordById(CompanyDBID:string, FEATUREID: string):Observable<any>{
        //JSON Obeject Prepared to be send as a param to API
       let jObject = { FeatureCode: JSON.stringify([{ CompanyDBID: "SFDCDB", FEATUREID: FEATUREID }]) };
    
      //Return the response form the API  
       return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetRecordById",jObject,this.common_params.httpOptions);
      }

      //Submit feature bom data
    updateData(featureBom):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
      //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ UpdateFeature: JSON.stringify(featureBom) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/UpdateFeatures", jObject, this.common_params.httpOptions);
    }
    DeleteData(CompanyDBID:string, FEATUREID: string):Observable<any>{
      //JSON Obeject Prepared to be send as a param to API
     let jObject = { DeleteFeature: JSON.stringify([{ CompanyDBID: "SFDCDB", FEATUREID: FEATUREID }]) };
  
    //Return the response form the API  
     return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/DeleteFeatures",jObject,this.common_params.httpOptions);
    }
}
