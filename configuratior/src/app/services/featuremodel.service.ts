import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class FeaturemodelService {
  arrConfigData:any;
  common_params = new CommonData();
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(localStorage.getItem('arrConfigData'));
  }
//defining properties for the call 
   ;
  //Submit feature bom data
  saveData(CompanyDBID:string,FromOperationNo):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ MoveOrder: JSON.stringify([{ 
        CompanyDBID: CompanyDBID, 
        FromOperation: FromOperationNo, 
        
       
      }]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL + "/MoveOrder/SubmitMoveOrder", jObject, this.common_params.httpOptions);
    }
    
    //get template items to hit API
  getTemplateItems(CompanyDBID:string):Observable<any>{
     //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

   //Return the response form the API  
    return this.httpclient.post("http://localhost:65342/FeatureHeader/GetModelTemplateItem",jObject,this.common_params.httpOptions);
   }

    
    //get template items to hit API
  getGeneratedItems(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ItemCodeGenerationReference: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
       
  //Return the response form the API  
  return this.httpclient.post("http://localhost:65342/api/UserGroup/GetAllUserGroupRecords",jObject,this.common_params.httpOptions);
  }
}
