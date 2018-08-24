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
    this.test_model();
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
  

  test_model(){
    this.popup_title = 'Example Model';
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.lookup_key = 'name';
    this.table_head = ["ID", "Name", "Email ID", "Address"];
    this.serviceData = [
    { id: 1, name: 'Meenesh', email: 'Meenesh@batchmaster.com', address: 'Indore, India' },
    { id: 2, name: 'Neeraj', email: 'Neeraj@batchmaster.com', address: 'Indore, India' },
    { id: 3, name: 'Ashish', email: 'Ashish@batchmaster.com', address: 'Indore, India' },
    { id: 4, name: 'Kapil', email: 'Kapil@batchmaster.com', address: 'Indore, India' },
    { id: 5, name: 'Roba', email: 'Roba@batchmaster.com', address: 'Indore, India' },
    { id: 6, name: 'Akshay', email: 'Akshay@batchmaster.com', address: 'Indore, India' },
    { id: 7, name: 'Hamza', email: 'Hamza@batchmaster.com', address: 'Indore, India' },
    { id: 8, name: 'Kishan', email: 'Kishan@batchmaster.com', address: 'Indore, India' },
    { id: 9, name: 'Sagar', email: 'Sagar@batchmaster.com', address: 'Indore, India' },
    { id: 10, name: 'Satendra', email: 'Satendra@batchmaster.com', address: 'Indore, India' }
];
    console.log(this.serviceData)
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

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
    this.serviceData = [
      { ItemCode: 1, ItemName: 'Meenesh'  },
      { ItemCode: 2, ItemName: 'Neeraj'  },
      { ItemCode: 3, ItemName: 'Ashish'  },
      { ItemCode: 4, ItemName: 'Kapil'  },
      { ItemCode: 5, ItemName: 'Roba'  },
      { ItemCode: 6, ItemName: 'Akshay'  },
      { ItemCode: 7, ItemName: 'Hamza'  },
      { ItemCode: 8, ItemName: 'Kishan'  },
      { ItemCode: 9, ItemName: 'Sagar'  },
      { ItemCode: 10, ItemName: 'Satendra' }
    ];

    console.log(this.serviceData)
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  model_item_generation_lookup() {
    this.popup_title = this.language.Model_Ref;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemCode';
    this.table_head = ['Code', 'ItemName', 'ItemDescription'];
    this.lookup_key = 'email';
    this.serviceData = [
      { Code: 1, email: 'Meenesh@batchmaster.com', address: 'Indore, India' },
      { Code: 2, email: 'Neeraj@batchmaster.com', address: 'Indore, India' },
      { Code: 3, email: 'Ashish@batchmaster.com', address: 'Indore, India' },
      { Code: 4, email: 'Kapil@batchmaster.com', address: 'Indore, India' },
      { Code: 5, email: 'Roba@batchmaster.com', address: 'Indore, India' },
      { Code: 6, email: 'Akshay@batchmaster.com', address: 'Indore, India' },
      { Code: 7, email: 'Hamza@batchmaster.com', address: 'Indore, India' },
      { Code: 8, email: 'Kishan@batchmaster.com', address: 'Indore, India' },
      { Code: 9, email: 'Sagar@batchmaster.com', address: 'Indore, India' },
      { Code: 10, email: 'Satendra@batchmaster.com', address: 'Indore, India' }
    ];

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
