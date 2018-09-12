import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class RulewbService {
  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  GetRuleList(search:any, page_number:any, record_per_page:any): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/ruleWb/GetRuleList", jObject, this.common_params.httpOptions);
  }

  getFeatureList(): Observable<any> {
    console.log(' in rule service');

    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllFeatureForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_code,press_location,index): Observable<any>{
    let jObject = { FeatureList: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureId: feature_code ,pressLocation:press_location,rowid:index}]) }
      return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllFeatureForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  GetModelList(): Observable<any> {
    let jObject = { ModelList: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllModelsForRuleWorkBench", jObject, this.common_params.httpOptions);
  }

  
  getFeatureDetailsForOutput(feature_code): Observable<any> {
    let jObject = { FeatureDetails: JSON.stringify([{ CompanyDBID: this.logged_in_company , FeatureId: feature_code }]) }
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/GetAllDetailsForFeature", jObject, this.common_params.httpOptions);
  }
  
}
