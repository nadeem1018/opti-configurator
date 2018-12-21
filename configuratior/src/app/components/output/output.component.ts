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
//import { LookupComponent } from '../common/lookup/lookup.component';


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
  //public step2_data_all_data={};

  // public router_link_new_config = "";

  public defaultCurrency = sessionStorage.defaultCurrency;
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.price_extn, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price_source, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.price_extn, "", "", "delete"];
  public step3_data_final_hidden_elements = [false, false, false, false, false, false, true, true, false, false];
  public step4_data_final_hidden_elements = [false, false, false, false, false, false, true, true, true];
  public feature_total_before_discount = 0;
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
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
  public order_creation_table_head = [this.language.hash, 'SI#', this.language.item, this.language.quantity, this.language.price + ' (' + this.defaultCurrency + ')', this.language.price_extn];
  feature_child_data: any = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService, private elementRef: ElementRef, private cdref: ChangeDetectorRef) { }
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
    let cDate = new Date();
    //  this.router_link_new_config = "/output/view/" + Math.round(Math.random() * 10000);
    this.step1_data.posting_date = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
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
    this.step1_data.document = "sales_quote";
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
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

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  start_new_configuration_click() {
    this.onOperationChange('');
    this.delete_all_row_data();
    $("fieldset").hide();
    $("fieldset:first").show();
  }

  onOperationChange(operation_type) {
    this.step1_data = [];
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
    this.onclearselection();
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
    if (this.step1_data.main_operation_type == 1) {
      console.log(this.step1_data.description);
      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
      this.setModelDataFlag = false;
      this.onclearselection();

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
    this.lookupfor = 'configure_list_lookup';
    this.OutputService.getConfigurationList(this.step1_data.main_operation_type).subscribe(
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

  getAllDetails(operationType, logid, description) {
    this.OutputService.GetAllOutputData(operationType, logid, description).subscribe(
      data => {
        console.log(data);
        if (data.CustomerOutput.length > 0) {
          if (data.CustomerOutput[0].OPTM_DOCTYPE = "23") {
            this.step1_data.document = "sales_quote"
          } else {
            this.step1_data.document = "sales_order"
          }
          //Bug no. 18436..Draft status was not showing...Ashish Devade
          if (data.CustomerOutput[0].OPTM_STATUS == "D") {
            this.step1_data.document = 'draft';
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
        return obj['OPTM_KEY'] != "" && obj['OPTM_ITEMTYPE'] == "0"
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

  openChildFeatureLookUp(feature_id, feature_code) {
    this.serviceData = []
    this.parentfeatureid = feature_id
    this.lookupfor = 'feature_Detail_Output_lookup';
    this.OutputService.getFeatureDetails(feature_id, this.step2_data.model_id).subscribe(
      data => {
        if (data.AllFeatures.length > 0) {
          this.serviceData = data.AllFeatures
        }
      })
  }

  openCustomerLookUp() {

    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'output_customer';
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

  openSalesEmpLookup() { }

  openTaxCodes() { }

  onContactPersonChange(contact) {
    console.log(contact);
    this.person = contact;
    this.step1_data.person_name = this.person;
  }

  openModalList() {
    this.serviceData = []
    this.setModelDataFlag = false;
    this.OutputService.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBomForWizard_lookup';
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

  onSalesPersonChange(selectedSalesEmp) {
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBomForWizard_lookup') {
      this.onclearselection();
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
    else if (this.lookupfor == 'feature_lookup') {
      this.step2_data.feature_id = $event[0];
      this.step2_data.feature_code = $event[1];
      this.getFeatureDetails($event[0], $event[1]);
    }
    else if (this.lookupfor == 'feature_Detail_Output_lookup') {
      for (let i = 0; i < this.feature_child_data.length; ++i) {
        if (this.feature_child_data[i].featureparentid == this.parentfeatureid) {
          this.feature_child_data[i].featurechildcode = $event[1];
        }

      }
      this.getFeatureDetails($event[0], $event[1]);
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
      this.step1_data.selected_configuration_key = $event[0];
      this.step1_data.description = $event[1];
      this.iLogID = $event[0];
      this.getAllDetails(this.step1_data.main_operation_type, this.step1_data.selected_configuration_key, this.step1_data.description);
    }
    // this.getItemDetails($event[0]);
  }

  getFeatureDetails(feature_id, feature_code) {
    this.serviceData = []
    this.OutputService.getFeatureDetails(feature_id, this.step2_data.model_id).subscribe(
      data => {
        if (data.ItemDataForFeature.length > 0) {
          this.getItemDataForFeature(data.ItemDataForFeature);
        }
        if (data.FeaturesWithAccessoryYes.length > 0) {
          this.getAccessory(data.FeaturesWithAccessoryYes)
        }
        if (data.DefaultWarehouse.length > 0) {
          this.warehouse = data.DefaultWarehouse[0].DEFAULTWAREHOUSE
        }
        this.feature_price_calculate();
        if (this.selecteddataforelement != null || this.selecteddataforelement != undefined) {
          this.generatekey(this.selecteddataforelement)
        }

      }
    )
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
                  var itemkey = this.feature_itm_list_table[i].Item
                  var modelfeaturepropagatecheck = this.ModelBOMDataForSecondLevel.filter(function (obj) {
                    return obj['OPTM_ITEMKEY'] == itemkey
                  })
                  if (modelfeaturepropagatecheck.length > 0) {
                    if (modelfeaturepropagatecheck[0].OPTM_PROPOGATEQTY == "Y") {
                      this.feature_itm_list_table[i].quantity = (this.feature_itm_list_table[i].quantity / this.previousquantity) * this.step2_data.quantity
                    }
                  }
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

  getAccessory(accesorydata: any) {
    if (accesorydata.length > 0) {
      let checkedacc = false;
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].OPTM_CHILDFEATUREID) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            if (accesorydata[i].OPTM_DEFAULT == "Y") {
              checkedacc = true
            }
            else {
              checkedacc = false
            }
            this.feature_accessory_list.push({
              id: accesorydata[i].OPTM_CHILDFEATUREID,
              key: accesorydata[i].OPTM_FEATURECODE,
              name: accesorydata[i].OPTM_DISPLAYNAME,
              model_id: this.step2_data.model_id,
              checked: checkedacc,
              parentId: this.selectfeaturedata[0].parentId
            });
          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          if (accesorydata[i].OPTM_DEFAULT == "Y") {
            checkedacc = true
          }
          else {
            checkedacc = false
          }
          this.feature_accessory_list.push({
            id: accesorydata[i].OPTM_CHILDFEATUREID,
            key: accesorydata[i].OPTM_FEATURECODE,
            name: accesorydata[i].OPTM_DISPLAYNAME,
            model_id: this.step2_data.model_id,
            checked: checkedacc,
            parentId: this.selectfeaturedata[0].parentId
          });
        }
      }

    }
  }

  getAccessoryForBydefault(accesorydata: any) {
    if (accesorydata.length > 0) {
      let checkedacc = false;
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].OPTM_CHILDFEATUREID) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            if (accesorydata[i].Mandatory == "Y") {
              if (accesorydata[i].checked == "Y") {
                checkedacc = true
              }
              else {
                checkedacc = false
              }
              this.feature_accessory_list.push({
                id: accesorydata[i].FeatureId,
                key: accesorydata[i].parentId,
                name: accesorydata[i].parentId,
                model_id: this.step2_data.model_id,
                checked: checkedacc,
                parentId: accesorydata[i].parentId
              });
            }

          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          if (accesorydata[i].Mandatory == "Y") {
            if (accesorydata[i].checked == "Y") {
              checkedacc = true
            }
            else {
              checkedacc = false
            }
            this.feature_accessory_list.push({
              id: accesorydata[i].FeatureId,
              key: accesorydata[i].parentId,
              name: accesorydata[i].parentId,
              model_id: this.step2_data.model_id,
              checked: checkedacc,
              parentId: accesorydata[i].parentId
            });
          }

        }
      }

    }
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      if (this.feature_accessory_list[i].checked == true)
        for (let j = 0; j < this.tree_data_json.length; ++j) {
          if (this.tree_data_json[j].component == this.feature_accessory_list[i].parentId && this.tree_data_json[j].Mandatory == "Y") {
            this.tree_data_json[j].checked = true
          }
        }
      this.onAccessoryChange(this.feature_accessory_list[i].checked, this.feature_accessory_list[i])
    }

  }



  getItemDataForFeature(ItemData) {
    let isPriceDisabled: boolean = false;
    let isPricehide: boolean = false;
    if (ItemData.length > 0) {
      if (this.feature_itm_list_table.length > 0) {
        let isExist = 0;

        for (let i = 0; i < ItemData.length; ++i) {
          for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
            if (this.feature_itm_list_table[j].FeatureId == ItemData[0].OPTM_FEATUREID && this.feature_itm_list_table[j].Item == ItemData[0].OPTM_ITEMKEY) {
              isExist = 1;
            }
          }
          // if (ItemData[0].OPTM_ISPRICEEDIT == "y") {
          //   isPriceDisabled = false
          //   isPricehide = false
          // }
          // else {
          //   isPriceDisabled = true
          //   isPricehide = true
          // }

          if (isExist == 0) {
            if (this.selectfeaturedata.length > 0) {
              for (let isel = 0; isel < this.selectfeaturedata.length; ++isel) {
                if (this.selectfeaturedata[isel].component == ItemData[0].OPTM_DISPLAYNAME) {
                  this.feature_itm_list_table.push({
                    FeatureId: ItemData[0].OPTM_FEATUREID,
                    featureName: ItemData[0].OPTM_DISPLAYNAME,
                    Item: ItemData[0].OPTM_ITEMKEY,
                    ItemNumber: ItemData[0].ITEMNUMBER,
                    Description: ItemData[0].OPTM_FEATUREDESC,
                    quantity: ItemData[0].OPTM_QUANTITY,
                    price: ItemData[0].Pricesource,
                    Actualprice: ItemData[0].Price,
                    pricextn: 0,
                    is_accessory: "N",
                    isPriceDisabled: isPriceDisabled,
                    pricehide: isPricehide,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id,
                    isQuantityDisabled: true

                  });
                }
              }

            }
            else {
              if (this.modelitemflag == 1) {
                this.feature_itm_list_table.push({
                  FeatureId: ItemData[0].OPTM_FEATUREID,
                  featureName: ItemData[0].OPTM_DISPLAYNAME,
                  Item: ItemData[0].OPTM_ITEMKEY,
                  ItemNumber: ItemData[0].ITEMNUMBER,
                  Description: ItemData[0].OPTM_FEATUREDESC,
                  quantity: ItemData[0].OPTM_QUANTITY,
                  price: ItemData[0].Pricesource,
                  Actualprice: ItemData[0].Price,
                  pricextn: 0,
                  is_accessory: "N",
                  isPriceDisabled: isPriceDisabled,
                  pricehide: isPricehide,
                  parentId: this.step2_data.model_id,
                  model_id: this.step2_data.model_id,
                  isQuantityDisabled: true

                });
              }
            }
          }
          isExist = 0;
        }
      }
      else {
        for (let i = 0; i < ItemData.length; ++i) {
          if (ItemData[0].OPTM_ISPRICEEDIT == "y") {
            isPriceDisabled = false
            isPricehide = false
          }
          else {
            isPriceDisabled = true
            isPricehide = true
          }
          if (this.selectfeaturedata.length > 0) {
            for (let isel = 0; isel < this.selectfeaturedata.length; ++isel) {
              if (this.selectfeaturedata[isel].component == ItemData[0].OPTM_DISPLAYNAME) {
                this.feature_itm_list_table.push({
                  FeatureId: ItemData[0].OPTM_FEATUREID,
                  featureName: ItemData[0].OPTM_DISPLAYNAME,
                  Item: ItemData[0].OPTM_ITEMKEY,
                  ItemNumber: ItemData[0].ITEMNUMBER,
                  Description: ItemData[0].OPTM_FEATUREDESC,
                  quantity: ItemData[0].OPTM_QUANTITY,
                  price: ItemData[0].Pricesource,
                  Actualprice: ItemData[0].Price,
                  pricextn: 0,
                  is_accessory: "N",
                  isPriceDisabled: isPriceDisabled,
                  pricehide: isPricehide,
                  parentId: this.selectfeaturedata[0].parentId,
                  model_id: this.step2_data.model_id,
                  isQuantityDisabled: true
                });
              }
            }

          }
          else {
            if (this.modelitemflag == 1) {
              this.feature_itm_list_table.push({
                FeatureId: ItemData[0].OPTM_FEATUREID,
                featureName: ItemData[0].OPTM_DISPLAYNAME,
                Item: ItemData[0].OPTM_ITEMKEY,
                ItemNumber: ItemData[0].ITEMNUMBER,
                Description: ItemData[0].OPTM_FEATUREDESC,
                quantity: ItemData[0].OPTM_QUANTITY,
                price: ItemData[0].Pricesource,
                Actualprice: ItemData[0].Price,
                pricextn: 0,
                is_accessory: "N",
                isPriceDisabled: isPriceDisabled,
                pricehide: isPricehide,
                parentId: this.step2_data.model_id,
                model_id: this.step2_data.model_id,
                isQuantityDisabled: true

              });
            }
          }


        }
      }

    }
    this.modelitemflag = 0;
    this.feature_price_calculate();
    // this.generatekey();
  }

  generatekey(selecteddata) {
    let itemkeydata = [];
    if (this.feature_itm_list_table.length > 0) {
      // let itemkey;
      // let counter=0;
      // for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      //   for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
      //     if(this.feature_itm_list_table[i].model_id==this.step2_data.model_id){
      //       if (this.feature_itm_list_table[i].parentId == this.tree_data_json[itree].FeatureId && this.tree_data_json[itree].checked==true) {
      //         itemkeydata.push({
      //           ItemNumber: counter,
      //           Component: this.tree_data_json[itree].component,
      //           parentId: this.tree_data_json[itree].parentId,
      //           ItemKey: "",
      //           FeatureId: this.feature_itm_list_table[i].FeatureId
      //         });
      //         counter++;
      //       }
      //     }
      //     else{
      //       if (this.feature_itm_list_table[i].parentId == this.tree_data_json[itree].parentId && this.tree_data_json[itree].checked==true) {
      //         itemkeydata.push({
      //           ItemNumber: counter,
      //           Component: this.tree_data_json[itree].component,
      //           parentId: this.tree_data_json[itree].parentId,
      //           ItemKey: "",
      //           FeatureId: this.feature_itm_list_table[i].FeatureId
      //         });
      //         counter++;
      //       }
      //     }

      //   }
      // }
      // let j = 0;
      // for (let i = 0; i < itemkeydata.length; ++i) {
      //   for (let j = i; j < itemkeydata.length; ++j) {
      //     if (itemkeydata[i].Component == itemkeydata[j].parentId) {
      //       if (itemkey.length == 0) {
      //         itemkey = itemkeydata[i].ItemNumber
      //       }
      //       else {
      //         itemkey = itemkey + "-" + itemkeydata[i].ItemNumber
      //       }

      //     }
      //   }
      // }
    }
  }

  // feature_price_calculate() {
  //   // if (this.feature_itm_list_table.length > 0) {
  //   let itotal = 0;
  //   let isumofpriceitem = 0;
  //   let itax = 0;
  //   let idiscount = 0;

  //   for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
  //     isumofpriceitem = isumofpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].price);
  //   }
  //   if (isumofpriceitem > 0) {
  //     itax = (isumofpriceitem * this.feature_item_tax) / 100
  //   }
  //   if (isumofpriceitem > 0) {
  //     idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
  //   }
  //   itotal = isumofpriceitem + itax + idiscount
  //   this.feature_item_total = itotal
  //   this.acc_grand_total = this.feature_item_total + this.acc_total

  //   this.feature_tax_total[0].value = this.feature_item_tax
  //   this.feature_tax_total[1].value = this.feature_item_total
  //   this.item_tax_total[2].value = this.acc_grand_total
  //   // }
  // }

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

    iproducttotal = isumofpropriceitem + iprotax - iprodiscount
    iacctotal = isumofaccpriceitem + iaccotax - iaccdiscount


    this.feature_total_before_discount = isumofpropriceitem + isumofaccpriceitem

    igrandtotal = iproducttotal + iacctotal
    this.feature_item_total = iproducttotal
    this.accessory_item_total = iacctotal
    this.acc_grand_total = igrandtotal

    // this.feature_tax_total[0].value = this.feature_item_tax
    // this.feature_tax_total[1].value = this.feature_item_total
    // this.item_tax_total[2].value = this.acc_grand_total
    // }
  }

  // accesory_price_calculate() {
  //   // if (this.accessory_itm_list_table.length > 0) {
  //   let itotal = 0;
  //   let isumofpriceitem = 0;
  //   let itax = 0;
  //   let idiscount = 0;

  //   for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
  //     isumofpriceitem = isumofpriceitem + (this.accessory_itm_list_table[iacc].quantity * this.accessory_itm_list_table[iacc].price);
  //   }
  //   if (isumofpriceitem > 0) {
  //     itax = (isumofpriceitem * this.acc_item_tax) / 100
  //   }
  //   if (isumofpriceitem > 0) {
  //     idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
  //   }
  //   itotal = isumofpriceitem + itax + idiscount
  //   this.acc_total = itotal

  //   this.acc_grand_total = this.feature_item_total + this.acc_total

  //   this.item_tax_total[0].value = this.acc_item_tax
  //   this.item_tax_total[1].value = this.acc_total
  //   this.item_tax_total[2].value = this.acc_grand_total


  //   //  }
  // }

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
      "total_before_discount": this.feature_total_before_discount,
      "product_total": this.feature_item_total,
      "product_discount": this.feature_discount_percent,
      "accessories_discount": this.accessory_discount_percent,
      "accessories_total": this.accessory_item_total,
      "grand_total": this.acc_grand_total
    });
    //pushing all final data sel details
    this.serviceData.verify_final_data_sel_details = this.step3_data_final;
    //pushing all payement data details
    this.serviceData.payment_details = undefined;
  }

  onAccessoryChange(value, row) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      if (this.feature_accessory_list[i].id == row.id) {
        this.feature_accessory_list[i].checked = value;
        if (this.feature_accessory_list[i].checked == true) {
          this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id, this.step2_data.model_id).subscribe(data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; ++i) {
                let isExist = 0;
                let isPriceDisabled: boolean = false;
                let isPricehide: boolean = false;
                if (data[i].OPTM_ISPRICEEDIT == "y") {
                  isPriceDisabled = false
                  isPricehide = false
                }
                else {
                  isPriceDisabled = true
                  isPricehide = true
                }
                // for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
                //   if (this.accessory_itm_list_table[iacc].Item == data[i].OPTM_ITEMKEY && this.accessory_itm_list_table[iacc].FeatureId == data[i].OPTM_FEATUREID) {
                //     isExist = 1;
                //   }
                // }
                // if (isExist == 0) {
                //   this.accessory_itm_list_table.push({
                //     FeatureId: data[i].OPTM_FEATUREID,
                //     Item: data[i].OPTM_ITEMKEY,
                //     Description: data[i].OPTM_DISPLAYNAME,
                //     quantity: data[i].OPTM_QUANTITY,
                //     price: 0,
                //     pricextn: 0
                //   });
                // }
                if (this.feature_itm_list_table.length > 0) {
                  for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
                    if (this.feature_itm_list_table[j].Item == data[i].OPTM_ITEMKEY && this.feature_itm_list_table[j].FeatureId == data[i].OPTM_FEATUREID) {
                      isExist = 1;
                    }
                  }
                  if (isExist == 0) {
                    this.feature_itm_list_table.push({
                      FeatureId: data[i].OPTM_FEATUREID,
                      featureName: data[i].OPTM_DISPLAYNAME,
                      Item: data[i].OPTM_ITEMKEY,
                      ItemNumber: data[i].ITEMNUMBER,
                      Description: data[i].OPTM_DISPLAYNAME,
                      quantity: parseFloat(data[i].OPTM_QUANTITY).toFixed(3),
                      price: data[i].Pricesource,
                      Actualprice: data[i].Price,
                      pricextn: 0,
                      is_accessory: "Y",
                      isPriceDisabled: true,
                      pricehide: true,
                      parentId: this.selectfeaturedata[0].parentId,
                      model_id: this.step2_data.model_id,
                      isQuantityDisabled: true,
                      ispropogateqty: data[i].OPTM_PROPOGATEQTY

                    });
                  }
                }
                else {
                  this.feature_itm_list_table.push({
                    FeatureId: data[i].OPTM_FEATUREID,
                    featureName: data[i].OPTM_DISPLAYNAME,
                    Item: data[i].OPTM_ITEMKEY,
                    ItemNumber: data[i].ITEMNUMBER,
                    Description: data[i].OPTM_DISPLAYNAME,
                    quantity: parseFloat(data[i].OPTM_QUANTITY).toFixed(3),
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: isPriceDisabled,
                    pricehide: isPricehide,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id,
                    isQuantityDisabled: true
                  });
                }


              }
              this.feature_price_calculate();
            }

          })

        }
        else {
          if (this.feature_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
              if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.feature_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }


            }
          }
          this.feature_price_calculate();
        }
      }
    }
    // this.accesory_price_calculate();

  }

  // on_accessory_input_change(inputid, value, rowid, item) {
  //   for (let i = 0; i < this.accessory_itm_list_table.length; ++i) {
  //     if (rowid == this.accessory_itm_list_table[i].FeatureId && item == this.accessory_itm_list_table[i].Item) {
  //       if (inputid == "quantity") {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].quantity = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].quantity = value
  //       }
  //       else if (inputid == "price") {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].price = 0;
  //           return;
  //         }
  //         var rgexp = /^\d+$/;
  //         if (rgexp.test(value) == false) {
  //           this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].quantity = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].price = value
  //       }
  //       else {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].pricextn = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].pricextn = value
  //       }

  //       // this.accesory_price_calculate();


  //     }

  //   }
  // }

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

  selectall(value) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      this.feature_accessory_list[i].checked = value;
      if (value == true) {
        this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id, this.step2_data.model_id).subscribe(data => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; ++i) {
              let isExist = 0;
              let isPriceDisabled: boolean = false;
              let isPricehide: boolean = false;
              if (data[i].OPTM_ISPRICEEDIT == "y") {
                isPriceDisabled = false
                isPricehide = false
              }
              else {
                isPriceDisabled = true
                isPricehide = true
              }

              if (this.feature_itm_list_table.length > 0) {
                for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
                  if (this.feature_itm_list_table[j].Item == data[i].OPTM_ITEMKEY && this.feature_itm_list_table[j].FeatureId == data[i].OPTM_FEATUREID) {
                    isExist = 1;
                  }
                }
                if (isExist == 0) {
                  this.feature_itm_list_table.push({
                    FeatureId: data[i].OPTM_FEATUREID,
                    featureName: "",
                    Item: data[i].OPTM_ITEMKEY,
                    Description: data[i].OPTM_DISPLAYNAME,
                    ItemNumber: "",
                    quantity: parseFloat(data[i].OPTM_QUANTITY).toFixed(3),
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: true,
                    pricehide: true,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id,
                    isQuantityDisabled: true
                  });
                }
              }
              else {
                this.feature_itm_list_table.push({
                  FeatureId: data[i].OPTM_FEATUREID,
                  featureName: "",
                  Item: data[i].OPTM_ITEMKEY,
                  Description: data[i].OPTM_DISPLAYNAME,
                  quantity: parseFloat(data[i].OPTM_QUANTITY).toFixed(3),
                  ItemNumber: "",
                  price: data[i].Pricesource,
                  Actualprice: data[i].Price,
                  pricextn: 0,
                  is_accessory: "Y",
                  isPriceDisabled: true,
                  pricehide: true,
                  parentId: this.selectfeaturedata[0].parentId,
                  model_id: this.step2_data.model_id,
                  isQuantityDisabled: true
                });
              }
            }
            this.feature_price_calculate();

          }

        })
      }
      else {
        if (this.feature_itm_list_table.length > 0) {
          for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
            if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
              this.feature_itm_list_table.splice(iacc, 1)
              iacc = iacc - 1;
            }


          }
        }
        this.feature_price_calculate();
      }
    }
  }


  step2_next_click_validation() {
    if (this.step1_data.document == "draft") {
      this.step1_data.customer = "";
      this.step1_data.ship_to = "";
      this.step1_data.bill_to = "";
      this.step1_data.person_name = "";
      this.step1_data.delivery_date = "";
      this.step1_data.sales_employee = "";
      this.step1_data.owner = "";
      this.step1_data.remark = "",
        this.step1_data.bill_to_address = "",
        this.step1_data.ship_to_address = "",
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

  onclearselection() {
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
    this.previousquantity = parseFloat("1");

  }

  GetAllDataForModelBomOutput(getmodelsavedata) {
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
        if (data != null || data != undefined) {
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

          this.setModelDataInGrid(ModelArray, this.ModelBOMDataForSecondLevel);

          this.setModelItemsDataInGrid(this.ModelHeaderItemsArray)

          this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);

          this.RuleIntegration(data.RuleOutputData, true)

          if (this.setModelDataFlag == true) {
            this.setModelDataInOutputBom(getmodelsavedata);
          }

        }
        else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }

      },
      error => {
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
    }

    if (parentarray[0].OPTM_MAXSELECTABLE > 1 && value == true) {
      var isExistForMax = this.feature_itm_list_table.filter(function (obj) {
        return obj['FeatureId'] == feature_model_data.OPTM_FEATUREID
      })

      if (isExistForMax.length == parentarray[0].OPTM_MAXSELECTABLE) {
        this.toastr.error('', this.language.select_max_selectable, this.commonData.toast_config);
        $("#" + id).prop("checked", false)
        return;
      }
    }

    this.checkedFunction(feature_model_data, parentarray, value);



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
                          if (this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].OPTM_FEATUREID == this.feature_itm_list_table[ifeatureitemsgrid].FeatureId && this.FeatureBOMDataForSecondLevel[ideletefeaturebomdata].OPTM_FEATUREID != null) {
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
                      OPTM_LINENO: feature_model_data.OPTM_LINENO,
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
                      propagateqty = parentarray[0].OPTM_QUANTITY
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
                              this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty);
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
                                  OPTM_LINENO: data.DataForSelectedFeatureModelItem[i].OPTM_LINENO,
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
                                        parentarray[0].feature_code = tempparentarray[0].feature_code
                                        parentarray[0].OPTM_LEVEL = tempparentarray[0].OPTM_LEVEL
                                      }
                                      itemData.push(data.dtFeatureDataWithDefault[idtfeature])
                                      this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty);
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
                    OPTM_LINENO: feature_model_data.OPTM_LINENO,
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
                        });
                      }
                    }
                  }
                  this.defaultitemflagid = feature_model_data.OPTM_FEATUREID
                }
              }
              else if (type == 2) {
                if (parentarray[0].OPTM_PROPOGATEQTY == "Y") {
                  propagateqtychecked = "Y"
                  parentarray[0].OPTM_QUANTITY = parseFloat(parentarray[0].OPTM_QUANTITY).toFixed(3)
                  propagateqty = parentarray[0].OPTM_QUANTITY
                }
                this.setItemDataForFeature(data.DataForSelectedFeatureModelItem, parentarray, propagateqtychecked, propagateqty);
                this.defaultitemflagid = data.DataForSelectedFeatureModelItem[0].OPTM_FEATUREID;
              }

            }//end data length
            this.enableFeatureModelsItems();
            this.RuleIntegration(data.RuleOutputData, value);
            this.checkedFunction(feature_model_data, parentarray, value);

          } //end value
          else {
            for (let i = 0; i < this.feature_itm_list_table.length; i++) {
              if (this.feature_itm_list_table[i].FeatureId == feature_model_data.OPTM_FEATUREID && this.feature_itm_list_table[i].Item == feature_model_data.OPTM_ITEMKEY) {
                this.feature_itm_list_table.splice(i, 1);
                i = i - 1;
              }
            }
            this.enableFeatureModelsItems();
            this.RuleIntegration(data.RuleOutputData, value);

          }
        }//end data null
      },//end data
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    );//end subscribe


    this.feature_price_calculate();

  } //end selection

  setItemDataForFeature(ItemData, parentarray, propagateqtychecked, propagateqty) {
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

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ItemData[0].OPTM_FEATUREID,
          featureName: parentarray[0].feature_code,
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
          ModelId: parentarray[0].OPTM_MODELID,
          OPTM_LEVEL: parentarray[0].OPTM_LEVEL,
          isQuantityDisabled: true
        });
      }
    }


    this.feature_price_calculate();

  }

  GetDataForModelBomOutput() {
    this.lookupfor = 'tree_view__model_bom_Output_lookup"';
    this.tree_data_json = [];
    if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
      this.OutputService.GetDataForModelBomOutput(this.step2_data.model_id, this.step2_data.model_name).subscribe(
        data => {
          if (data != null || data != undefined) {
            // this.serviceData = data;
            // this.lookupfor = "tree_view__model_bom_lookup";
            let counter_temp = 0;
            let temp_data = data.Table2.filter(function (obj) {
              // obj['live_row_id'] = (counter_temp++);
              return obj;
            });
            for (let i = 0; i < temp_data.length; ++i) {
              if (temp_data[i].checked == "Y") {
                temp_data[i].checked = true
              }
              else {
                temp_data[i].checked = false
              }
              if (temp_data[i].MaxSelectable == "1") {
                temp_data[i].element_type = "radio"
              }
              else {
                if (temp_data[i].MaxSelectable > 1) {
                  temp_data[i].element_type = "checkbox"
                }

              }
            }
            this.tree_data_json = temp_data;
            this.tree_accessory_json = data.Table3;
            this.GetDataByModelId(this.step2_data.model_id);
            this.getAccessoryForBydefault(data.Table3)

            setTimeout(() => {
              this.tree_view_expand_collapse()
            }, 2000);
          }
          else {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }

        },
        error => {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      );
    }
    else {
      // let sequence_count = parseInt(this.tree_data_json.length + 1);
      // if (this.live_tree_view_data.length > 0) {
      //   console.log(this.live_tree_view_data);
      //   for (var key in this.live_tree_view_data) {
      //     this.tree_data_json.push({ "sequence": sequence_count, "parentId": this.modelbom_data.feature_name, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1" });
      //   }

      //   this.live_tree_view_data = [];
      //   console.log(this.tree_data_json);
      // }
    }
  }

  on_element_input_change(data, value) {
    this.selectfeaturedata = [];
    this.selectfeaturedata.push(data)
    if (this.feature_accessory_list.length > 0) {
      for (let i = 0; i < this.feature_accessory_list.length; ++i) {
        if (this.feature_accessory_list[i].parentId == data.parentId) {
          if (this.feature_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
              if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.feature_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }
            }
          }
          this.feature_price_calculate();
          this.feature_accessory_list.splice(i, 1);
          i = i - 1;
        }
      }
    }
    // let itotalcheckfeature = 0;
    // for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
    //   if (this.tree_data_json[itree].FeatureId == data.FeatureId && this.tree_data_json[itree].checked == true) {
    //     itotalcheckfeature = itotalcheckfeature + 1;
    //   }
    //   if (itotalcheckfeature >= data.MaxSelectable && this.tree_data_json[itree].component == data.component) {
    //     this.tree_data_json[itree].checked = false
    //     this.toastr.error('', "cannot select greater than maximum selectable limit", this.commonData.toast_config);
    //     return;
    //   }
    //   else {
    //     if(this.tree_data_json[itree].component == data.component){
    //       this.tree_data_json[itree].checked = true
    //     }
    //   }
    // }
    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      if (this.feature_itm_list_table[iacc].FeatureId == data.FeatureId) {
        if (data.MaxSelectable == 1) {
          this.feature_itm_list_table.splice(iacc, 1)
          iacc = iacc - 1;
          for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
            if (this.tree_data_json[itree].FeatureId == data.FeatureId) {
              //itotalcheckfeature = itotalcheckfeature + 1;
              if (this.tree_data_json[itree].component != data.component) {
                this.tree_data_json[itree].checked = false
              }

            }
          }
        }
      }
      if (value == false) {
        if (data.component == this.feature_itm_list_table[iacc].featureName) {
          this.feature_itm_list_table.splice(iacc, 1)
          iacc = iacc - 1;
        }
      }
    }
    if (value == true) {
      if (data.FeatureId == this.step2_data.model_id) {
        this.bycheckboxpress = 1
        this.GetDataByModelId(this.step2_data.model_id)
      }
      else {

        this.getFeatureDetails(data.FeatureId, this.step2_data.model_id);
        this.selecteddataforelement = data;
      }
    }
  }

  GetDataByModelId(id) {
    this.OutputService.GetDataByModelId(id).subscribe(
      data => {
        this.modelitemflag = 1;
        this.getItemDataForFeature(data.ModelDetail);
        this.modelitemflag = 0;
        this.selectfeaturedata = [];
        for (let iacc = 0; iacc < this.tree_data_json.length; ++iacc) {
          if (this.tree_data_json[iacc].checked == true && this.tree_data_json[iacc].OPTM_ITEMKEY != "" && this.tree_data_json[iacc].parentId != this.step2_data.model_code && this.tree_data_json[iacc].Mandatory == "Y") {
            this.selectfeaturedata.push(this.tree_data_json[iacc])
            if (this.feature_accessory_list.length > 0) {
              for (let i = 0; i < this.feature_accessory_list.length; ++i) {
                if (this.feature_accessory_list[i].parentId == this.tree_data_json[iacc].parentId) {
                  if (this.feature_itm_list_table.length > 0) {
                    for (let iaccss = 0; iaccss < this.feature_itm_list_table.length; ++iaccss) {
                      if (this.feature_itm_list_table[iaccss].FeatureId == this.feature_accessory_list[i].id) {
                        this.feature_itm_list_table.splice(iaccss, 1)
                        iaccss = iaccss - 1;
                      }
                    }
                  }
                  this.feature_price_calculate();
                  this.feature_accessory_list.splice(i, 1);
                  i = i - 1;
                }
              }
            }
            if (this.bycheckboxpress == 0) {
              for (let iaccess = 0; iaccess < this.feature_itm_list_table.length; ++iaccess) {
                if (this.feature_itm_list_table[iaccess].parentId == this.tree_data_json[iacc].parentId) {
                  this.feature_itm_list_table.splice(iaccess, 1)
                  iaccess = iaccess - 1;
                }
              }

            }

          }
        }
        // this.on_element_input_change(this.tree_data_json[iacc],false)
        for (let iaccss = 0; iaccss < this.selectfeaturedata.length; iaccss++) {
          this.getFeatureDetails(this.selectfeaturedata[iaccss].FeatureId, this.step2_data.model_id);
        }

        this.bycheckboxpress = 0;
      }
    )
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
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else {
          this.step1_data.ship_to_address = '';
        }
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
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
        }
        else {
          this.step1_data.bill_to_address = '';
        }
      })
  }
  onCustomerChange() {
    this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data === "False") {
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
          //this.GetCustomername();
          // this.fillContactPerson();
          // this.fillShipTo();
          // this.fillBillTo();
          // this.fillOwners();
        }
      })
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
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
  }

  onFinishPress(screen_name, button_press) {
    if (button_press == 'finishPress') {
      this.onValidateNextPress();
    }
    let final_dataset_to_save: any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTDTL = [];
    final_dataset_to_save.ConnectionDetails = [];
    let total_discount = (Number(this.feature_discount_percent) + Number(this.accessory_discount_percent));
    //creating header data
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
      "OPTM_FGITEM": this.step2_data.model_code,
      "OPTM_KEY": "",
      "OPTM_DELIVERYDATE": this.step1_data.delivery_until,
      "OPTM_QUANTITY": parseFloat(this.step2_data.quantity).toFixed(3),
      "OPTM_CREATEDBY": this.common_output_data.username,
      "OPTM_MODIFIEDBY": this.common_output_data.username,
      "OPTM_DESC": this.step1_data.description,
      "OPTM_SALESEMP": this.step1_data.sales_employee,
      "OPTM_OWNER": this.step1_data.owner,
      "OPTM_REMARKS": this.step1_data.remark,
      "OPTM_BILLADD": this.step1_data.bill_to_address,
      "OPTM_SHIPADD": this.step1_data.ship_to_address,
      "OPTM_POSTINGDATE": this.step1_data.posting_date,
      "OPTM_GRANDTOTAL": Number(this.acc_grand_total),
      "OPTM_PRODTOTAL": Number(this.feature_item_total),
      "OPTM_TOTALBEFOREDIS": Number(this.feature_total_before_discount),
      "OPTM_PRODDISCOUNT": Number(this.feature_discount_percent),
      "OPTM_ACCESSORYDIS": Number(this.accessory_discount_percent),
      "OPTM_ACCESSORYTOTAL": Number(this.accessory_item_total),
      "OPTM_TOTALDISCOUNT": Number(total_discount),
    })

    //creating details table array
    final_dataset_to_save.OPConfig_OUTPUTDTL = this.step2_final_dataset_to_save;
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

    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          if (data[0].Status == "True") {
            this.iLogID = data[0].LogId;
            this.toastr.success('', this.language.OperCompletedSuccess, this.commonData.toast_config);
          }
          else {
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
            return;
          }

        }
        else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )
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

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
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

  onValidateNextPress() {
    this.navigatenextbtn = false;
    this.validnextbtn = true;
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
    $("#modelbom_next_click_id").trigger('click');
    this.onModelBillNextPress();
  }

  //For next press towards finsh screen
  onModelBillNextPress() {
    //Clear the array
    var isModelFeatureItem = 0;
    this.step3_data_final = [];
    var imodelfilteritems = [];
    var itemkeyforparentmodel = "";

    this.step2_final_dataset_to_save = [];
    let grand_total = Number(this.feature_total_before_discount)
    let per_item_price: any = (grand_total / Number(this.step2_data.quantity));
    let price_ext: any = grand_total;
    this.step3_data_final.push({
      "rowIndex": "1",
      "sl_no": "1",
      "item": this.step2_data.model_code,
      "quantity": parseFloat(this.step2_data.quantity).toFixed(3),
      "price": parseFloat(per_item_price).toFixed(3),
      "price_ext": parseFloat(price_ext).toFixed(3),
      "feature": this.feature_itm_list_table,
      "accesories": this.feature_accessory_list,
      "model_id": this.step2_data.model_id,
      "desc": this.step2_data.model_name,
    })

    // for (let itemCount = 0; itemCount < this.step3_data_final.length; itemCount++) {
    //   let row_data = this.step3_data_final[itemCount];
    //   this.new_item_list.push(
    //     row_data.item
    //   )
    // }


    this.step2_final_dataset_to_save = [];
    if (this.step2_final_dataset_to_save.length == 0) {
      this.step2_final_dataset_to_save.push({
        "OPTM_OUTPUTID": "",
        "OPTM_OUTPUTDTLID": "",
        "OPTM_ITEMNUMBER": "",
        "OPTM_ITEMCODE": this.step2_data.model_code,
        "OPTM_KEY": "",
        "OPTM_PARENTKEY": "",
        "OPTM_TEMPLATEID": this.step2_data.templateid,
        "OPTM_ITMCODEGENKEY": this.step2_data.itemcodegenkey,
        "OPTM_ITEMTYPE": 0,
        "OPTM_WHSE": this.warehouse,
        "OPTM_LEVEL": 0,
        "OPTM_QUANTITY": parseFloat(this.step2_data.quantity).toFixed(3),
        "OPTM_PRICELIST": 0,
        "OPTM_UNITPRICE": 0,
        "OPTM_TOTALPRICE": 0,
        "OPTM_DISCPERCENT": 0,
        "OPTM_CREATEDBY": this.common_output_data.username,
        "OPTM_MODIFIEDBY": this.common_output_data.username,
        "UNIQUEIDNT": "Y",
        "PARENTID": this.step2_data.model_id,
        "OPTM_FGCREATEDATE": "",
        "OPTM_REFITEMCODE": "",
        "OPTM_PARENTID": this.step2_data.model_id,
        "OPTM_PARENTTYPE": 2
      })
    }

    if (this.feature_accessory_list.length <= 0 && this.feature_itm_list_table.length <= 0) {
      //Clear the array when user play with next prev button
      this.step3_data_final = [];
    }
    for (var ifeature in this.feature_itm_list_table) {
      if (this.feature_itm_list_table[ifeature].Item == null || this.feature_itm_list_table[ifeature].Item == "" || this.feature_itm_list_table[ifeature].Item == undefined) {
        imodelfilteritems = [];
        var imodelfilterfeatures = [];
        var imodelData = [];
        var tempfeatureid = this.feature_itm_list_table[ifeature].FeatureId

        imodelData = this.ModelHeaderData.filter(function (obj) {
          return obj['OPTM_CHILDMODELID'] == tempfeatureid
        })

        imodelfilteritems = this.ModelBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_MODELID'] == tempfeatureid && obj['OPTM_TYPE'] == 2
        })

        imodelfilterfeatures = this.ModelBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_MODELID'] == tempfeatureid && obj['OPTM_TYPE'] == 1
        })

        var matchmodelitemarray = [];

        matchmodelitemarray = this.feature_itm_list_table.filter(function (obj) {
          return obj['ModelId'] == tempfeatureid
        })

        if (matchmodelitemarray.length > 0) {
          isModelFeatureItem = 1;
          for (var imatchmodel in matchmodelitemarray) {
            var indexmatchmodelitemarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
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

        this.step2_final_dataset_to_save.push({
          "OPTM_OUTPUTID": "",
          "OPTM_OUTPUTDTLID": "",
          "OPTM_ITEMNUMBER": "",
          "OPTM_ITEMCODE": this.feature_itm_list_table[ifeature].featureName,
          "OPTM_KEY": "",
          "OPTM_PARENTKEY": "",
          "OPTM_TEMPLATEID": imodelData[0].MODELTEMPLATEITEM,
          "OPTM_ITMCODEGENKEY": imodelData[0].ITEMCODEGENREF,
          "OPTM_ITEMTYPE": 1,
          "OPTM_WHSE": this.warehouse,
          "OPTM_LEVEL": this.feature_itm_list_table[ifeature].OPTM_LEVEL,
          "OPTM_QUANTITY": parseFloat(this.feature_itm_list_table[ifeature].quantity).toFixed(3),
          "OPTM_PRICELIST": Number(this.feature_itm_list_table[ifeature].price),
          "OPTM_UNITPRICE": Number(this.feature_itm_list_table[ifeature].Actualprice),
          "OPTM_TOTALPRICE": Number(this.feature_itm_list_table[ifeature].quantity * this.feature_itm_list_table[ifeature].Actualprice),
          "OPTM_DISCPERCENT": 0,
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
            if (this.feature_itm_list_table[ifeature].is_accessory == "Y") {
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

            featureitemlistfilterdata = this.feature_itm_list_table.filter(function (obj) {
              return obj['Item'] == imodelfilteritems[i].OPTM_ITEMKEY && obj['ModelId'] == imodelfilteritems[i].OPTM_MODELID
            })

            var checkmodelitem = this.ModelBOMDataForSecondLevel.filter(function (obj) {
              return obj['OPTM_MODELID'] == featureitemlistfilterdata[0].ModelId && obj['OPTM_TYPE'] == 2 &&
                obj['OPTM_ITEMKEY'] == featureitemlistfilterdata[0].Item
            })

            if (checkmodelitem.length > 0) {
              this.step2_final_dataset_to_save.push({
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
                "OPTM_UNITPRICE": Number(featureitemlistfilterdata[0].Actualprice),
                "OPTM_TOTALPRICE": Number(featureitemlistfilterdata[0].quantity * featureitemlistfilterdata[0].Actualprice),
                "OPTM_DISCPERCENT": 0,
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

          for (var isave in this.step2_final_dataset_to_save) {
            if (this.step2_final_dataset_to_save[isave].PARENTID == imodelData[0].OPTM_MODELID && this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE == imodelData[0].child_code) {
              this.step2_final_dataset_to_save[isave].OPTM_KEY = itemkeyforparentmodel.toString()
            }
            // if (isModelFeatureItem == 0) {
            //   for (var isavemodelchild in imodelfilteritems) {
            //     if (this.step2_final_dataset_to_save[isave].PARENTID == imodelfilteritems[isavemodelchild].OPTM_MODELID && this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE == imodelfilteritems[isavemodelchild].OPTM_ITEMKEY) {
            //       this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY = itemkeyforparentmodel
            //     }
            //   }
            // }
          }

        }
        var modelfeatureitemkey = "";
        if (imodelfilterfeatures.length > 0) {
          for (var ifeaitem in imodelfilterfeatures) {
            var filterfeatureitems = this.feature_itm_list_table.filter(function (obj) {
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
          for (var isavedataset in this.step2_final_dataset_to_save) {
            if (this.step2_final_dataset_to_save[isavedataset].OPTM_ITEMTYPE == "1" && modelfeatureitemkey != "") {
              this.step2_final_dataset_to_save[isavedataset].OPTM_KEY = modelfeatureitemkey.toString()
            }
          }

        }



      }
      else {
        var ifeatureData = [];
        var itemtype;
        var fid = this.feature_itm_list_table[ifeature].FeatureId;
        if (this.feature_itm_list_table[ifeature].FeatureId != null) {
          if (this.feature_itm_list_table[ifeature].FeatureId != this.step2_data.model_id) {
            var ifeatureHeaderData = [];
            ifeatureHeaderData = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == fid && obj['OPTM_FEATUREID'] != null
            })

            if (ifeatureHeaderData.length == 0) {
              if (this.feature_itm_list_table[ifeature].is_accessory == "N") {
                ifeatureHeaderData = this.ModelHeaderData.filter(function (obj) {
                  return obj['OPTM_ITEMKEY'] == this.feature_itm_list_table[ifeature].Item
                })
              }
              else {
                ifeatureHeaderData = this.Accessoryarray.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == fid
                })
              }
            }

            var itemcode = this.feature_itm_list_table[ifeature].OPTM_ITEMKEY
            if (this.feature_itm_list_table[ifeature].is_accessory == "Y") {
              itemtype = 3;
            }
            else {
              itemtype = 2;
            }

            // if (ifeatureData.length > 0) {
            this.step2_final_dataset_to_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": this.feature_itm_list_table[ifeature].ItemNumber,
              "OPTM_ITEMCODE": this.feature_itm_list_table[ifeature].Item,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": "",
              "OPTM_ITMCODEGENKEY": "",
              "OPTM_ITEMTYPE": itemtype,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": this.feature_itm_list_table[ifeature].OPTM_LEVEL,
              "OPTM_QUANTITY": parseFloat(this.feature_itm_list_table[ifeature].quantity).toFixed(3),
              "OPTM_PRICELIST": Number(this.feature_itm_list_table[ifeature].price),
              "OPTM_UNITPRICE": Number(this.feature_itm_list_table[ifeature].Actualprice),
              "OPTM_TOTALPRICE": Number(this.feature_itm_list_table[ifeature].quantity * this.feature_itm_list_table[ifeature].Actualprice),
              "OPTM_DISCPERCENT": 0,
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": ifeatureHeaderData[0].OPTM_UNIQUEIDNT,
              "PARENTID": this.feature_itm_list_table[ifeature].FeatureId,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": this.feature_itm_list_table[ifeature].FeatureId,
              "OPTM_PARENTTYPE": 1
            })
          }
          else {
            var ifeatureHeaderData = [];
            var itemcode = this.feature_itm_list_table[ifeature].Item
            ifeatureHeaderData = this.ModelHeaderItemsArray.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == itemcode && obj['OPTM_MODELID'] == fid
            })

            if (this.feature_itm_list_table[ifeature].is_accessory == "Y") {
              itemtype = 3;
            }
            else {
              itemtype = 2;
            }

            // if (ifeatureData.length > 0) {
            this.step2_final_dataset_to_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": this.feature_itm_list_table[ifeature].ItemNumber,
              "OPTM_ITEMCODE": this.feature_itm_list_table[ifeature].Item,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": "",
              "OPTM_ITMCODEGENKEY": "",
              "OPTM_ITEMTYPE": itemtype,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": this.feature_itm_list_table[ifeature].OPTM_LEVEL,
              "OPTM_QUANTITY": parseFloat(this.feature_itm_list_table[ifeature].quantity).toFixed(3),
              "OPTM_PRICELIST": Number(this.feature_itm_list_table[ifeature].price),
              "OPTM_UNITPRICE": Number(this.feature_itm_list_table[ifeature].Actualprice),
              "OPTM_TOTALPRICE": Number(this.feature_itm_list_table[ifeature].quantity * this.feature_itm_list_table[ifeature].Actualprice),
              "OPTM_DISCPERCENT": 0,
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": ifeatureHeaderData[0].OPTM_UNIQUEIDNT,
              "PARENTID": this.feature_itm_list_table[ifeature].FeatureId,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": this.feature_itm_list_table[ifeature].FeatureId,
              "OPTM_PARENTTYPE": 1
            })
          }

          // }
        }
      }
    }

    // if (isModelFeatureItem == 1) {
    for (var isavemodelchild in imodelfilteritems) {
      for (var isavefinaldatasettosave in this.step2_final_dataset_to_save) {
        if (this.step2_final_dataset_to_save[isavefinaldatasettosave].OPTM_ITEMNUMBER == imodelfilteritems[isavemodelchild].DocEntry && this.step2_final_dataset_to_save[isavefinaldatasettosave].OPTM_ITEMCODE == imodelfilteritems[isavemodelchild].OPTM_ITEMKEY) {
          this.step2_final_dataset_to_save[isavefinaldatasettosave].OPTM_PARENTKEY = itemkeyforparentmodel
          this.step2_final_dataset_to_save[isavefinaldatasettosave].OPTM_PARENTID = imodelfilteritems[isavemodelchild].OPTM_MODELID
          this.step2_final_dataset_to_save[isavefinaldatasettosave].PARENTID = imodelfilteritems[isavemodelchild].OPTM_MODELID
        }
      }

    }
    // }

    var modelitemtype = this.step2_final_dataset_to_save.filter(function (obj) {
      return obj['OPTM_ITEMTYPE'] == 1
    })

    if (modelitemtype.length > 0) {
      for (var imodelitemtypesave in modelitemtype) {
        var itemnumbersplitnumber = String(modelitemtype[imodelitemtypesave].OPTM_KEY).split("-")
      }
    }

    var itemkey = "";
    for (var isave in this.step2_final_dataset_to_save) {
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE == 1) {
        // imodelData = this.ModelHeaderData.filter(function (obj) {
        //   return obj['OPTM_MODELID'] == this.step2_final_dataset_to_save[isave].PARENTID && obj['featureName'] == this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE
        // })
        if (this.step2_final_dataset_to_save[isave].UNIQUEIDNT == "Y") {
          if (itemkey.length == 0) {
            itemkey = this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE
          } else {
            itemkey = itemkey + "-" + this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE
          }
        }

      }
      else if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE != 1 && isave != "0" && this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY == "" && this.step2_final_dataset_to_save[isave].UNIQUEIDNT == "Y" && this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE != 3) {
        var modelitemflag = false;
        for (var i in itemnumbersplitnumber) {
          if (itemnumbersplitnumber[i] == this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER) {
            modelitemflag = true
          }
        }

        if (modelitemflag == false) {
          if (itemkey.length == 0) {
            itemkey = this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER
          } else {
            itemkey = itemkey + "-" + this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER
          }
        }

      }

      this.step2_final_dataset_to_save[0].OPTM_KEY = itemkey.toString()
    }
    var sortitemkey = "";
    var sortitemkeyarray = this.step2_final_dataset_to_save[0].OPTM_KEY.split("-").sort((a, b) => a - b)

    for (var isort in sortitemkeyarray) {
      if (sortitemkey.length == 0) {
        sortitemkey = sortitemkeyarray[isort]
      } else {
        sortitemkey = sortitemkey + "-" + sortitemkeyarray[isort]
      }
    }

    this.step2_final_dataset_to_save[0].OPTM_KEY = sortitemkey.toString()
    itemkey = sortitemkey

    for (var isave in this.step2_final_dataset_to_save) {
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE != 0 && this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE != 3 && this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY == "") {
        this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY = itemkey
      }
    }
    var modelitemtype = this.step2_final_dataset_to_save.filter(function (obj) {
      return obj['OPTM_ITEMTYPE'] == 1
    })

    if (modelitemtype.length > 0) {
      for (var imodelitemtypesave in modelitemtype) {
        var itemnumbersplitnumber = String(modelitemtype[imodelitemtypesave].OPTM_KEY).split("-")
        for (var isave in this.step2_final_dataset_to_save) {
          if (itemnumbersplitnumber.length > 0) {
            for (var i in itemnumbersplitnumber) {
              if (itemnumbersplitnumber[i] == this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER) {
                this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY = modelitemtype[imodelitemtypesave].OPTM_KEY.toString()
              }
            }
          }
        }
      }
    }




    this.feature_price_calculate();
  }

  //For getting final status this mehod will handle 
  getFinalBOMStatus() {
    this.OutputService.getFinalBOMStatus(this.iLogID).subscribe(
      data => {
        console.log('data');
        console.log(data);
        if (data != null) {
          console.log('in if data');
          if (data.FinalStatus[0].OPTM_STATUS == "P") {
            this.final_order_status = this.language.process_status;
            this.final_ref_doc_entry = data.FinalStatus[0].OPTM_REFDOCENTRY;
            this.final_document_number = data.FinalStatus[0].OPTM_REFDOCNO;
          }
          else {
            console.log('in else data');
            this.final_order_status = this.language.pending_status;
          }

          if (data.GeneratedNewItemList.length > 0 && data.GeneratedNewItemList !== undefined) {
            console.log('in GeneratedNewItemList');
            console.log(data.GeneratedNewItemList)
            this.new_item_list = data.GeneratedNewItemList;
            data.GeneratedNewItemList
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
        },
        error => {
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
            ispropogateqty: ItemData[i].OPTM_PROPOGATEQTY

          });
        }
      }
      this.feature_price_calculate();
    }
  }

  selectallAccessory(value) {
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
            let parentfeatureid = this.feature_accessory_list[i].parentfeatureid
            let parentarray = this.Accessoryarray.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == parentfeatureid
            });
            if (data.DataForSelectedFeatureModelItem.length > 0)
              this.setItemDataForFeatureAccessory(data.DataForSelectedFeatureModelItem, parentarray);
          },
          error => {
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
      }
    }
    this.feature_price_calculate();
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
          isQuantityDisabled: true
        });
      }
    }
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
          isQuantityDisabled: true
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
            isQuantityDisabled: true
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
          isQuantityDisabled: true
        });
      }
    }
  }

  RuleIntegration(RuleOutputData, value) {
    if (RuleOutputData.length > 0) {
      for (var iItemFeatureTable in this.FeatureBOMDataForSecondLevel) {
        for (var iItemRule in RuleOutputData) {
          if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_TYPE == 1) {
            if (this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_CHILDFEATUREID == RuleOutputData[iItemRule].OPTM_FEATUREID) {
              if (value == true) {
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
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
                }
                else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATURECODE = this.FeatureBOMDataForSecondLevel[iItemFeatureTable].parent_code
                    defaultitemarray.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
                    if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {

                      this.removefeatureitemlist(this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID)

                      this.getDefaultItems(defaultitemarray)
                    }
                  }
                  else {
                    this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = false
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
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = true
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                }
                else {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                  if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                    defaultitemarray.push(this.ModelBOMDataForSecondLevel[iModelItemTable])
                    if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {
                      this.removefeatureitemlist(this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID)
                      this.getDefaultItems(defaultitemarray)
                    }

                  }
                  else {
                    this.ModelBOMDataForSecondLevel[iModelItemTable].checked = false
                  }
                }
              }
              else {
                this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
                if (RuleOutputData[iItemRule].OPTM_DEFAULT == "True") {
                  this.ModelBOMDataForSecondLevel[iModelItemTable].checked = true
                  defaultitemarray.push(this.ModelBOMDataForSecondLevel[iModelItemTable])
                  if (this.defaultitemflagid != defaultitemarray[0].OPTM_FEATUREID) {
                    this.removefeatureitemlist(this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID)
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
    this.OutputService.onModelIdChange(this.step2_data.model_code).subscribe(
      data => {
        if (data === "False") {
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.step2_data.modal_id = "";
          this.step2_data.model_code = "";
          this.onclearselection();
          return;
        }
        else {
          this.step2_data.model_id = data;
          this.GetAllDataForModelBomOutput("");
        }
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
            isQuantityDisabled: true
          });

      }
      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 2) {
        if (getmodelsavedata[imodelsavedata].OPTM_LEVEL == 2) {
          var ModelItemsArray = [];
          ModelItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });

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
              isQuantityDisabled: true
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
              isQuantityDisabled: true
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
                isQuantityDisabled: true
              });

              for (var iaccess in this.feature_accessory_list) {
                if (parentfeatureid == this.feature_accessory_list[iaccess].id) {
                  this.feature_accessory_list[iaccess].checked = true
                }
              }

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

  //This method will get Customer's all info.

  getCustomerAllInfo() {

    //first we will clear the details
    this.cleanCustomerAllInfo();

    this.OutputService.getCustomerAllInfo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
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


              this.step1_data.sales_employee = this.salesemployee;
            }
            else {
              this.sales_employee = [];
              this.salesemployee = "";
              this.step1_data.sales_employee = "";
            }
          }
          else {
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
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

          //Fill Ship to
          if (data.ShipDetail.length > 0) {
            this.ship_to = data.ShipDetail;
            this.customerShipTo = data.ShipDetail[0].ShipToDef;
            this.step1_data.ship_to = data.ShipDetail[0].ShipToDef;


            this.ship_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              ShipTo: this.customerShipTo,
              currentDate: this.step1_data.posting_date
            });

            //To get ship address
            this.fillShipAddress(this.ship_data, data);
          }
          else {
            this.ship_to = [];
            this.step1_data.ship_to_address = '';
          }
        } else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        }
      },
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      })

  }

  fillBillAddress(bill_data, orig_data) {
    this.OutputService.fillBillAddress(bill_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;

          this.fillShipDetails(orig_data);
        }
        else {
          this.step1_data.bill_to_address = '';
        }
      })
  }

  fillShipAddress(ship_data, orig_data) {
    this.OutputService.fillShipAddress(ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;

          this.fillAllOwners(orig_data);
        }
        else {
          this.step1_data.ship_to_address = '';
        }
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
    }
  }

  //fill all owners
  fillAllOwners(data) {
    if (data.AllOwners.length > 0) {
      this.owner_list = data.AllOwners;
      this.step1_data.owner = data.AllOwners[0].lastName;
    }
    else {
      this.owner_list = [];
      this.step1_data.owner = "";
    }
  }

  //Clean all Customer Info
  cleanCustomerAllInfo() {
    //clear all owners info
    this.owner_list.length = 0;
    this.step1_data.owner = "";

    //clear all bill to detial
    this.bill_to.length = 0;
    this.step1_data.bill_to_address =
      //clear contact person detail
      this.contact_persons.length = 0;
    this.person = "";
    this.step1_data.person_name = "";

    //clear sales employee detail
    this.sales_employee.length = 0;
    this.salesemployee = "";
    this.step1_data.sales_employee = "";

    //clear ship to detail
    this.ship_to.length = 0;
    this.step1_data.ship_to_address = '';
  }
}