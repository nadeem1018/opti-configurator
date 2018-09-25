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


  getCustomerLookupData(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
   let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

  //Return the response form the API  
   return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerList",jObject,this.common_params.httpOptions);
  }


  fillContactPerson(CompanyDBID:string,Customer:string):Observable<any>{
  //JSON Obeject Prepared to be send as a param to API
  let jObject = { ContactPerson: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer }]) };

  //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/FillContactPerson",jObject,this.common_params.httpOptions);
  }

  
  fillShipTo(CompanyDBID:string,Customer:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { AddressList: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer }]) };
  
    //Return the response form the API  
      return this.httpclient.post(this.config_params.service_url + "/Wizard/FillShipAddress",jObject,this.common_params.httpOptions);
    }

    fillBillTo(CompanyDBID:string,Customer:string):Observable<any>{
      //JSON Obeject Prepared to be send as a param to API
      let jObject = { AddressList: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer }]) };
    
      //Return the response form the API  
        return this.httpclient.post(this.config_params.service_url + "/Wizard/FillBillAddress",jObject,this.common_params.httpOptions);
    }

    fillShipAddress(ShipData ):Observable<any>{
        //JSON Obeject Prepared to be send as a param to API
        // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
        let jObject:any = { AddressDetail: JSON.stringify( ShipData) };
        //Return the response form the API  
          return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerShipAddress",jObject,this.common_params.httpOptions);
      }

      fillBillAddress(Billdata ):Observable<any>{
          //JSON Obeject Prepared to be send as a param to API
          //let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,BillTo:BillTo }]) };Billdata
          let jObject:any = { AddressDetail: JSON.stringify( Billdata) };
          //Return the response form the API  
            return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerBillAddress",jObject,this.common_params.httpOptions);
      }

      fillAllOwners(CompanyDBID:string):Observable<any>{
        //JSON Obeject Prepared to be send as a param to API
        let jObject = { OwnerList: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
      
        //Return the response form the API  
          return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAllOwners",jObject,this.common_params.httpOptions);
      }

      validateInputCustomer(CompanyDBID:string, Customer : string ):Observable<any>{
        //JSON Obeject Prepared to be send as a param to API
        let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer:Customer }]) };
      
        //Return the response form the API  
          return this.httpclient.post(this.config_params.service_url + "/Wizard/ValidateCustomer",jObject,this.common_params.httpOptions);
      }

      GetCustomername(CompanyDBID:string, Customer : string ):Observable<any>{
        //JSON Obeject Prepared to be send as a param to API
        let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer:Customer }]) };
      
        //Return the response form the API  
          return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerName",jObject,this.common_params.httpOptions);
      }
}
