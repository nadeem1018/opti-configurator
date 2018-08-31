import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class ModelbomService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;
  
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }
  
 

  post_data_with_file(input_file_obj, modelbom_data): Observable<any> {
     console.log('input_file_obj');
     console.log(input_file_obj);
    
     let jObject = { 
       GetModel: input_file_obj, 
       ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, modelbom_data: modelbom_data }])
     };
      console.log(jObject);
   //   const headers = new HttpHeaders({'Content-Type': 'Content-Disposition', 'Accept': 'json/application' })
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetBomModel", input_file_obj);
  }
}
