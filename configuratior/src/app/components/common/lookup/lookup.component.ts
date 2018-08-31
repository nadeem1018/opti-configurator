import { Component, OnInit, setTestabilityGetter, Input ,Output, EventEmitter} from '@angular/core';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'ts-xlsx';
import { FeaturemodelService } from '../../../services/featuremodel.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  // input and output emitters
  @Input() serviceData: any; 
  @Input() lookupfor: any; 
  @Input() fillLookupArray: any;
  @Output() lookupvalue = new EventEmitter();

  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  popup_title = this.language.title;
  constructor(private common_service: CommonService,private fms: FeaturemodelService) { }
  

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
  public selectedFile:string="";
  public xls_dataset;
  companyName: string ;
  // intital Javascript object class 
  Object = Object;

  ngOnInit() {  
    this.companyName = sessionStorage.getItem('selectedComp');
  }
  
  ngOnChanges(): void {
 
    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.lookup_key = '';
    this.item_code_columns = [];
    this.model_template_item_columns = [];
    this.fill_input_id = ''; 
    
    this.dataBind = [];
    //this.test_model();
    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
        this.model_template_lookup();
      }
      if (this.lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
      }

      if (this.lookupfor == "feature_lookup"){
        this.get_features_lookup();
      }

      // open poup for import 
      if (this.lookupfor == "import_popup"){
        this.import_popup();
      }
    }
  }

  log(val) { 
    console.log(val); 
  }

  on_item_select(lookup_key){
    this.lookupvalue.emit(lookup_key);
  }

  model_template_lookup() {
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = ['ItemCode', 'ItemName'];
    this.lookup_key = 'ItemName';
   
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  model_item_generation_lookup() {
    console.log(this.serviceData);
    this.popup_title = this.language.Model_Ref;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemCode';
    this.table_head = ['Code'];
    this.lookup_key = 'OPTM_CODE';
  
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  get_features_lookup(){
    console.log('in lookup');

    this.popup_title = this.language.Bom_title;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATURECODE';
    this.table_head = ['Code', 'Name'];
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  import_popup(){
    this.popup_title = this.language.import_features;
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }
  file_input($event) {
    var obj = this;
    this.selectedFile = $event.target.files[0];
    var reader = new FileReader();
    var XLS_DATA = '';
    reader.onload = function ( loadEvent ) {
      var data = loadEvent.target.result; 
        var workbook = XLSX.read(data, { type: 'binary' });  
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          XLS_DATA = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          obj.xls_dataset = XLS_DATA;
        })
    
      }
    reader.readAsBinaryString($event.target.files[0]);
  }  

  importclick() {
    var xls_data = this.xls_dataset;
    
    if(this.lookupfor == 'import_popup'){
      
      this.fms.importData(this.companyName, xls_data).subscribe(
        data => {
        })
    } 

  }
}
