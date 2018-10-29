import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import * as XLSX from 'ts-xlsx';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { ModelbomService } from '../../../services/modelbom.service';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';
// import { Http, ResponseContentType } from '@angular/http';

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
  @Input() ruleselected: any;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  // @ViewChild(searchlookupfield, { read: ElementRef }) lookup_search: ElementRef;

  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  popup_title = this.language.title;
  constructor(private common_service: CommonService, private fms: FeaturemodelService, private toastr: ToastrService, private router: Router, private mbom: ModelbomService,) { }
  public table_head_hidden_elements = [];


  // mandatory variables
  public dataBind: any = [];
  public columns: any = [];
  public checked_rules = [];
  public showLoader: boolean = false;
  public showruleOutputLoader: boolean = false;
  
  public LookupDataLoaded: boolean = false;
  public RuleOutputLookupDataLoaded: boolean = false;
  public click_operation;
  public service_Data;
  // look up columns - thats needs to be shown 
  public fill_input_id = '';
  public item_code_columns;
  public model_template_item_columns;
  public table_head = [];
  public rule_output_table_head=[];
  public rule_output_table_head_hidden_elements=[];
  public lookup_key = "";
  public width_value = '100%';
  public selectedFile: any = "";
  public xls_dataset;
  public outputServiceData:any = [];
  companyName: string;
  // intital Javascript object class 
  Object = Object;
  public preview_image = "";
  public isRuleChecked = false;
  username: string;
  public fileType = "";
  public template_path = "";
 
  ngOnInit() {
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.template_path = this.commonData.application_path + "/assets/data/json/FeatureMaster.xlsx";
  }

  ngOnChanges(): void {

    this.showLoader = true;
    this.LookupDataLoaded = false;
    this.showruleOutputLoader = true;
    this.RuleOutputLookupDataLoaded = false;
    this.lookup_key = '';
    this.item_code_columns = [];
    this.model_template_item_columns = [];
    this.fill_input_id = '';
    this.preview_image = '';
    this.dataBind = [];
    this.outputServiceData = [];
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

      if (this.lookupfor == "ModelBom_lookup" || this.lookupfor == "ModelBom_Detail_lookup") {
        this.get_Model_lookup();
      }

      if (this.lookupfor == "large_image_view") {
        this.showImage();
      }
      if (this.lookupfor == "Price_lookup") {
        this.get_Price_lookup();
      }
      if (this.lookupfor == "rule_section_lookup") {
        this.ruleSelection();
      }

      // if (this.lookupfor == "tree_view_lookup"){
      //   this.showTreeView();
      // }

      if (this.lookupfor == "tree_view__model_bom_lookup") {
        this.showModelBOMTreeView();
      }

      if (this.lookupfor == "associated_BOM") {
        this.showAssociatedBOMs();
      }
      if (this.lookupfor == "feature_Detail_Output_lookup") {
        this.get_features_Output_lookup();
      }

      if (this.lookupfor == "output_customer") {
        this.customer_lookup();
      }

      if(this.lookupfor == "operand_feature_lookup"){
        this.get_features_lookup();
      }
      
      if (this.lookupfor == "operand_model_lookup") {
        this.get_Model_lookup();
      }

      if (this.lookupfor == "configure_list_lookup"){
        this.configure_list_lookup();
      }
      if (this.lookupfor == "ModelBomForWizard_lookup") {
        this.get_ModelWizard_lookup();
      }

       if (this.lookupfor == "output_invoice_print") {
         this.output_invoice_print();
      }
    }
  }

  /*  ngAfterViewChecked() {
     
   } */

  log(val) {
    console.log(val);
  }

  on_item_select(lookup_key) {
    console.log("lookup_key - " + lookup_key);
    console.log(lookup_key);

    this.lookupvalue.emit(lookup_key);
    $("#lookup_modal").modal('hide');
  }

  configure_list_lookup(){
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'modify_duplicate_lookup';
    this.table_head = ['LogID','Description' ,'Customer','Contact Person','FGItem','Quantity'];
    //this.table_head_hidden_elements = [false, false];
    this.lookup_key = 'OPTM_DESC';

    this.width_value = ((100 / this.table_head.length) + '%');


    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
  }

  model_template_lookup() {
    this.popup_title = this.language.model_template;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureItemName';
    this.table_head = ['Code', 'Name'];
    this.table_head_hidden_elements = [false, false];
    this.lookup_key = 'Name';

    this.width_value = ((100 / this.table_head.length) + '%');


    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
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
    this.table_head_hidden_elements = [false];
    this.lookup_key = 'OPTM_CODE';
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
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
    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }

  }

  close_lookup(lookup_id) {
    this.log("lookup id - " + lookup_id);
    $("#" + lookup_id).modal('hide');
  }

  get_Model_lookup() {


    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = ['Model Id', 'Code', 'Name'];
    this.table_head_hidden_elements = [true, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }

  }

  get_ModelWizard_lookup() {


    this.popup_title = this.language.ModelBom;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = ['Model Id', 'Code', 'Name','TemplateId','ItemCodeGenkey'];
    this.table_head_hidden_elements = [true, false, false,true,true];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
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
    this.table_head_hidden_elements = [false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.log('this.serviceData');
    this.log(this.serviceData);
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }

  }

  import_popup() {
    this.popup_title = this.language.import_features;
    this.showLoader = false;
    this.LookupDataLoaded = true;
    this.fileType = "excel";
    $("#import_modal").modal('show');

  }

  get_Price_lookup() {
    this.popup_title = this.language.price_source;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'price_source';
    this.lookup_key = 'PriceListID';
    this.table_head = ['Price Source'];
    this.table_head_hidden_elements = [false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }
  }

  get_features_Output_lookup() {


    this.popup_title = this.language.Bom_FeatureId;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.fill_input_id = 'featureNameId';
    this.lookup_key = 'OPTM_FEATUREID';
    this.table_head = ['Id', 'Code', 'Name', 'Accesory'];
    this.table_head_hidden_elements = [true, false, false, true];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        $("#lookup_modal").modal('show');
      }
    }

  }

  ruleSelection() {
    this.popup_title = this.language.rule_selection;
    this.LookupDataLoaded = false;
    this.showLoader = true;
    this.lookup_key = 'code';
    this.table_head = ['Select', 'Rule', 'Description'];
    this.table_head_hidden_elements = [false, false, false];
    this.width_value = ((100 / this.table_head.length) + '%');

    this.showLoader = false;
    this.LookupDataLoaded = true;
    if (this.serviceData !== undefined) {
      if (this.serviceData.length > 0) {
        this.checked_rules = [];
        //console.log(this.serviceData);
        for (var i = 0; i < this.serviceData.length; i++) {
          if (this.serviceData[i].Selected == "Y") {
            this.serviceData[i].Selected = true;
            this.checked_rules.push(this.serviceData[i]);
          }
          else {
            this.serviceData[i].Selected = false;
          }

        }

        $("#rule_selection").modal('show');
      }
    }
  }

  get_rule_output( rule_id,  seq_id){
    console.log("  rule_id " +  rule_id);
    console.log("  seq_id " +  seq_id);
    this.showruleOutputLoader = true;
    this.RuleOutputLookupDataLoaded = false;
    this.rule_output_table_head = ['#', 'feature', 'Description'];
    this.rule_output_table_head_hidden_elements = [false, false, false];
    $("#rule_output_table_lookup").modal('show');
    // $("#rule_selection").css("opacity", "0");
     $(".modal-backdrop:first").addClass("z-index_1050");
    this.outputServiceData = [
      {"id":"2","key":"123","value":"test 1"},
      {"id":"2","key":"431","value":"test 2"},
      {"id":"4","key":"555","value":"test 3"},
    ];

  let obj = this;
    this.mbom.getRuleOutput(rule_id, seq_id).subscribe(
        data => {
          console.log(data);
          if (data !== '' && data !== undefined && data !== null) {
            obj.outputServiceData = data
          // this.close_lookup();
        } else {
          this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
          // this.close_lookup();
        }
        
        //$(".modal-backdrop").hasClass("show").removeClass("show").addClass('hide');
       })
    
    this.showruleOutputLoader = false;
    this.RuleOutputLookupDataLoaded = true;

  }
  close_rule_model(id){
    $("#rule_output_table_lookup").modal('hide');
    $(".modal-backdrop:first").removeClass("z-index_1050");
   // $("#rule_selection").css("opacity", "1");
  }


  on_checkbox_checked(checkedvalue, row_data) {
    console.log("checkedvalue " + checkedvalue);
    console.log(row_data);

    if (checkedvalue == true) {
      row_data.Selected = true;
      this.checked_rules.push(row_data);
    }
    else {
      let i = this.checked_rules.indexOf(row_data);
      row_data.Selected = false;
      this.checked_rules.splice(i, 1)
    }
    console.log(this.checked_rules);

  }

  rule_select_ok() {
    this.lookupvalue.emit(this.checked_rules);
    $("#rule_selection").modal('hide');
  }

  file_input($event) {
    var obj = this;
    var proceed = true;
    this.selectedFile = $event.target.files[0];
    let file_name_array = this.selectedFile.name.split(".");
    var index = file_name_array.length - 1;
    var file_extension = file_name_array[index];
    if(this.fileType == "excel" && (file_extension == "xlsx" || file_extension == "xls")){
      proceed = true;
    }
    else if(this.fileType == "csv" && file_extension == "csv"){
      proceed = true;
     }
     else{
      this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
      this.selectedFile = "";
      this.reset();
      return;
     }
    var reader = new FileReader();
    var XLS_DATA = '';
    reader.onload = function (loadEvent) {
        // @ts-ignore: Unreachable code error
      var data = loadEvent.target.result;
      var workbook = XLSX.read(data, { type: 'binary' });
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
         // @ts-ignore: Unreachable code error
        XLS_DATA = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        obj.xls_dataset = XLS_DATA;
      })

    }
    reader.readAsBinaryString($event.target.files[0]);
  }

  importclick() {
    console.log(this.selectedFile);
    if (this.selectedFile == "" || this.selectedFile == null){
      this.toastr.error('', this.language.nofileattach, this.commonData.toast_config);
      return;
    }

    var xls_data = this.xls_dataset;
    var objData:any = {}
    objData.ExcelData = [];
    objData.Common = [];
    objData.ExcelData = xls_data;
    objData.Common.push({
      CompanyDBId: this.companyName,
      CreatedUser: this.username
    }); 

      this.fms.importData(objData).subscribe(
        data => {
          console.log(data);
          if (data !== '' && data !== undefined && data !== null) {
          this.toastr.warning('', data, this.commonData.toast_config);
          // this.close_lookup();
        } else {
          this.toastr.error('', this.language.incorrectfile, this.commonData.toast_config);
          // this.close_lookup();
        }
        $("#import_modal").modal('hide');
        //$(".modal-backdrop").hasClass("show").removeClass("show").addClass('hide');
       })
  
}

