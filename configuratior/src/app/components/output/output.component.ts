import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationStyleMetadata } from '../../../../node_modules/@angular/animations';
import * as $ from 'jquery';
import { JitSummaryResolver } from '../../../../node_modules/@angular/compiler';
import { UIHelper } from '../../helpers/ui.helpers';
import { isNumber } from 'util';
import { NullInjector } from '../../../../node_modules/@angular/core/src/di/injector';
import { CommonService } from '../../services/common.service';
import { serializePaths } from '@angular/router/src/url_tree';


@Component({
  //providers:[LookupComponent],
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  public selectedImage = "";
  @ViewChild("modelcode") _el: ElementRef;
  @ViewChild("refresh_button") _refresh_el: ElementRef;
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modify_duplicate_selected: boolean = false;
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public step1_data: any = [];
  public stepp_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public FeatureChildData = [];
  public feature_itm_list_table = [];
  public accessory_itm_list_table = [];
  public feature_itm_list_temp_table = [];
  public parentfeatureid: string = "";
  public feature_discount_percent: number = 0;
  public accessory_discount_percent: number = 0;
  public step2_final_dataset_to_save = [];
  public tree_accessory_json = [];
  public Accessoryarray = [];
  public ModelHeaderItemsArray = [];
  public warehouse: string = "";
  public currentDate = new Date();
  public submit_date;
  public showLookupLoader: boolean = false;
  public step2_selected_model:any = '';
  public step2_selected_model_id : any = '';
  public step4_final_prod_total: any = 0;
  public step4_final_acc_total: any = 0;
  public step4_final_grand_total:any =0;
  public step4_final_DetailModelData=[];
  //Outputlog
  public prod_discount_log:any = 0;
  public access_dis_amount_log:any = 0;
  //public step2_data_all_data={};

  // public router_link_new_config = "";

  public defaultCurrency = sessionStorage.defaultCurrency;
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.extension];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension, "", "", "delete"];
  public step3_data_final_hidden_elements = [false, false, false, false, false, false, true, true, false, false];
  public step4_data_final_hidden_elements = [false, false, false, false, false, false, true, true, true];
  public feature_total_before_discount = 0;
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public step3_feature_price_bef_dis: number = 0
  public step3_acc_price_bef_dis: number = 0
  public acc_item_tax: number = 0
  public bycheckboxpress: number = 0;
  public acc_total: number = 0
  public accessory_item_tax: number = 0;
  public accessory_item_total: number = 0;
  public acc_grand_total: number = 0;
  public isModelVisible: boolean = false;
  public selecteddataforelement: any;
  public final_document_number: any = '';
  public selectfeaturedata = [];
  public modelitemflag: number = 0;
  public final_array_checked_options = [];
  public navigatenextbtn: boolean = false;
  public validnextbtn: boolean = true;
  public showPrintOptions: boolean = false;
  public previousquantity: any = parseFloat("1").toFixed(3);
  public feature_tax_total = [
    { "key": this.language.tax, "value": this.feature_item_tax },
    { "key": this.language.total, "value": this.feature_item_total },
  ];
  public item_tax_total = [
    { "key": this.language.product_tax, "value": this.acc_item_tax },
    { "key": this.language.product_total, "value": this.acc_total },
    { "key": this.language.accessories_discount, "value": this.acc_item_tax },
    { "key": this.language.accessories_tax, "value": this.acc_item_tax },
    { "key": this.language.accessories_total, "value": this.acc_total },
    { "key": this.language.grand_total, "value": this.acc_grand_total }
  ];
  //
  public new_item_list = [];
  /* public refresh_button_text = '<i class="fa fa-refresh fa-fw"></i> ' + this.language.refresh; */
  public showFinalLoader: boolean = true;
  public dontShowFinalLoader: boolean = false;
  public Accessory_table_hidden_elements = [false, false, false, true, true, true, true];
  public order_creation_table_head = [this.language.hash, 'SI#', this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.extension];
  feature_child_data: any = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService, private elementRef: ElementRef, private cdref: ChangeDetectorRef,private CommonService: CommonService) { }
  serviceData: any;
  public new_output_config: boolean = false;
  public contact_persons: any = [];
  public sales_employee: any = [];
  public ship_to: any = [];
  public bill_to: any = [];
  public ship_data: any = [];
  public bill_data: any = [];
  public owner_list: any = [];
  public customerBillTo: any;
  public document: any;
  public customerShipTo: any;
  public isNextButtonVisible: boolean = false;
  public person: any;
  public salesemployee: any;
  public step3_data_final = [];
  public document_date = '';
  public iLogID: any = '';
  public CheckedData: any = [];
  public selectallRows: boolean = false;
  public isMultiDelete: boolean = false;
  rows: any = "";
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public final_row_data: any;
  public final_order_status = this.language.new;
  public final_order_status_class = "text-primary";
  public final_reference_number = "";
  public final_ref_doc_entry = "";
  public ModelHeaderData = [];
  public ModelBOMDataForSecondLevel = [];
  public FeatureBOMDataForSecondLevel = [];
  public globalConfigId: any = '';
  public description: any;
  public step0_isNextButtonVisible: boolean = false;
  public setModelDataFlag: boolean = false;
  public defaultitemflagid: any;
  public ModelInModelArray: any = [];
  public ModelLookupFlag = false
  public cDate = new Date();


  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public min;
  detectDevice() {
    let getDevice = UIHelper.isDevice();
    this.isMobile = getDevice[0];
    this.isIpad = getDevice[1];
    this.isDesktop = getDevice[2];
    if (this.isMobile == true) {
      this.isPerfectSCrollBar = true;
    } else if (this.isIpad == true) {
      this.isPerfectSCrollBar = false;
    } else {
      this.isPerfectSCrollBar = false;
    }
  }

  ngOnInit() {
    
    //  this.router_link_new_config = "/output/view/" + Math.round(Math.random() * 10000);
    //this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    const element = document.getElementsByTagName('body')[0];
    element.className = '';
    this.detectDevice();
    element.classList.add('sidebar-toggled');
    let d = new Date();
    this.min = new Date(d.setDate(d.getDate() - 1));
    this.submit_date = (this.currentDate.getFullYear()) + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate()
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    // this.step1_data.document = "sales_quote";
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else if (this.step1_data.document == "sales_order") {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
    else {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.draft;
    }

    this.feature_accessory_list = []
    this.step2_data.quantity = parseFloat("1");
    this._el.nativeElement.focus();
    var todaysDate = new Date();
    //var mindate =new Date(todaysDate) ;


    this.isNextButtonVisible = false;

    // dummy data for 3rd screen 
    // this.step3_data_final = [
    //   {
    //     "rowIndex": "1", "sl_no": "1", "item": "Model 1", "quantity": "10", "price": "2000", "price_ext": "20", "rowIndexBtn": "1","model_id": this.step2_data.model_id,
    //     "feature": [{
    //       "feature_name": "Feature001",
    //       "item": "item001",
    //       "item_desc": "itemdesc001",
    //       "quantity": 100,
    //       "price": 2000,
    //       "price_ext": 20,
    //       "feature_accessories": "FEATUREACCESS001"
    //     }],
    //     "accessories": [{
    //       "code": "ACCES001",
    //       "name": "ACCESSNAME001"
    //     }]
    //   }
    // ];

    // dummy data for 2nd screen 
    this.tree_data_json = [
      // { "sequence": "1", "component": "F1", "level": "0", "parentId": "", "element_type": "radio" },
      // { "sequence": "2", "component": "F2", "level": "1", "parentId": "F1", "element_type": "radio" },
      // { "sequence": "3", "component": "F3", "level": "1", "parentId": "F1", "element_type": "radio" },
      // { "sequence": "4", "component": "Item0001", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      // { "sequence": "5", "component": "Item0002", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      // { "sequence": "6", "component": "F4", "level": "2", "parentId": "F3", "element_type": "radio" },
      // { "sequence": "7", "component": "F5", "level": "2", "parentId": "F3", "element_type": "radio" },
      // { "sequence": "7", "component": "F6", "level": "3", "parentId": "F4", "element_type": "radio" },
      // { "sequence": "8", "component": "Item0003", "level": "3", "parentId": "F5", "element_type": "radio" },
      // { "sequence": "9", "component": "Item0004", "level": "3", "parentId": "F5", "element_type": "radio" },
      // { "sequence": "10", "component": "Item0005", "level": "4", "parentId": "F6", "element_type": "radio" },
      // { "sequence": "11", "component": "Item0006", "level": "4", "parentId": "F6", "element_type": "radio" },
      // { "sequence": "13", "component": "Item0002", "level": "1", "parentId": "F1", "element_type": "checkbox" },
      // { "sequence": "14", "component": "Item0011", "level": "0", "parentId": "", "element_type": "checkbox" }
    ];

    // initialize jquery 
    /* setTimeout(() => {
      this.tree_view_expand_collapse()
    }, 2000); */

  }

  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  start_new_configuration_click() {
    this.clear_all_screen_data()
    this.onOperationChange('');
    $("fieldset").hide();
    $("fieldset:first").show();
  }

  clear_all_screen_data() {
    this.final_order_status = "";
    this.final_document_number = "";
    this.final_ref_doc_entry = "";
    this.iLogID = "";
    this.new_item_list = [];
    this.onclearselection(1)
    this.delete_all_row_data();
    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;

  }

  onOperationChange(operation_type) {
    this.step1_data = [];
    this.iLogID = '';
    let cDate = new Date();
    this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    this.contact_persons = [];
    this.ship_to = [];
    this.bill_to = [];
    this.sales_employee = [];
    this.owner_list = [];
    this.step1_data.selected_configuration_key = "";
    this.step1_data.description = "";
    this.new_output_config = false;
    this.modify_duplicate_selected = false;
    this.step3_data_final = [];
    this.onclearselection(1);
    if (operation_type == 2 || operation_type == 3 || operation_type == 4) {
      this.modify_duplicate_selected = true;
      this.new_output_config = true;
      this.step0_isNextButtonVisible = true;
    } else {
      if (operation_type == "") {
        this.new_output_config = false;
        this.step0_isNextButtonVisible = false;
      } else {
        this.new_output_config = true;
        this.step0_isNextButtonVisible = true;
        this.step1_data.document = 'draft';
        this.step1_data.document_name = this.language.draft;
        this.isNextButtonVisible = true;
      }

      this.modify_duplicate_selected = false;
    }
    this.step1_data.main_operation_type = operation_type;
  }

  on_configuration_id_change(value) {
    this.globalConfigId = value;
  }

  onStep0NextPress() {
    console.log(this.step1_data.main_operation_type);

    this.CommonService.GetServerDate().subscribe(
      data => {
        if (data.length > 0) {
          if(data[0].DATEANDTIME != null){
            let server_date_time = new Date(data[0].DATEANDTIME);
            this.step1_data.posting_date = (server_date_time.getMonth() + 1) + "/" + server_date_time.getDate() + "/" + server_date_time.getFullYear();
          }
        }
        else {
          this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
          this.toastr.error('', this.language.ServerDateError, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
        this.showLookupLoader = false;
      }
    )
    
    if (this.step1_data.main_operation_type == 1) {
      console.log(this.step1_data.description);
      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
      this.setModelDataFlag = false;
      this.onclearselection(1);

    }
    if (this.step1_data.main_operation_type == 2 || this.step1_data.main_operation_type == 3) {
      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
      if (this.step1_data.selected_configuration_key == "") {
        this.toastr.error('', this.language.select_configuration, this.commonData.toast_config);
        return;
      }
    }
    $("#step0_next_click_id").trigger('click');
    this.showPrintOptions = true;
  }
  onSavePress() {
    // this.onValidateNextPress();
    this.onFinishPress("step1_data", "savePress");
    
  }

  open_config_lookup() {
    this.serviceData = []
    this.showLookupLoader = true;
    this.lookupfor = 'configure_list_lookup';
    this.OutputService.getConfigurationList(this.step1_data.main_operation_type).subscribe(
      data => {
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
      }
    )
  }

  getAllDetails(operationType, logid, description) {
    this.OutputService.GetAllOutputData(operationType, logid, description).subscribe(
      data => {
        console.log(data);
        if (data.CustomerOutput.length > 0) {
          if (data.CustomerOutput[0].OPTM_DOCTYPE = "23") {
            this.step1_data.document = "sales_quote"
            this.step1_data.document_name = this.language.SalesQuote;
          } else {
            this.step1_data.document = "sales_order"
            this.step1_data.document_name = this.language.SalesOrder;
          }
          //Bug no. 18436..Draft status was not showing...Ashish Devade
          if (data.CustomerOutput[0].OPTM_STATUS == "D" && data.CustomerOutput[0].OPTM_DELIVERYDATE == null) {
            this.step1_data.document = 'draft';
            this.step1_data.document_name = this.language.draft;
          }
          this.step1_data.customer = data.CustomerOutput[0].OPTM_BPCODE,
            this.step1_data.customer_name = data.CustomerOutput[0].Name,
            this.step1_data.bill_to_address = data.CustomerOutput[0].OPTM_BILLADD,
            this.step1_data.ship_to_address = data.CustomerOutput[0].OPTM_SHIPADD,
            this.step1_data.delivery_until = data.CustomerOutput[0].OPTM_DELIVERYDATE;
          this.contact_persons.push({
            Name: data.CustomerOutput[0].OPTM_CONTACTPERSON,
          });
          this.step1_data.person_name = data.CustomerOutput[0].OPTM_CONTACTPERSON,
            this.bill_to.push({
              BillToDef: data.CustomerOutput[0].OPTM_BILLTO,
            });
          this.step1_data.bill_to = data.CustomerOutput[0].OPTM_BILLTO,
            this.ship_to.push({
              ShipToDef: data.CustomerOutput[0].OPTM_SHIPTO,
            });
          this.step1_data.ship_to = data.CustomerOutput[0].OPTM_SHIPTO,
            this.sales_employee.push({
              SlpName: data.CustomerOutput[0].OPTM_SALESEMP,
            });
          this.step1_data.sales_employee = data.CustomerOutput[0].OPTM_SALESEMP,
            this.owner_list.push({
              lastName: data.CustomerOutput[0].OPTM_OWNER,
            });
          this.step1_data.owner = data.CustomerOutput[0].OPTM_OWNER

          this.feature_discount_percent = data.CustomerOutput[0].OPTM_TOTALDISCOUNT
          this.accessory_discount_percent = data.CustomerOutput[0].OPTM_ACCESSORYDIS
          
          this.getModelDatabyModelCodeAndId(data.ModelBOMData);
        }
        this.isNextButtonVisible = true;
      }
    )
  }

  getModelDatabyModelCodeAndId(ModelBOMData) {
    console.log(ModelBOMData);
    if (ModelBOMData.length > 0) {
      let tempModelData = [];
      tempModelData = ModelBOMData.filter(function (obj) {
        return (obj['OPTM_KEY']).trim() != "" && (obj['OPTM_ITEMTYPE']).trim() == "0"
      })
      console.log('tempModelData');
      console.log(tempModelData);
      this.OutputService.GetModelIdbyModelCode(tempModelData[0].OPTM_ITEMCODE).subscribe(
        data => {
          if (data.length > 0) {
            this.step2_data.quantity = parseFloat(tempModelData[0].OPTM_QUANTITY);
            this.step2_data.model_id = data[0].OPTM_FEATUREID
            this.step2_data.model_code = tempModelData[0].OPTM_ITEMCODE
            this.step2_data.model_name = data[0].OPTM_DISPLAYNAME
            this.step2_data.templateid = data[0].OPTM_MODELTEMPLATEITEM;
            this.step2_data.itemcodegenkey = data[0].OPTM_ITEMCODEGENREF;
            this.setModelDataFlag = true;
            this.GetAllDataForModelBomOutput(ModelBOMData);
          }
        })
    }
  }

  openFeatureLookUp() {
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.OutputService.getFeatureList(this.step2_data.model_id).subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

 

  openCustomerLookUp() {
    this.showLookupLoader = true;
    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'output_customer';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
      }
    )

  }

  openSalesEmpLookup() { }

  openTaxCodes() { }

  onContactPersonChange(contact) {
    console.log(contact);
    this.person = contact;
    this.step1_data.person_name = this.person;
  }

  openModalList() {
    this.showLookupLoader = true;
    this.serviceData = []
    this.setModelDataFlag = false;
    this.OutputService.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBomForWizard_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.showLookupLoader = false;
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
      }
    )
  }

  onSalesPersonChange(selectedSalesEmp) {
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBomForWizard_lookup') {
      this.onclearselection(1);
      this.step2_data.model_id = $event[0];
      this.step2_data.model_code = $event[1];
      this.step2_data.model_name = $event[2];
      this.step2_data.templateid = $event[4];
      this.step2_data.itemcodegenkey = $event[3];
      this.isModelVisible = true
      this.navigatenextbtn = false;
      this.validnextbtn = true;
      // this.GetDataForModelBomOutput();
      this.GetAllDataForModelBomOutput("");
    }
    else if (this.lookupfor == 'Price_lookup') {
      // this.getPriceDetails($event[0], "Header", this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_section_lookup') {
      // this.rule_data = $event;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.serviceData = []
    }
    else if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if (this.step1_data.customer != undefined) {
        this.isNextButtonVisible = true;
        //get contact person
        this.getCustomerAllInfo();
        // this.fillContactPerson();
        // this.fillShipTo();
        // this.fillBillTo();
        // this.fillOwners();
      }
      else {
        this.isNextButtonVisible = false;
      }
    }
    else if (this.lookupfor == 'configure_list_lookup') {
      this.clear_all_screen_data();
      this.step1_data.selected_configuration_key = $event[0];
      this.step1_data.description = $event[1];
      this.iLogID = $event[0];
      this.getAllDetails(this.step1_data.main_operation_type, this.step1_data.selected_configuration_key, this.step1_data.description);
    }
    // this.getItemDetails($event[0]);
  }

  

  on_input_change(inputid, value) {
    if (inputid == "quantity") {
      if (isNaN(value) == true) {
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      if (value == 0 || value == '' || value == null || value == undefined) {
        this.toastr.error('', this.language.blank_or_zero_not_allowed, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      if (value < 0) {
        this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      var rgexp = /^\d+$/;
      if (rgexp.test(value) == false) {
        this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = parseFloat(this.previousquantity);
        return;
      }
      else {
        //this.step2_data.quantity = value
        for (let i = 0; i < this.feature_itm_list_table.length; i++) {
          var tempfeatureid = this.feature_itm_list_table[i].FeatureId

          if (this.feature_itm_list_table[i].is_accessory == "N") {
            var modelheaderpropagatechecked = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == tempfeatureid
            })
            if (modelheaderpropagatechecked.length == 0) {
              modelheaderpropagatechecked = this.ModelInModelArray.filter(function (obj) {
                return obj['OPTM_CHILDMODELID'] == tempfeatureid
              })
            }
            if (modelheaderpropagatechecked.length == 0 && this.feature_itm_list_table[i].Item != "") {
              var itemkey = this.feature_itm_list_table[i].Item
              modelheaderpropagatechecked = this.ModelHeaderItemsArray.filter(function (obj) {
                return obj['OPTM_ITEMKEY'] == itemkey
              })
            }
            if (modelheaderpropagatechecked.length > 0) {
              if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                if (modelheaderpropagatechecked[0].OPTM_TYPE == "1") {
                  var itemkey = this.feature_itm_list_table[i].Item
                  var featurepropagatecheck = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                    return obj['OPTM_ITEMKEY'] == itemkey
                  })
                  if (featurepropagatecheck.length > 0) {
                    if (featurepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                      this.feature_itm_list_table[i].quantity = (this.feature_itm_list_table[i].quantity / this.previousquantity) * this.step2_data.quantity
                    }
                  }
                }
                else if (modelheaderpropagatechecked[0].OPTM_TYPE == "2") {
                  if (modelheaderpropagatechecked[0].OPTM_ITEMKEY == this.feature_itm_list_table[i].Item) {
                    this.feature_itm_list_table[i].quantity = (this.feature_itm_list_table[i].quantity / this.previousquantity) * this.step2_data.quantity
                  }
                }
                else {
                  // var itemkey = this.feature_itm_list_table[i].Item
                  // var modelfeaturepropagatecheck = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                  //   return obj['OPTM_ITEMKEY'] == itemkey
                  //  })
                  //  if (modelfeaturepropagatecheck.length > 0) {
                  // if (modelfeaturepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                  this.feature_itm_list_table[i].quantity = (this.feature_itm_list_table[i].quantity / this.previousquantity) * this.step2_data.quantity
                  // }
                  // }
                }

              }

            }
          }
          else {
            var modelheaderpropagatechecked = this.Accessoryarray.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == tempfeatureid
            })
            if (modelheaderpropagatechecked.length > 0) {
              if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                if (this.feature_itm_list_table[i].ispropogateqty == "Y") {
                  this.feature_itm_list_table[i].quantity = (this.feature_itm_list_table[i].quantity / this.previousquantity) * this.step2_data.quantity
                }

              }

            }
          }


          this.feature_itm_list_table[i].pricextn = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].quantity = parseFloat(this.feature_itm_list_table[i].quantity).toFixed(3)
          this.feature_itm_list_table[i].pricextn = parseFloat(this.feature_itm_list_table[i].pricextn).toFixed(3)
        }

        this.feature_price_calculate();
      }
      value = parseFloat(value);
      this.previousquantity = value
      this.step2_data.quantity = value
    }
  }

  feature_price_calculate() {
    let igrandtotal = 0;
    let iproducttotal = 0;
    let iacctotal = 0;
    let isumofpropriceitem = 0;
    let isumofaccpriceitem = 0;
    let iprotax = 0;
    let iaccotax = 0;
    let iaccdiscount = 0;
    let iprodiscount = 0;

    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      if (this.feature_itm_list_table[iacc].Item != null) {
        if (this.feature_itm_list_table[iacc].is_accessory == "Y") {
          isumofaccpriceitem = isumofaccpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
        }
        else {
          isumofpropriceitem = isumofpropriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
        }
      }
    }
    if (isumofpropriceitem > 0) {
      iprotax = (isumofpropriceitem * this.feature_item_tax) / 100;
      iprodiscount = (isumofpropriceitem * this.feature_discount_percent) / 100
    }
    if (isumofaccpriceitem > 0) {
      iaccotax = (isumofaccpriceitem * this.acc_item_tax) / 100
      iaccdiscount = (isumofaccpriceitem * this.accessory_discount_percent) / 100
    }

    iproducttotal = Number(isumofpropriceitem + iprotax - iprodiscount);
    iacctotal = Number(isumofaccpriceitem + iaccotax - iaccdiscount);


    this.feature_total_before_discount = isumofpropriceitem + isumofaccpriceitem
    this.step3_feature_price_bef_dis = isumofpropriceitem;
    this.step3_acc_price_bef_dis = isumofaccpriceitem;
    igrandtotal = iproducttotal + iacctotal
    this.feature_item_total = iproducttotal
    this.accessory_item_total = iacctotal
    this.acc_grand_total = igrandtotal
    this.step4_final_price_calculation();
  }

 

  output_invvoice_print_lookup(operation_type) {
    this.lookupfor = 'output_invoice_print';
    if (operation_type == "") {
      this.toastr.error('', this.language.operation_type_required, this.commonData.toast_config);
      return;
    }
    this.serviceData = [];
    this.serviceData.ref_doc_details = [];
    this.serviceData.product_grand_details = [];
    this.serviceData.print_types = [];
    //pushing print types
    this.serviceData.print_types.push({
      "selected_print_type": operation_type
    });
    //pushing all customer data
    this.serviceData.customer_and_doc_details = this.step1_data;
    this.serviceData.ref_doc_details.push({
      "ref_doc_no": this.final_reference_number,
      "ref_doc_entry": this.final_ref_doc_entry,
      "conf_id": this.iLogID,
      "conf_desc": this.step1_data.description
    });
    //pushing all price details
    this.serviceData.product_grand_details.push({
      "step4_final_prod_total": this.step4_final_prod_total ,
      "step4_final_acc_total": this.step4_final_acc_total,
      "step4_final_grand_total": this.step4_final_grand_total,
      "prod_discount_log" : this.prod_discount_log,
      "access_dis_amount_log" : this.access_dis_amount_log,
    });
    //pushing all final data sel details
    this.serviceData.verify_final_data_sel_details = this.step3_data_final;
    //pushing all payement data details
    this.serviceData.payment_details = undefined;
  }

  

  on_feature_input_change(inputid, value, rowid, item) {
    for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      if (rowid == this.feature_itm_list_table[i].FeatureId && item == this.feature_itm_list_table[i].Item) {
        if (inputid == "quantity") {
          if (isNaN(value) == true) {
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }
          if (value < 0) {
            this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }
          var rgexp = /^\d+$/;
          if (rgexp.test(value) == false) {
            this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = parseFloat("1").toFixed(3);
            return;
          }

          this.feature_itm_list_table[i].quantity = parseFloat(value).toFixed(3);
          var priceextn: any = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].pricextn = parseFloat(priceextn).toFixed(3);
        }
        else if (inputid == "actual_price") {
          if (isNaN(value) == true) {
            this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
            var price: any = this.feature_itm_list_table[i].pricextn / this.feature_itm_list_table[i].quantity
            this.feature_itm_list_table[i].Actualprice = parseFloat(price).toFixed(3);
            return;
          }
          if (value < 0) {
            this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
            var price: any = this.feature_itm_list_table[i].pricextn / this.feature_itm_list_table[i].quantity
            this.feature_itm_list_table[i].Actualprice = parseFloat(price).toFixed(3);
            return;
          }
          this.feature_itm_list_table[i].Actualprice = parseFloat(value).toFixed(3);
          var priceextn: any = this.feature_itm_list_table[i].quantity * this.feature_itm_list_table[i].Actualprice
          this.feature_itm_list_table[i].pricextn = parseFloat(priceextn).toFixed(3);
        }
        else {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.feature_itm_list_table[i].pricextn = 0;
            return;
          }
          this.feature_itm_list_table[i].pricextn = value
        }

        this.feature_price_calculate();

      }

    }
  }

  step2_next_click_validation() {
    if (this.step1_data.document == "draft") {
      /*   this.step1_data.customer = "";
        this.step1_data.ship_to = "";
        this.step1_data.bill_to = "";
        this.step1_data.person_name = "";
        this.step1_data.delivery_date = "";
        this.step1_data.sales_employee = "";
        this.step1_data.owner = "";
        this.step1_data.remark = "",
          this.step1_data.bill_to_address = "",
          this.step1_data.ship_to_address = "", */
      // this.step1_data.posting_date="",
      $(".step_2_redirect").trigger('click');
    } else {
      let required_fields = '';
      if (this.step1_data.customer == "" || this.step1_data.customer == undefined || this.step1_data.customer == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.language.customer;
      }
      if (this.step1_data.posting_date == "" || this.step1_data.posting_date == undefined || this.step1_data.posting_date == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.language.posting_date;
      }

      if (this.step1_data.delivery_until == "" || this.step1_data.delivery_until == undefined || this.step1_data.delivery_until == null) {
        if (required_fields != "") {
          required_fields += ',';
        }
        required_fields += this.document_date;
      }
      if (required_fields != "") {
        this.toastr.error('', this.language.required_fields_direct + " - " + required_fields, this.commonData.toast_config);
        return false;
      } else {
        $(".step_2_redirect").trigger('click');
      }
    }
  }

  on_calculation_change(inputid, value) {
    if (value < 0) {
      this.feature_discount_percent = 0;
      this.toastr.error('', this.language.negativediscountvalid, this.commonData.toast_config);
      value = 0;
    }
    else if (value > 100) {
      this.toastr.error('', this.language.percentvalidation, this.commonData.toast_config);
      value = 0;
    }
    else if (parseFloat(value) === NaN) {
      this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      value = 0;
    }
    if (inputid == "product_discount") {
      this.feature_discount_percent = value;
    }
    else {
      this.accessory_discount_percent = value;
    }
    this.feature_price_calculate();
  }

  onclearselection(all_clear) {
    this.serviceData = [];
    this.step2_data = [];
    this.tree_data_json = [];
    this.feature_child_data = [];
    this.feature_accessory_list = [];
    this.feature_itm_list_table = [];
    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_item_total = 0
    this.acc_total = 0;
    this.acc_grand_total = 0;
    this.feature_tax_total[0].value = 0;
    this.feature_tax_total[1].value = 0;
    this.feature_discount_percent = 0;
    this.accessory_discount_percent = 0;
    this.step2_data.quantity = parseFloat("1");
    this._el.nativeElement.focus();
    this.ModelHeaderData = [];
    this.ModelBOMDataForSecondLevel = [];
    this.FeatureBOMDataForSecondLevel = [];
    this.feature_total_before_discount = 0;
    this.step3_feature_price_bef_dis = 0;
    this.step3_acc_price_bef_dis = 0;
    this.previousquantity = parseFloat("1");
    if(all_clear == 1){
      this.step2_selected_model = "";
      this.step2_selected_model_id = "";
    }
    $(".accesory_check_for_second_screen").prop('checked', false);
  } 

  GetAllDataForModelBomOutput(getmodelsavedata) {
    this.showLookupLoader = true;
    let AllDataForModelBomOutput: any = {};
    AllDataForModelBomOutput.modelinputdatalookup = [];
    AllDataForModelBomOutput.getmodelsavedata = [];

    AllDataForModelBomOutput.modelinputdatalookup.push({
      CompanyDBID: this.common_output_data.companyName,
      ModelID: this.step2_data.model_id,
      ModelDisplayName: this.step2_data.model_name,
      currentDate: this.submit_date

    });
    AllDataForModelBomOutput.getmodelsavedata = getmodelsavedata
    this.OutputService.GetDataByModelIDForFirstLevel(AllDataForModelBomOutput).subscribe(
      //this.OutputService.GetDataByModelIDForFirstLevel(this.step2_data.model_id, this.step2_data.model_name).subscribe(
      data => {
        if (data != null && data != undefined) {
          console.log(data);
          if (data.DeafultWarehouse !== undefined && data.DeafultWarehouse[0] !== undefined) {
            if (data.DeafultWarehouse[0].DEFAULTWAREHOUSE !== undefined) {
              this.warehouse = data.DeafultWarehouse[0].DEFAULTWAREHOUSE;
            }
          }

          data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
            obj['OPTM_LEVEL'] = 0;
            return data.ModelHeaderData
          })

          data.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_LEVEL'] = 1;
            return data.FeatureBOMDataForSecondLevel
          })

          data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_LEVEL'] = 2;
            return data.ModelBOMDataForSecondLevel
          })

          data.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            if(obj['checked'] =="True"){
              obj['checked'] =true
            }
            return data.ModelBOMDataForSecondLevel
          })

          data.ObjFeatureItemDataWithDfaultY = data.ObjFeatureItemDataWithDfaultY.filter(function (obj) {
            obj['OPTM_LEVEL'] = 1;
            return data.ObjFeatureItemDataWithDfaultY
          })

          for (var i in data.FeatureBOMDataForSecondLevel) {
            if (data.FeatureBOMDataForSecondLevel[i].checked == "True") {
              data.FeatureBOMDataForSecondLevel[i].checked = true
            }
            else {
              data.FeatureBOMDataForSecondLevel[i].checked = false
            }
            if (data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != "" && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != null && data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT != undefined) {
              data.FeatureBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.FeatureBOMDataForSecondLevel[i].OPTM_ATTACHMENT
            }
          }

          for (var i in data.ModelBOMDataForSecondLevel) {
            if (data.ModelBOMDataForSecondLevel[i].IMAGEPATH != "" && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != null && data.ModelBOMDataForSecondLevel[i].IMAGEPATH != undefined) {
              data.ModelBOMDataForSecondLevel[i].IMAGEPATH = this.commonData.get_current_url() + data.ModelBOMDataForSecondLevel[i].IMAGEPATH
            }
          }

          this.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
            return obj['ACCESSORY'] != "Y" && obj['OPTM_TYPE'] != "2"
          })

          this.ModelHeaderItemsArray = data.ModelHeaderData.filter(function (obj) {
            return obj['OPTM_TYPE'] == "2"
          })
          // this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel
          this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] != "Y"
          });
          this.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] != "Y"
          });
          this.Accessoryarray = [];
          this.Accessoryarray = data.ModelHeaderData.filter(function (obj) {
            return obj['ACCESSORY'] == "Y";
          });
          this.getAccessoryData(this.Accessoryarray)
          var Access = [];
          Access = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] == "Y";
          });
          this.getAccessoryData(Access)

          var ModelArray = [];
          ModelArray = data.ModelHeaderData.filter(function (obj) {
            return obj['OPTM_TYPE'] == "3"
          });

          this.ModelInModelArray = ModelArray

          this.setModelDataInGrid(ModelArray, this.ModelBOMDataForSecondLevel);

          this.setModelItemsDataInGrid(this.ModelHeaderItemsArray)

          this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);

          this.RuleIntegration(data.RuleOutputData, true)

          this.ModelLookupFlag = true

          this.ModelHeaderData = this.ModelHeaderData.sort((a, b) => a.OPTM_LINENO - b.OPTM_LINENO)

          if (this.setModelDataFlag == true) {
            this.setModelDataInOutputBom(getmodelsavedata);
            var Modelfeaturesaveditems=this.FeatureBOMDataForSecondLevel.filter(function(obj){
              return obj['checked']==true && obj['OPTM_TYPE']==2
            })
            if(Modelfeaturesaveditems.length>0){
              this.SetModelFeatureSavedItems(Modelfeaturesaveditems)
            }
          }
          this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
          this.showLookupLoader = false;
        }
        else {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }

      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    );
  }

  onselectionchange(feature_model_data, value, id) {
    let type = feature_model_data.OPTM_TYPE
    let modelid;
    let featureid;
    let parentfeatureid;
    let parentmodelid;
    let item;
    let propagateqtychecked = "N";
    let propagateqty = 1;
    let selectedvalue = "";
    this.ModelLookupFlag = false
    if (feature_model_data.OPTM_CHILDMODELID == undefined || feature_model_data.OPTM_CHILDMODELID == null) {
      modelid = ""
    }
    else {
      modelid = feature_model_data.OPTM_CHILDMODELID
    }
    if (feature_model_data.OPTM_CHILDFEATUREID == undefined || feature_model_data.OPTM_CHILDFEATUREID == null) {
      featureid = "";
    }
    else {
      featureid = feature_model_data.OPTM_CHILDFEATUREID
    }
    if (feature_model_data.OPTM_ITEMKEY == undefined || feature_model_data.OPTM_ITEMKEY == null) {
      item = "";
    }
    else {
      item = feature_model_data.OPTM_ITEMKEY
    }
    if (feature_model_data.OPTM_VALUE == undefined || feature_model_data.OPTM_VALUE == null || feature_model_data.OPTM_VALUE == "") {
      selectedvalue = "";
    }
    else {
      selectedvalue = feature_model_data.OPTM_VALUE
    }
    if (feature_model_data.OPTM_FEATUREID == undefined || feature_model_data.OPTM_FEATUREID == null) {
      parentfeatureid = "";
    }
    else {
      parentfeatureid = feature_model_data.OPTM_FEATUREID
    }
    if (feature_model_data.OPTM_MODELID == undefined || feature_model_data.OPTM_MODELID == null) {
      parentmodelid = "";
    }
    else {
      parentmodelid = feature_model_data.OPTM_MODELID
      if (parentmodelid != this.step2_data.model_id) {
        featureid = parentfeatureid
        feature_model_data.OPTM_CHILDFEATUREID = featureid
      }
    }



    if (feature_model_data.OPTM_CHILDFEATUREID == feature_model_data.OPTM_FEATUREID) {
      parentfeatureid = "";
    }
    let parentarray
    if (parentmodelid != "") {
      if (parentmodelid == this.step2_data.model_id) {
        parentarray = this.ModelHeaderData.filter(function (obj) {
          return obj['OPTM_MODELID'] == parentmodelid && obj['OPTM_ITEMKEY'] == feature_model_data.OPTM_ITEMKEY
        });
      }
      else {
        parentarray = this.ModelHeaderData.filter(function (obj) {
          obj['OPTM_MODELID'] = obj['OPTM_CHILDMODELID']
          return obj['OPTM_CHILDMODELID'] == parentmodelid
        });
      }

    }
    else {
      parentarray = this.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == parentfeatureid
      });
      if (parentarray.length > 0) {
        if (parentarray[0].parentmodelid != "" && parentarray[0].parentmodelid != null && parentarray[0].parentmodelid != undefined) {
          if (parentarray[0].parentmodelid != this.step2_data.model_id) {
            parentarray[0].OPTM_MODELID = parentarray[0].parentmodelid
          }
        }
        else {

          var tempparentFeatureArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_CHILDFEATUREID'] == parentfeatureid
          });
          if (tempparentFeatureArray.length > 0) {
            parentarray[0].parentmodelid = tempparentFeatureArray[0].parentmodelid
          }
        }

      }

    }

    if (parentarray[0].OPTM_MAXSELECTABLE > 1 && value == true) {
      //  if( feature_model_data.OPTM_FEATUREID==2){
      var isExistForItemMax = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == feature_model_data.OPTM_FEATUREID
      })

      var isExistForFeatureMax = this.ModelHeaderData.filter(function (obj) {
        return obj['parentfeatureid'] == feature_model_data.OPTM_FEATUREID
      })

      var isExistForValue = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == feature_model_data.OPTM_FEATUREID && obj['OPTM_TYPE'] == 3 && obj['checked'] == true
      })

      var totalSelect = isExistForItemMax.length + isExistForFeatureMax.length + isExistForValue.length

      if (totalSelect == parentarray[0].OPTM_MAXSELECTABLE) {
        this.toastr.error('', this.language.select_max_selectable, this.commonData.toast_config);
        $("#" + id).prop("checked", false)
        return;
      }
      //    }
      // else if(feature_model_data.OPTM_FEATUREID==1){
      //   var isExistForItemMax = this.feature_itm_list_table.filter(function (obj) {
      //     return obj['FeatureId'] == feature_model_data.OPTM_FEATUREID
      //   })

      //   var isExistForFeatureMax = this.ModelHeaderData.filter(function (obj) {
      //     return obj['parentfeatureid'] == feature_model_data.OPTM_FEATUREID
      //   })

      //   var totalSelect=isExistForItemMax.length + isExistForFeatureMax.length

      //   if (isExistForMax.length == parentarray[0].OPTM_MAXSELECTABLE) {
      //     this.toastr.error('', this.language.select_max_selectable, this.commonData.toast_config);
      //     $("#" + id).prop("checked", false)
      //     return;
      //   }
      // }

    }

    this.checkedFunction(feature_model_data, parentarray, value);


    this.showLookupLoader = true;
    let GetDataForSelectedFeatureModelItemData: any = {};
    GetDataForSelectedFeatureModelItemData.selecteddata = [];
    GetDataForSelectedFeatureModelItemData.featurebomdata = [];
    GetDataForSelectedFeatureModelItemData.modelbomdata = [];
    GetDataForSelectedFeatureModelItemData.selecteddata.push({
      type: type,
      modelid: modelid,
      featureid: featureid,
      item: item,
      parentfeatureid: parentfeatureid,
      parentmodelid: parentmodelid,
      selectedvalue: selectedvalue,
      CompanyDBID: this.common_output_data.companyName,
      SuperModelId: this.step2_data.model_id,
      currentDate: this.step1_data.posting_date
    });

    GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    // this.OutputService.GetDataForSelectedFeatureModelItem(type, modelid, featureid, item, parentfeatureid, parentmodelid,selectedvalue,this.FeatureBOMDataForSecondLevel).subscribe(
    this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
      data => {

        if (data != null || data != undefined) {
          if (value == true) {

            if (data.DataForSelectedFeatureModelItem.length > 0) {
              if (parentarray[0].element_type == "radio") {
                for (let imodelheader = 0; imodelheader < this.ModelHeaderData.length; imodelheader++) {
                  if (parentfeatureid != "" && this.ModelHeaderData[imodelheader].parentfeatureid != undefined && feature_model_data.OPTM_CHILDFEATUREID != feature_model_data.OPTM_FEATUREID) {
                    if (this.ModelHeaderData[imodelheader].parentfeatureid == parentfeatureid) {
                      for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {
                        if (this.feature_itm_list_table[ifeatureitemsgrid].FeatureId == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                          this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                          ifeatureitemsgrid = ifeatureitemsgrid - 1;
                        }
                      }
                      for (let ifeaturedataforsecond = 0; ifeaturedataforsecond < this.FeatureBOMDataForSecondLevel.length; ifeaturedataforsecond++) {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                          //   this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].checked=value
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }
                      let removemodelheaderid = this.ModelHeaderData[imodelheader].OPTM_FEATUREID
                      this.ModelHeaderData.splice(imodelheader, 1);
                      imodelheader = imodelheader - 1;
                      this.removemodelheaderdatatable(removemodelheaderid)
                    }
                    // else {
                    //   for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {
                    //     if (this.feature_itm_list_table[ifeatureitemsgrid].FeatureId == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                    //       this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                    //       ifeatureitemsgrid = ifeatureitemsgrid - 1;
                    //     }
                    //   }
                    // }
                  }
                  else if (parentmodelid != "" && this.ModelHeaderData[imodelheader].parentmodelid != undefined) {
                    if (this.ModelHeaderData[imodelheader].parentmodelid == parentmodelid) {
                      for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {
                        for (let imodelbomdata = 0; imodelbomdata < this.ModelBOMDataForSecondLevel.length; imodelbomdata++) {
                          if (this.ModelBOMDataForSecondLevel[imodelbomdata].OPTM_FEATUREID == this.feature_itm_list_table[ifeatureitemsgrid].FeatureId && this.ModelBOMDataForSecondLevel[imodelbomdata].OPTM_MODELID == parentmodelid && this.ModelBOMDataForSecondLevel[imodelbomdata].OPTM_FEATUREID != null) {
                            this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                            ifeatureitemsgrid = ifeatureitemsgrid - 1;
                          }
                        }
                        for (let ideletefeaturebomdata = 0; ideletefeaturebomdata < this.FeatureBOMDataForSecondLevel.length; ideletefeaturebomdata++) {
                          if (this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].OPTM_FEATUREID == this.feature_itm_list_table[ifeatureitemsgrid].FeatureId && this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].OPTM_FEATUREID != null && parentmodelid == this.feature_itm_list_table[ifeatureitemsgrid].ModelId && parentmodelid != null) {
                            this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                            ifeatureitemsgrid = ifeatureitemsgrid - 1;
                          }
                        }
                      }
                      for (let imodeldataforsecond = 0; imodeldataforsecond < this.ModelBOMDataForSecondLevel.length; imodeldataforsecond++) {
                        if (this.ModelBOMDataForSecondLevel[imodeldataforsecond].OPTM_MODELID == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                          //  this.ModelBOMDataForSecondLevel[imodeldataforsecond].checked=value
                          this.ModelBOMDataForSecondLevel.splice(imodeldataforsecond, 1);
                          imodeldataforsecond = imodeldataforsecond - 1;
                        }
                      }
                      for (let ideletemodeldataforfeaturesecond = 0; ideletemodeldataforfeaturesecond < this.FeatureBOMDataForSecondLevel.length; ideletemodeldataforfeaturesecond++) {
                        if (this.FeatureBOMDataForSecondLevel[ideletemodeldataforfeaturesecond].OPTM_FEATUREID == this.ModelHeaderData[imodelheader].OPTM_FEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ideletemodeldataforfeaturesecond, 1);
                          ideletemodeldataforfeaturesecond = ideletemodeldataforfeaturesecond - 1;
                        }
                      }
                      let removemodelheaderid = this.ModelHeaderData[imodelheader].OPTM_FEATUREID
                      this.ModelHeaderData.splice(imodelheader, 1);
                      imodelheader = imodelheader - 1;
                      this.removemodelheaderdatatable(removemodelheaderid)

                    }
                  }
                }



              }
              if (type == 1) {
                var isExist;
                if (data.DataForSelectedFeatureModelItem.length > 0) {
                  isExist = this.ModelHeaderData.filter(function (obj) {
                    return obj['OPTM_FEATUREID'] == feature_model_data.OPTM_CHILDFEATUREID;
                  });

                  // if(parentmodelid!="" && parentmodelid!=null && parentmodelid!=undefined){
                  //   if( feature_model_data.parentmodelid!=this.step2_data.model_id){
                  //     parentmodelid= feature_model_data.parentmodelid
                  //   }
                  // }

                  if (isExist.length == 0) {
                    this.ModelHeaderData.push({
                      ACCESSORY: feature_model_data.ACCESSORY,
                      IMAGEPATH: feature_model_data.IMAGEPATH,
                      OPTM_CHILDMODELID: feature_model_data.OPTM_CHILDMODELID,
                      OPTM_COMPANYID: feature_model_data.OPTM_COMPANYID,
                      OPTM_CREATEDATETIME: feature_model_data.OPTM_CREATEDATETIME,
                      OPTM_CREATEDBY: feature_model_data.OPTM_CREATEDBY,
                      OPTM_DISPLAYNAME: feature_model_data.OPTM_DISPLAYNAME,
                      OPTM_FEATUREID: feature_model_data.OPTM_CHILDFEATUREID,
                      OPTM_ITEMKEY: feature_model_data.OPTM_ITEMKEY,
                      OPTM_LINENO: this.ModelHeaderData.length + 1,
                      OPTM_MANDATORY: "N",
                      OPTM_MAXSELECTABLE: "1",
                      OPTM_MINSELECTABLE: "1",
                      OPTM_MODELID: parentarray[0].OPTM_MODELID,
                      OPTM_MODIFIEDBY: feature_model_data.OPTM_MODIFIEDBY,
                      OPTM_MODIFIEDDATETIME: String(feature_model_data.OPTM_MODIFIEDDATETIME).toString(),
                      OPTM_PRICESOURCE: feature_model_data.ListName,
                      OPTM_PROPOGATEQTY: feature_model_data.OPTM_PROPOGATEQTY,
                      OPTM_QUANTITY: parseFloat(feature_model_data.OPTM_QUANTITY).toFixed(3),
                      OPTM_TYPE: feature_model_data.OPTM_TYPE,
                      OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
                      OPTM_UOM: parentarray[0].OPTM_UOM,
                      child_code: parentarray[0].child_code,
                      element_class: "custom-control custom-radio",
                      element_type: "radio",
                      feature_code: feature_model_data.feature_code,
                      parentfeatureid: parentfeatureid,
                      parentmodelid: parentmodelid,
                      OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                      is_second_level: 1

                    });

                    if (parentarray[0].OPTM_PROPOGATEQTY == "Y") {
                      propagateqtychecked = "Y"
                      parentarray[0].OPTM_QUANTITY = parseFloat(parentarray[0].OPTM_QUANTITY).toFixed(3)
                      //  propagateqty = parentarray[0].OPTM_QUANTITY
                    }
                  }
                  for (var i = 0; i < data.DataForSelectedFeatureModelItem.length; ++i) {
                    var isExist;
                    if (data.DataForSelectedFeatureModelItem.length > 0) {
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID;
                        });
                      }
                      else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2) {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_ITEMKEY'] == data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY;
                        });
                      }
                      else {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_VALUE'] == data.DataForSelectedFeatureModelItem[i].OPTM_VALUE;
                        });
                      }
                      if (isExist.length == 0) {
                        let checkeddefault = false;
                        if (data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT == "Y") {
                          checkeddefault = true
                        }

                        if (feature_model_data.OPTM_PROPOGATEQTY == "Y") {
                          if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                            data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY = parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY) * parseFloat(feature_model_data.OPTM_QUANTITY)
                            propagateqty = data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY
                          }

                        }


                        this.FeatureBOMDataForSecondLevel.push({
                          ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                          IMAGEPATH: this.commonData.get_current_url() + data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_ATTACHMENT: data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_CHILDFEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID,
                          OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                          OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                          OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                          OPTM_DEFAULT: data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT,
                          OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                          OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                          OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                          OPTM_LINENO: data.DataForSelectedFeatureModelItem[i].OPTM_LINENO,
                          OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                          OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                          OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                          OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                          OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                          OPTM_REMARKS: data.DataForSelectedFeatureModelItem[i].OPTM_REMARKS,
                          OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                          OPTM_VALUE: data.DataForSelectedFeatureModelItem[i].OPTM_VALUE,
                          feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                          parent_code: data.DataForSelectedFeatureModelItem[i].parent_code,
                          checked: checkeddefault,
                          OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
                          is_second_level: 1,
                          element_class: "custom-control custom-radio",
                          element_type: "radio",
                          parentfeatureid: parentfeatureid,
                          parentmodelid: parentmodelid,
                          HEADER_LINENO: this.ModelHeaderData.length + 1
                        });

                        if (checkeddefault == true) {
                          var itemData = [];
                          parentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                            // if (obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && data.DataForSelectedFeatureModelItem[i].OPTM_TYPE==2) {
                            //   obj['feature_code'] = obj['parent_code']
                            // }
                            return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID
                          });
                          if (parentarray.length == 0) {
                            parentarray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                              return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID
                            });
                          }
                          if (parentarray.length > 0) {
                            if (parentarray[0].OPTM_FEATUREID == data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID && data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2 && parentarray[0].parent_code != undefined && parentarray[0].parent_code != null) {
                              parentarray[0].feature_code = parentarray[0].parent_code
                            }
                            if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2) {
                              itemData.push(data.DataForSelectedFeatureModelItem[i])
                              // if(parentarray[0].parentmodelid!=this.step2_data.model_id){
                              //   parentarray[0].OPTM_MODELID=parentarray[0].parentmodelid
                              // }
                              this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].HEADER_LINENO);
                            }
                            else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                              isExist = this.ModelHeaderData.filter(function (obj) {
                                return obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID;
                              });
                              if (isExist.length == 0) {
                                this.ModelHeaderData.push({
                                  ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                                  IMAGEPATH: data.DataForSelectedFeatureModelItem[i].IMAGEPATH,
                                  OPTM_CHILDMODELID: "",
                                  OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                                  OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                                  OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                                  OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                                  OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID,
                                  OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                                  OPTM_LINENO: this.ModelHeaderData.length + 1,
                                  OPTM_MANDATORY: "N",
                                  OPTM_MAXSELECTABLE: "1",
                                  OPTM_MINSELECTABLE: "1",
                                  OPTM_MODELID: parentarray[0].OPTM_MODELID,
                                  OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                                  OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                                  OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                                  OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                                  OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                                  OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                                  OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
                                  OPTM_UOM: parentarray[0].OPTM_UOM,
                                  child_code: parentarray[0].child_code,
                                  element_class: parentarray[0].element_class,
                                  element_type: parentarray[0].element_type,
                                  feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                                  parentfeatureid: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                                  parentmodelid: parentmodelid,
                                  OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                                  is_second_level: 1

                                });

                                if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                                  propagateqtychecked = "Y"
                                  data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY = parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3)
                                  propagateqty = data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY
                                }

                                if (data.dtFeatureDataWithDefault.length > 0) {
                                  for (var idtfeature in data.dtFeatureDataWithDefault) {
                                    isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                                      return obj['OPTM_ITEMKEY'] == data.dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY && obj['OPTM_FEATUREID'] == data.dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID;
                                    });
                                    if (data.dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y") {
                                      checkeddefault = true
                                    }
                                    else {
                                      checkeddefault = false
                                    }

                                    if (data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY == "Y") {
                                      if (data.dtFeatureDataWithDefault[idtfeature].OPTM_PROPOGATEQTY == "Y") {
                                        data.dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY = parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY) * parseFloat(data.dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY)
                                        propagateqty = data.dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY
                                      }

                                    }


                                    if (isExist.length == 0)
                                      this.FeatureBOMDataForSecondLevel.push({
                                        ACCESSORY: data.dtFeatureDataWithDefault[idtfeature].ACCESSORY,
                                        IMAGEPATH: this.commonData.get_current_url() + data.dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
                                        OPTM_ATTACHMENT: data.dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
                                        OPTM_CHILDFEATUREID: data.dtFeatureDataWithDefault[idtfeature].OPTM_CHILDFEATUREID,
                                        OPTM_COMPANYID: data.dtFeatureDataWithDefault[idtfeature].OPTM_COMPANYID,
                                        OPTM_CREATEDATETIME: data.dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDATETIME,
                                        OPTM_CREATEDBY: data.dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDBY,
                                        OPTM_DEFAULT: data.dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT,
                                        OPTM_DISPLAYNAME: data.dtFeatureDataWithDefault[idtfeature].OPTM_DISPLAYNAME,
                                        OPTM_FEATUREID: data.dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID,
                                        OPTM_ITEMKEY: data.dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY,
                                        OPTM_LINENO: data.dtFeatureDataWithDefault[idtfeature].OPTM_LINENO,
                                        OPTM_MODIFIEDBY: data.dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDBY,
                                        OPTM_MODIFIEDDATETIME: String(data.dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDDATETIME).toString(),
                                        OPTM_PROPOGATEQTY: data.dtFeatureDataWithDefault[i].OPTM_PROPOGATEQTY,
                                        OPTM_PRICESOURCE: data.dtFeatureDataWithDefault[idtfeature].ListName,
                                        OPTM_QUANTITY: parseFloat(data.dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY).toFixed(3),
                                        OPTM_REMARKS: data.dtFeatureDataWithDefault[idtfeature].OPTM_REMARKS,
                                        OPTM_TYPE: data.dtFeatureDataWithDefault[idtfeature].OPTM_TYPE,
                                        OPTM_VALUE: data.dtFeatureDataWithDefault[idtfeature].OPTM_VALUE,
                                        feature_code: data.dtFeatureDataWithDefault[idtfeature].feature_code,
                                        parent_code: data.dtFeatureDataWithDefault[idtfeature].parent_code,
                                        checked: checkeddefault,
                                        OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
                                        is_second_level: 1,
                                        element_class: "custom-control custom-radio",
                                        element_type: "radio",
                                        parentfeatureid: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID,
                                        parentmodelid: parentmodelid,
                                        HEADER_LINENO: this.ModelHeaderData.length + 1
                                      });

                                    if (data.dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y") {
                                      // parentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                                      //   return obj['OPTM_CHILDFEATUREID'] == data.dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID
                                      // });
                                      var tempparentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                                        return obj['OPTM_CHILDFEATUREID'] == data.dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID
                                      });
                                      if (tempparentarray.length > 0) {
                                        parentarray[0].OPTM_TYPE = tempparentarray[0].OPTM_TYPE
                                        parentarray[0].parentmodelid = tempparentarray[0].parentmodelid
                                        parentarray[0].OPTM_LEVEL = tempparentarray[0].OPTM_LEVEL
                                        parentarray[0].HEADER_LINENO = tempparentarray[0].HEADER_LINENO
                                      }
                                      itemData.push(data.dtFeatureDataWithDefault[idtfeature])
                                      this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, tempparentarray[0].feature_code, parentarray[0].HEADER_LINENO);
                                    }
                                  }

                                }

                              }

                            }

                          }

                        }
                      }
                    }
                  }

                  this.defaultitemflagid = feature_model_data.OPTM_FEATUREID

                }
              }
              else if (type == 3 && feature_model_data.OPTM_VALUE == null) {
                // let parentarray = this.ModelHeaderData.filter(function (obj) {
                //   return obj['OPTM_MODELID'] == parentmodelid
                // });

                if (data.DataForSelectedFeatureModelItem.length > 0) {
                  this.ModelHeaderData.push({
                    ACCESSORY: feature_model_data.ACCESSORY,
                    IMAGEPATH: feature_model_data.IMAGEPATH,
                    OPTM_CHILDMODELID: feature_model_data.OPTM_CHILDMODELID,
                    OPTM_COMPANYID: feature_model_data.OPTM_COMPANYID,
                    OPTM_CREATEDATETIME: feature_model_data.OPTM_CREATEDATETIME,
                    OPTM_CREATEDBY: feature_model_data.OPTM_CREATEDBY,
                    OPTM_DISPLAYNAME: feature_model_data.OPTM_DISPLAYNAME,
                    OPTM_FEATUREID: feature_model_data.OPTM_FEATUREID,
                    OPTM_ITEMKEY: feature_model_data.OPTM_ITEMKEY,
                    OPTM_LINENO: this.ModelHeaderData.length + 1,
                    OPTM_MANDATORY: "N",
                    OPTM_MAXSELECTABLE: "1",
                    OPTM_MINSELECTABLE: "1",
                    OPTM_MODELID: parentarray[0].OPTM_MODELID,
                    OPTM_MODIFIEDBY: feature_model_data.OPTM_MODIFIEDBY,
                    OPTM_MODIFIEDDATETIME: String(feature_model_data.OPTM_MODIFIEDDATETIME).toString(),
                    OPTM_PRICESOURCE: feature_model_data.ListName,
                    OPTM_PROPOGATEQTY: parentarray[0].OPTM_PROPOGATEQTY,
                    OPTM_QUANTITY: parseFloat(feature_model_data.OPTM_QUANTITY).toFixed(3),
                    OPTM_TYPE: feature_model_data.OPTM_TYPE,
                    OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
                    OPTM_UOM: parentarray[0].OPTM_UOM,
                    child_code: parentarray[0].child_code,
                    element_class: parentarray[0].element_class,
                    element_type: parentarray[0].element_type,
                    feature_code: feature_model_data.feature_code,
                    parentfeatureid: parentfeatureid,
                    parentmodelid: parentmodelid,
                    OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                    is_second_level: 1

                  });
                  for (let i = 0; i < data.DataForSelectedFeatureModelItem.length; i++) {
                    var isExist;
                    if (data.DataForSelectedFeatureModelItem.length > 0) {
                      if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID;
                        });
                      }
                      else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 3) {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID;
                        });
                      }
                      else {
                        isExist = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_ITEMKEY'] == data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY;
                        });
                      }
                      if (isExist.length == 0) {
                        this.ModelBOMDataForSecondLevel.push({
                          ACCESSORY: data.DataForSelectedFeatureModelItem[i].ACCESSORY,
                          IMAGEPATH: this.commonData.get_current_url() + data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_ATTACHMENT: data.DataForSelectedFeatureModelItem[i].OPTM_ATTACHMENT,
                          OPTM_CHILDFEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID,
                          OPTM_COMPANYID: data.DataForSelectedFeatureModelItem[i].OPTM_COMPANYID,
                          OPTM_CREATEDATETIME: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDATETIME,
                          OPTM_CREATEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_CREATEDBY,
                          OPTM_DEFAULT: data.DataForSelectedFeatureModelItem[i].OPTM_DEFAULT,
                          OPTM_DISPLAYNAME: data.DataForSelectedFeatureModelItem[i].OPTM_DISPLAYNAME,
                          OPTM_FEATUREID: data.DataForSelectedFeatureModelItem[i].OPTM_FEATUREID,
                          OPTM_ITEMKEY: data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY,
                          OPTM_LINENO: data.DataForSelectedFeatureModelItem[i].OPTM_LINENO,
                          OPTM_MODIFIEDBY: data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDBY,
                          OPTM_MODIFIEDDATETIME: String(data.DataForSelectedFeatureModelItem[i].OPTM_MODIFIEDDATETIME).toString(),
                          OPTM_PRICESOURCE: data.DataForSelectedFeatureModelItem[i].ListName,
                          OPTM_QUANTITY: parseFloat(data.DataForSelectedFeatureModelItem[i].OPTM_QUANTITY).toFixed(3),
                          OPTM_REMARKS: data.DataForSelectedFeatureModelItem[i].OPTM_REMARKS,
                          OPTM_PROPOGATEQTY: data.DataForSelectedFeatureModelItem[i].OPTM_PROPOGATEQTY,
                          OPTM_TYPE: data.DataForSelectedFeatureModelItem[i].OPTM_TYPE,
                          OPTM_VALUE: data.DataForSelectedFeatureModelItem[i].OPTM_VALUE,
                          feature_code: data.DataForSelectedFeatureModelItem[i].feature_code,
                          parent_code: data.DataForSelectedFeatureModelItem[i].parent_code,
                          OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
                          is_second_level: 1,
                          element_class: "custom-control custom-radio",
                          element_type: "radio",
                          parentfeatureid: parentfeatureid,
                          parentmodelid: parentmodelid,
                          HEADER_LINENO: parentarray[0].OPTM_LINENO
                        });
                      }
                    }
                  }
                  this.defaultitemflagid = feature_model_data.OPTM_FEATUREID
                }
              }
              else if (type == 2) {
                if (parentarray[0].OPTM_PROPOGATEQTY == "Y") {
                  if (data.DataForSelectedFeatureModelItem[0].OPTM_PROPOGATEQTY == "Y") {
                    propagateqtychecked = "Y"
                    parentarray[0].OPTM_QUANTITY = parseFloat(parentarray[0].OPTM_QUANTITY).toFixed(3)
                    propagateqty = parentarray[0].OPTM_QUANTITY * data.DataForSelectedFeatureModelItem[0].OPTM_QUANTITY

                  }

                }
                this.setItemDataForFeature(data.DataForSelectedFeatureModelItem, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].OPTM_LINENO);
                this.defaultitemflagid = data.DataForSelectedFeatureModelItem[0].OPTM_FEATUREID;
              }

            }//end data length
            this.enableFeatureModelsItems();
            this.RuleIntegration(data.RuleOutputData, value);
            this.checkedFunction(feature_model_data, parentarray, value);
            this.showLookupLoader = false;
          } //end value
          else {
            if (feature_model_data.OPTM_TYPE != 2) {
              if (feature_model_data.parentmodelid == "" || feature_model_data.parentmodelid == null || feature_model_data.parentmodelid == undefined) {
                for (let iremovemodelheader = 0; iremovemodelheader < this.ModelHeaderData.length; iremovemodelheader++) {
                  if (this.ModelHeaderData[iremovemodelheader].parentfeatureid == feature_model_data.OPTM_FEATUREID) {
                    for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {
                      if (this.feature_itm_list_table[ifeatureitemsgrid].FeatureId == this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID) {
                        this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                        ifeatureitemsgrid = ifeatureitemsgrid - 1;
                      }
                    }
                    //  if (parentarray[0].element_type == "radio") {
                    for (let ifeaturedataforsecond = 0; ifeaturedataforsecond < this.FeatureBOMDataForSecondLevel.length; ifeaturedataforsecond++) {
                      if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE != 3) {
                        this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                        ifeaturedataforsecond = ifeaturedataforsecond - 1;
                      }
                    }

                    for (let ifeaturedataforsecond = 0; ifeaturedataforsecond < this.FeatureBOMDataForSecondLevel.length; ifeaturedataforsecond++) {
                      if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE == 2) {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }
                      else if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE == 1) {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }
                      else {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].parentfeatureid == feature_model_data.OPTM_FEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }

                    }

                    if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;

                    }
                    if (this.ModelHeaderData[iremovemodelheader].parentmodelid == feature_model_data.OPTM_MODELID && this.ModelHeaderData[iremovemodelheader].parentfeatureid == feature_model_data.OPTM_FEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;

                    }

                    //  }
                  }
                  if (feature_model_data.OPTM_TYPE == 1) {
                    // if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                    //   this.ModelHeaderData.splice(iremovemodelheader, 1);
                    //   iremovemodelheader = iremovemodelheader - 1;
                    //     }
                    if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;
                    }
                  }
                }
              }
              else {
                for (let iremovemodelheader = 0; iremovemodelheader < this.ModelHeaderData.length; iremovemodelheader++) {
                  if (this.ModelHeaderData[iremovemodelheader].parentmodelid == feature_model_data.parentmodelid) {
                    for (let ifeatureitemsgrid = 0; ifeatureitemsgrid < this.feature_itm_list_table.length; ifeatureitemsgrid++) {
                      if (this.feature_itm_list_table[ifeatureitemsgrid].FeatureId == this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID && this.feature_itm_list_table[ifeatureitemsgrid].FeatureId == feature_model_data.OPTM_FEATUREID) {
                        this.feature_itm_list_table.splice(ifeatureitemsgrid, 1);
                        ifeatureitemsgrid = ifeatureitemsgrid - 1;
                      }
                    }
                    //  if (parentarray[0].element_type == "radio") {
                    for (let ifeaturedataforsecond = 0; ifeaturedataforsecond < this.FeatureBOMDataForSecondLevel.length; ifeaturedataforsecond++) {
                      if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE != 3) {
                        this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                        ifeaturedataforsecond = ifeaturedataforsecond - 1;
                      }
                    }

                    for (let ifeaturedataforsecond = 0; ifeaturedataforsecond < this.FeatureBOMDataForSecondLevel.length; ifeaturedataforsecond++) {
                      if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE == 2) {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }
                      else if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_TYPE == 1) {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].OPTM_FEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }
                      else {
                        if (this.FeatureBOMDataForSecondLevel[ifeaturedataforsecond].parentfeatureid == feature_model_data.OPTM_FEATUREID) {
                          this.FeatureBOMDataForSecondLevel.splice(ifeaturedataforsecond, 1);
                          ifeaturedataforsecond = ifeaturedataforsecond - 1;
                        }
                      }

                    }

                    if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;

                    }
                    if (this.ModelHeaderData[iremovemodelheader].parentmodelid == feature_model_data.OPTM_MODELID && this.ModelHeaderData[iremovemodelheader].parentfeatureid == feature_model_data.OPTM_FEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;

                    }

                    //  }
                  }
                  if (feature_model_data.OPTM_TYPE == 1) {
                    // if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
                    //   this.ModelHeaderData.splice(iremovemodelheader, 1);
                    //   iremovemodelheader = iremovemodelheader - 1;
                    //     }
                    if (this.ModelHeaderData[iremovemodelheader].OPTM_FEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
                      this.ModelHeaderData.splice(iremovemodelheader, 1);
                      iremovemodelheader = iremovemodelheader - 1;
                    }
                  }
                }
              }
            }
           



            for (let i = 0; i < this.feature_itm_list_table.length; i++) {
              if (this.feature_itm_list_table[i].FeatureId == feature_model_data.OPTM_FEATUREID && this.feature_itm_list_table[i].Item == feature_model_data.OPTM_ITEMKEY) {
                this.feature_itm_list_table.splice(i, 1);
                i = i - 1;
              }
            }
            this.enableFeatureModelsItems();
            this.RuleIntegration(data.RuleOutputData, value);
            this.feature_price_calculate();
            this.showLookupLoader = false;
          }
        }//end data null
        this.showLookupLoader = false;
      },//end data
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    );//end subscribe


    this.feature_price_calculate();

  } //end selection

  setItemDataForFeature(ItemData, parentarray, propagateqtychecked, propagateqty, tempfeaturecode, lineno) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    if (ItemData.length > 0) {
      if (parentarray[0].element_type == "radio") {
        for (let i = 0; i < this.feature_itm_list_table.length; i++) {
          if (parentarray[0].OPTM_TYPE == 1) {
            if (this.feature_itm_list_table[i].FeatureId == ItemData[0].OPTM_FEATUREID) {
              this.feature_itm_list_table.splice(i, 1);
              i = i - 1;
            }
          }
          else if (parentarray[0].OPTM_TYPE == 3) {
            if (this.feature_itm_list_table[i].ModelId == ItemData[0].OPTM_MODELID) {
              this.feature_itm_list_table.splice(i, 1);
              i = i - 1;
            }
          }

        }
      }
      var isExist;
      if (parentarray[0].OPTM_TYPE == 1) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ItemData[0].OPTM_FEATUREID && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
        });
      }
      else if (parentarray[0].OPTM_TYPE == 3) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['ModelId'] == ItemData[0].OPTM_MODELID && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
        });
      }
      else {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['ModelId'] == ItemData[0].OPTM_MODELID && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
        });
      }
      var formatequantity: any;
      if (propagateqtychecked == "Y" && ItemData[0].OPTM_PROPOGATEQTY == "Y") {
        propagateqty = parseFloat(propagateqty).toFixed(3)
        ItemData[0].OPTM_QUANTITY = propagateqty
        ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
        formatequantity = ItemData[0].OPTM_QUANTITY * this.step2_data.quantity
      }
      else {
        ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
        formatequantity = ItemData[0].OPTM_QUANTITY
      }
      var priceextn: any = formatequantity * ItemData[0].Price
      var tempModelID
      if (parentarray[0].parentmodelid != this.step2_data.model_id) {
        tempModelID = parentarray[0].parentmodelid
      }
      else {
        tempModelID = parentarray[0].OPTM_MODELID
      }


      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ItemData[0].OPTM_FEATUREID,
          featureName: tempfeaturecode,
          Item: ItemData[0].OPTM_ITEMKEY,
          ItemNumber: ItemData[0].DocEntry,
          Description: ItemData[0].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          price: ItemData[0].ListName,
          Actualprice: parseFloat(ItemData[0].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          // ModelId: ItemData[0].OPTM_MODELID,
          ModelId: tempModelID,
          OPTM_LEVEL: parentarray[0].OPTM_LEVEL,
          isQuantityDisabled: true,
          HEADER_LINENO: lineno
        });
      }
    }

    this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)

    this.feature_price_calculate();

  }

  

  onShipToChange(SelectedShipTo) {

    this.step1_data.ship_to = SelectedShipTo;

    this.ship_data = [];
    this.ship_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedShipTo,
      currentDate: this.submit_date
    });
    this.showLookupLoader = true;
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.showLookupLoader = false;
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else {
          this.step1_data.ship_to_address = '';
          this.showLookupLoader = false;
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }

  onBillToChange(SelectedBillTo) {
    this.step1_data.bill_to = SelectedBillTo;
    this.bill_data = [];
    this.bill_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedBillTo,
      currentDate: this.submit_date
    });
    this.showLookupLoader = true;
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.BillingAdress[0] != undefined) {
            this.showLookupLoader = false;
            this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
          }
        }
        else {
          this.showLookupLoader = false;
          this.step1_data.bill_to_address = '';
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }
  onCustomerChange() {
    this.showLookupLoader = true;
    this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data === "False") {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.invalidcustomer, this.commonData.toast_config);
          this.isNextButtonVisible = false;
          this.step1_data.customer = "";
          this.step1_data.customer_name = '';
          this.contact_persons = [];
          this.sales_employee = [];
          this.ship_to = [];
          this.step1_data.ship_to_address = '';
          this.step1_data.bill_to_address = '';
          this.bill_to = [];
          this.owner_list = [];
          return;
        }

        else {
          this.isNextButtonVisible = true;
          this.getCustomerAllInfo();
        }
      }, error => {
        this.showLookupLoader = false;
      }
    )
  }

  GetCustomername() {
    this.OutputService.GetCustomername(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )
  }

  onDocumentChange(documentValue) {
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else if (this.step1_data.document == "sales_order") {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
    else {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.draft;
    }
  }

  onFinishPress(screen_name, button_press) {
   // if (button_press == 'finishPress' ) {
      // this.onValidateNextPress(true, "");
      this.generate_unique_key();
    // }
    this.showLookupLoader = true;
    let final_dataset_to_save: any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTDTL = [];
    final_dataset_to_save.OPConfig_OUTPUTLOG = [];
    final_dataset_to_save.ConnectionDetails = [];
    let total_discount = (Number(this.feature_discount_percent) + Number(this.accessory_discount_percent));
    
    //Creating OutputLog table
    final_dataset_to_save.OPConfig_OUTPUTLOG.push({
      "OPTM_LOGID": this.iLogID,
      "OPTM_DOCTYPE": this.step1_data.document,
      "OPTM_PAYMENTTERM":0,
      "OPTM_DESC": this.step1_data.description,
      "OPTM_PRODTOTAL": Number(this.step4_final_prod_total),
      "OPTM_PRODDISCOUNT" : Number(this.prod_discount_log),
      "OPTM_ACCESSORYTOTAL": Number(this.step4_final_acc_total),
      "OPTM_ACCESSORYDISAMOUNT" :Number(this.access_dis_amount_log),
      "OPTM_GRANDTOTAL": Number(this.step4_final_grand_total),
      "OPTM_CREATEDBY": this.common_output_data.username
    });

    let delivery_date_string =  (this.step1_data.delivery_until.getMonth() + 1) + "/" + this.step1_data.delivery_until.getDate() + "/" + this.step1_data.delivery_until.getFullYear();
    for(let iHdrCount = 0; iHdrCount < this.step3_data_final.length; iHdrCount++){
       final_dataset_to_save.OPConfig_OUTPUTHDR.push({
      "OPTM_LOGID": this.iLogID,
      "OPTM_OUTPUTID": "",
      "OPTM_DOCTYPE": this.step1_data.document,
      "OPTM_BPCODE": this.step1_data.customer,
      "OPTM_SHIPTO": this.step1_data.ship_to,
      "OPTM_BILLTO": this.step1_data.bill_to,
      "OPTM_CONTACTPERSON": this.step1_data.person_name,
      "OPTM_TAX": this.acc_item_tax,
      "OPTM_PAYMENTTERM": 0,
      "OPTM_FGITEM": this.step3_data_final[iHdrCount].item,
      "OPTM_KEY": "",
      "OPTM_DELIVERYDATE": delivery_date_string,
      "OPTM_QUANTITY": parseFloat(this.step3_data_final[iHdrCount].quantity).toFixed(3),
      "OPTM_CREATEDBY": this.common_output_data.username,
      "OPTM_MODIFIEDBY": this.common_output_data.username,
      "OPTM_DESC": this.step3_data_final[iHdrCount].desc,
      "OPTM_SALESEMP": this.step1_data.sales_employee,
      "OPTM_OWNER": this.step1_data.owner,
      "OPTM_REMARKS": this.step1_data.remark,
      "OPTM_BILLADD": this.step1_data.bill_to_address,
      "OPTM_SHIPADD": this.step1_data.ship_to_address,
      "OPTM_POSTINGDATE": this.step1_data.posting_date,
      "OPTM_GRANDTOTAL": Number(this.step3_data_final[iHdrCount].discounted_price),
      "OPTM_PRODTOTAL": Number(this.step3_data_final[iHdrCount].price_ext),
      "OPTM_TOTALBEFOREDIS": Number(this.step3_data_final[iHdrCount].price),
      "OPTM_PRODDISCOUNT": Number(this.step3_data_final[iHdrCount].feature_discount_percent),
      "OPTM_ACCESSORYDIS":"",
      "OPTM_ACCESSORYTOTAL": "",
      "OPTM_TOTALDISCOUNT": "",
    })
    }

    //creating details table array
   final_dataset_to_save.OPConfig_OUTPUTDTL = this.step2_final_dataset_to_save;
   // final_dataset_to_save.OPConfig_OUTPUTDTL=this.step4_final_DetailModelData
    if (button_press == undefined) {
      button_press = "finishPress"
    }
    //creating connection detials
    final_dataset_to_save.ConnectionDetails.push({
      CompanyDBID: this.common_output_data.companyName,
      ScreenData: screen_name,
      OperationType: this.step1_data.main_operation_type,
      Button: button_press,
      currentDate: this.submit_date
      //ConfigType: this.step1_data.main_operation_type
    })
    var obj = this;
    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        if (data != null || data != undefined) {
          if (data[0].Status == "True") {
            this.showLookupLoader = false;
            this.iLogID = data[0].LogId;
            this.toastr.success('', this.language.OperCompletedSuccess, this.commonData.toast_config);
            setTimeout(function(){
              obj.getFinalBOMStatus();
            }, 100);
          }
          else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
            return;
          }

        }
        else {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )
    
  }
  colSpanValue(e){
    setTimeout(() => {  
      $('.opti_screen4-detail-row-lastchildTable .k-detail-row td.k-detail-cell').attr('colspan',9);
    }, 1000);
  }
  openPriceListLookup() {
  }

  delete_multiple_final_modal() {
    console.log(this.final_array_checked_options);
    if (this.final_array_checked_options.length > 0) {

      this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
      this.show_dialog = true;

    } else {
      this.toastr.error('', this.language.no_model_selected, this.commonData.toast_config);
    }

  }

  remove_final_modal(row_data) {
    this.isMultiDelete = false;
    this.final_row_data = row_data;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }

  on_checkbox_checked(checkedvalue, row_data) {
    this.rows = row_data;
    if (checkedvalue.checked == true) {
      this.isMultiDelete = true;
      this.final_array_checked_options.push(row_data);
    }
    else {
      let i = this.final_array_checked_options.indexOf(row_data);
      this.final_array_checked_options.splice(i, 1)
    }
    console.log(this.final_array_checked_options);
  }

  refresh_bom_status() {
    this.showLookupLoader = true;
    this.dontShowFinalLoader = true;
    this.showFinalLoader = false;
    this.getFinalBOMStatus();
  }

  tree_view_expand_collapse() {
    let laguage = this.language;
    // $(document).find('.tree li:has(ul)').addClass('parent_li').find('span.parent_span').find("i.fa").addClass("fa-plus");
  }

  //This will recurse the tree
  get_childrens(component) {
    let data = this.complete_dataset.filter(function (obj) {
      return obj['parentId'] == component;
    });
    return data;
  }

  check_component_exist(component, level) {
    level = (parseInt(level) + 1);
    let data = this.tree_data_json.filter(function (obj) {
      return obj['parentId'] == component && obj['level'] == level;
    });
    return data;
  }

  //Row Deletion
  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      if (this.isMultiDelete == false) {
        this.delete_row();
      }
      else {
        this.delete_all_row_data();
      }
    }
    this.show_dialog = false;
  }

  delete_row() {
    this.cleanupAccessories(this.final_row_data.model_id);
    this.cleanupFeatureItemList(this.final_row_data.model_id);
    this.cleanuptree();
    this.cleanupFinalArray(this.final_row_data.model_id);

    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_discount_percent = 0;
    this.accessory_item_total = 0;
    this.acc_grand_total = 0;
    this.step2_data.modal_id = '';
    this.step2_data.model_code = '';
    this.feature_itm_list_table = [];
    $(".accesory_check_for_second_screen").prop('checked', false);
    this.step2_selected_model_id = '';
    this.step2_selected_model = '';

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
    this.step4_final_price_calculation();
  }

  delete_all_row_data() {
    for (let iCount = 0; iCount < this.final_array_checked_options.length; iCount++) {
      //clean Accessory List Array
      this.cleanupAccessories(this.final_array_checked_options[iCount].model_id);
      //Clean Feature List Array
      this.cleanupFeatureItemList(this.final_array_checked_options[iCount].model_id);
      //Clean Final Array (step3_data_final_data)
      this.cleanupFinalArray(this.final_array_checked_options[iCount].model_id);
    }

    //Clean Tree Data
    this.cleanuptree();

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
  }

  cleanupAccessories(current_model_id) {
    //Get the modal id and clean the data of accessories here
    for (let count = 0; count < this.feature_accessory_list.length; count++) {
      if (current_model_id == this.feature_accessory_list[count].model_id) {
        this.feature_accessory_list.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanupFeatureItemList(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.feature_itm_list_table.length; count++) {
      if (current_model_id == this.feature_itm_list_table[count].ModelId) {
        this.feature_itm_list_table.splice(count, 1);
        count = count - 1;
      }
    }

  }

  cleanupFinalArray(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.step3_data_final.length; count++) {
      if (current_model_id == this.step3_data_final[count].model_id) {
        this.step3_data_final.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanuptree() {
    this.tree_data_json = [];
    this.complete_dataset = [];
    this.tree_data_json.length = 0;
    this.complete_dataset.length = 0;
    this.ModelHeaderData = [];
    this.FeatureBOMDataForSecondLevel = [];
    this.ModelBOMDataForSecondLevel = [];
  }

  onAddedModelChange(model_row_index, from_step4){
    console.log(model_row_index);
    if (model_row_index != "" && model_row_index != undefined){
      this.showLookupLoader = true;
      this.onclearselection(0);
      var current_row = 0;
      for (var i = 0; i < this.step3_data_final.length; i++) {
        if (this.step3_data_final[i] !== undefined) {
          if (this.step3_data_final[i].rowIndex == model_row_index) {
            current_row = i;

          }
        }
      }

      this.step2_selected_model = this.step3_data_final[current_row];
      this.step2_data.model_id = this.step2_selected_model.model_id; 
      this.step2_data.model_code = this.step2_selected_model.item;
      this.step2_data.quantity = parseInt(this.step2_selected_model.quantity);
      this.feature_accessory_list = this.step2_selected_model.accesories;
      this.feature_itm_list_table = this.step2_selected_model.feature;
      this.ModelHeaderData = this.step2_selected_model.ModelHeaderData;
      this.FeatureBOMDataForSecondLevel = this.step2_selected_model.FeatureBOMDataForSecondLevel;
      this.ModelBOMDataForSecondLevel = this.step2_selected_model.ModelBOMDataForSecondLevel;
      this.step2_selected_model_id = model_row_index;
      this.feature_discount_percent = this.step2_selected_model.feature_discount_percent;
      this.accessory_discount_percent = this.step2_selected_model.accessory_discount_percent;
      this.ModelHeaderItemsArray = this.step2_selected_model.ModelHeaderItemsArray;
      this.step2_data.templateid =  this.step2_selected_model.templateid;
      this.step2_data.itemcodegenkey =  this.step2_selected_model.itemcodegenkey;
      this.Accessoryarray =  this.step2_selected_model.Accessoryarray;
      this.feature_price_calculate();
      this.showLookupLoader = false;

      if (from_step4 !== undefined && from_step4 != "") {
        from_step4();
      }
    } else {
      this.onclearselection(1);
    }
    
  }

  step4_edit_model(model_data){
    this.onAddedModelChange(model_data.rowIndex, function(){
       $("fieldset").hide();
       $("fieldset").eq(2).show();
    });

  }

  step4_final_price_calculation(){

    this.step4_final_prod_total = 0;
    this.step4_final_acc_total  = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;

    if (this.step3_data_final.length > 0 && this.step3_data_final!= undefined){
      for (var i = 0; i < this.step3_data_final.length; i++) {
        let step3_temp = this.step3_data_final[i];
        this.step4_final_prod_total += Number(step3_temp.price_ext); 
        this.step4_final_acc_total += Number(step3_temp.accessory_total_before_dis);
        this.prod_discount_log += Number(step3_temp.discount_amount);
        this.access_dis_amount_log += Number(step3_temp.accessory_discount_amount);
      }
    }
    this.step4_final_grand_total = (Number(this.step4_final_prod_total) + Number(this.step4_final_acc_total)) - (this.prod_discount_log + this.access_dis_amount_log);
  
  }
  

  add_fg_multiple_model(){
    var obj = this;
    this.onValidateNextPress(false, function(){
      $(".multiple_model_click_btn").attr("disabled", "true");
      obj.fill_step3_data_array('add', '0');
      setTimeout(() => {
        obj.onclearselection(1);
       $(".accesory_check_for_second_screen").prop('checked', false);
        $(".multiple_model_click_btn").removeAttr("disabled");
      }, 400);
    })
  }

  update_added_model(){
    $(".multiple_model_click_btn").attr("disabled", "true");
    
    this.console.log(this.step3_data_final.length);
    for (var i = 0; i < this.step3_data_final.length; i++){
      if (this.step3_data_final[i] !== undefined){
        if (this.step3_data_final[i].rowIndex == this.step2_selected_model_id){
          this.fill_step3_data_array('update', i);
        }
      }
    }
    $(".multiple_model_click_btn").removeAttr("disabled");    
  }

  fill_step3_data_array(mode, row_id){
    $(".multiple_model_click_btn").attr("disabled", "true");
    let feature_discount:any  = 0;
    let fg_discount_amount: any = 0;
    if (this.feature_discount_percent !== undefined && this.feature_discount_percent != 0){
      feature_discount = Number(this.feature_discount_percent);
    }
    
    let accessory_discount:any = 0;
    if (this.accessory_discount_percent !== undefined && this.accessory_discount_percent != 0) {
      accessory_discount = Number(this.accessory_discount_percent);
    }
    let product_total:any = 0;
   
   /*  if(accessory_discount == 0){
      product_total = Number(this.feature_total_before_discount) - Number(this.accessory_item_total);
    } else {
      
      product_total = Number(this.feature_total_before_discount) - Number((Number(this.accessory_item_total) * (Number(accessory_discount) / 100))); 
    } */
/* 
    if(feature_discount == 0){
      product_total = Number(this.feature_item_total);
    } else {
      product_total = Number(this.feature_item_total) - Number((Number(this.feature_item_total) * (Number(accessory_discount) / 100))) ;
    } */

    product_total = this.step3_feature_price_bef_dis;
    // step3_acc_price_bef_dis
    
    let per_item_price: any = (product_total / Number(this.step2_data.quantity));
    let price_ext: any = product_total;
    let rowIndex = 0;
    let sl_no = 0;
    let tota_dis_on_acces:any = 0;
    let acc_total_before_dis:any = 0;
    if (feature_discount != 0){
      fg_discount_amount = (price_ext * feature_discount) / 100;
    } else {
      fg_discount_amount = 0;
    }

    for (let fiti = 0; fiti < this.feature_itm_list_table.length; fiti++) {
      var discount_amount = 0;
      this.feature_itm_list_table[fiti].gross = Number(this.feature_itm_list_table[fiti].pricextn);
       this.feature_itm_list_table[fiti].discount = 0;
      if (this.feature_itm_list_table[fiti].is_accessory == 'Y'){
        acc_total_before_dis += Number(this.feature_itm_list_table[fiti].pricextn);
        if(accessory_discount != 0){
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (accessory_discount / 100));
          tota_dis_on_acces += Number(discount_amount);
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (accessory_discount);
        }
      } else {
        if (feature_discount!= 0){
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (feature_discount / 100));
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (feature_discount);
        } 
      }
      this.feature_itm_list_table[fiti].dicount_amount = (discount_amount).toFixed(3);
    }

    if (mode == 'add'){
        if (this.step3_data_final.length > 0) {
          rowIndex = this.step3_data_final.length;
          sl_no = this.step3_data_final.length;
        }
        rowIndex++;
        sl_no++;
        this.step3_data_final.push({
          "rowIndex": rowIndex,
          "sl_no": sl_no,
          "item": this.step2_data.model_code,
          "quantity": parseFloat(this.step2_data.quantity).toFixed(3),
          "price": parseFloat(per_item_price).toFixed(3),
          "price_ext": parseFloat(price_ext).toFixed(3),
          "discounted_price": (this.feature_item_total).toFixed(3),
          "discount_amount": (fg_discount_amount).toFixed(3),
          "accessory_discount_amount": parseFloat(tota_dis_on_acces).toFixed(3),
          "accessory_total_before_dis": parseFloat(acc_total_before_dis).toFixed(3),
          "feature": this.feature_itm_list_table,
          "accesories": this.feature_accessory_list,
          "accessory_item_total": (this.accessory_item_total).toFixed(3),
          "model_id": this.step2_data.model_id,
          "desc": this.step2_data.model_name,
          "ModelHeaderData": this.ModelHeaderData,
          "FeatureBOMDataForSecondLevel": this.FeatureBOMDataForSecondLevel,
          "ModelBOMDataForSecondLevel": this.ModelBOMDataForSecondLevel,
          "feature_discount_percent": feature_discount,
          "accessory_discount_percent": accessory_discount,
          "accesory_final_price": (this.accessory_item_total).toFixed(3),
          "templateid" : this.step2_data.templateid,
          "itemcodegenkey": this.step2_data.itemcodegenkey,
          "ModelHeaderItemsArray" : this.ModelHeaderItemsArray,
          "Accessoryarray": this.Accessoryarray,
        });
        // this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
      } else {
          this.step3_data_final[row_id]["item"]  =  this.step2_data.model_code;
          this.step3_data_final[row_id]["quantity"]  =  parseFloat(this.step2_data.quantity).toFixed(3);
          this.step3_data_final[row_id]["price"]  =  parseFloat(per_item_price).toFixed(3);
          this.step3_data_final[row_id]["price_ext"] = parseFloat(price_ext).toFixed(3);
          this.step3_data_final[row_id]["discounted_price"] = (this.feature_item_total).toFixed(3);
          this.step3_data_final[row_id]["discount_amount"] = (fg_discount_amount).toFixed(3);
          this.step3_data_final[row_id]["accessory_discount_amount"] = parseFloat(tota_dis_on_acces).toFixed(3);
          this.step3_data_final[row_id]["accessory_total_before_dis"] = parseFloat(acc_total_before_dis).toFixed(3);
          this.step3_data_final[row_id]["feature"]  =  this.feature_itm_list_table;
          this.step3_data_final[row_id]["accesories"]  =  this.feature_accessory_list;
          this.step3_data_final[row_id]["model_id"]  =  this.step2_data.model_id;
          this.step3_data_final[row_id]["desc"]  =  this.step2_data.model_name;
          this.step3_data_final[row_id]["ModelHeaderData"] = this.ModelHeaderData;
          this.step3_data_final[row_id]["FeatureBOMDataForSecondLevel"] = this.FeatureBOMDataForSecondLevel;
          this.step3_data_final[row_id]["ModelBOMDataForSecondLevel"]  =  this.ModelBOMDataForSecondLevel;
          this.step3_data_final[row_id]["feature_discount_percent"] = feature_discount;
          this.step3_data_final[row_id]["accessory_discount_percent"] = accessory_discount;
          this.step3_data_final[row_id]["accesory_final_price"] = (this.accessory_item_total).toFixed(3);
          this.step3_data_final[row_id]["accessory_item_total"] = (this.accessory_item_total).toFixed(3);
          this.step3_data_final[row_id]["templateid"] = this.step2_data.templateid;
          this.step3_data_final[row_id]["itemcodegenkey"] = this.step2_data.itemcodegenkey;
          this.step3_data_final[row_id]["ModelHeaderItemsArray"] =  this.ModelHeaderItemsArray;
          this.step3_data_final[row_id]["Accessoryarray"] = this.Accessoryarray;
          this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
        }
        this.console.log( "this.step3_data_final");
        this.console.log( this.step3_data_final);
        this.step4_final_price_calculation();
    $(".multiple_model_click_btn").removeAttr("disabled");
  }

    

  onValidateNextPress(navigte, for_multiple_model ) {
    this.navigatenextbtn = false;
    this.validnextbtn = true;
    if (navigte == true && this.step3_data_final.length > 0) {
      $("#modelbom_next_click_id").trigger('click');
      return;
    }

    if (this.feature_itm_list_table.length == 0) {
      this.toastr.error('', this.language.no_item_selected, this.commonData.toast_config);
      return;
    }

    var isMandatoryItems = this.ModelHeaderData.filter(function (obj) {
      return obj['OPTM_MANDATORY'] == "Y"
    })
    let isMandatoryCount = 0;
    var counted = 0;
    var itemnotselectedarray = [];
    if (isMandatoryItems.length > 0) {
      for (let imandtory = 0; imandtory < isMandatoryItems.length; imandtory++) {
        if (isMandatoryItems[imandtory].OPTM_TYPE == "3") {
          for (let ifeatureitems = 0; ifeatureitems < this.feature_itm_list_table.length; ifeatureitems++) {
            if (isMandatoryItems[imandtory].OPTM_CHILDMODELID == this.feature_itm_list_table[ifeatureitems].FeatureId) {
              isMandatoryCount++;
              counted = 1;
              break;
            }
          }
        }
        else if (isMandatoryItems[imandtory].OPTM_TYPE == "1") {
          for (let ifeatureBOMitems = 0; ifeatureBOMitems < this.FeatureBOMDataForSecondLevel.length; ifeatureBOMitems++) {
            if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].parent_code && this.FeatureBOMDataForSecondLevel[ifeatureBOMitems].checked == true) {
              isMandatoryCount++;
              counted = 1;
              break;
            }
          }
          for (let imodelBOMitems = 0; imodelBOMitems < this.ModelBOMDataForSecondLevel.length; imodelBOMitems++) {
            if (isMandatoryItems[imandtory].OPTM_FEATUREID == this.ModelBOMDataForSecondLevel[imodelBOMitems].OPTM_FEATUREID && isMandatoryItems[imandtory].feature_code == this.ModelBOMDataForSecondLevel[imodelBOMitems].parent_code && this.ModelBOMDataForSecondLevel[imodelBOMitems].checked == true) {
              isMandatoryCount++;
              counted = 1;
              break;
            }
          }
        }
        if (counted == 0) {
          itemnotselectedarray.push(isMandatoryItems[imandtory].OPTM_DISPLAYNAME)
        }
        counted = 0;
      }
    }
    if (isMandatoryCount != isMandatoryItems.length) {
      var psmsg = this.language.MandatoryItems
      if (itemnotselectedarray.length > 0) {
        for (var item in itemnotselectedarray) {
          psmsg = psmsg + " - " + itemnotselectedarray[item]
        }
      }
      this.toastr.error('', psmsg, this.commonData.toast_config);
      return;
    }
    for (let iMinModelHeaderData = 0; iMinModelHeaderData < this.ModelHeaderData.length; iMinModelHeaderData++) {
      if (this.ModelHeaderData[iMinModelHeaderData].OPTM_MANDATORY == "Y") {
        if (this.ModelHeaderData[iMinModelHeaderData].OPTM_TYPE == "1") {
          var tempfeatureid = this.ModelHeaderData[iMinModelHeaderData].OPTM_FEATUREID
          var isMinItemsCounted = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_FEATUREID'] == tempfeatureid && obj['checked'] == true
          })
        }
        else if (this.ModelHeaderData[iMinModelHeaderData].OPTM_TYPE == "3") {
          var tempfeatureid = this.ModelHeaderData[iMinModelHeaderData].OPTM_CHILDMODELID
          var isMinItemsCounted = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_MODELID'] == tempfeatureid && obj['checked'] == true
          })
        }

        if (isMinItemsCounted.length < this.ModelHeaderData[iMinModelHeaderData].OPTM_MINSELECTABLE) {
          this.toastr.error('', this.language.Minimumitemsarenotselected + this.ModelHeaderData[iMinModelHeaderData].OPTM_DISPLAYNAME, this.commonData.toast_config);
          return;
        }
      }

    }


    this.navigatenextbtn = true;
    // this.validnextbtn=false;
    if (navigte == true){
      $("#modelbom_next_click_id").trigger('click');
      // this.onModelBillNextPress(); // method commented 
      if (this.step3_data_final.length == 0){
        this.fill_step3_data_array('add', '0');
        this.step2_selected_model = this.step3_data_final[0];
        this.step2_selected_model_id = 1;
      }  
    }  else {
      for_multiple_model();
    }
  }

  generate_unique_key(){
    this.step2_final_dataset_to_save = [];
    if(this.step3_data_final.length > 0 && this.step3_data_final!== undefined){
      for (var mj = 0; mj < this.step3_data_final.length; mj++){ // step3_data_final_loop
        if (this.step3_data_final[mj] !== undefined){
          var step3_data_row = this.step3_data_final[mj];
          var imodelfilteritems = [];
          var itemkeyforparentmodel = "";
          var temp_step2_final_dataset_save = [];

        
            temp_step2_final_dataset_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": "",
              "OPTM_ITEMCODE": step3_data_row.item,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": step3_data_row.templateid,
              "OPTM_ITMCODEGENKEY": step3_data_row.itemcodegenkey,
              "OPTM_ITEMTYPE": 0,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": 0,
              "OPTM_QUANTITY": parseFloat(step3_data_row.quantity).toFixed(3),
              "OPTM_PRICELIST": 0,
              "OPTM_UNITPRICE": parseFloat("0").toFixed(3),
              "OPTM_TOTALPRICE": parseFloat("0").toFixed(3),
              "OPTM_DISCPERCENT": 0,
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": "Y",
              "PARENTID": step3_data_row.model_id,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": step3_data_row.model_id,
              "OPTM_PARENTTYPE": 2
            })
          } // if step3 data ot undefined if - end 
       
          for (var ifeature in step3_data_row.feature) {
            if (step3_data_row.feature[ifeature].Item == null || step3_data_row.feature[ifeature].Item == "" || step3_data_row.feature[ifeature].Item == undefined) {
              imodelfilteritems = [];
              var imodelfilterfeatures = [];
              var imodelData = [];
              var tempfeatureid = step3_data_row.feature[ifeature].FeatureId
      
              imodelData = step3_data_row.ModelHeaderData.filter(function (obj) {
                return obj['OPTM_CHILDMODELID'] == tempfeatureid
              })
      
              imodelfilteritems = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                return obj['OPTM_MODELID'] == tempfeatureid && obj['OPTM_TYPE'] == 2
              })
      
              imodelfilterfeatures = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                return obj['OPTM_MODELID'] == tempfeatureid && obj['OPTM_TYPE'] == 1
              })
      
              var matchmodelitemarray = [];
      
              matchmodelitemarray = step3_data_row.feature.filter(function (obj) {
                return obj['ModelId'] == tempfeatureid
              })
      
              if (matchmodelitemarray.length > 0) {
                for (var imatchmodel in matchmodelitemarray) {
                  var indexmatchmodelitemarray = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
                    return matchmodelitemarray[imatchmodel].Item == obj['OPTM_ITEMKEY'] && matchmodelitemarray[imatchmodel].FeatureId == obj['OPTM_FEATUREID']
                  })
      
                  if (indexmatchmodelitemarray.length > 0)
                    imodelfilteritems.push({
                      DocEntry: matchmodelitemarray[imatchmodel].ItemNumber,
                      OPTM_UNIQUEIDNT: imodelData[0].OPTM_UNIQUEIDNT,
                      OPTM_ITEMKEY: indexmatchmodelitemarray[0].OPTM_ITEMKEY,
                      OPTM_MODELID: imodelData[0].OPTM_MODELID
                    })
      
                }
      
              }
              var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
              formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
      
              temp_step2_final_dataset_save.push({
                "OPTM_OUTPUTID": "",
                "OPTM_OUTPUTDTLID": "",
                "OPTM_ITEMNUMBER": "",
                "OPTM_ITEMCODE": step3_data_row.feature[ifeature].featureName,
                "OPTM_KEY": "",
                "OPTM_PARENTKEY": "",
                "OPTM_TEMPLATEID": imodelData[0].MODELTEMPLATEITEM,
                "OPTM_ITMCODEGENKEY": imodelData[0].ITEMCODEGENREF,
                "OPTM_ITEMTYPE": 1,
                "OPTM_WHSE": this.warehouse,
                "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
                "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
                "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
                "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
                "OPTM_TOTALPRICE": formatedTotalPrice,
                "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount),
                "OPTM_CREATEDBY": this.common_output_data.username,
                "OPTM_MODIFIEDBY": this.common_output_data.username,
                "UNIQUEIDNT": imodelData[0].OPTM_UNIQUEIDNT,
                "PARENTID": imodelData[0].OPTM_MODELID,
                "OPTM_FGCREATEDATE": "",
                "OPTM_REFITEMCODE": "",
                "OPTM_PARENTID": imodelData[0].OPTM_MODELID,
                "OPTM_PARENTTYPE": 2
              })
      
              if (imodelfilteritems.length > 0) {
                var featureitemlistfilterdata = [];
                itemkeyforparentmodel = "";
                for (var i in imodelfilteritems) {
                  var itemtype;
                  if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                    itemtype = 3;
                  }
                  else {
                    itemtype = 2;
                  }
      
                  if (itemkeyforparentmodel.length == 0) {
                    if (imodelfilteritems[i].OPTM_UNIQUEIDNT == "Y")
                      itemkeyforparentmodel = imodelfilteritems[i].DocEntry
      
                  }
                  else {
                    if (imodelfilteritems[i].OPTM_UNIQUEIDNT == "Y")
                      itemkeyforparentmodel = itemkeyforparentmodel + "-" + imodelfilteritems[i].DocEntry
      
                  }
      
                  featureitemlistfilterdata = step3_data_row.feature.filter(function (obj) {
                    return obj['Item'] == imodelfilteritems[i].OPTM_ITEMKEY && obj['ModelId'] == imodelfilteritems[i].OPTM_MODELID
                  })
      
                  var checkmodelitem = step3_data_row.ModelBOMDataForSecondLevel.filter(function (obj) {
                    return obj['OPTM_MODELID'] == featureitemlistfilterdata[0].ModelId && obj['OPTM_TYPE'] == 2 &&
                      obj['OPTM_ITEMKEY'] == featureitemlistfilterdata[0].Item
                  })
                  var formatedTotalPrice: any = featureitemlistfilterdata[0].quantity * featureitemlistfilterdata[0].Actualprice
                  formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
      
                  if (checkmodelitem.length > 0) {
                    temp_step2_final_dataset_save.push({
                      "OPTM_OUTPUTID": "",
                      "OPTM_OUTPUTDTLID": "",
                      "OPTM_ITEMNUMBER": imodelfilteritems[i].DocEntry,
                      "OPTM_ITEMCODE": featureitemlistfilterdata[0].Item,
                      "OPTM_KEY": "",
                      "OPTM_PARENTKEY": "",
                      "OPTM_TEMPLATEID": "",
                      "OPTM_ITMCODEGENKEY": "",
                      "OPTM_ITEMTYPE": itemtype,
                      "OPTM_WHSE": this.warehouse,
                      "OPTM_LEVEL": featureitemlistfilterdata[0].OPTM_LEVEL,
                      "OPTM_QUANTITY": parseFloat(featureitemlistfilterdata[0].quantity).toFixed(3),
                      "OPTM_PRICELIST": Number(featureitemlistfilterdata[0].price),
                      "OPTM_UNITPRICE": parseFloat(featureitemlistfilterdata[0].Actualprice).toFixed(3),
                      "OPTM_TOTALPRICE": formatedTotalPrice,
                      "OPTM_DISCPERCENT": parseFloat(featureitemlistfilterdata[0].discount),
                      "OPTM_CREATEDBY": this.common_output_data.username,
                      "OPTM_MODIFIEDBY": this.common_output_data.username,
                      "UNIQUEIDNT": imodelfilteritems[i].OPTM_UNIQUEIDNT,
                      "PARENTID": imodelfilteritems[i].OPTM_MODELID,
                      "OPTM_FGCREATEDATE": "",
                      "OPTM_REFITEMCODE": "",
                      "OPTM_PARENTID": imodelfilteritems[i].OPTM_MODELID,
                      "OPTM_PARENTTYPE": 2
                    })
                  }
                }
      
                for (var isave in temp_step2_final_dataset_save) {
                  if (temp_step2_final_dataset_save[isave].PARENTID == imodelData[0].OPTM_MODELID && temp_step2_final_dataset_save[isave].OPTM_ITEMCODE == imodelData[0].child_code) {
                    temp_step2_final_dataset_save[isave].OPTM_KEY = itemkeyforparentmodel.toString()
                  }
                }
      
              }
              var modelfeatureitemkey = "";
              if (imodelfilterfeatures.length > 0) {
                for (var ifeaitem in imodelfilterfeatures) {
                  var filterfeatureitems = step3_data_row.feature.filter(function (obj) {
                    return obj['FeatureId'] == imodelfilterfeatures[ifeaitem].OPTM_FEATUREID
                  })
      
                  if (filterfeatureitems.length > 0) {
                    for (var ifeafilteritem in filterfeatureitems) {
                      if (imodelfilterfeatures[ifeaitem].OPTM_UNIQUEIDNT == "Y") {
                        if (modelfeatureitemkey.length == 0) {
                          modelfeatureitemkey = filterfeatureitems[ifeafilteritem].ItemNumber
                        } else {
                          modelfeatureitemkey = modelfeatureitemkey + "-" + filterfeatureitems[ifeafilteritem].ItemNumber
                        }
                      }
                    }
                  }
      
      
                }
                for (var isavedataset in temp_step2_final_dataset_save) {
                  if (temp_step2_final_dataset_save[isavedataset].OPTM_ITEMTYPE == "1" && modelfeatureitemkey != "") {
                    temp_step2_final_dataset_save[isavedataset].OPTM_KEY = modelfeatureitemkey.toString()
                  }
                }
              }
            }
            else {
              var ifeatureData = [];
              var itemtype;
              var fid = step3_data_row.feature[ifeature].FeatureId;
              if (step3_data_row.feature[ifeature].FeatureId != null) {
                if (step3_data_row.feature[ifeature].FeatureId != step3_data_row.model_id) {
                  var ifeatureHeaderData = [];
                  ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                    return obj['OPTM_FEATUREID'] == fid && obj['OPTM_FEATUREID'] != null
                  })
      
                  if (ifeatureHeaderData.length == 0) {
                    if (step3_data_row.feature[ifeature].is_accessory == "N") {
                      ifeatureHeaderData = step3_data_row.ModelHeaderData.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == step3_data_row.feature[ifeature].Item
                      })
                    }
                    else {
                      ifeatureHeaderData = step3_data_row.Accessoryarray.filter(function (obj) {
                        return obj['OPTM_FEATUREID'] == fid
                      })
                    }
                  }
                  if (ifeatureHeaderData.length == 0) {
                    ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                      return obj['OPTM_ITEMKEY'] == step3_data_row.ModelHeaderItemsArray[ifeature].Item
                    })
                  }
                  var itemcode = step3_data_row.feature[ifeature].OPTM_ITEMKEY
                  if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                    itemtype = 3;
                  }
                  else {
                    itemtype = 2;
                  }
      
                  var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
                  formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
                  // if (ifeatureData.length > 0) {
                  temp_step2_final_dataset_save.push({
                    "OPTM_OUTPUTID": "",
                    "OPTM_OUTPUTDTLID": "",
                    "OPTM_ITEMNUMBER": step3_data_row.feature[ifeature].ItemNumber,
                    "OPTM_ITEMCODE": step3_data_row.feature[ifeature].Item,
                    "OPTM_KEY": "",
                    "OPTM_PARENTKEY": "",
                    "OPTM_TEMPLATEID": "",
                    "OPTM_ITMCODEGENKEY": "",
                    "OPTM_ITEMTYPE": itemtype,
                    "OPTM_WHSE": this.warehouse,
                    "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
                    "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
                    "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
                    "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
                    "OPTM_TOTALPRICE": formatedTotalPrice,
                    "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount),
                    "OPTM_CREATEDBY": this.common_output_data.username,
                    "OPTM_MODIFIEDBY": this.common_output_data.username,
                    "UNIQUEIDNT": ifeatureHeaderData[0].OPTM_UNIQUEIDNT,
                    "PARENTID": step3_data_row.feature[ifeature].FeatureId,
                    "OPTM_FGCREATEDATE": "",
                    "OPTM_REFITEMCODE": "",
                    "OPTM_PARENTID": step3_data_row.feature[ifeature].FeatureId,
                    "OPTM_PARENTTYPE": 1
                  })
                }
                else {
                  var ifeatureHeaderData = [];
                  var itemcode = step3_data_row.feature[ifeature].Item
                  ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                    return obj['OPTM_ITEMKEY'] == itemcode && obj['OPTM_MODELID'] == fid
                  })
      
                  if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                    itemtype = 3;
                  }
                  else {
                    itemtype = 2;
                  }
                  var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
                  formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
      
                  // if (ifeatureData.length > 0) {
                  temp_step2_final_dataset_save.push({
                    "OPTM_OUTPUTID": "",
                    "OPTM_OUTPUTDTLID": "",
                    "OPTM_ITEMNUMBER": step3_data_row.feature[ifeature].ItemNumber,
                    "OPTM_ITEMCODE": step3_data_row.feature[ifeature].Item,
                    "OPTM_KEY": "",
                    "OPTM_PARENTKEY": "",
                    "OPTM_TEMPLATEID": "",
                    "OPTM_ITMCODEGENKEY": "",
                    "OPTM_ITEMTYPE": itemtype,
                    "OPTM_WHSE": this.warehouse,
                    "OPTM_LEVEL": step3_data_row.feature[ifeature].OPTM_LEVEL,
                    "OPTM_QUANTITY": parseFloat(step3_data_row.feature[ifeature].quantity).toFixed(3),
                    "OPTM_PRICELIST": Number(step3_data_row.feature[ifeature].price),
                    "OPTM_UNITPRICE": parseFloat(step3_data_row.feature[ifeature].Actualprice).toFixed(3),
                    "OPTM_TOTALPRICE": formatedTotalPrice,
                    "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount),
                    "OPTM_CREATEDBY": this.common_output_data.username,
                    "OPTM_MODIFIEDBY": this.common_output_data.username,
                    "UNIQUEIDNT": ifeatureHeaderData[0].OPTM_UNIQUEIDNT,
                    "PARENTID": step3_data_row.feature[ifeature].FeatureId,
                    "OPTM_FGCREATEDATE": "",
                    "OPTM_REFITEMCODE": "",
                    "OPTM_PARENTID": step3_data_row.feature[ifeature].FeatureId,
                    "OPTM_PARENTTYPE": 1
                  })
                }
      
                // }
              }
            }
          }

          // key generation array iteration  - start 
          for (var isavemodelchild in imodelfilteritems) {
            for (var isavefinaldatasettosave in temp_step2_final_dataset_save) {
              if (temp_step2_final_dataset_save[isavefinaldatasettosave].OPTM_ITEMNUMBER == imodelfilteritems[isavemodelchild].DocEntry && temp_step2_final_dataset_save[isavefinaldatasettosave].OPTM_ITEMCODE == imodelfilteritems[isavemodelchild].OPTM_ITEMKEY) {
                temp_step2_final_dataset_save[isavefinaldatasettosave].OPTM_PARENTKEY = itemkeyforparentmodel
                temp_step2_final_dataset_save[isavefinaldatasettosave].OPTM_PARENTID = imodelfilteritems[isavemodelchild].OPTM_MODELID
                temp_step2_final_dataset_save[isavefinaldatasettosave].PARENTID = imodelfilteritems[isavemodelchild].OPTM_MODELID
              }
            }
      
          }
       
          var modelitemtype = temp_step2_final_dataset_save.filter(function (obj) {
            return obj['OPTM_ITEMTYPE'] == 1
          })
      
          if (modelitemtype.length > 0) {
            for (var imodelitemtypesave in modelitemtype) {
              var itemnumbersplitnumber = String(modelitemtype[imodelitemtypesave].OPTM_KEY).split("-")
            }
          }
      
          var itemkey = "";
          for (var isave in temp_step2_final_dataset_save) {
            if (temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE == 1) {
               if (temp_step2_final_dataset_save[isave].UNIQUEIDNT == "Y") {
                if (itemkey.length == 0) {
                  itemkey = temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
                } else {
                  itemkey = itemkey + "-" + temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
                }
              }
      
            }
            else if (temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE != 1 && isave != "0" && temp_step2_final_dataset_save[isave].OPTM_PARENTKEY == "" && temp_step2_final_dataset_save[isave].UNIQUEIDNT == "Y" && temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE != 3) {
              var modelitemflag = false;
              for (var i in itemnumbersplitnumber) {
                if (itemnumbersplitnumber[i] == temp_step2_final_dataset_save[isave].OPTM_ITEMNUMBER) {
                  modelitemflag = true
                }
              }
      
              if (modelitemflag == false) {
                if (itemkey.length == 0) {
                  itemkey = temp_step2_final_dataset_save[isave].OPTM_ITEMNUMBER
                } else {
                  itemkey = itemkey + "-" + temp_step2_final_dataset_save[isave].OPTM_ITEMNUMBER
                }
              }
      
            }
      
            temp_step2_final_dataset_save[0].OPTM_KEY = itemkey.toString()
          }
          var sortitemkey = "";
          var sortitemkeyarray = temp_step2_final_dataset_save[0].OPTM_KEY.split("-").sort((a, b) => a - b)
      
          for (var isort in sortitemkeyarray) {
            if (sortitemkey.length == 0) {
              sortitemkey = sortitemkeyarray[isort]
            } else {
              sortitemkey = sortitemkey + "-" + sortitemkeyarray[isort]
            }
          }
      
          temp_step2_final_dataset_save[0].OPTM_KEY = sortitemkey.toString()
          itemkey = sortitemkey
      
          for (var isave in temp_step2_final_dataset_save) {
            if (temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE != 0 && temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE != 3 && temp_step2_final_dataset_save[isave].OPTM_PARENTKEY == "") {
              temp_step2_final_dataset_save[isave].OPTM_PARENTKEY = itemkey
            }
          }
          var modelitemtype = temp_step2_final_dataset_save.filter(function (obj) {
            return obj['OPTM_ITEMTYPE'] == 1
          })
      
          if (modelitemtype.length > 0) {
            for (var imodelitemtypesave in modelitemtype) {
              var itemnumbersplitnumber = String(modelitemtype[imodelitemtypesave].OPTM_KEY).split("-")
              for (var isave in temp_step2_final_dataset_save) {
                if (itemnumbersplitnumber.length > 0) {
                  for (var i in itemnumbersplitnumber) {
                    if (itemnumbersplitnumber[i] == temp_step2_final_dataset_save[isave].OPTM_ITEMNUMBER) {
                      temp_step2_final_dataset_save[isave].OPTM_PARENTKEY = modelitemtype[imodelitemtypesave].OPTM_KEY.toString()
                    }
                  }
                }
              }
            }
          }
          // key generation array iteration - end 
      //  this.step2_final_dataset_to_save.push(temp_step2_final_dataset_save);
        for(let itempsavefinal=0; itempsavefinal<temp_step2_final_dataset_save.length; itempsavefinal++){
          this.step2_final_dataset_to_save.push({
            "OPTM_OUTPUTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTID,
            "OPTM_OUTPUTDTLID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTDTLID,
            "OPTM_ITEMNUMBER": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMNUMBER,
            "OPTM_ITEMCODE":temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMCODE,
            "OPTM_KEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_KEY,
            "OPTM_PARENTKEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTKEY,
            "OPTM_TEMPLATEID": temp_step2_final_dataset_save[itempsavefinal].OPTM_TEMPLATEID,
            "OPTM_ITMCODEGENKEY":temp_step2_final_dataset_save[itempsavefinal].OPTM_ITMCODEGENKEY,
            "OPTM_ITEMTYPE": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMTYPE,
            "OPTM_WHSE": this.warehouse,
            "OPTM_LEVEL": temp_step2_final_dataset_save[itempsavefinal].OPTM_LEVEL,
            "OPTM_QUANTITY": temp_step2_final_dataset_save[itempsavefinal].OPTM_QUANTITY,
            "OPTM_PRICELIST":temp_step2_final_dataset_save[itempsavefinal].OPTM_PRICELIST,
            "OPTM_UNITPRICE": temp_step2_final_dataset_save[itempsavefinal].OPTM_UNITPRICE,
            "OPTM_TOTALPRICE": temp_step2_final_dataset_save[itempsavefinal].OPTM_TOTALPRICE,
            "OPTM_DISCPERCENT": temp_step2_final_dataset_save[itempsavefinal].OPTM_DISCPERCENT,
            "OPTM_CREATEDBY": this.common_output_data.usernameOPTM_CREATEDBY,
            "OPTM_MODIFIEDBY": this.common_output_data.usernameOPTM_MODIFIEDBY,
            "UNIQUEIDNT":temp_step2_final_dataset_save[itempsavefinal].UNIQUEIDNT,
            "PARENTID": temp_step2_final_dataset_save[itempsavefinal].PARENTID,
            "OPTM_FGCREATEDATE": temp_step2_final_dataset_save[itempsavefinal].OPTM_FGCREATEDATE,
            "OPTM_REFITEMCODE": temp_step2_final_dataset_save[itempsavefinal].OPTM_REFITEMCODE,
            "OPTM_PARENTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTID,
            "OPTM_PARENTTYPE":temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTTYPE
          })
        }
      
        
      } // step3_datafinal loop end
      console.log("this.step2_final_dataset_to_save ");
      console.log(this.step2_final_dataset_to_save);
    }
  }

  //For getting final status this mehod will handle 
  getFinalBOMStatus() {
    this.showLookupLoader = true;
    this.OutputService.getFinalBOMStatus(this.iLogID).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null) {
          if (data.FinalStatus[0].OPTM_STATUS == "P") {
            this.final_order_status = this.language.process_status;
            this.final_ref_doc_entry = data.FinalStatus[0].OPTM_REFDOCENTRY;
            this.final_document_number = data.FinalStatus[0].OPTM_REFDOCNO;
          } else if (data.FinalStatus[0].OPTM_STATUS == "E") {
            this.final_order_status = this.language.error_status;
            this.toastr.error('', this.language.error_occured + ': ' +  data.FinalStatus[0].OPTM_ERRDESC, this.commonData.toast_config);
          }
          else {
            this.final_order_status = this.language.pending_status;
          }

          if (data.GeneratedNewItemList.length > 0 && data.GeneratedNewItemList !== undefined) {
            console.log(data.GeneratedNewItemList)
            this.new_item_list = data.GeneratedNewItemList;
          }
          this.stoprefreshloader();
        }
        else {
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.stoprefreshloader();
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )

  }

  stoprefreshloader() {
    var obj = this;
    setTimeout(function () {
      obj.dontShowFinalLoader = false;
      obj.showFinalLoader = true;
    }, 500);

  }

  get_feature_elements(header_feature_table, feature_child_datatable, model_child_datatable) {
    var array = [];
    // header_feature_table['OPTM_LEVEL'] = 0;
    // model_child_datatable['OPTM_LEVEL'] = 1;
    // for (let i = 0; i < feature_child_datatable.length; i++) {
    //    feature_child_datatable['OPTM_LEVEL'] = 1;
    // if(feature_child_datatable[i].checked==""||feature_child_datatable[i].checked==undefined||feature_child_datatable[i].checked==null){
    //   if (feature_child_datatable[i].OPTM_DEFAULT == "Y") {
    //     feature_child_datatable[i].checked = true
    //   }
    //   else {
    //     feature_child_datatable[i].checked = false
    //   }
    // }
    //  }
    if (header_feature_table['OPTM_TYPE'] == "1" && header_feature_table['ACCESSORY'] != "Y") {

      array = feature_child_datatable.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'];
      });
    } else if (header_feature_table['OPTM_TYPE'] == "3" && header_feature_table['ACCESSORY'] != "Y") {
      array = model_child_datatable.filter(function (obj) {
        return obj['OPTM_MODELID'] == header_feature_table['OPTM_CHILDMODELID'] && obj['OPTM_TYPE'] != "2";
      });
    }
    if (header_feature_table['OPTM_MAXSELECTABLE'] > 1) {
      header_feature_table['element_type'] = "checkbox";
      header_feature_table['element_class'] = "custom-control custom-checkbox";
    }
    else {
      header_feature_table['element_type'] = "radio";
      header_feature_table['element_class'] = "custom-control custom-radio";
    }


    return array;

  }

  getAccessoryData(Accarray) {
    let checkedacc = false;
    for (let iaccss = 0; iaccss < Accarray.length; iaccss++) {
      this.feature_accessory_list.push({
        id: Accarray[iaccss].OPTM_FEATUREID,
        key: Accarray[iaccss].feature_code,
        name: Accarray[iaccss].OPTM_DISPLAYNAME,
        model_id: Accarray[iaccss].OPTM_MODELID,
        checked: checkedacc,
        parentfeatureid: Accarray[iaccss].OPTM_FEATUREID,
        parentmodelid: Accarray[iaccss].OPTM_MODELID
      });
    }
  }

  onAccessorySelectionChange(value, rowData) {
    if (value == true) {
      this.showLookupLoader = true;
      let parentfeatureid = rowData.parentfeatureid
      let GetDataForSelectedFeatureModelItemData: any = {};
      GetDataForSelectedFeatureModelItemData.selecteddata = [];
      GetDataForSelectedFeatureModelItemData.featurebomdata = [];
      GetDataForSelectedFeatureModelItemData.modelbomdata = [];
      GetDataForSelectedFeatureModelItemData.selecteddata.push({
        type: 1,
        modelid: "",
        featureid: rowData.id,
        item: "",
        parentfeatureid: rowData.parentfeatureid,
        parentmodelid: "",
        selectedvalue: "",
        CompanyDBID: this.common_output_data.companyName,
        SuperModelId: this.step2_data.model_id,
        currentDate: this.submit_date
      });

      GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
        return obj['checked'] == true
      })

      GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
        return obj['checked'] == true
      })
      this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
        data => {
          let parentarray = this.Accessoryarray.filter(function (obj) {
            return obj['OPTM_FEATUREID'] == parentfeatureid
          });
          if (data.DataForSelectedFeatureModelItem.length > 0)
            this.setItemDataForFeatureAccessory(data.DataForSelectedFeatureModelItem, parentarray);
          console.log('this.feature_accessory_list');
          console.log(this.feature_accessory_list);
          this.showLookupLoader = false;
        },
        error => {
          this.showLookupLoader = false;
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        });


    }
    else {
      for (let i = 0; i < this.feature_itm_list_table.length; i++) {
        if (this.feature_itm_list_table[i].FeatureId == rowData.id) {
          this.feature_itm_list_table.splice(i, 1);
          i = i - 1;
        }
      }
    }
    this.feature_price_calculate();
    this.updateCheckedStatus(value, rowData);
  }

  setItemDataForFeatureAccessory(ItemData, parentarray) {
    let isPriceDisabled: boolean = false;
    let isPricehide: boolean = false;
    if (ItemData.length > 0) {
      for (let i = 0; i < this.feature_itm_list_table.length; i++) {
        if (parentarray[0].OPTM_TYPE == 1) {
          if (this.feature_itm_list_table[i].FeatureId == ItemData[0].OPTM_FEATUREID) {
            this.feature_itm_list_table.splice(i, 1);
            i = i - 1;
          }
        }
        else if (parentarray[0].OPTM_TYPE == 3) {
          if (this.feature_itm_list_table[i].ModelId == ItemData[0].OPTM_MODELID) {
            this.feature_itm_list_table.splice(i, 1);
            i = i - 1;
          }
        }

      }

      var isExist;
      let isheadercounter = 10000;
      for (let i = 0; i < ItemData.length; i++) {
        if (parentarray[0].OPTM_TYPE == 1) {
          isExist = this.feature_itm_list_table.filter(function (obj) {
            return obj['FeatureId'] == ItemData[i].OPTM_FEATUREID && obj['Item'] == ItemData[i].OPTM_ITEMKEY;
          });
        }
        else if (parentarray[0].OPTM_TYPE == 3) {
          isExist = this.feature_itm_list_table.filter(function (obj) {
            return obj['ModelId'] == ItemData[i].OPTM_MODELID && obj['Item'] == ItemData[i].OPTM_ITEMKEY;
          });
        }
        else {
          isExist = this.feature_itm_list_table.filter(function (obj) {
            return obj['ModelId'] == ItemData[i].OPTM_MODELID && obj['Item'] == ItemData[i].OPTM_ITEMKEY;
          });
        }


        var formatequantity: any;
        if (parentarray[0].OPTM_PROPOGATEQTY == "Y" && ItemData[0].OPTM_PROPOGATEQTY == "Y") {
          ItemData[0].OPTM_QUANTITY = parentarray[0].OPTM_QUANTITY
          ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
          formatequantity = ItemData[0].OPTM_QUANTITY * this.step2_data.quantity
        }
        else {
          ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
          formatequantity = ItemData[0].OPTM_QUANTITY
        }

        var priceextn: any = formatequantity * ItemData[i].Price

        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ItemData[i].OPTM_FEATUREID,
            featureName: parentarray[0].feature_code,
            Item: ItemData[i].OPTM_ITEMKEY,
            ItemNumber: ItemData[i].DocEntry,
            Description: ItemData[i].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            price: ItemData[i].ListName,
            Actualprice: parseFloat(ItemData[i].Price).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "Y",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: ItemData[i].OPTM_MODELID,
            OPTM_LEVEL: parentarray[0].OPTM_LEVEL + 1,
            isQuantityDisabled: false,
            ispropogateqty: ItemData[i].OPTM_PROPOGATEQTY,
            //HEADER_LINENO: parentarray[0].OPTM_LINENO
            HEADER_LINENO: isheadercounter

          });

          isheadercounter++;
        }
      }
      this.feature_price_calculate();
    }
  }

  selectallAccessory(value) {
    if(this.feature_accessory_list.length > 0){
      this.showLookupLoader = true;
      for (let i = 0; i < this.feature_accessory_list.length; ++i) {
        this.feature_accessory_list[i].checked = value;
        if (value == true) {
          let GetDataForSelectedFeatureModelItemData: any = {};
          GetDataForSelectedFeatureModelItemData.selecteddata = [];
          GetDataForSelectedFeatureModelItemData.featurebomdata = [];
          GetDataForSelectedFeatureModelItemData.modelbomdata = [];
          GetDataForSelectedFeatureModelItemData.selecteddata.push({
            type: 1,
            modelid: "",
            featureid: this.feature_accessory_list[i].id,
            item: "",
            parentfeatureid: this.feature_accessory_list[i].parentfeatureid,
            parentmodelid: "",
            selectedvalue: "",
            CompanyDBID: this.common_output_data.companyName,
            SuperModelId: this.step2_data.model_id,
            currentDate: this.submit_date
          });

          GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
            return obj['checked'] == true
          })

          GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
            return obj['checked'] == true
          })

          this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
            data => {
              this.showLookupLoader = false;
              let parentfeatureid = this.feature_accessory_list[i].parentfeatureid
              let parentarray = this.Accessoryarray.filter(function (obj) {
                return obj['OPTM_FEATUREID'] == parentfeatureid
              });
              if (data.DataForSelectedFeatureModelItem.length > 0)
                this.setItemDataForFeatureAccessory(data.DataForSelectedFeatureModelItem, parentarray);

            },
            error => {
              this.showLookupLoader = false;
              this.stoprefreshloader();
              this.toastr.error('', this.language.server_error, this.commonData.toast_config);
              return;
            });
        }
        else {
          if (this.feature_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.feature_itm_list_table.length; iacc++) {
              if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.feature_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }

            }
          }
          this.showLookupLoader = false;
        }
      }
      this.feature_price_calculate();
    }
    
  }

  getDefaultItems(DefaultData) {
    // if (this.FeatureBOMDataForSecondLevel.length > 0) {
    //   var DefaultArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
    //     return obj['OPTM_DEFAULT'] == 'Y'
    //   });
    //   for (let i = 0; i < DefaultArray.length; i++) {
    //     this.onselectionchange(DefaultArray[i], true);
    //   }

    // }
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;

    for (var idefault in DefaultData) {
      var isExist;
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == DefaultData[idefault].OPTM_FEATUREID && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY;
      });

      // var defaultitemparentarray= this.ModelHeaderData.filter(function (obj) {
      //   return obj['OPTM_FEATUREID'] == DefaultData[idefault].OPTM_FEATUREID 
      // });

      // if(defaultitemparentarray.length>0){
      //   if(defaultitemparentarray[0].OPTM_PROPOGATEQTY=="Y"){
      //     DefaultData[idefault].OPTM_QUANTITY =DefaultData[idefault].OPTM_QUANTITY * defaultitemparentarray[0].OPTM_QUANTITY
      //   }
      // }

      DefaultData[idefault].OPTM_QUANTITY = parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3)
      var formatequantity: any = DefaultData[idefault].OPTM_QUANTITY * this.step2_data.quantity
      var priceextn: any = formatequantity * DefaultData[idefault].Price

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: DefaultData[idefault].OPTM_FEATUREID,
          featureName: DefaultData[idefault].OPTM_FEATURECODE,
          Item: DefaultData[idefault].OPTM_ITEMKEY,
          ItemNumber: DefaultData[idefault].DocEntry,
          Description: DefaultData[idefault].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          price: DefaultData[idefault].ListName,
          Actualprice: parseFloat(DefaultData[idefault].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: this.step2_data.model_id,
          OPTM_LEVEL: 1,
          isQuantityDisabled: true,
          HEADER_LINENO: DefaultData[idefault].HEADER_LINENO
        });
      }
    }
    this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_price_calculate();

  }

  setModelDataInGrid(ModelData, ModelItems) {
    var isExist;
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice: any = 0;

    for (var imodelarray in ModelData) {
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['Description'] == ModelData[imodelarray].OPTM_DISPLAYNAME;
      });

      ModelData[imodelarray].OPTM_QUANTITY = parseFloat(ModelData[imodelarray].OPTM_QUANTITY)
      var formatequantity: any = ModelData[imodelarray].OPTM_QUANTITY * this.step2_data.quantity

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelData[imodelarray].OPTM_CHILDMODELID,
          featureName: ModelData[imodelarray].child_code,
          Item: ModelData[imodelarray].OPTM_ITEMKEY,
          ItemNumber: "",
          Description: ModelData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          price: ModelData[imodelarray].ListName,
          Actualprice: 0,
          pricextn: 0,
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelData[imodelarray].OPTM_LINENO,
          OPTM_ITEMTYPE: 1
        });
      }

      var ModelItemsArray = [];
      ModelItemsArray = ModelItems.filter(function (obj) {
        return obj['OPTM_MODELID'] == ModelData[imodelarray].OPTM_CHILDMODELID && obj['OPTM_TYPE'] == 2;
      });


      for (var imodelItemsarray in ModelItemsArray) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ModelItemsArray[imodelItemsarray].OPTM_MODELID && obj['Item'] == ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY;
        });

        ModelItemsArray[imodelItemsarray].OPTM_QUANTITY = parseFloat(ModelItemsArray[imodelItemsarray].OPTM_QUANTITY).toFixed(3)
        var formatequantity: any = ModelItemsArray[imodelItemsarray].OPTM_QUANTITY * this.step2_data.quantity
        var priceextn: any = formatequantity * ModelItemsArray[imodelItemsarray].Price
        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ModelItemsArray[imodelItemsarray].OPTM_FEATUREID,
            featureName: ModelItemsArray[imodelItemsarray].feature_code,
            Item: ModelItemsArray[imodelItemsarray].OPTM_ITEMKEY,
            ItemNumber: ModelItemsArray[imodelItemsarray].DocEntry,
            Description: ModelItemsArray[imodelItemsarray].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            price: ModelItemsArray[imodelItemsarray].ListName,
            Actualprice: parseFloat(ModelItemsArray[imodelItemsarray].Price).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: ModelItemsArray[imodelItemsarray].OPTM_MODELID,
            OPTM_LEVEL: 2,
            isQuantityDisabled: true,
            HEADER_LINENO: ModelItemsArray[imodelItemsarray].HEADER_LINENO,
          });

          ItemPrice = ItemPrice + ModelItemsArray[imodelarray].Price
        }
      }

      for (var ifeatureitem in this.feature_itm_list_table) {
        if (this.feature_itm_list_table[ifeatureitem].FeatureId == ModelData[imodelarray].OPTM_CHILDMODELID) {
          this.feature_itm_list_table[ifeatureitem].Actualprice = parseFloat(ItemPrice).toFixed(3)
        }
      }

    }
    this.feature_price_calculate();
  }

  setModelItemsDataInGrid(ModelItemsData) {
    var isExist;
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice = 0;

    for (var imodelarray in ModelItemsData) {
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == ModelItemsData[imodelarray].OPTM_MODELID && obj['Item'] == ModelItemsData[imodelarray].OPTM_ITEMKEY;
      });

      ModelItemsData[imodelarray].OPTM_QUANTITY = parseFloat(ModelItemsData[imodelarray].OPTM_QUANTITY).toFixed(3)
      var formatequantity: any = ModelItemsData[imodelarray].OPTM_QUANTITY * this.step2_data.quantity
      var priceextn: any = formatequantity * ModelItemsData[imodelarray].Price
      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelItemsData[imodelarray].OPTM_MODELID,
          featureName: "",
          Item: ModelItemsData[imodelarray].OPTM_ITEMKEY,
          ItemNumber: ModelItemsData[imodelarray].DocEntry,
          Description: ModelItemsData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          price: ModelItemsData[imodelarray].ListName,
          Actualprice: parseFloat(ModelItemsData[imodelarray].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelItemsData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelItemsData[imodelarray].OPTM_LINENO,
        });
      }
    }
  }

  SetModelFeatureSavedItems(DefaultData) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;

    for (var idefault in DefaultData) {
      var isExist;
      isExist = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == DefaultData[idefault].OPTM_FEATUREID && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY;
      });


      DefaultData[idefault].OPTM_QUANTITY = parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3)
      var formatequantity: any = DefaultData[idefault].OPTM_QUANTITY * this.step2_data.quantity
      var priceextn: any = formatequantity * DefaultData[idefault].Price

      var tempmodelid;
      var checkModelFeatureParent=this.ModelBOMDataForSecondLevel.filter(function(obj){
        return obj['OPTM_FEATUREID']==DefaultData[idefault].OPTM_FEATUREID
      })
      if(checkModelFeatureParent.length>0){
        tempmodelid=checkModelFeatureParent[0].OPTM_MODELID
      }
      else{
        tempmodelid=this.step2_data.model_id
      }

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: DefaultData[idefault].OPTM_FEATUREID,
          featureName: DefaultData[idefault].parent_code,
          Item: DefaultData[idefault].OPTM_ITEMKEY,
          ItemNumber: DefaultData[idefault].DocEntry,
          Description: DefaultData[idefault].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          price: DefaultData[idefault].ListName,
          Actualprice: parseFloat(DefaultData[idefault].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: tempmodelid,
          OPTM_LEVEL: 2,
          isQuantityDisabled: true,
          HEADER_LINENO: DefaultData[idefault].HEADER_LINENO
        });
      }
    }
    this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_price_calculate();

  }

  RuleIntegration(RuleOutputData, value) {
    if (RuleOutputData.length > 0) {
      for (var iItemFeatureTable in this.FeatureBOMDataForSecondLevel) {
        for (var iItemRule in RuleOutputData) {
          if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_TYPE == 1) {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_CHILDFEATUREID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
                //  if (this.ModelLookupFlag == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable != false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked == false) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID != this.defaultitemflagid) {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                  }
                  else {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                  }
                }
              }
              //  }
              else {
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID != this.defaultitemflagid) {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
              }
            }
          }
          else if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_TYPE == 2) {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY) {
              var defaultitemarray = [];

              if (value == true) {
                // if (this.ModelLookupFlag == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable != false {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                  var checkedRowFound = false

                  checkedRowFound = this.ischeckedRow(RuleOutputData, this.FeatureBOMDataForSecondLevel)
                  // var tempRuleArray = RuleOutputData.filter(function (obj) {
                  //   return obj['OPTM_ISINCLUDED'].trim() == "True"
                  // })


                  // if (tempRuleArray.length > 0) {
                  //   for (var itemp in tempRuleArray) {
                  //     var tempFeatArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                  //       return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "N"
                  //     })
                  //     if (tempFeatArray.length == 0 ) {
                  //       var tempFeatArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                  //         return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "Y" && obj['checked'] == true
                  //       })
                  //     }
                  //     if (tempFeatArray.length > 0 ) {
                  //       if( tempFeatArray[0].checked == true){
                  //         checkedRowFound = true
                  //         break
                  //       }

                  //     }
                  //   }

                  // }
                  if (checkedRowFound == false) {
                    if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATURECODE = this.FeatureBOMDataForSecondLevel[iItemFeatureTable].parent_code
                      defaultitemarray.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
                      if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {

                        this.removefeatureitemlist(this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID)
                        if (defaultitemarray[0].OPTM_FEATURECODE == undefined || defaultitemarray[0].OPTM_FEATURECODE == "" || defaultitemarray[0].OPTM_FEATURECODE == null) {
                          defaultitemarray[0].OPTM_FEATURECODE = defaultitemarray[0].parent_code
                        }
                        this.getDefaultItems(defaultitemarray)
                      }
                    }
                    else {
                      this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                    }
                  }
                }

              }
              else {
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                  defaultitemarray.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
                  if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {
                    this.removefeatureitemlist(this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID)
                    if (defaultitemarray[0].OPTM_FEATURECODE == undefined || defaultitemarray[0].OPTM_FEATURECODE == "" || defaultitemarray[0].OPTM_FEATURECODE == null) {
                      defaultitemarray[0].OPTM_FEATURECODE = defaultitemarray[0].parent_code
                    }
                    this.getDefaultItems(defaultitemarray)
                  }

                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
              }
            }
          }
          else {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_VALUE == RuleOutputData[iItemRule].OPTM_VALUE) {
              if (value == true) {
                //  if (this.ModelLookupFlag == false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable != false && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked == false) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID != this.defaultitemflagid) {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                  }
                  else {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                  }
                }
              }
              //  }
              else {
                this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID != this.defaultitemflagid) {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
              }
            }
          }


        }
      }
      for (var iModelItemTable in this.ModelBOMDataForSecondLevel) {
        for (var iItemRule in RuleOutputData) {
          if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_TYPE == 1) {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
                //    if (this.ModelLookupFlag == false && this.ModelBOMDataForSecondLevel[iModelItemTable].disable != false && this.ModelBOMDataForSecondLevel[iModelItemTable].checked == false) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID != this.defaultitemflagid) {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                  }
                  else {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                  }
                }
              }
              //   }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID != this.defaultitemflagid) {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
              }

            }
          }
          else if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_TYPE == 2) {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_ITEMKEY == RuleOutputData[iItemRule].OPTM_ITEMKEY) {
              var defaultitemarray = [];
              if (value == true) {
                // if (this.ModelLookupFlag == false && this.ModelBOMDataForSecondLevel[iModelItemTable].disable != false && this.ModelBOMDataForSecondLevel[iModelItemTable].checked == false) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  var checkedRowFound = false
                  checkedRowFound = this.ischeckedRow(RuleOutputData, this.ModelBOMDataForSecondLevel)
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                  if (checkedRowFound == false) {
                    if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                      this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                      defaultitemarray.push(this.ModelBOMDataForSecondLevel[iModelItemTable])
                      if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {
                        this.removefeatureitemlist(this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID)
                        if (defaultitemarray[0].OPTM_FEATURECODE == undefined || defaultitemarray[0].OPTM_FEATURECODE == "" || defaultitemarray[0].OPTM_FEATURECODE == null) {
                          defaultitemarray[0].OPTM_FEATURECODE = defaultitemarray[0].parent_code
                        }
                        this.getDefaultItems(defaultitemarray)
                      }

                    }
                    else {
                      this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                    }
                  }

                }
              }
              //  }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                  defaultitemarray.push(this.ModelBOMDataForSecondLevel[iModelItemTable])
                  if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {
                    this.removefeatureitemlist(this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID)
                    if (defaultitemarray[0].OPTM_FEATURECODE == undefined || defaultitemarray[0].OPTM_FEATURECODE == "" || defaultitemarray[0].OPTM_FEATURECODE == null) {
                      defaultitemarray[0].OPTM_FEATURECODE = defaultitemarray[0].parent_code
                    }
                    this.getDefaultItems(defaultitemarray)
                  }
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
              }

            }
          }
          else {
            if (this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_CHILDMODELID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
                //  if (this.ModelLookupFlag == false && this.ModelBOMDataForSecondLevel[iModelItemTable].disable != false && this.ModelBOMDataForSecondLevel[iModelItemTable].checked == false) {
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID != this.defaultitemflagid) {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                  }
                  else {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                  }
                }
              }
              //   }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True" && this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID != this.defaultitemflagid) {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
              }

            }
          }

        }
      }
      for (var iFeatureItemaddedTable = 0; iFeatureItemaddedTable < this.feature_itm_list_table.length; iFeatureItemaddedTable++) {
        for (var iItemRule in RuleOutputData) {
          if (this.feature_itm_list_table[iFeatureItemaddedTable].Item == RuleOutputData[iItemRule].OPTM_ITEMKEY) {
            if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
              this.feature_itm_list_table.splice(iFeatureItemaddedTable, 1)
              iFeatureItemaddedTable = iFeatureItemaddedTable - 1
              break;
            }
            else if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "True") {
              if (RuleOutputData[iItemRule].OPTM_ISQTYEDIT == "y") {
                this.feature_itm_list_table[iFeatureItemaddedTable].isQuantityDisabled = false
              }
              else {
                this.feature_itm_list_table[iFeatureItemaddedTable].isQuantityDisabled = true
              }

              var tempfeatureid = this.feature_itm_list_table[iFeatureItemaddedTable].FeatureId
              if (this.feature_itm_list_table[iFeatureItemaddedTable].is_accessory == "N") {
                var modelheaderpropagatechecked = this.ModelHeaderData.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == tempfeatureid
                })
                if (modelheaderpropagatechecked.length > 0) {
                  if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                    if (modelheaderpropagatechecked[0].OPTM_TYPE == "1") {
                      var itemkey = this.feature_itm_list_table[iFeatureItemaddedTable].Item
                      var featurepropagatecheck = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == itemkey
                      })
                      if (featurepropagatecheck.length > 0) {
                        if (featurepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                          this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                        }
                      }
                    }
                    else if (modelheaderpropagatechecked[0].OPTM_TYPE == "2") {
                      if (modelheaderpropagatechecked[0].OPTM_ITEMKEY == this.feature_itm_list_table[iFeatureItemaddedTable].Item) {
                        this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                      }
                    }
                    else {
                      var itemkey = this.feature_itm_list_table[iFeatureItemaddedTable].Item
                      var modelfeaturepropagatecheck = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                        return obj['OPTM_ITEMKEY'] == itemkey
                      })
                      if (modelfeaturepropagatecheck.length > 0) {
                        if (modelfeaturepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                          this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                        }
                      }
                    }
                  }
                  else {
                    this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)
                  }

                }
                else {
                  this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)
                }
              }
              else {
                var modelheaderpropagatechecked = this.Accessoryarray.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == tempfeatureid
                })
                if (modelheaderpropagatechecked.length > 0) {
                  if (modelheaderpropagatechecked[0].OPTM_PROPOGATEQTY == "Y") {
                    if (this.feature_itm_list_table[iFeatureItemaddedTable].ispropogateqty == "Y") {
                      this.feature_itm_list_table[iFeatureItemaddedTable].quantity = (RuleOutputData[iItemRule].OPTM_QUANTITY * this.step2_data.quantity)
                    }

                  }

                }
              }



              this.feature_itm_list_table[iFeatureItemaddedTable].quantity = parseFloat(this.feature_itm_list_table[iFeatureItemaddedTable].quantity).toFixed(3)

              if (RuleOutputData[iItemRule].OPTM_ISPRICEEDIT == "y") {
                this.feature_itm_list_table[iFeatureItemaddedTable].isPriceDisabled = false
                this.feature_itm_list_table[iFeatureItemaddedTable].pricehide = false
              }
              else {
                this.feature_itm_list_table[iFeatureItemaddedTable].isPriceDisabled = true
                this.feature_itm_list_table[iFeatureItemaddedTable].pricehide = true
              }

            }
          }
        }
      }
    }
    else {
      for (var iItemFeatureTable in this.feature_itm_list_table) {
        this.feature_itm_list_table[iItemFeatureTable].isPriceDisabled = true
        this.feature_itm_list_table[iItemFeatureTable].pricehide = true
        this.feature_itm_list_table[iItemFeatureTable].isQuantityDisabled = true
      }
      for (var iItemFeatureTable in this.FeatureBOMDataForSecondLevel) {
        this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
      }
      for (var iModelItemTable in this.ModelBOMDataForSecondLevel) {
        this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
      }

    }
    this.defaultitemflagid = "";
  }

  checkedFunction(feature_model_data, parentarray, value) {

    for (var ifeaturechecked in this.FeatureBOMDataForSecondLevel) {
      if (feature_model_data.OPTM_TYPE == 2) {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_ITEMKEY == feature_model_data.OPTM_ITEMKEY) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && parentarray[0].element_type == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_ITEMKEY != feature_model_data.OPTM_ITEMKEY) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
      }
      else if (feature_model_data.OPTM_TYPE == 1) {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && parentarray[0].element_type == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
          var tempfeaturechild = this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID
          this.FeatureBOMDataForSecondLevel = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
            if (obj['OPTM_FEATUREID'] == tempfeaturechild) {
              obj['checked'] = false
            }
            return obj
          })
        }
      }
      else {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE == feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && parentarray[0].element_type == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE != feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
      }


    }

    for (var imodelchecked in this.ModelBOMDataForSecondLevel) {
      if (feature_model_data.OPTM_TYPE == 2) {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY == feature_model_data.OPTM_ITEMKEY) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && parentarray[0].element_type == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY != feature_model_data.OPTM_ITEMKEY) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }
      else if (feature_model_data.OPTM_TYPE == 1) {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID == feature_model_data.OPTM_CHILDFEATUREID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        // if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && parentarray[0].element_type == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
        //   this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        // }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && parentarray[0].element_type == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }
      else {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID == feature_model_data.OPTM_CHILDMODELID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && parentarray[0].element_type == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID != feature_model_data.OPTM_CHILDMODELID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }

    }

  }

  onModelCodeChange() {
    this.showLookupLoader = true;
    this.OutputService.onModelIdChange(this.step2_data.model_code).subscribe(
      data => {
        if (data === "False") {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.step2_data.modal_id = "";
          this.step2_data.model_code = "";
          this.onclearselection(1);
          return;
        }
        else {
          this.step2_data.model_id = data;
          this.GetAllDataForModelBomOutput("");
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }
  setModelDataInOutputBom(getmodelsavedata) {
    this.feature_itm_list_table = [];
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let ItemPrice = 0;
    for (var imodelsavedata in getmodelsavedata) {
      if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 1) {
        let filtemodeldataheader = [];
        filtemodeldataheader = this.ModelHeaderData.filter(function (obj) {
          return obj['child_code'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE
        })
        var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

        if (filtemodeldataheader.length > 0)
          this.feature_itm_list_table.push({
            FeatureId: filtemodeldataheader[0].OPTM_CHILDMODELID,
            featureName: filtemodeldataheader[0].child_code,
            Item: filtemodeldataheader[0].OPTM_ITEMKEY,
            ItemNumber: "",
            Description: filtemodeldataheader[0].OPTM_DISPLAYNAME,
            quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
            price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
            Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ModelId: filtemodeldataheader[0].OPTM_MODELID,
            OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
            isQuantityDisabled: true,
            HEADER_LINENO: parseFloat(imodelsavedata) + 1
          });

      }
      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 2) {
        if (getmodelsavedata[imodelsavedata].OPTM_LEVEL == 2) {
          var ModelItemsArray = [];
          ModelItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });

          // if(ModelItemsArray.length==0){
          //   ModelItemsArray.push({
          //     OPTM_FEATUREID
          //   })
          // }

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

          if (ModelItemsArray.length > 0) {
            this.feature_itm_list_table.push({
              FeatureId: ModelItemsArray[0].OPTM_FEATUREID,
              featureName: ModelItemsArray[0].feature_code,
              Item: ModelItemsArray[0].OPTM_ITEMKEY,
              ItemNumber: ModelItemsArray[0].DocEntry,
              Description: ModelItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
              Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: ModelItemsArray[0].OPTM_MODELID,
              OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
              isQuantityDisabled: true,
              HEADER_LINENO: parseFloat(imodelsavedata) + 1
            });
          }
        }
        else {
          var ItemsArray = [];
          ItemsArray = this.ModelHeaderItemsArray.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });
          if (ItemsArray.length == 0 && getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 2) {
            ItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
            });
          }
          if (ItemsArray.length == 0 && getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 1) {
            ItemsArray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
            });
          }

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

          if (ItemsArray.length > 0) {
            this.feature_itm_list_table.push({
              FeatureId: ItemsArray[0].OPTM_FEATUREID,
              featureName: ItemsArray[0].parent_code,
              Item: ItemsArray[0].OPTM_ITEMKEY,
              ItemNumber: ItemsArray[0].DocEntry,
              Description: ItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
              Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: ItemsArray[0].OPTM_MODELID,
              OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
              isQuantityDisabled: true,
              HEADER_LINENO: parseFloat(imodelsavedata) + 1
            });

          }
        }
      }

      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 3) {
        let parentfeatureid;
        let parentmodelid;
        if (getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 1) {
          parentfeatureid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
          parentmodelid = ""
        }
        else {
          parentfeatureid = ""
          parentmodelid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
        }
        let GetDataForSelectedFeatureModelItemData: any = {};
        GetDataForSelectedFeatureModelItemData.selecteddata = [];
        GetDataForSelectedFeatureModelItemData.featurebomdata = [];
        GetDataForSelectedFeatureModelItemData.modelbomdata = [];
        GetDataForSelectedFeatureModelItemData.selecteddata.push({
          type: 2,
          modelid: "",
          featureid: "",
          item: getmodelsavedata[imodelsavedata].OPTM_ITEMCODE,
          parentfeatureid: parentfeatureid,
          parentmodelid: parentmodelid,
          selectedvalue: "",
          CompanyDBID: this.common_output_data.companyName,
          SuperModelId: this.step2_data.model_id,
          currentDate: this.submit_date
        });

        GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['checked'] == true
        })

        GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
          return obj['checked'] == true
        })

        // this.OutputService.GetDataForSelectedFeatureModelItem(type, modelid, featureid, item, parentfeatureid, parentmodelid,selectedvalue,this.FeatureBOMDataForSecondLevel).subscribe(
        this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
          data => {
            var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE
            if (data != null || data != undefined) {
              this.feature_itm_list_table.push({
                FeatureId: parentfeatureid,
                featureName: data.DataForSelectedFeatureModelItem[0].OPTM_DISPLAYNAME,
                Item: data.DataForSelectedFeatureModelItem[0].OPTM_ITEMKEY,
                ItemNumber: getmodelsavedata[imodelsavedata].OPTM_ITEMNUMBER,
                Description: data.DataForSelectedFeatureModelItem[0].OPTM_DISPLAYNAME,
                quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
                price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
                Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE).toFixed(3),
                pricextn: parseFloat(priceextn).toFixed(3),
                is_accessory: "Y",
                isPriceDisabled: isPriceDisabled,
                pricehide: isPricehide,
                ModelId: this.step2_data.model_id,
                OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
                isQuantityDisabled: true,
                HEADER_LINENO: parseFloat(imodelsavedata) + 1
              });

              for (var iaccess in this.feature_accessory_list) {
                if (parentfeatureid == this.feature_accessory_list[iaccess].id) {
                  this.feature_accessory_list[iaccess].checked = true
                }
              }
this.feature_price_calculate();
            }
          }
        )
      }
    }
    if (this.feature_itm_list_table.length > 0) {
      for (var ifeatureitemlist in this.feature_itm_list_table) {
        for (var ifeatureBomData in this.FeatureBOMDataForSecondLevel) {
          if (this.feature_itm_list_table[ifeatureitemlist].Item == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY && this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY != null) {
            this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = true
            this.FeatureBOMDataForSecondLevel[ifeatureBomData].disable = false
          }
          if (this.feature_itm_list_table[ifeatureitemlist].Item != this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY && this.feature_itm_list_table[ifeatureitemlist].FeatureId == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_FEATUREID) {
            var featureid = this.feature_itm_list_table[ifeatureitemlist].FeatureId
            var parentarray = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == featureid
            })
            if (parentarray.length > 0) {
              if (parentarray[0].OPTM_MAXSELECTABLE == 1) {
                this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = false
              }
              else {
                if (this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_FEATUREID == parentarray[0].OPTM_FEATUREID) {
                  var modeldataitemfilter = getmodelsavedata.filter(function (obj) {
                    return obj['OPTM_PARENTID'] == parentarray[0].OPTM_FEATUREID
                  })

                  for (var imodeldataitemfilter in modeldataitemfilter) {
                    if (modeldataitemfilter[imodeldataitemfilter].OPTM_ITEMCODE == this.FeatureBOMDataForSecondLevel[ifeatureBomData].OPTM_ITEMKEY) {
                      this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = true
                    }
                    else {
                      this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = false
                    }
                  }
                }
              }

            }

          }

        }
        for (var imodelBomData in this.ModelBOMDataForSecondLevel) {
          if (this.feature_itm_list_table[ifeatureitemlist].Item == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY && this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY != null) {
            this.ModelBOMDataForSecondLevel[imodelBomData].checked = true
            this.ModelBOMDataForSecondLevel[imodelBomData].disable = false
          }
          if (this.feature_itm_list_table[ifeatureitemlist].Item != this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY && this.feature_itm_list_table[ifeatureitemlist].FeatureId == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_MODELID) {
            var modelid = this.feature_itm_list_table[ifeatureitemlist].FeatureId
            var parentarray = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_MODELID'] == modelid
            })
            if (parentarray.length > 0) {
              if (parentarray[0].OPTM_MAXSELECTABLE == 1) {
                this.ModelBOMDataForSecondLevel[imodelBomData].checked = false
              }
              else {
                if (this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_FEATUREID == parentarray[0].OPTM_FEATUREID) {
                  var modeldataitemfilter = getmodelsavedata.filter(function (obj) {
                    return obj['OPTM_PARENTID'] == parentarray[0].OPTM_FEATUREID
                  })

                  for (var imodeldataitemfilter in modeldataitemfilter) {
                    if (modeldataitemfilter[imodeldataitemfilter].OPTM_ITEMCODE == this.ModelBOMDataForSecondLevel[imodelBomData].OPTM_ITEMKEY) {
                      this.ModelBOMDataForSecondLevel[imodelBomData].checked = true
                    }
                    else {
                      this.ModelBOMDataForSecondLevel[imodelBomData].checked = false
                    }
                  }
                }
              }

            }

          }

        }

      }
    }
    this.feature_price_calculate();
    this.setModelDataFlag = false;
  }//end function

  removemodelheaderdatatable(removemodelheaderid) {
    for (let iremove = 0; iremove < this.ModelHeaderData.length; iremove++) {
      if (this.ModelHeaderData[iremove].parentfeatureid == removemodelheaderid) {
        let removemodelheaderidchild = this.ModelHeaderData[iremove].OPTM_FEATUREID


        for (let igrid = 0; igrid < this.feature_itm_list_table.length; igrid++) {
          if (this.feature_itm_list_table[igrid].FeatureId == this.ModelHeaderData[iremove].OPTM_FEATUREID) {
            this.feature_itm_list_table.splice(igrid, 1);
            igrid = igrid - 1;
          }
        }

        for (let isecond = 0; isecond < this.FeatureBOMDataForSecondLevel.length; isecond++) {
          if (this.FeatureBOMDataForSecondLevel[isecond].OPTM_FEATUREID == this.ModelHeaderData[iremove].OPTM_FEATUREID) {
            this.FeatureBOMDataForSecondLevel.splice(isecond, 1);
            isecond = isecond - 1;
          }
        }


        this.ModelHeaderData.splice(iremove, 1);
        this.removemodelheaderdatatable(removemodelheaderidchild)
      }
    }
  }

  //THis will maintain the array and label checked to checked one's
  updateCheckedStatus(value, row) {
    let id = row.id;
    for (let count = 0; count < this.feature_accessory_list.length; count++) {
      if (this.feature_accessory_list[count].id == id) {
        this.feature_accessory_list[count].checked = true;
      }
      // else {
      //   this.feature_accessory_list[count].checked = false;
      // }
    }
  }

  //this remove items which have 1 maximum selectable
  removefeatureitemlist(featureid) {
    var maxselect = this.ModelHeaderData.filter(function (obj) {
      return obj['OPTM_FEATUREID'] == featureid
    })
    if (maxselect.length > 0) {
      if (maxselect[0].OPTM_MAXSELECTABLE == "1") {
        for (var iFeatureItemadded = 0; iFeatureItemadded < this.feature_itm_list_table.length; iFeatureItemadded++) {
          if (this.feature_itm_list_table[iFeatureItemadded].FeatureId == maxselect[0].OPTM_FEATUREID) {
            this.feature_itm_list_table.splice(iFeatureItemadded, 1)
            iFeatureItemadded = iFeatureItemadded - 1;
          }

        }
      }
    }
  }

  enableFeatureModelsItems() {
    this.FeatureBOMDataForSecondLevel = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      obj['disable'] = false
      return obj
    })
    this.ModelBOMDataForSecondLevel = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      obj['disable'] = false
      return obj
    })
  }

  ischeckedRow(RuleOutputData, FeatureModelData) {
    var tempRuleArray = RuleOutputData.filter(function (obj) {
      return obj['OPTM_ISINCLUDED'].trim() == "True"
    })


    if (tempRuleArray.length > 0) {
      for (var itemp in tempRuleArray) {
        var tempFeatArray = FeatureModelData.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "N"
        })
        if (tempFeatArray.length == 0) {
          var tempFeatArray = FeatureModelData.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "Y" && obj['checked'] == true
          })
        }
        if (tempFeatArray.length > 0) {
          if (tempFeatArray[0].checked == true) {
            return true
            // break
          }

        }
      }

    }
    return false
  }

  //This method will get Customer's all info.

  getCustomerAllInfo() {

    //first we will clear the details
    this.cleanCustomerAllInfo();
    this.showLookupLoader = true;
    this.OutputService.getCustomerAllInfo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.console.log("ALL CUSTOMER INFO-->", data)

          //Fill Contact Person
          if (data.ContactPerson != undefined) {
            if (data.ContactPerson.length > 0) {
              this.contact_persons = data.ContactPerson;
              this.person = data.ContactPerson[0].Name;
              this.step1_data.person_name = this.person;
            }
            else {
              this.contact_persons = [];
              this.person = "";
              this.step1_data.person_name = "";
            }

            if (data.DefaultSalesPerson.length > 0) {

              //remove -No Sales Employee-
              this.sales_employee = (data.DefaultSalesPerson).filter(function (row) {
                return row.SlpCode != "-1";
              });

              //sort it 
              this.sales_employee = (this.sales_employee).sort(function (a, b) {
                return a.SlpName.localeCompare(b.name);
              });

              //now push -No Sales Employee- to first position
              this.sales_employee.unshift({ SlpName: "-No Sales Employee-", SlpCode: "-1" });

              //Set Default Sales Person
              this.salesemployee = data.DefaultSalesPerson[0].SlpName;
              var obj = this;
              this.sales_employee = this.sales_employee.filter(function (row) {
                (obj.salesemployee == row.SlpName) ? row.selected = true : row.selected = false;
                return row;
              });
              this.step1_data.sales_employee = this.salesemployee;
              this.showLookupLoader = false;
            }
            else {
              this.sales_employee = [];
              this.salesemployee = "";
              this.showLookupLoader = false;
              this.step1_data.sales_employee = "";
            }
          }
          else {
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
            this.showLookupLoader = false;
            return;
          }


          //Fill bill to
          if (data.BillToDef.length > 0) {
            this.bill_to = data.BillToDef;
            this.customerBillTo = data.BillToDef[0].BillToDef;
            this.step1_data.bill_to = data.BillToDef[0].BillToDef;

            this.bill_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              BillTo: this.customerBillTo,
              currentDate: this.submit_date

            });
            //To get bill address
            this.fillBillAddress(this.bill_data, data);
          }
          else {
            this.bill_to = [];
            this.step1_data.bill_to_address = '';
          }
        } else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        }
        this.showLookupLoader = false;
      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      })

  }

  fillBillAddress(bill_data, orig_data) {
    this.OutputService.fillBillAddress(bill_data).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null && data != undefined) {
          if (data.BillingAdress != undefined) {
            this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
          }
        }
        else {
          this.step1_data.bill_to_address = '';
        }
        this.fillShipDetails(orig_data);
      }, error => {
        this.showLookupLoader = false;
      })
  }

  fillShipAddress(ship_data, orig_data) {
    this.OutputService.fillShipAddress(ship_data).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != null && data != undefined) {
          if (data.ShippingAdress != undefined) {
            this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
          }

          this.fillAllOwners(orig_data);
        }
        else {
          this.step1_data.ship_to_address = '';
          this.showLookupLoader = false;
        }
      }, error => {
        this.showLookupLoader = false;
      })
  }

  fillShipDetails(data) {
    //Fill Ship Detail
    //if default is set else
    let ShipDetails: any;
    if (data.DefaultShipDetail != undefined) {
      ShipDetails = data.DefaultShipDetail;
    }
    else {
      ShipDetails = data.ShipDetail;
    }

    if (ShipDetails.length > 0) {
      this.ship_to = ShipDetails;
      this.customerShipTo = ShipDetails[0].ShipToDef;
      this.step1_data.ship_to = ShipDetails[0].ShipToDef;


      this.ship_data.push({
        CompanyDBId: this.common_output_data.companyName,
        Customer: this.step1_data.customer,
        ShipTo: this.customerShipTo,
        currentDate: this.step1_data.posting_date,
        BillTo: this.customerBillTo
      });

      this.fillShipAddress(this.ship_data, data);
    }
    else {
      this.ship_to = [];
      this.step1_data.ship_to_address = '';
      this.showLookupLoader = false;
    }
  }

  //fill all owners
  fillAllOwners(data) {
    if (data.AllOwners.length > 0) {
      this.showLookupLoader = false;
      this.owner_list = data.AllOwners;
      this.step1_data.owner = data.AllOwners[0].lastName;
    }
    else {
      this.owner_list = [];
      this.showLookupLoader = false;
      this.step1_data.owner = "";
    }
  }

  //Clean all Customer Info
  cleanCustomerAllInfo() {
    //clear all owners info
    this.owner_list.length = 0;
    this.owner_list = [];

    this.step1_data.owner = "";

    //clear all bill to detial
    this.bill_to.length = 0;
    this.bill_to = [];

    this.step1_data.bill_to_address = "";
    //clear contact person detail
    this.contact_persons.length = 0;
    this.contact_persons = [];

    this.person = "";
    this.step1_data.person_name = "";

    //clear sales employee detail
    this.sales_employee.length = 0;
    this.sales_employee = [];

    this.salesemployee = "";
    this.step1_data.sales_employee = "";

    //clear ship to detail
    this.ship_to.length = 0;
    this.ship_to = [];

    this.step1_data.ship_to_address = '';
  }


  getFeatureHasAccesory(selected_feature_in_model){
   return  selected_feature_in_model.filter(obj => obj.is_accessory == 'Y');
  }
}