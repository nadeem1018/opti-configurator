import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter,ElementRef,ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'ts-xlsx';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';

// import { ContentChild, AfterViewInit, ViewChild, ViewChildren, AfterViewChecked, ElementRef } from "@angular/core"

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
  @ViewChild("lookupsearch") _el: ElementRef;
  // input and output emitters
  @Input() serviceData: any;
  @Input() lookupfor: any;
  @Input() fillLookupArray: any;
  @Input() selectedImage: any
  @Output() lookupvalue = new EventEmitter();
  // @ViewChild(searchlookupfield, { read: ElementRef }) lookup_search: ElementRef;

  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  popup_title = this.language.title;
  constructor(private common_service: CommonService,private fms: FeaturemodelService,private toastr: ToastrService,private router: Router) { }
  
  

  // mandatory variables
  public dataBind: any = [];
  public columns: any = [];
  public showLoader: boolean = false;
  public LookupDataLoaded: boolean = false;
  public click_operation;
  public service_Data;
  // look up columns - thats needs to be shown 
  public fill_input_id = '';
  public item_code_columns;
  public model_template_item_columns;
  public table_head = [];
  public lookup_key = "";
  public width_value = '100%';
  public selectedFile: string = "";
  public xls_dataset;
  companyName: string;
  // intital Javascript object class 
  Object = Object;
  public preview_image = "";

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
    this.preview_image = '';
    this.dataBind = [];
    //this.test_model();
    console.log("this.lookupfor " + this.lookupfor);
   

    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
       this.model_template_lookup();
      }
      if (this.lookupfor == "model_item_generation") {
        this.model_item_generation_lookup();
      }

      if (this.lookupfor == "feature_lookup") {
        this.get_features_lookup();
      }

      if (this.lookupfor == "feature_Detail_lookup") {
        this.get_features_lookup();
      }

      if (this.lookupfor == "Item_Detail_lookup") {
        this.get_Item_lookup();
      }

      // open poup for import 
      if (this.lookupfor == "import_popup") {
        this.import_popup();
      }

      if (this.lookupfor == "ModelBom_lookup" || this.lookupfor == "ModelBom_Detail_lookup" ) {
        this.get_Model_lookup();
      }

      if (this.lookupfor == "large_image_view") {
        this.showImage();
      }
      if (this.lookupfor == "Price_lookup") {
        this.get_Price_lookup();
      }
      

      if (this.lookupfor == "tree_view_lookup"){
        this.showTreeView();
      }
    }
  }

 /*  ngAfterViewChecked() {
    
  } */
  
  log(val) {
    console.log(val);
  }

  on_item_select(lookup_key) {
    this.lookupvalue.emit(lookup_key);
    $("#lookup_modal").modal('hide');
  }

  model_template_lookup() {
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = ['Code', 'Name'];
    this.lookup_key = 'Name';

    this.width_value = ((100 / this.table_head.length) + '%');
   

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
   
  }

  model_item_generation_lookup() {
    this.popup_title = this.language.Model_Ref;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemCode';
    this.table_head = ['Code'];
    this.lookup_key = 'OPTM_CODE';
    this.width_value = ((100 / this.table_head.length) + '%');
   
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
    
   
  }

  get_features_lookup() {
    

    this.popup_title = this.language.Bom_FeatureId;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = ['Id', 'Code', 'Name'];
    this.width_value = ((100 / this.table_head.length) + '%');
    
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
   
  }

  close_lookup(lookup_id){
    this.log("lookup id - " + lookup_id);
    $("#" + lookup_id).modal('show');
  }

  get_Model_lookup() {
    

    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = ['Model Id', 'Code', 'Name'];
    this.width_value = ((100 / this.table_head.length) + '%');
    
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
    
  }

  get_Item_lookup() {
    

    this.popup_title = this.language.ItemLookupTitle;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'type_value';
    this.lookup_key = 'ItemKey';
    this.table_head = ['ItemKey', 'Name'];
    this.width_value = ((100 / this.table_head.length) + '%');
    
    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.log('this.serviceData');
    this.log(this.serviceData);
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
  
  }

  import_popup() {
    this.popup_title = this.language.import_features;
    this.showLoader = false;
    this.LookupDataLoaded = true;
    $("#import_modal").modal('show');
   
  }

  get_Price_lookup() {
    this.popup_title = this.language.price_source;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'price_source';
    this.lookup_key = 'PriceListID';
    this.table_head = ['Price Source'];
    this.width_value = ((100 / this.table_head.length) + '%');
    
    this.showLoader = false;
    this.LookupDataLoaded = true;
    if(this.serviceData !== undefined){
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }

  }

  
  file_input($event) {
 
  }

  importclick() {
    var xls_data = this.xls_dataset;

    if (this.lookupfor == 'import_popup') {

      this.fms.importData(this.companyName, xls_data).subscribe(
        data => {
          console.log("imported result"+ data);
          this.toastr.success('', data, this.commonData.toast_config);
            $("#import_modal").modal("hide");
        
          this.router.navigateByUrl('/feature/model/view');
          return;
        })
    }
  }

  showImage() {
    this.popup_title = this.language.feature_image;
    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.preview_image = this.selectedImage;
    this.showLoader = false;
    this.LookupDataLoaded = true;
  }

  public tree_data_json:any = '';
  @Input() component;

  showTreeView(){
    this.popup_title = this.language.explode;
    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.tree_data_json = this.dummy_json();
    this.showLoader = false;
    this.LookupDataLoaded = true;
    
  }

  check_component_exist(component, level){
    level = (parseInt(level) + 1);
    let data = this.tree_data_json.filter(function (obj) {
      return obj['parent'] == component && obj['level'] == level;
    });
    return data;
  }

  dummy_json(){
    return [
      { "sequence" : "1",    "component"  :  "F1",        "level"  : "0",    "parent": ""   },
      { "sequence" : "2",    "component"  :  "F2",        "level"  : "1",    "parent": "F1" },
      { "sequence" : "3",    "component"  :  "F3",        "level"  : "1",    "parent": "F1" },
      { "sequence" : "4",    "component"  :  "Item0001",  "level"  : "2",    "parent": "F2" },
      { "sequence" : "5",    "component"  :  "Item0002",  "level"  : "2",    "parent": "F2" },
      { "sequence" : "6",    "component"  :  "F4",        "level"  : "2",    "parent": "F3" },
      { "sequence" : "7",    "component"  :  "F5",        "level"  : "2",    "parent": "F3" },
      { "sequence" : "7",    "component"  :  "F6",        "level"  : "3",    "parent": "F4" },
      { "sequence" : "8",    "component"  :  "Item0003",  "level"  : "3",    "parent": "F5" },
      { "sequence" : "9",    "component"  :  "Item0004",  "level"  : "3",    "parent": "F5" },
      { "sequence" : "10",   "component"  :  "Item0005",  "level"  : "4",    "parent": "F6" },
      { "sequence" : "11",   "component"  :  "Item0006",  "level"  : "4",    "parent": "F6" },
      { "sequence" : "13",   "component"  :  "Item0002",  "level"  : "1",    "parent": "F1" },
      { "sequence" : "14",   "component"  :  "Item0011",  "level"  : "0",    "parent": ""   }
    ];
  }
}