showImage() {
  this.popup_title = this.language.feature_image;
  this.showLoader = true;
  this.LookupDataLoaded = false;
  this.preview_image = this.selectedImage;
  this.showLoader = false;
  this.LookupDataLoaded = true;
}

  output_invoice_print(){
    this.popup_title = 'Print Quote';
    $("#invoice_modal").modal('show');
   
  }

  public tree_data_json: any = '';
@Input() component;

// showTreeView(){
//   this.popup_title = this.language.explode;
//   this.showLoader = true;
//   this.LookupDataLoaded = false;
//   //this.tree_data_json = this.dummy_json();
//   this.showLoader = false;
//   this.LookupDataLoaded = true;
//   if(this.serviceData !== undefined){
//     if (this.serviceData.length > 0) {
//       //this.tree_data_json =  this.dummy_json();
//       this.tree_data_json =this.serviceData;
//         $("#tree_view").modal('show');
//     }
//   }

// }


//To show all associated BOM
showAssociatedBOMs() {

  this.popup_title = this.language.associated_BOM;
  this.LookupDataLoaded = false;
  this.showLoader = true;


  this.table_head = ['Model Id', 'Model Name', 'Model Description'];
  this.table_head_hidden_elements = [true, false, false];
  this.width_value = ((100 / this.table_head.length) + '%');

  this.showLoader = false;
  this.LookupDataLoaded = true;
  if (this.serviceData !== undefined) {
    if (this.serviceData.length > 0) {
      $("#simple_table_modal").modal('show');
    }
  }

}

