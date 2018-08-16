import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  constructor(private common_service: CommonService) { }
  

  // mandatory variables
  public dataBind: any = [];
  public columns: any = [];
  public showLoader: boolean = false;
  public LookupDataLoaded:boolean = false;
  public click_operation;
  public service_Data;

  // look up columns - thats needs to be shown 
   
  public item_code_columns;
  public model_template_item_columns;

  ngOnInit() {
    this.showLoader = true;
  }

  model_template_lookup(){
    this.click_operation  = 'model_template';
    this.model_template_item_columns = ['', '', ''];
    this.showLoader = true;
    this.dataBind = [];

    // service call 
    this.service_Data = this.common_service.templatelookupData;

    this.dataBind = JSON.stringify(this.service_Data, this.model_template_item_columns);
    this.dataBind = JSON.parse(this.dataBind);
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  onRowBtnClick(evt, rowIndex) {
    this.common_service.ShareData({ value: this.service_Data[rowIndex], from: this.click_operation });
  }


}
