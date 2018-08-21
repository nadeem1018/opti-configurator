import { Component, OnInit, Input ,Output, EventEmitter} from '@angular/core';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {

  @Input() serviceData: any; 
  @Input() lookupfor: any; 
  @Input() fillLookupArray: any;
  @Output() messageEvent = new EventEmitter<string>();
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

  ngOnInit() {  }
  
  ngOnChanges(): void {

    this.showLoader = true;
    this.LookupDataLoaded = false;

    this.item_code_columns = [];
    this.model_template_item_columns = [];

    console.log("ngOnChanges lookup - " + this.lookupfor);
    this.dataBind = [];

    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
        this.model_template_lookup();
      }
      if (this.lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
      }
    }
    
  }

  model_template_lookup(){
    this.click_operation  = 'model_template';
    this.model_template_item_columns = ['ItemCode', 'ItemName'];
    this.showLoader = true;
    this.dataBind = [];
    // service call 
    // this.service_Data = this.common_service.templatelookupData;
    console.log(this.serviceData);
    
    this.dataBind = JSON.stringify(this.serviceData, this.model_template_item_columns);
    this.dataBind = JSON.parse(this.dataBind);
    console.log( this.dataBind);
    this.showLoader = false;
    this.LookupDataLoaded = true;
      }
  model_item_generation_lookup(){
    this.click_operation  = 'model_item_generation';
    this.model_template_item_columns = ['Code'];
    this.showLoader = true;
    this.dataBind = [];

    // service call 
    // this.service_Data = this.common_service.templatelookupData;
    console.log(this.serviceData);
    
    this.dataBind = JSON.stringify(this.serviceData, this.model_template_item_columns);
    this.dataBind = JSON.parse(this.dataBind);
    console.log( this.dataBind);
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  onRowBtnClick(evt, rowIndex) {  
    
    console.log('in row select ');
    this.common_service.ShareData({ value: this.serviceData[rowIndex], from: this.click_operation });
   
   
  }

}
