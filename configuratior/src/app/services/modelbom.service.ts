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
  
 

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    })
  }

  /* post_data_with_file(input_file_obj: File, modelbom_data): Observable<any> {
    console.log(' in  post_data_with_file');
    console.log(input_file_obj);
    console.log(input_file_obj.name);
    
    
    let form_data: FormData = new FormData();
    form_data.append('file', input_file_obj, input_file_obj.name);
    console.log('form_data');
    console.log(form_data);
    
    // let jObject = { file_data: form_data, ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, modelbom_data: modelbom_data }]) };
    let jObject = { form_data };
    console.log(jObject);
    
    return this.httpclient.post(this.config_params.service_url + "/FeatureHeader/GetBomModel/", input_file_obj, this.httpOptions);
  } */

  GetModelList(): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetModelList", jObject, this.common_params.httpOptions);
  }

  getModelDetails(model_code,press_location,index): Observable<any>{
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelID: model_code ,pressLocation:press_location,rowid:index}]) }
      return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetModelList", jObject, this.common_params.httpOptions);
  }

  getModelFeatureDetails(feature_code,press_location,index): Observable<any>{
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, featureCode: feature_code ,pressLocation:press_location,rowid:index}]) }
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetFeatureList", jObject, this.common_params.httpOptions);
  }

  getItemDetails(ItemKey): Observable<any>{
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, ItemKey: ItemKey}]) }
      return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/GetItemList", jObject, this.common_params.httpOptions);
  }

  SaveModelBom(SaveData): Observable<any>{
    let jObject:any = { AddModel: JSON.stringify( SaveData) };

    //let jObject:any={ AddModel: JSON.stringify(SaveData), RuleModel: JSON.stringify(RuleData)};

      return this.httpclient.post(this.config_params.service_url + "/ModelBOM/AddUpdateModelBOM", jObject, this.common_params.httpOptions);
  }

  getAllViewDataForModelBom(search:string,PageNumber:any,record_per_page:any): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, SearchString:search,PageNumber:PageNumber, PageLimit:record_per_page }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataForCommonViewForModelBOM", jObject, this.common_params.httpOptions);
  }

  GetPriceList(ItemKey): Observable<any> {
    let jObject = { PriceList: JSON.stringify([{ CompanyDBID: this.logged_in_company,ItemKey:ItemKey }]) }
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetPriceList", jObject, this.common_params.httpOptions);
  }

  GetDataByModelId(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelId:id}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataByModelID", jObject, this.common_params.httpOptions);
  }

  DeleteData(id): Observable<any> {
    
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { DeleteModel: JSON.stringify(id) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/DeleteModelBOMFromHDRandDTL", jObject, this.common_params.httpOptions);
  }

  GetDataForExplodeViewForModelBOM(CompanyDBID,modelID): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: CompanyDBID,ModelID: modelID }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetDataForExplodeViewForModelBOM", jObject, this.common_params.httpOptions);
  }

  getRuleLookupList(id): Observable<any>{
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelId:id }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetAllRules", jObject, this.common_params.httpOptions);
  }

  onModelIdChange(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelList: JSON.stringify([{ CompanyDBID: this.logged_in_company,ModelId:id}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/RuleWorkBench/CheckValidModelEntered", jObject, this.common_params.httpOptions);
  }

  onFeatureIdChangeModelBom(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company,FeatureId:id}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/CheckValidFeatureIdEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }
  
  onItemIdChangeModelBom(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company,ItemCode:id}]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/FeatureBOM/CheckValidItemEnteredForFeatureBOM", jObject, this.common_params.httpOptions);
  }

  onVerifyOutput(VerifyData): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject:any = { GetData: JSON.stringify( VerifyData) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/VerifyOutput", jObject, this.common_params.httpOptions);
  }

}