showModelBOMTreeView() {
  this.popup_title = this.language.explode;
  this.showLoader = true;
  this.LookupDataLoaded = false;
  //this.tree_data_json = this.dummy_json();
  this.showLoader = false;
  this.LookupDataLoaded = true;
  if (this.serviceData !== undefined) {
    if (this.serviceData.length > 0) {
      // this.tree_data_json =  this.dummy_json();
      this.tree_data_json = this.serviceData;

      // setTimeout(function(){
      $("#tree_view").modal('show');
      //}, 5000);
    }
  }

}

customer_lookup() {
  this.popup_title = this.language.model_template;
  this.LookupDataLoaded = false;
  this.showLoader = true;
  this.fill_input_id = 'featureItemName';
  this.table_head = ['Customer Code', 'Name'];
  this.table_head_hidden_elements = [false, false];
  this.lookup_key = 'Name';

  this.width_value = ((100 / this.table_head.length) + '%');


  this.showLoader = false;
  this.LookupDataLoaded = true;
  if (this.serviceData !== undefined) {
    if (this.serviceData.length > 0) {
      $("#lookup_modal").modal('show');
    }
  }

}

reset() {
  this.myInputVariable.nativeElement.value = "";
}

/*downloadFile() {
  return this.http
    .get('https://jslim.net/path/to/file/download', {
      responseType: ResponseContentType.Blob
    })
    .map(res => {
      return {
        filename: 'filename.pdf',
        data: res.blob()
      };
    })
    .subscribe(res => {
        console.log('start download:',res);
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });
}*/

