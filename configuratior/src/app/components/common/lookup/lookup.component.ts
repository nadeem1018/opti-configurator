import { Component, OnInit, setTestabilityGetter, Input ,Output, EventEmitter} from '@angular/core';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {

  @Input() serviceData: any; 
  @Input() lookupfor: any; 
  @Output() messageEvent = new EventEmitter<string>();
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  popup_title = this.language.title;
  @Input() fillLookupArray: any;
  constructor(private common_service: CommonService) { }
  

  // mandatory variables
  public dataBind: any = [];
  public columns: any = [];
  public showLoader: boolean = false;
  public LookupDataLoaded:boolean = false;
  public click_operation;
  public service_Data;
  // look up columns - thats needs to be shown 
  public  fill_input_id = ''; 
  public item_code_columns;
  public model_template_item_columns;
  public table_head = [];
  public lookup_key = "";

  Object = Object;

  ngOnInit() {  }
  
  ngOnChanges(): void {

    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.lookup_key = '';
    this.item_code_columns = [];
    this.model_template_item_columns = [];
    this.fill_input_id = ''; 

    console.log("ngOnChanges lookup - " + this.lookupfor);
    this.dataBind = [];
    //this.test_model();
    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
        this.model_template_lookup();
      }
      if (this.lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
      }
    }
  }

  log(val) { console.log(val); }

  on_item_select(lookup_key){
     (<HTMLInputElement>document.getElementById(this.fill_input_id)).value = lookup_key;
  }

  model_template_lookup() {
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = ['ItemCode', 'ItemName'];
    this.lookup_key = 'ItemName';
   
    console.log(this.serviceData)
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  model_item_generation_lookup() {
    this.popup_title = this.language.Model_Ref;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemCode';
    this.table_head = ['Code'];
    this.lookup_key = 'OPTM_CODE';
   
    console.log(this.serviceData)
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }


 /*  model_template_lookup(){
    this.popup_title = this.language.model_template;
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
      } */

 /*  model_item_generation_lookup(){
    this.click_operation  = 'model_item_generation';
    this.model_template_item_columns = ['Code'];
    this.showLoader = true;
    this.dataBind = [];

  
    // this.service_Data = this.common_service.templatelookupData;
    console.log(this.serviceData);
    
    this.dataBind = JSON.stringify(this.serviceData, this.model_template_item_columns);
    this.dataBind = JSON.parse(this.dataBind);
    console.log( this.dataBind);
    this.showLoader = false;
    this.LookupDataLoaded = true;
  } */

  onRowBtnClick(evt, rowIndex) {  
    
    console.log('in row select ');
    this.common_service.ShareData({ value: this.serviceData[rowIndex], from: this.click_operation });
   
   
  }

}
