import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;
  
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }
  
 

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    })
  }

  GetModelList(): Observable<any> {
    let jObject = { GetModel: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetModelForConfigureWizard", jObject, this.common_params.httpOptions);
  }

  getFeatureList(): Observable<any> {
    let jObject = { GetFeature: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureForConfigureWizard", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_id): Observable<any>{
    let jObject = { GetFeature: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureId: feature_id}]) }
      return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureListForSelectedFeatureForConfigureWizard", jObject, this.common_params.httpOptions);
  }

  GetAccessory(): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAccessorry", jObject, this.common_params.httpOptions);
  }

  GetItemDataForSelectedAccessorry(feature_id): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company , FeatureId: feature_id}]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetItemDataForSelectedAccessorry", jObject, this.common_params.httpOptions);
  }

  
}
