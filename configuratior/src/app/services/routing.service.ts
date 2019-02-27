import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  get_all_routing_data(): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetAllRoutingData", jObject, this.common_params.httpOptions);
  }

  getFeatureList(): Observable<any> {
    console.log(' in  service');

    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/FeatureList", jObject, this.common_params.httpOptions);
  }

  GetModelList(): Observable<any> {
    let jObject:any = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/ModelList", jObject, this.common_params.httpOptions);
  }

  getFeatureDetail(id): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureCode: id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/FeatureDetail", jObject, this.common_params.httpOptions);
  }

  getModalDetail(id): Observable<any> {
    let jObject = { ModelBOMDetail: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelCode: id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/ModelDetail", jObject, this.common_params.httpOptions);
  }

  GetDataByFeatureId(id): Observable<any> {
    let jObject = { ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureId: id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetDataByFeatureId", jObject, this.common_params.httpOptions);
  }

  GetDataByModelId(id): Observable<any> {
    let jObject = { ModelBOMDetail: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelId: id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/GetDataByModelID", jObject, this.common_params.httpOptions);
  }

  getWarehouseDetail(id): Observable<any> {
    let jObject = { getData: JSON.stringify([{ CompanyDBID: this.logged_in_company, warehouseId: id }]) };
    return this.httpclient.post(this.config_params.service_url + "/Routing/WarehouseDetail", jObject, this.common_params.httpOptions);
  }

  getWarehouseList(): Observable<any> {
    let jObject = { WareHouse: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/WarehouseList", jObject, this.common_params.httpOptions);
  }

  getOperationList(warehouse_id): Observable<any> {
    let jObject = { WareHouse: JSON.stringify([{ CompanyDBID: this.logged_in_company, warehouseId: warehouse_id }]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/OperationList", jObject, this.common_params.httpOptions);
  }

  getWCList(warehouse_id): Observable<any> {
    let jObject = { WareHouse: JSON.stringify([{ CompanyDBID: this.logged_in_company, warehouseId: warehouse_id }]) }
    return this.httpclient.post(this.config_params.service_url + "/Routing/getWCList", jObject, this.common_params.httpOptions);
  }

}
