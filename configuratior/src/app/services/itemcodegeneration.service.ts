import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class ItemcodegenerationService {

  arrConfigData:any;
  common_params = new CommonData();
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(localStorage.getItem('arrConfigData'));
  }



  //Submit feature bom data
  saveData(ItemCodeGenerationData):Observable<any>{
    
    //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ AddItemGeneration: JSON.stringify(ItemCodeGenerationData) };
    //Return the response form the API  
    return this.httpclient.post("http://localhost:65341/ItemGeneration/AddItemGeneration", jObject, this.common_params.httpOptions);
    }
}
