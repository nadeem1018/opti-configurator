import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeaturemodelService {
  arrConfigData:any;
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(localStorage.getItem('arrConfigData'));
  }
//defining properties for the call 
httpOptions = {
  headers: new HttpHeaders({
  'Content-Type':  'application/json',
  'Accept':'application/json'
    })
  };
  //Submit feature bom data
  saveData(featureBom):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
      //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ Feature: JSON.stringify(featureBom) };
    //Return the response form the API  
    return this.httpclient.post("http://localhost:65342/FeatureHeader/AddFeatures",jObject,this.httpOptions);
    }
    
    //get template items to hit API
  getTemplateItems(CompanyDBID:string):Observable<any>{
     //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

   //Return the response form the API  
    return this.httpclient.post("http://localhost:65342/FeatureHeader/GetModelTemplateItem",jObject,this.httpOptions);
   }

    
    //get template items to hit API
  getGeneratedItems(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ItemCodeGenerationReference: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
       
  //Return the response form the API  
  return this.httpclient.post("http://localhost:65342/FeatureHeader/GetItemCodeGenerationReference",jObject,this.httpOptions);
  }
}