// dummy_json(){
//   return [
//     { "sequence" : "1",    "component"  :  "F1",        "level"  : "0",    "parent": ""   },
//     { "sequence" : "2",    "component"  :  "F2",        "level"  : "1",    "parent": "F1" },
//     { "sequence" : "3",    "component"  :  "F3",        "level"  : "1",    "parent": "F1" },
//     { "sequence" : "4",    "component"  :  "Item0001",  "level"  : "2",    "parent": "F2" },
//     { "sequence" : "5",    "component"  :  "Item0002",  "level"  : "2",    "parent": "F2" },
//     { "sequence" : "6",    "component"  :  "F4",        "level"  : "2",    "parent": "F3" },
//     { "sequence" : "7",    "component"  :  "F5",        "level"  : "2",    "parent": "F3" },
//     { "sequence" : "7",    "component"  :  "F6",        "level"  : "3",    "parent": "F4" },
//     { "sequence" : "8",    "component"  :  "Item0003",  "level"  : "3",    "parent": "F5" },
//     { "sequence" : "9",    "component"  :  "Item0004",  "level"  : "3",    "parent": "F5" },
//     { "sequence" : "10",   "component"  :  "Item0005",  "level"  : "4",    "parent": "F6" },
//     { "sequence" : "11",   "component"  :  "Item0006",  "level"  : "4",    "parent": "F6" },
//     { "sequence" : "13",   "component"  :  "Item0002",  "level"  : "1",    "parent": "F1" },
//     { "sequence" : "14",   "component"  :  "Item0011",  "level"  : "0",    "parent": ""   }
//   ];
// }

dummy_json() {
  return [
    { "sequence": 1, "parentId": "", "component": "29", "level": "0" },
    { "sequence": 2, "parentId": "29", "component": "19", "level": "1" },
    { "sequence": 3, "parentId": "29", "component": "8", "level": "1" },
    { "sequence": 4, "parentId": "29", "component": "Wind Sensor", "level": "1" },
    { "sequence": 5, "parentId": "29", "component": "WMT70BIRDKIT", "level": "1" },
    { "sequence": 6, "parentId": "19", "component": "21", "level": "2" },
    { "sequence": 7, "parentId": "19", "component": "20", "level": "2" },
    { "sequence": 8, "parentId": "8", "component": "Item02", "level": "2" },
    { "sequence": 9, "parentId": "8", "component": "VALUE", "level": "2" },
    { "sequence": 10, "parentId": "19", "component": "Wind Sensor", "level": "2" },
    { "sequence": 11, "parentId": "20", "component": "22", "level": "3" },
    { "sequence": 12, "parentId": "20", "component": "21", "level": "3" },
    { "sequence": 13, "parentId": "22", "component": "26", "level": "4" },
    { "sequence": 14, "parentId": "22", "component": "23", "level": "4" },

    //    {"sequence":15,"parentId":"23","component":"19","level":"5"},
    { "sequence": 16, "parentId": "19", "component": "21", "level": "6" },
    { "sequence": 17, "parentId": "19", "component": "20", "level": "6" },
    { "sequence": 18, "parentId": "19", "component": "Wind Sensor", "level": "6" },

  ]
}
}
