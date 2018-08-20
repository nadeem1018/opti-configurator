import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemcodegenerationService {

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
  saveData(ItemCodeGenerationData):Observable<any>{
    
    //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ AddItemGeneration: JSON.stringify(ItemCodeGenerationData) };
    //Return the response form the API  
    return this.httpclient.post("http://localhost:65341/ItemGeneration/AddItemGeneration",jObject,this.httpOptions);
    }
}
