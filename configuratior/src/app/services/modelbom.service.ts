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

  post_data_with_file(input_file_obj: File, modelbom_data): Observable<any> {
    console.log(' in  post_data_with_file');
    let form_data: FormData = new FormData();
    form_data.append('file', input_file_obj, input_file_obj.name);
    let jObject = { file_data: form_data, ModelItem: JSON.stringify([{ CompanyDBID: this.logged_in_company, modelbom_data: modelbom_data }]) };
    return this.httpclient.post(this.config_params.service_url + "/ModelBOM/GetFeatureList", form_data, this.common_params.httpOptions);
  }
}
