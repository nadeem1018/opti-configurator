import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class ArchivingService {

  config_params: any;
  common_params = new CommonData();
  logged_in_company = sessionStorage.selectedComp;

  constructor(private httpclient: HttpClient) { 
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
  }

  get_all_model_list(): Observable<any> {
    let jObject = {
      ModelList: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), 
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/Archiving/ModelList", jObject, this.common_params.httpOptions);
  }

  filter_results(filter_data_obj): Observable<any> {
    let jObject = {
      FilteredData: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"), 
        UsernameForLic: sessionStorage.getItem("loggedInUser"),
        dateRange: filter_data_obj.from_date + ',' + filter_data_obj.to_date,
        fromDate: filter_data_obj.from_date,
        toDate: filter_data_obj.to_date,
        DocType: filter_data_obj.doc_type,
        orderStatus: 'P',
        configDesc: filter_data_obj.config_desc,
        modelId: (filter_data_obj.selected_models).join()
      }])
    };
    console.log("jObject ", jObject); 
    return this.httpclient.post(this.config_params.service_url + "/Archiving/FilterResult", jObject, this.common_params.httpOptions);
  }

  archive_data(filter_data_obj): Observable<any> {
    let jObject = {
      ArchiveDate: JSON.stringify([{
        CompanyDBID: sessionStorage.selectedComp,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser"),
        dateRange: filter_data_obj.from_date + ',' + filter_data_obj.to_date,
        fromDate: filter_data_obj.from_date,
        toDate: filter_data_obj.to_date,
        DocType: filter_data_obj.doc_type,
        orderStatus: 'P',
        configDesc: filter_data_obj.config_desc,
        modelId: (filter_data_obj.selected_models).join(),
        selectedRecords : '',
      }])
    };
    return this.httpclient.post(this.config_params.service_url + "/Archiving/ArchiveData", jObject, this.common_params.httpOptions);
  }
}
