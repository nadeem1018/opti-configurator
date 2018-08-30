import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class FeaturebomService {
  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  getFeatureList(): Observable<any> {
    console.log(' in  service');

    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetFeatureList", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_code){
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, featureCode: feature_code }]) }
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetFeatureList", jObject, this.common_params.httpOptions);

  }
}
