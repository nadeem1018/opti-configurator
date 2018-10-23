import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
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

  getFeatureList(modelid): Observable<any> {
    let jObject = { GetFeature: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelId: modelid }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureForConfigureWizard", jObject, this.common_params.httpOptions);
  }

  getFeatureDetails(feature_id, modelid): Observable<any> {
    let jObject = { GetFeature: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureId: feature_id, ModelId: modelid }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFeatureListForSelectedFeatureForConfigureWizard", jObject, this.common_params.httpOptions);
  }

  GetAccessory(): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAccessorry", jObject, this.common_params.httpOptions);
  }

  GetItemDataForSelectedAccessorry(feature_id, modelid): Observable<any> {
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, FeatureId: feature_id, ModelId: modelid }]) }
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetItemDataForSelectedAccessorry", jObject, this.common_params.httpOptions);
  }

  getCustomerLookupData(CompanyDBID: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerList", jObject, this.common_params.httpOptions);
  }

  GetDataForModelBomOutput(modelID, modalDesc): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelID: modelID, ModelDisplayName: modalDesc }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataForModelBomOutput", jObject, this.common_params.httpOptions);
  }

  GetDataByModelIDForFirstLevel(modelID, modalDesc): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelID: modelID, ModelDisplayName: modalDesc }]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataByModelIDForFirstLevel", jObject, this.common_params.httpOptions);
  }
  GetDataForSelectedFeatureModelItem(type,modelid ,featureid,item,parentfeatureid,parentmodelid): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, Type: type, ModelId: modelid ,FeatureId:featureid,Item:item,ParentFeatureId:parentfeatureid,ParentModelId:parentmodelid}]) }
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataForSelectedFeatureModelItem", jObject, this.common_params.httpOptions);
  }


  fillContactPerson(CompanyDBID: string, Customer: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { ContactPerson: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer: Customer }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/FillContactPerson", jObject, this.common_params.httpOptions);
  }


  fillShipTo(CompanyDBID: string, Customer: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { AddressList: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer: Customer }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/FillShipAddress", jObject, this.common_params.httpOptions);
  }

  fillBillTo(CompanyDBID: string, Customer: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { AddressList: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer: Customer }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/FillBillAddress", jObject, this.common_params.httpOptions);
  }

  fillShipAddress(ShipData): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    // let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,ShipTo:ShipTo }]) };
    let jObject: any = { AddressDetail: JSON.stringify(ShipData) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerShipAddress", jObject, this.common_params.httpOptions);
  }

  fillBillAddress(Billdata): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    //let jObject = { AddressDetail: JSON.stringify([{ CompanyDBID: CompanyDBID,Customer: Customer,BillTo:BillTo }]) };Billdata
    let jObject: any = { AddressDetail: JSON.stringify(Billdata) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerBillAddress", jObject, this.common_params.httpOptions);
  }

  fillAllOwners(CompanyDBID: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { OwnerList: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetAllOwners", jObject, this.common_params.httpOptions);
  }

  validateInputCustomer(CompanyDBID: string, Customer: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer: Customer }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/ValidateCustomer", jObject, this.common_params.httpOptions);
  }

  GetCustomername(CompanyDBID: string, Customer: string): Observable<any> {
    //JSON Obeject Prepared to be send as a param to API
    let jObject = { Customer: JSON.stringify([{ CompanyDBID: CompanyDBID, Customer: Customer }]) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetCustomerName", jObject, this.common_params.httpOptions);
  }

  AddUpdateCustomerData(final_dataset_to_save): Observable<any> {
    var jObject = { GetData: JSON.stringify(final_dataset_to_save) };

    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/AddUpdateCustomerData", jObject, this.common_params.httpOptions);
  }
  GetDataByModelId(id): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, ModelId: id }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetDataByModelID", jObject, this.common_params.httpOptions);
  }

  getFinalBOMStatus(ilogID): Observable<any> {

    //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company, LogID: ilogID }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetFinalStatus", jObject, this.common_params.httpOptions);
  }

  getConfigurationList(): Observable<any> {
 //JSON Obeject Prepared to be send as a param to API
    let jObject = { GetData: JSON.stringify([{ CompanyDBID: this.logged_in_company }]) };
    //Return the response form the API  
    return this.httpclient.post(this.config_params.service_url + "/Wizard/GetConfigurationList", jObject, this.common_params.httpOptions);
  }

}
