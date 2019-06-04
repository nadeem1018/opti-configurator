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
  public discount_price: number = 0;

  public accessory_discount_percent: number = 0;
  public step2_final_dataset_to_save = [];
  public tree_accessory_json = [];
  public Accessoryarray = [];
  public ModelHeaderItemsArray = [];
  public warehouse: string = "";
  public currentDate = new Date();
  public submit_date;
  public showLookupLoader: boolean = false;
  public step2_selected_model: any = '';
  public step2_selected_model_id: any = '';
  public step4_final_prod_total: any = 0;
  public step4_final_acc_total: any = 0;
  public step4_final_grand_total: any = 0;
  public step4_final_DetailModelData = [];
  //Outputlog
  public prod_discount_log: any = 0;
  public access_dis_amount_log: any = 0;
  public isPreviousPressed: boolean = false;
  public isDuplicate: boolean = false;
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
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService, private elementRef: ElementRef, private cdref: ChangeDetectorRef, private CommonService: CommonService) { }
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
  public checked:boolean = false;
  public globalConfigId: any = '';
  public description: any;
  public step0_isNextButtonVisible: boolean = false;
  public setModelDataFlag: boolean = false;
  public defaultitemflagid: any;
  public ModelInModelArray: any = [];
  public ModelLookupFlag = false
  public cDate = new Date();
  public AccessModel: any = [];
  public selectedAccessoryHeader: any = []
  public selectedAccessoryBOM: any = []
  public menu_auth_index = '205';

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
    this.submit_date = (this.currentDate.getFullYear()) + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate();
    this.step1_data.delivery_until = new Date((this.currentDate.getFullYear()) + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate());
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

    // dummy data for 2nd screen 
    this.tree_data_json = [];
    this.step1_data.print_operation = "";
    // check screen authorisation - start
  
   this.check_authorisation()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async check_authorisation(){
    await this.sleep(1200);
    this.CommonService.getMenuRecord().subscribe(
      menu_item => {
        let menu_auth_index = this.menu_auth_index
        let is_authorised = menu_item.filter(function (obj) {
          return (obj.OPTM_MENUID == menu_auth_index) ? obj : "";
        });

        if (is_authorised.length == 0) {
          let objcc = this;
          setTimeout(function () {
            objcc.toastr.error('', objcc.language.notAuthorisedScreen, objcc.commonData.toast_config);
            objcc.route.navigateByUrl('home');
          }, 200);
        }
      });
      // check screen authorisation - end
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
    this.lookupfor = "";
    $("select[name='print_operation_type']").val("");
    this.serviceData = [];
    this.step1_data.print_operation = [];
    this.serviceData.ref_doc_details = [];
    this.serviceData.product_grand_details = [];
    this.serviceData.print_types = [];
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
    this.step1_data.delivery_until = (cDate.getMonth() + 1) + "/" + cDate.getDate() + "/" + cDate.getFullYear();
    console.log(this.step1_data.delivery_until);
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
  
    this.CommonService.GetServerDate().subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].DATEANDTIME != null) {
            let server_date_time = new Date(data[0].DATEANDTIME);
            this.step1_data.posting_date = (server_date_time.getMonth() + 1) + "/" + server_date_time.getDate() + "/" + server_date_time.getFullYear();
            this.step1_data.delivery_until = new Date((server_date_time.getMonth() + 1) + "/" + server_date_time.getDate() + "/" + server_date_time.getFullYear());
            console.log(this.step1_data.delivery_until);
          }
        }
        else {
          this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
          this.step1_data.delivery_until = new Date((this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear());
          console.log(this.step1_data.delivery_until);
          this.toastr.error('', this.language.ServerDateError, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.step1_data.posting_date = (this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear();
        this.step1_data.delivery_until = new Date((this.cDate.getMonth() + 1) + "/" + this.cDate.getDate() + "/" + this.cDate.getFullYear());
        console.log(this.step1_data.delivery_until);
        this.showLookupLoader = false;
      }
    )

    if (this.step1_data.main_operation_type == 1) {
      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
      this.setModelDataFlag = false;
      this.onclearselection(1);

    }
    if (this.step1_data.main_operation_type == 2 || this.step1_data.main_operation_type == 3 || this.step1_data.main_operation_type == 4) {
      if (this.step1_data.selected_configuration_key == "") {
        this.toastr.error('', this.language.select_configuration, this.commonData.toast_config);
        return;
      }

      if (this.step1_data.description == "" || this.step1_data.description == undefined) {
        this.toastr.error('', this.language.description_blank, this.commonData.toast_config);
        return;
      }
    }
    $("#step0_next_click_id").trigger('click');
    this.showPrintOptions = true;
  }
  previousButtonPress() {
    this.isPreviousPressed = true;
    this.showPrintOptions = false;

  }
  onSavePress() {
    // this.onValidateNextPress();

    this.add_fg_multiple_model();
    this.onFinishPress("step1_data", "savePress");

  }

  open_config_lookup() {
    this.serviceData = []
    this.showLookupLoader = true;
    this.lookupfor = 'configure_list_lookup';
    this.OutputService.getConfigurationList(this.step1_data.main_operation_type).subscribe(
      data => {
        if (data != undefined && data.length > 0) {
          this.showLookupLoader = false;

          if (data[0].ErrorMsg == "7001") {
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }

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

        if (data != undefined && data.length > 0) {
          // test
          if (data[0].ErrorMsg == "7001") {

            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
        }

        console.log(data);
        if (this.step1_data.main_operation_type == "3") {
          this.iLogID = "";
        }

        if (data.CustomerOutput.length > 0) {
          if ((data.CustomerOutput[0].OPTM_DOCTYPE = "23") && (data.CustomerOutput[0].OPTM_STATUS != "D")) {
            this.step1_data.document = "sales_quote"
            this.step1_data.document_name = this.language.SalesQuote;
          } else if (((data.CustomerOutput[0].OPTM_DOCTYPE = "23") && (data.CustomerOutput[0].OPTM_STATUS == "D")) || ((data.CustomerOutput[0].OPTM_DOCTYPE = "17") && (data.CustomerOutput[0].OPTM_STATUS == "D"))) {
            this.step1_data.document = 'draft';
            this.step1_data.document_name = this.language.draft;
          }
          else {
            this.step1_data.document = "sales_order"
            this.step1_data.document_name = this.language.SalesOrder;
          }

          this.final_reference_number = data.CustomerOutput[0].LogRefDocNo;
          this.final_ref_doc_entry =  data.CustomerOutput[0].LogRefDocEntry;
          this.final_document_number = data.CustomerOutput[0].LogRefDocNo;

          this.step1_data.customer = data.CustomerOutput[0].OPTM_BPCODE,
            this.step1_data.customer_name = data.CustomerOutput[0].Name,
            this.step1_data.bill_to_address = data.CustomerOutput[0].OPTM_BILLADD,
            this.step1_data.ship_to_address = data.CustomerOutput[0].OPTM_SHIPADD,
            // this.step1_data.delivery_until = (data.CustomerOutput[0].OPTM_DELIVERYDATE !== null) ? new Date(data.CustomerOutput[0].OPTM_DELIVERYDATE) : "";
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

          this.step1_data.remark = data.CustomerOutput[0].OPTM_REMARKS

          // this.feature_discount_percent = data.CustomerOutput[0].OPTM_TOTALDISCOUNT
          this.discount_price = data.CustomerOutput[0].OPTM_PRODDISCOUNT
          this.feature_discount_percent = data.CustomerOutput[0].OPTM_PRODDISCOUNT
          this.accessory_discount_percent = data.CustomerOutput[0].OPTM_ACCESSORYDIS
          this.getSavedModelDatabyModelCodeAndId(data);
        }
        this.isNextButtonVisible = true;
      }
    )
  }

  getSavedModelDatabyModelCodeAndId(saveddata) {
    if (saveddata.ModelBOMData.length > 0) {
      let AllDataForModelBomOutput: any = {};
      AllDataForModelBomOutput.modelinputdatalookup = [];
      AllDataForModelBomOutput.getmodelsavedata = [];
      AllDataForModelBomOutput.apidata = [];

      AllDataForModelBomOutput.modelinputdatalookup.push({
        CompanyDBID: this.common_output_data.companyName,
        currentDate: this.submit_date
      });

      AllDataForModelBomOutput.apidata.push({
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      });

      console.log(saveddata.ModelBOMData);
      AllDataForModelBomOutput.getmodelsavedata = saveddata.ModelBOMData
      this.showLookupLoader = true;
      this.OutputService.GetSavedDataMultiModel(AllDataForModelBomOutput).subscribe(
        data => {
          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.showLookupLoader = false;
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
              this.setModelDataFlag = true;
              for (var isavedmultimodel in data) {
                this.onclearselection(1);
                this.step2_data.quantity = parseFloat(data[isavedmultimodel].AddedModelHeaderData[0].quantity);
                this.step2_data.model_id = data[isavedmultimodel].AddedModelHeaderData[0].ModelID
                this.step2_data.model_code = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_FEATURECODE
                this.step2_data.model_name = data[isavedmultimodel].AddedModelHeaderData[0].ModelDisplayName
                this.step2_data.templateid = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_MODELTEMPLATEITEM
                this.step2_data.itemcodegenkey = data[isavedmultimodel].AddedModelHeaderData[0].OPTM_ITEMCODEGENREF
                this.GetAllDataForSavedMultiModelBomOutput(data[isavedmultimodel], saveddata);
                if (this.isDuplicate) {
                  this.step3_data_final = [];
                  this.add_fg_multiple_model();
                } else {
                  this.add_fg_multiple_model();
                }
                this.showLookupLoader = false;
              }
              console.log("this.step3_data_final");
              console.log(this.step3_data_final);
            } else {
              this.showLookupLoader = false;
            }
          }
          else {
            this.showLookupLoader = false;
          }
        }, error => {
          this.showLookupLoader = false;
        })
    }
  }

  GetAllDataForSavedMultiModelBomOutput(data, saveddata) {
    
    this.showLookupLoader = true;
    if (data != null && data != undefined) {
      if (data.DeafultWarehouse !== undefined && data.DeafultWarehouse[0] !== undefined) {
        if (data.DeafultWarehouse[0].DEFAULTWAREHOUSE !== undefined) {
          this.warehouse = data.DeafultWarehouse[0].DEFAULTWAREHOUSE;
        }
      }

      data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
        obj['OPTM_LEVEL'] = 0;
        return data.ModelHeaderData
      })

      data.ModelHeaderData = data.ModelHeaderData.filter(function (obj) {
        if (obj['OPTM_MAXSELECTABLE'] > 1) {
          obj['element_type'] = "checkbox"
          obj['element_class'] = "custom-control custom-checkbox"
        }
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
        if (obj['checked'] == "True") {
          obj['checked'] = true
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
      /*this.getAccessoryData(this.Accessoryarray)*/
      this.AccessModel = [];
      this.AccessModel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['ACCESSORY'] == "Y";
      });
      /*this.getAccessoryData(this.AccessModel)*/
      this.getAccessoryData(data.SelectedAccessoryHDR);
      this.selectedAccessoryBOM = data.SelectedAccessoryBOM

      if (this.Accessoryarray.length == 0 && this.AccessModel.length > 0) {
        this.Accessoryarray = this.AccessModel
      }

      var ModelArray = [];
      ModelArray = data.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_TYPE'] == "3"
      });

      this.ModelInModelArray = ModelArray

      this.setModelDataInGrid(ModelArray, this.ModelBOMDataForSecondLevel);

      this.setModelItemsDataInGrid(this.ModelHeaderItemsArray)

      this.getDefaultItems(data.ObjFeatureItemDataWithDfaultY);

      this.RuleIntegration(data.RuleOutputData, true)

      /*this.getCheckedAccessoryData(data.SelectedAccessory);*/

      this.ModelLookupFlag = true

      this.ModelHeaderData = this.ModelHeaderData.sort((a, b) => a.OPTM_LINENO - b.OPTM_LINENO)

      if (this.setModelDataFlag == true) {
        var temp_obj = this;
        var feature_list =saveddata.ModelBOMData.filter(function (obj) {
          if (obj['OPTM_ITEMTYPE'] == 2) {
            return obj
          }
        });

        var accessory_list =saveddata.ModelBOMData.filter(function (obj) {
          if (obj['OPTM_ITEMTYPE'] == 3) {
            return obj
          }
        });

        if (feature_list.length > 0 && feature_list != null && feature_list != undefined) {
          this.feature_discount_percent = feature_list[0]['OPTM_DISCPERCENT'];
        }

        if (accessory_list.length > 0 && accessory_list != null && accessory_list != undefined) {
          this.accessory_discount_percent = accessory_list[0]['OPTM_DISCPERCENT'];
        }

        this.setModelDataInOutputBom(data.Savedgetmodelsavedata, data.SelectedAccessory, data.ModelHeaderData);
        var Modelfeaturesaveditems = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['checked'] == true && obj['OPTM_TYPE'] == 2
        })
        if (Modelfeaturesaveditems.length > 0) {
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

  }

  openFeatureLookUp() {
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.OutputService.getFeatureList(this.step2_data.model_id).subscribe(
      data => {
        if (data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
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
          if (data[0].ErrorMsg == "7001") {
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
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
          if (data[0].ErrorMsg == "7001") {
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
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
    // setTimeout(()=> {
    //   this.lookupfor = "";
    // }, 200)
    // this.getItemDetails($event[0]);
    if (this.isPreviousPressed) {
      this.isDuplicate = true;
    }
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
                      // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                      this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                    }
                  }
                }
                else if (modelheaderpropagatechecked[0].OPTM_TYPE == "2") {
                  if (modelheaderpropagatechecked[0].OPTM_ITEMKEY == this.feature_itm_list_table[i].Item) {
                    // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                    this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                  }
                }
                else {
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
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
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
                }

              }
            } else {
              // no accessory in main array, but accessory found in sub model 
              if (this.feature_itm_list_table[i].is_accessory == 'Y'){
                if (this.feature_itm_list_table[i].ispropogateqty == 'Y') {
                  // this.feature_itm_list_table[i].quantity = this.step2_data.quantity
                  this.feature_itm_list_table[i].quantity = ((this.step2_data.quantity) * Number(this.feature_itm_list_table[i].original_quantity));
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
      "step4_final_prod_total": this.step4_final_prod_total,
      "step4_final_acc_total": this.step4_final_acc_total,
      "step4_final_grand_total": this.step4_final_grand_total,
      "prod_discount_log": this.prod_discount_log,
      "access_dis_amount_log": this.access_dis_amount_log,
    });
    //pushing all final data sel details
    this.serviceData.verify_final_data_sel_details = this.step3_data_final;
    //pushing all payement data details
    this.serviceData.payment_details = undefined;
    this.lookupfor = 'output_invoice_print';
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
            let pricextn0 = 0;
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.feature_itm_list_table[i].pricextn = pricextn0.toFixed(3);
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
    this.selectedAccessoryBOM= [];
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
    if (all_clear == 1) {
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
    //AllDataForModelBomOutput.apidata = [];

    AllDataForModelBomOutput.modelinputdatalookup.push({
      CompanyDBID: this.common_output_data.companyName,
      ModelID: this.step2_data.model_id,
      ModelDisplayName: this.step2_data.model_name,
      currentDate: this.submit_date
    })

    // AllDataForModelBomOutput.apidata.push({
    //   GUID: sessionStorage.getItem("GUID"),
    //   UsernameForLic: sessionStorage.getItem("loggedInUser")
    // })

    AllDataForModelBomOutput.getmodelsavedata = getmodelsavedata

    this.OutputService.GetDataByModelIDForFirstLevel(AllDataForModelBomOutput).subscribe(
      //this.OutputService.GetDataByModelIDForFirstLevel(this.step2_data.model_id, this.step2_data.model_name).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          if (data.SubModelReadyToUse !== undefined) {
            if (data.SubModelReadyToUse.length > 0) {
              if (data.SubModelReadyToUse[0].ReadyToUse !== undefined) {
                if (data.SubModelReadyToUse[0].ReadyToUse == "N") {
                  this.showLookupLoader = false;
                  this.step2_data.model_code = ""
                  this.toastr.error('', this.language.Submodelreadyforuse, this.commonData.toast_config);
                  return;
                }
              }
            }

          }

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
            if (obj['checked'] == "True") {
              obj['checked'] = true
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
          /*this.getAccessoryData(this.Accessoryarray)*/
          this.AccessModel = [];
          this.AccessModel = data.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['ACCESSORY'] == "Y";
          });

          this.selectedAccessoryHeader = data.SelectedAccessory;

          this.getAccessoryData(this.selectedAccessoryHeader)

          this.selectedAccessoryBOM = data.SelectedAccessoryBOM

          if (this.Accessoryarray.length == 0 && this.AccessModel.length > 0) {
            this.Accessoryarray = this.AccessModel
          }
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
            this.setModelDataInOutputBom(getmodelsavedata, "", data.ModelHeaderData);
            var Modelfeaturesaveditems = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
              return obj['checked'] == true && obj['OPTM_TYPE'] == 2
            })
            if (Modelfeaturesaveditems.length > 0) {
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

  onselectionchange(feature_model_data, value, id,isSecondLevel) {
    let type = feature_model_data.OPTM_TYPE
    let modelid;
    let featureid;
    let parentfeatureid;
    let parentmodelid;
    let item;
    let superfeatureid;
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
    } else {
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
    }

    var elementtypeforcheckedfunction = parentarray[0].element_type

    this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value,true);
     /* superfeatureid = feature_model_data.parentfeatureid;*/

    this.showLookupLoader = true;
    let GetDataForSelectedFeatureModelItemData: any = {};
    GetDataForSelectedFeatureModelItemData.selecteddata = [];
    GetDataForSelectedFeatureModelItemData.featurebomdata = [];
    GetDataForSelectedFeatureModelItemData.modelbomdata = [];
    GetDataForSelectedFeatureModelItemData.apidata = [];
    GetDataForSelectedFeatureModelItemData.selecteddata.push({
      type: type,
      modelid: modelid,
      featureid: featureid,
      item: item,
      parentfeatureid: parentfeatureid,
      superfeatureid: feature_model_data.parentfeatureid,
      parentmodelid: parentmodelid,
      selectedvalue: selectedvalue,
      CompanyDBID: this.common_output_data.companyName,
      SuperModelId: this.step2_data.model_id,
      /* currentDate: this.step1_data.posting_date */
      currentDate: this.submit_date,
      unique_key:feature_model_data.unique_key,
      nodeid:feature_model_data.nodeid
    });

    GetDataForSelectedFeatureModelItemData.featurebomdata = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    GetDataForSelectedFeatureModelItemData.modelbomdata = this.ModelBOMDataForSecondLevel.filter(function (obj) {
      obj['OPTM_QUANTITY'] = parseFloat(obj['OPTM_QUANTITY'])
      return obj['checked'] == true
    })

    GetDataForSelectedFeatureModelItemData.apidata.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });


    // this.OutputService.GetDataForSelectedFeatureModelItem(type, modelid, featureid, item, parentfeatureid, parentmodelid,selectedvalue,this.FeatureBOMDataForSecondLevel).subscribe(
    this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }

          if (value == true) {
            if (data.DataForSelectedFeatureModelItem.length > 0) {
              if (parentarray[0].element_type == "radio") {
                if (parentfeatureid != "" && feature_model_data.OPTM_CHILDFEATUREID != feature_model_data.OPTM_FEATUREID) {
                  this.removefeaturesanditems(parentfeatureid)
                }
                else if (parentmodelid != "") {
                  for (let imodelheader = 0; imodelheader < this.ModelHeaderData.length; imodelheader++) {
                    if (this.ModelHeaderData[imodelheader].parentmodelid != undefined) {
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
              }
              if (type == 1) {
                var isExist;
                var psMaxSelect = "1"
                var psMinSelect = "1"
                var pselementclass = "custom-control custom-radio"
                var pselementtype = "radio"
                if (data.DataForSelectedFeatureModelItem.length > 0) {
                  isExist = this.ModelHeaderData.filter(function (obj) {
                    return obj['unique_key'] == feature_model_data.unique_key && obj['parentfeatureid'] == feature_model_data.OPTM_FEATUREID;
                  });

                  if (data.DataForMinMaxForFeatureId != null) {
                    if (data.DataForMinMaxForFeatureId.length > 0) {
                      if (data.DataForMinMaxForFeatureId[0].OPTM_ISMULTISELECT == "Y") {
                        psMaxSelect = data.DataForMinMaxForFeatureId[0].OPTM_MAX_SELECTABLE
                        psMinSelect = data.DataForMinMaxForFeatureId[0].OPTM_MIN_SELECTABLE
                        if (parseFloat(psMaxSelect) > 1) {
                          pselementclass = "custom-control custom-checkbox"
                          pselementtype = "checkbox"
                        }

                      }
                    }
                  }

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
                      OPTM_MAXSELECTABLE: psMaxSelect,
                      OPTM_MINSELECTABLE: psMinSelect,
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
                      element_class: pselementclass,
                      element_type: pselementtype,
                      feature_code: feature_model_data.feature_code,
                      parentfeatureid: parentfeatureid,
                      parentmodelid: parentmodelid,
                      OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
                      is_second_level: 1,
                      unique_key: feature_model_data.unique_key,
                      nodeid: feature_model_data.nodeid
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
                          return obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID && obj['OPTM_TYPE'] == 1;
                        });
                      }
                      else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 2) {
                        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
                          return obj['OPTM_ITEMKEY'] == data.DataForSelectedFeatureModelItem[i].OPTM_ITEMKEY && obj['nodeid'] == data.DataForSelectedFeatureModelItem[i].nodeid;
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
                          HEADER_LINENO: this.ModelHeaderData.length + 1,
                          unique_key: data.DataForSelectedFeatureModelItem[i].unique_key,
                          nodeid: data.DataForSelectedFeatureModelItem[i].nodeid
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
                            if (parentarray.length > 0) {
                              if (parentarray[0].OPTM_MAXSELECTABLE > 1) {
                                parentarray[0].element_class = "custom-control custom-checkbox"
                                parentarray[0].element_type = "checkbox"
                              }
                            }
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
                              if(parentarray[0].OPTM_ISMULTISELECT == "N") {
                                parentarray[0].element_type = "radio"
                              } else {
                                parentarray[0].element_type = "checkbox"
                              }
                              this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].HEADER_LINENO);
                            }
                            else if (data.DataForSelectedFeatureModelItem[i].OPTM_TYPE == 1) {
                              isExist = this.ModelHeaderData.filter(function (obj) {
                                return obj['OPTM_FEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID;
                              });


                              var psMaxSelect = "1"
                              var psMinSelect = "1"
                              var pselementclass = "custom-control custom-radio"
                              var pselementtype = "radio"

                              if (data.DataForSelectedFeatureModelItem[i].OPTM_ISMULTISELECT == "Y") {
                                psMaxSelect = data.DataForSelectedFeatureModelItem[i].OPTM_MAX_SELECTABLE
                                psMinSelect = data.DataForSelectedFeatureModelItem[i].OPTM_MIN_SELECTABLE
                                if (parseFloat(psMaxSelect) > 1) {
                                  pselementclass = "custom-control custom-checkbox"
                                  pselementtype = "checkbox"
                                  elementtypeforcheckedfunction = "checkbox"
                                }
                              }



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
                                  OPTM_MAXSELECTABLE: psMaxSelect,
                                  OPTM_MINSELECTABLE: psMinSelect,
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
                                  element_class: pselementclass,
                                  element_type: pselementtype,
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
                                  this.setDtFeatureDataWithDefault(data.dtFeatureDataWithDefault, data.DataForSelectedFeatureModelItem[i], feature_model_data, parentmodelid, parentarray, propagateqtychecked, data)
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
                          return ((obj['OPTM_CHILDFEATUREID'] == data.DataForSelectedFeatureModelItem[i].OPTM_CHILDFEATUREID) && obj['OPTM_CHILDFEATUREID'] != undefined);
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
              else if (type == 3 && feature_model_data.OPTM_VALUE != null) {
                this.setItemDataForFeature(data.DataForSelectedFeatureModelItem, parentarray, propagateqtychecked, propagateqty, parentarray[0].feature_code, parentarray[0].OPTM_LINENO);
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
            if(isSecondLevel) {
              this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value,true);
            } else {
              this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value,false);
            }

            this.showLookupLoader = false;
          } //end value
          else {
            if (feature_model_data.OPTM_TYPE != 2) {
              if (feature_model_data.parentmodelid == "" || feature_model_data.parentmodelid == null || feature_model_data.parentmodelid == undefined) {


                this.removefeaturesbyuncheck(feature_model_data.OPTM_FEATUREID, feature_model_data.feature_code)


              }
              else {
                this.removeModelfeaturesbyuncheck(feature_model_data.parentmodelid, feature_model_data.feature_code)

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
          if (data.DataForSelectedFeatureModelItem.length == 1) {
            var currentSelectedFeatureId = data.DataForSelectedFeatureModelItem[0].OPTM_FEATUREID;
            var ModelBOMDataForSelectedFeature = this.ModelBOMDataForSecondLevel.filter(function (array) {
              return array.OPTM_FEATUREID == currentSelectedFeatureId;
            });
            if (ModelBOMDataForSelectedFeature.length > 0) {
              for (var i = 0; i < this.ModelBOMDataForSecondLevel.length; i++) {
                if (this.ModelBOMDataForSecondLevel[i].OPTM_FEATUREID != 'undefined' || ModelBOMDataForSelectedFeature[0].OPTM_FEATUREID != 'undefined') {
                  if (ModelBOMDataForSelectedFeature[0].OPTM_FEATUREID == this.ModelBOMDataForSecondLevel[i].OPTM_FEATUREID) {
                    this.ModelBOMDataForSecondLevel[i].checked = true;
                  } else {
                    this.ModelBOMDataForSecondLevel[i].checked = false;
                  }
                }
              }
            }
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

  setDtFeatureDataWithDefault(dtFeatureDataWithDefault, DataForSelectedFeatureModelItem, feature_model_data, parentmodelid, parentarray, propagateqtychecked, data) {
    for (var idtfeature in dtFeatureDataWithDefault) {
      var isExist;
      var checkeddefault;
      var propagateqty;
      var itemData = [];
      if (dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1") {
        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_CHILDFEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_CHILDFEATUREID;
        });
      }
      else {
        isExist = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY && obj['OPTM_FEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID;
        });
      }

      if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y") {
        checkeddefault = true
      }
      else {
        checkeddefault = false
      }

      if (DataForSelectedFeatureModelItem.OPTM_PROPOGATEQTY == "Y") {
        if (dtFeatureDataWithDefault[idtfeature].OPTM_PROPOGATEQTY == "Y") {
          dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY = parseFloat(DataForSelectedFeatureModelItem.OPTM_QUANTITY) * parseFloat(dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY)
          propagateqty = dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY
        }

      }


      if (isExist.length == 0)
        var psFeatureMax;
      var psFeatureMin;
      var psFeatureelement_class = "custom-control custom-radio"
      var psFeatureelement_type = "radio"
      if (dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == null || dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == "" || dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE == undefined) {
        psFeatureMax = 1
      }
      else {
        psFeatureMax = dtFeatureDataWithDefault[idtfeature].OPTM_MAX_SELECTABLE
        if (parseFloat(psFeatureMax) > 1) {
          psFeatureelement_class = "custom-control custom-checkbox"
          psFeatureelement_type = "checkbox"
        }
      }
      if (dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == null || dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == "" || dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE == undefined) {
        psFeatureMin = 1
      }
      else {
        psFeatureMin = dtFeatureDataWithDefault[idtfeature].OPTM_MIN_SELECTABLE

      }
      this.FeatureBOMDataForSecondLevel.push({
        ACCESSORY: dtFeatureDataWithDefault[idtfeature].ACCESSORY,
        IMAGEPATH: this.commonData.get_current_url() + dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
        OPTM_ATTACHMENT: dtFeatureDataWithDefault[idtfeature].OPTM_ATTACHMENT,
        OPTM_CHILDFEATUREID: dtFeatureDataWithDefault[idtfeature].OPTM_CHILDFEATUREID,
        OPTM_COMPANYID: dtFeatureDataWithDefault[idtfeature].OPTM_COMPANYID,
        OPTM_CREATEDATETIME: dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDATETIME,
        OPTM_CREATEDBY: dtFeatureDataWithDefault[idtfeature].OPTM_CREATEDBY,
        OPTM_DEFAULT: dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT,
        OPTM_DISPLAYNAME: dtFeatureDataWithDefault[idtfeature].OPTM_DISPLAYNAME,
        OPTM_FEATUREID: dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID,
        OPTM_ITEMKEY: dtFeatureDataWithDefault[idtfeature].OPTM_ITEMKEY,
        OPTM_LINENO: dtFeatureDataWithDefault[idtfeature].OPTM_LINENO,
        OPTM_MODIFIEDBY: dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDBY,
        OPTM_MODIFIEDDATETIME: String(dtFeatureDataWithDefault[idtfeature].OPTM_MODIFIEDDATETIME).toString(),
        OPTM_PROPOGATEQTY: dtFeatureDataWithDefault[idtfeature].OPTM_PROPOGATEQTY,
        OPTM_PRICESOURCE: dtFeatureDataWithDefault[idtfeature].ListName,
        OPTM_QUANTITY: parseFloat(dtFeatureDataWithDefault[idtfeature].OPTM_QUANTITY).toFixed(3),
        OPTM_REMARKS: dtFeatureDataWithDefault[idtfeature].OPTM_REMARKS,
        OPTM_ISMULTISELECT: String(dtFeatureDataWithDefault[idtfeature].OPTM_ISMULTISELECT),
        OPTM_MAXSELECTABLE: psFeatureMax,
        OPTM_MIN_SELECTABLE: psFeatureMin,
        OPTM_TYPE: dtFeatureDataWithDefault[idtfeature].OPTM_TYPE,
        OPTM_VALUE: dtFeatureDataWithDefault[idtfeature].OPTM_VALUE,
        feature_code: dtFeatureDataWithDefault[idtfeature].feature_code,
        parent_code: dtFeatureDataWithDefault[idtfeature].parent_code,
        checked: checkeddefault,
        OPTM_LEVEL: feature_model_data.OPTM_LEVEL + 1,
        is_second_level: 1,
        element_class: psFeatureelement_class,
        element_type: psFeatureelement_type,
        parentfeatureid: DataForSelectedFeatureModelItem.OPTM_CHILDFEATUREID,
        parentmodelid: parentmodelid,
        HEADER_LINENO: this.ModelHeaderData.length + 1
      });

      if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "2") {
        // parentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
        //   return obj['OPTM_CHILDFEATUREID'] == data.dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID
        // });
        var tempparentarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_CHILDFEATUREID'] == dtFeatureDataWithDefault[idtfeature].OPTM_FEATUREID
        });
        if (tempparentarray.length > 0) {
          parentarray[0].OPTM_TYPE = tempparentarray[0].OPTM_TYPE
          parentarray[0].parentmodelid = tempparentarray[0].parentmodelid
          parentarray[0].OPTM_LEVEL = tempparentarray[0].OPTM_LEVEL
          parentarray[0].HEADER_LINENO = tempparentarray[0].HEADER_LINENO
        }
        itemData.push(dtFeatureDataWithDefault[idtfeature])
        this.setItemDataForFeature(itemData, parentarray, propagateqtychecked, propagateqty, tempparentarray[0].feature_code, parentarray[0].HEADER_LINENO);
      }
    }
    var checkDefaultFeatureIndtFeatureDataWithDefault = dtFeatureDataWithDefault.filter(function (obj) {
      return obj['OPTM_DEFAULT'] == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1"
    })

    if (checkDefaultFeatureIndtFeatureDataWithDefault.length > 0) {
      isExist = this.ModelHeaderData.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID;
      });


      var psMaxSelect = "1"
      var psMinSelect = "1"
      var pselementclass = "custom-control custom-radio"
      var pselementtype = "radio"
      var elementtypeforcheckedfunction = "radio";
      if (checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_ISMULTISELECT == "Y") {
        psMaxSelect = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MAX_SELECTABLE
        psMinSelect = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MIN_SELECTABLE
        if (parseFloat(psMaxSelect) > 1) {
          pselementclass = "custom-control custom-checkbox"
          pselementtype = "checkbox"
          elementtypeforcheckedfunction = "checkbox"
        }
      }



      if (isExist.length == 0) {
        this.ModelHeaderData.push({
          ACCESSORY: checkDefaultFeatureIndtFeatureDataWithDefault[0].ACCESSORY,
          IMAGEPATH: checkDefaultFeatureIndtFeatureDataWithDefault[0].IMAGEPATH,
          OPTM_CHILDMODELID: "",
          OPTM_COMPANYID: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_COMPANYID,
          OPTM_CREATEDATETIME: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CREATEDATETIME,
          OPTM_CREATEDBY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CREATEDBY,
          OPTM_DISPLAYNAME: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_DISPLAYNAME,
          OPTM_FEATUREID: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID,
          OPTM_ITEMKEY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_ITEMKEY,
          OPTM_LINENO: this.ModelHeaderData.length + 1,
          OPTM_MANDATORY: "N",
          OPTM_MAXSELECTABLE: psMaxSelect,
          OPTM_MINSELECTABLE: psMinSelect,
          OPTM_MODELID: parentarray[0].OPTM_MODELID,
          OPTM_MODIFIEDBY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MODIFIEDBY,
          OPTM_MODIFIEDDATETIME: String(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_MODIFIEDDATETIME).toString(),
          OPTM_PRICESOURCE: checkDefaultFeatureIndtFeatureDataWithDefault[0].ListName,
          OPTM_PROPOGATEQTY: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_PROPOGATEQTY,
          OPTM_QUANTITY: parseFloat(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY).toFixed(3),
          OPTM_TYPE: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_TYPE,
          OPTM_UNIQUEIDNT: parentarray[0].OPTM_UNIQUEIDNT,
          OPTM_UOM: parentarray[0].OPTM_UOM,
          child_code: parentarray[0].child_code,
          element_class: pselementclass,
          element_type: pselementtype,
          feature_code: checkDefaultFeatureIndtFeatureDataWithDefault[0].feature_code,
          parentfeatureid: checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_FEATUREID,
          parentmodelid: parentmodelid,
          OPTM_LEVEL: feature_model_data.OPTM_LEVEL,
          is_second_level: 1

        });



        if (checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_PROPOGATEQTY == "Y") {
          propagateqtychecked = "Y"
          checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY = parseFloat(checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY).toFixed(3)
          propagateqty = checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_QUANTITY
        }

        var childItemsAddedModelHeaderData = data.AllDataForFeature.filter(function (obj) {
          return obj['OPTM_FEATUREID'] == checkDefaultFeatureIndtFeatureDataWithDefault[0].OPTM_CHILDFEATUREID
        })

        if (childItemsAddedModelHeaderData.length > 0) {
          this.setDtFeatureDataWithDefault(childItemsAddedModelHeaderData, checkDefaultFeatureIndtFeatureDataWithDefault[0], feature_model_data, parentmodelid, parentarray, propagateqtychecked, data)
        }

      }
    }
    // else if (dtFeatureDataWithDefault[idtfeature].OPTM_DEFAULT == "Y" && dtFeatureDataWithDefault[idtfeature].OPTM_TYPE == "1") {

    // }

  }

  setItemDataForFeature(ItemData, parentarray, propagateqtychecked, propagateqty, tempfeaturecode, lineno) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;
    let currentfeaturerow:any = [];
    if (ItemData.length > 0) {
      if (parentarray[0].element_type == "radio") {
        for (let i = 0; i < this.feature_itm_list_table.length; i++) {
          if (parentarray[0].OPTM_TYPE == 1) {
            if (this.feature_itm_list_table[i].nodeid == ItemData[0].nodeid) {
              currentfeaturerow = this.feature_itm_list_table[i];
              this.feature_itm_list_table.splice(i, 1);
              i = i - 1;
            }
          }
          else if (parentarray[0].OPTM_TYPE == 3) {
            if (this.feature_itm_list_table[i].ModelId == ItemData[0].OPTM_MODELID) {
              currentfeaturerow = this.feature_itm_list_table[i];
              this.feature_itm_list_table.splice(i, 1);
              i = i - 1;
            }
          }

        }
      }
      var isExist;
      if (parentarray[0].OPTM_TYPE == 1) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['nodeid'] == ItemData[0].nodeid && obj['Item'] == ItemData[0].OPTM_ITEMKEY;
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
      if (ItemData[0].Price == null || ItemData[0].Price == undefined || ItemData[0].Price == "") {
        ItemData[0].Price = 0;
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
        if (parentarray[0].parentmodelid !== undefined && parentarray[0].parentmodelid !== null){
          tempModelID = parentarray[0].parentmodelid;
        } else {
          if(currentfeaturerow.ModelId != undefined && currentfeaturerow.ModelId!= null){
            tempModelID = currentfeaturerow.ModelId;
          } else {
            tempModelID = this.step2_data.model_id;
          }
        }
      }
      else {
        if (parentarray[0].OPTM_MODELID != undefined && parentarray[0].OPTM_MODELID != null){
          tempModelID = parentarray[0].OPTM_MODELID;
        } else {
          if (currentfeaturerow.ModelId != undefined && currentfeaturerow.ModelId != null) {
            tempModelID = currentfeaturerow.ModelId;
          } else {
            tempModelID = this.step2_data.model_id;
          }
        }
        
      }


      if ((isExist.length == 0) && ItemData[0].OPTM_TYPE != 3) {
        this.feature_itm_list_table.push({
          FeatureId: ItemData[0].OPTM_FEATUREID,
          featureName: tempfeaturecode,
          Item: ItemData[0].OPTM_ITEMKEY,
          ItemNumber: ItemData[0].DocEntry,
          Description: ItemData[0].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3),
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
          HEADER_LINENO: lineno,
          parent_featureid: ItemData[0].parent_featureid,
          unique_key: ItemData[0].unique_key,
          nodeid:ItemData[0].nodeid
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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
      currentDate: this.submit_date,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.showLookupLoader = true;
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
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
      currentDate: this.submit_date,
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    });
    this.showLookupLoader = true;
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
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

        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
        }

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
        if (data != null && data != undefined && data.length > 0) {

          if (data[0].ErrorMsg == "7001") {
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
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
    this.step2_final_dataset_to_save = [];
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      this.generate_unique_key();
    }
    // }
    this.showLookupLoader = true;
    let final_dataset_to_save: any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTDTL = [];
    final_dataset_to_save.OPConfig_OUTPUTLOG = [];
    final_dataset_to_save.ConnectionDetails = [];
    final_dataset_to_save.apidata = [];
    final_dataset_to_save.routing_model = [];
    final_dataset_to_save.routing_model_feature_data = [];
    final_dataset_to_save.routing_user_selection = [];
    let total_discount = (Number(this.feature_discount_percent) + Number(this.accessory_discount_percent));

    //Creating OutputLog table
    final_dataset_to_save.OPConfig_OUTPUTLOG.push({
      "OPTM_LOGID": this.iLogID,
      "OPTM_DOCTYPE": this.step1_data.document,
      "OPTM_PAYMENTTERM": 0,
      "OPTM_DESC": this.step1_data.description,
      "OPTM_PRODTOTAL": Number(this.step4_final_prod_total),
      "OPTM_PRODDISCOUNT": Number(this.prod_discount_log),
      "OPTM_ACCESSORYTOTAL": Number(this.step4_final_acc_total),
      "OPTM_ACCESSORYDISAMOUNT": Number(this.access_dis_amount_log),
      "OPTM_GRANDTOTAL": Number(this.step4_final_grand_total),
      "OPTM_CREATEDBY": this.common_output_data.username
    });

    let delivery_date_string = "";
    if (this.step1_data.delivery_until != "" && this.step1_data.delivery_until != undefined && this.step1_data.delivery_until != null) {
      delivery_date_string = (this.step1_data.delivery_until.getMonth() + 1) + "/" + this.step1_data.delivery_until.getDate() + "/" + this.step1_data.delivery_until.getFullYear();
    }

    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      for (let iHdrCount = 0; iHdrCount < this.step3_data_final.length; iHdrCount++) {
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
          "OPTM_ACCESSORYDIS": "",
          "OPTM_ACCESSORYTOTAL": "",
          "OPTM_TOTALDISCOUNT": "",
        })
      }
    } else {
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
        "OPTM_FGITEM": "",
        "OPTM_KEY": "",
        "OPTM_DELIVERYDATE": delivery_date_string,
        "OPTM_QUANTITY": 0,
        "OPTM_CREATEDBY": this.common_output_data.username,
        "OPTM_MODIFIEDBY": this.common_output_data.username,
        "OPTM_DESC": "",
        "OPTM_SALESEMP": this.step1_data.sales_employee,
        "OPTM_OWNER": this.step1_data.owner,
        "OPTM_REMARKS": this.step1_data.remark,
        "OPTM_BILLADD": this.step1_data.bill_to_address,
        "OPTM_SHIPADD": this.step1_data.ship_to_address,
        "OPTM_POSTINGDATE": this.step1_data.posting_date,
        "OPTM_GRANDTOTAL": 0,
        "OPTM_PRODTOTAL": 0,
        "OPTM_TOTALBEFOREDIS": 0,
        "OPTM_PRODDISCOUNT": 0,
        "OPTM_ACCESSORYDIS": "0",
        "OPTM_ACCESSORYTOTAL": "0",
        "OPTM_TOTALDISCOUNT": "0",
      });
    }

    //creating details table array
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      final_dataset_to_save.OPConfig_OUTPUTDTL = this.step2_final_dataset_to_save;
      // populate routing data array - start

      for (let indexx = 0; indexx < this.step3_data_final.length; indexx++) {
        let step3_temp_row = this.step3_data_final[indexx];

        if (step3_temp_row.ModelHeaderItemsArray[0] != undefined) {
          final_dataset_to_save.routing_model.push({
            DocEntry: step3_temp_row.ModelHeaderItemsArray[0].DocEntry,
            OPTM_LINENO: step3_temp_row.ModelHeaderItemsArray[0].OPTM_LINENO,
            OPTM_MODELID: step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID,
            OPTM_TYPE: step3_temp_row.ModelHeaderItemsArray[0].OPTM_TYPE,
            OPTM_MANDATORY: step3_temp_row.ModelHeaderItemsArray[0].OPTM_MANDATORY,
            OPTM_UOM: step3_temp_row.ModelHeaderItemsArray[0].OPTM_UOM,
            OPTM_UNIQUEIDNT: step3_temp_row.ModelHeaderItemsArray[0].OPTM_UNIQUEIDNT,
            Price: step3_temp_row.ModelHeaderItemsArray[0].Price,
            feature_code: step3_temp_row.ModelHeaderItemsArray[0].feature_code,
            child_code: step3_temp_row.ModelHeaderItemsArray[0].child_code,
            OPTM_LEVEL: step3_temp_row.ModelHeaderItemsArray[0].OPTM_LEVEL,
            ITEMCODEGENREF: step3_temp_row.ModelHeaderItemsArray[0].ITEMCODEGENREF,
          });
        } else {
          final_dataset_to_save.routing_model.push({
            DocEntry: step3_temp_row.model_id,
            OPTM_LINENO: step3_temp_row.rowIndex,
            OPTM_MODELID: step3_temp_row.model_id,
            OPTM_TYPE: '2',
            OPTM_MANDATORY: 'N',
            OPTM_UOM: 'each',
            OPTM_UNIQUEIDNT: 'Y',
            Price: step3_temp_row.price,
            feature_code: "",
            child_code: "",
            OPTM_LEVEL: 0,
            ITEMCODEGENREF: step3_temp_row.itemcodegenkey,
          });
        }

        for (let f_indexx = 0; f_indexx < step3_temp_row.ModelHeaderData.length; f_indexx++) {
          let modelid_val = '';
          if (step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID != "" && step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID != null) {
            modelid_val = step3_temp_row.ModelHeaderData[f_indexx].OPTM_MODELID;
          } else {
            if (step3_temp_row.ModelHeaderData[f_indexx].parentmodelid != "" && step3_temp_row.ModelHeaderData[f_indexx].parentmodelid != null) {
              modelid_val = step3_temp_row.ModelHeaderData[f_indexx].parentmodelid;
            } else {
              if (step3_temp_row.ModelHeaderItemsArray[0] != undefined && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != "" && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != null) {
                modelid_val = step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID;
              } else {
                if (step3_temp_row.model_id != "" && step3_temp_row.model_id != null) {
                  modelid_val = step3_temp_row.model_id;
                }
              }
            }

          }
          final_dataset_to_save.routing_model_feature_data.push({
            ACCESSORY: step3_temp_row.ModelHeaderData[f_indexx].ACCESSORY,
            ITEMCODEGENREF: step3_temp_row.ModelHeaderData[f_indexx].ITEMCODEGENREF,
            MODELTEMPLATEITEM: step3_temp_row.ModelHeaderData[f_indexx].MODELTEMPLATEITEM,
            OPTM_CHILDMODELID: step3_temp_row.ModelHeaderData[f_indexx].OPTM_CHILDMODELID,
            OPTM_DISPLAYNAME: step3_temp_row.ModelHeaderData[f_indexx].OPTM_DISPLAYNAME,
            OPTM_FEATUREID: step3_temp_row.ModelHeaderData[f_indexx].OPTM_FEATUREID,
            OPTM_ITEMKEY: step3_temp_row.ModelHeaderData[f_indexx].OPTM_ITEMKEY,
            OPTM_LEVEL: step3_temp_row.ModelHeaderData[f_indexx].OPTM_LEVEL,
            OPTM_LINENO: step3_temp_row.ModelHeaderData[f_indexx].OPTM_LINENO,
            OPTM_MANDATORY: step3_temp_row.ModelHeaderData[f_indexx].OPTM_MANDATORY,
            OPTM_MODELID: modelid_val,
            OPTM_TYPE: step3_temp_row.ModelHeaderData[f_indexx].OPTM_TYPE,
            OPTM_UNIQUEIDNT: step3_temp_row.ModelHeaderData[f_indexx].OPTM_UNIQUEIDNT,
            OPTM_UOM: step3_temp_row.ModelHeaderData[f_indexx].OPTM_UOM,
            Price: step3_temp_row.ModelHeaderData[f_indexx].Price,
            child_code: step3_temp_row.ModelHeaderData[f_indexx].child_code,
            feature_code: step3_temp_row.ModelHeaderData[f_indexx].feature_code,
            parentfeatureid: step3_temp_row.ModelHeaderData[f_indexx].parentfeatureid,
            parentmodelid: step3_temp_row.ModelHeaderData[f_indexx].parentmodelid,
          });
        }


        for (let us_indexx = 0; us_indexx < step3_temp_row.feature.length; us_indexx++) {
          let modelid_val = '';
          if (step3_temp_row.feature[us_indexx].ModelId && step3_temp_row.feature[us_indexx].ModelId != null) {
            modelid_val = step3_temp_row.feature[us_indexx].ModelId
          } else {
            if (step3_temp_row.ModelHeaderItemsArray[0]!= undefined && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != "" && step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID != null) {
              modelid_val = step3_temp_row.ModelHeaderItemsArray[0].OPTM_MODELID;
            } else {
              if(step3_temp_row.model_id!="" && step3_temp_row.model_id != null) {
                modelid_val = step3_temp_row.model_id;
              }
            }
          }

          let ItemNo = "";
          if (step3_temp_row.feature[us_indexx].ItemNumber != undefined && step3_temp_row.feature[us_indexx].ItemNumber != ""){
            ItemNo = (step3_temp_row.feature[us_indexx].ItemNumber).toString();
          } else {
            ItemNo = "";
          }

          final_dataset_to_save.routing_user_selection.push({
            Actualprice: step3_temp_row.feature[us_indexx].Actualprice,
            Description: step3_temp_row.feature[us_indexx].Description,
            FeatureId: step3_temp_row.feature[us_indexx].FeatureId,
            HEADER_LINENO: step3_temp_row.feature[us_indexx].HEADER_LINENO,
            Item: step3_temp_row.feature[us_indexx].Item,
            ItemNumber: (ItemNo),
            ModelId: modelid_val,
            OPTM_LEVEL: step3_temp_row.feature[us_indexx].OPTM_LEVEL,
            dicount_amount: step3_temp_row.feature[us_indexx].dicount_amount,
            discount: step3_temp_row.feature[us_indexx].discount,
            featureName: step3_temp_row.feature[us_indexx].featureName,
            gross: step3_temp_row.feature[us_indexx].gross,
            isPriceDisabled: step3_temp_row.feature[us_indexx].isPriceDisabled,
            isQuantityDisabled: step3_temp_row.feature[us_indexx].isQuantityDisabled,
            is_accessory: step3_temp_row.feature[us_indexx].is_accessory,
            ispropogateqty: step3_temp_row.feature[us_indexx].ispropogateqty,
            price: step3_temp_row.feature[us_indexx].price,
            pricehide: step3_temp_row.feature[us_indexx].pricehide,
            pricextn: parseFloat(step3_temp_row.feature[us_indexx].pricextn).toFixed(3),
            quantity: step3_temp_row.feature[us_indexx].quantity,
          });
        }

      }
      // populate routing data array - end
    }

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

    final_dataset_to_save.apidata.push({
      GUID: sessionStorage.getItem("GUID"),
      UsernameForLic: sessionStorage.getItem("loggedInUser")
    })

    console.log(final_dataset_to_save);
    var obj = this;
    // final data submission 

    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
          if (data[0].Status == "True") {
            this.showLookupLoader = false;
            this.iLogID = data[0].LogId;
            this.toastr.success('', this.language.OperCompletedSuccess, this.commonData.toast_config);
            if (button_press == 'finishPress') {
              setTimeout(function () {
                obj.getFinalBOMStatus();
              }, 100);
            }
          }
          else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.no_item_selected, this.commonData.toast_config);
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

  colSpanValue(e) {
    setTimeout(() => {
      $('.opti_screen4-detail-row-lastchildTable .k-detail-row td.k-detail-cell').attr('colspan', 9);
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
    this.selectedAccessoryBOM = [];
    this.feature_accessory_list = [];
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

  onAddedModelChange(model_row_index, from_step4) {
    this.lookupfor = "";
    console.log(model_row_index);
    if (model_row_index != "" && model_row_index != undefined) {
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
      this.step2_data.templateid = this.step2_selected_model.templateid;
      this.step2_data.itemcodegenkey = this.step2_selected_model.itemcodegenkey;
      this.Accessoryarray = this.step2_selected_model.Accessoryarray;
      this.selectedAccessoryBOM = this.step2_selected_model.selectedAccessoryBOM;
      this.feature_price_calculate();
      this.showLookupLoader = false;

      if (from_step4 !== undefined && from_step4 != "") {
        from_step4();
      }
    } else {
      this.onclearselection(1);
    }

  }

  step4_edit_model(model_data) {
    this.onAddedModelChange(model_data.rowIndex, function () {
     // $("fieldset").hide();
     // $("fieldset").eq(2).show();
     $(document).find('button[data-previous-block="model_bom_config"]').trigger("click");
    });

  }

  step4_final_price_calculation() {

    this.step4_final_prod_total = 0;
    this.step4_final_acc_total = 0;
    this.step4_final_grand_total = 0;
    this.prod_discount_log = 0;
    this.access_dis_amount_log = 0;

    if (this.step3_data_final.length > 0 && this.step3_data_final != undefined) {
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


  add_fg_multiple_model() {
    var obj = this;
    this.lookupfor = "";
    this.onValidateNextPress(false, function () {
      if (obj.step3_data_final.length > 0 && obj.step3_data_final != undefined && obj.step2_selected_model_id != "") {
        for (var i = 0; i < obj.step3_data_final.length; i++) {
          if (obj.step3_data_final[i].rowIndex == obj.step2_selected_model_id) {
            obj.fill_step3_data_array('update', i);
          }
        }
      } else {
        obj.fill_step3_data_array('add', '0');
      }

      setTimeout(() => {
        obj.onclearselection(1);
        $(".accesory_check_for_second_screen").prop('checked', false);
        $(".multiple_model_click_btn").removeAttr("disabled");
      }, 400);
    })
  }

  update_added_model() {
    this.lookupfor = "";
    $(".multiple_model_click_btn").attr("disabled", "true");

    this.console.log(this.step3_data_final.length);
    for (var i = 0; i < this.step3_data_final.length; i++) {
      if (this.step3_data_final[i] !== undefined) {
        if (this.step3_data_final[i].rowIndex == this.step2_selected_model_id) {
          this.fill_step3_data_array('update', i);
        }
      }
    }
    $(".multiple_model_click_btn").removeAttr("disabled");
  }

  fill_step3_data_array(mode, row_id) {
    $(".multiple_model_click_btn").attr("disabled", "true");
    let feature_discount: any = 0;
    let fg_discount_amount: any = 0;
    if (this.discount_price !== undefined && this.discount_price != 0) {
      feature_discount = Number(this.discount_price);
    }

    if (this.feature_discount_percent !== undefined && this.feature_discount_percent != 0) {
      feature_discount = Number(this.feature_discount_percent);
    }

    let accessory_discount: any = 0;
    if (this.accessory_discount_percent !== undefined && this.accessory_discount_percent != 0) {
      accessory_discount = Number(this.accessory_discount_percent);
    }
    let product_total: any = 0;

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
    let tota_dis_on_acces: any = 0;
    let acc_total_before_dis: any = 0;
    if (feature_discount != 0) {
      fg_discount_amount = (price_ext * feature_discount) / 100;
    } else {
      fg_discount_amount = 0;
    }

    for (let fiti = 0; fiti < this.feature_itm_list_table.length; fiti++) {
      var discount_amount = 0;
      this.feature_itm_list_table[fiti].gross = Number(this.feature_itm_list_table[fiti].pricextn);
      this.feature_itm_list_table[fiti].discount = 0;
      if (this.feature_itm_list_table[fiti].is_accessory == 'Y') {
        acc_total_before_dis += Number(this.feature_itm_list_table[fiti].pricextn);
        if (accessory_discount != 0) {
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (accessory_discount / 100));
          tota_dis_on_acces += Number(discount_amount);
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (accessory_discount);
        }
      } else {
        if (feature_discount != 0) {
          discount_amount = (this.feature_itm_list_table[fiti].pricextn * (feature_discount / 100));
          this.feature_itm_list_table[fiti].gross = (Number(this.feature_itm_list_table[fiti].pricextn) - Number(discount_amount)).toFixed(3);
          this.feature_itm_list_table[fiti].discount = (feature_discount);
        }
      }
      this.feature_itm_list_table[fiti].dicount_amount = (discount_amount).toFixed(3);
    }

    if (mode == 'add') {
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
        "selectedAccessoryBOM": this.selectedAccessoryBOM,
        "accessory_item_total": (this.accessory_item_total).toFixed(3),
        "model_id": this.step2_data.model_id,
        "desc": this.step2_data.model_name,
        "ModelHeaderData": this.ModelHeaderData,
        "FeatureBOMDataForSecondLevel": this.FeatureBOMDataForSecondLevel,
        "ModelBOMDataForSecondLevel": this.ModelBOMDataForSecondLevel,
        "feature_discount_percent": (feature_discount).toFixed(3),
        "accessory_discount_percent": (accessory_discount).toFixed(3),
        "accesory_final_price": (this.accessory_item_total).toFixed(3),
        "templateid": this.step2_data.templateid,
        "itemcodegenkey": this.step2_data.itemcodegenkey,
        "ModelHeaderItemsArray": this.ModelHeaderItemsArray,
        "Accessoryarray": this.Accessoryarray,
      });
      // this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
    } else {
      this.step3_data_final[row_id]["item"] = this.step2_data.model_code;
      this.step3_data_final[row_id]["quantity"] = parseFloat(this.step2_data.quantity).toFixed(3);
      this.step3_data_final[row_id]["price"] = parseFloat(per_item_price).toFixed(3);
      this.step3_data_final[row_id]["price_ext"] = parseFloat(price_ext).toFixed(3);
      this.step3_data_final[row_id]["discounted_price"] = (this.feature_item_total).toFixed(3);
      this.step3_data_final[row_id]["discount_amount"] = (fg_discount_amount).toFixed(3);
      this.step3_data_final[row_id]["accessory_discount_amount"] = parseFloat(tota_dis_on_acces).toFixed(3);
      this.step3_data_final[row_id]["accessory_total_before_dis"] = parseFloat(acc_total_before_dis).toFixed(3);
      this.step3_data_final[row_id]["feature"] = this.feature_itm_list_table;
      this.step3_data_final[row_id]["accesories"] = this.feature_accessory_list;
      this.step3_data_final[row_id]["selectedAccessoryBOM"] = this.selectedAccessoryBOM;
      this.step3_data_final[row_id]["model_id"] = this.step2_data.model_id;
      this.step3_data_final[row_id]["desc"] = this.step2_data.model_name;
      this.step3_data_final[row_id]["ModelHeaderData"] = this.ModelHeaderData;
      this.step3_data_final[row_id]["FeatureBOMDataForSecondLevel"] = this.FeatureBOMDataForSecondLevel;
      this.step3_data_final[row_id]["ModelBOMDataForSecondLevel"] = this.ModelBOMDataForSecondLevel;
      this.step3_data_final[row_id]["feature_discount_percent"] = (feature_discount).toFixed(3);
      this.step3_data_final[row_id]["accessory_discount_percent"] = (accessory_discount).toFixed(3);
      this.step3_data_final[row_id]["accesory_final_price"] = (this.accessory_item_total).toFixed(3);
      this.step3_data_final[row_id]["accessory_item_total"] = (this.accessory_item_total).toFixed(3);
      this.step3_data_final[row_id]["templateid"] = this.step2_data.templateid;
      this.step3_data_final[row_id]["itemcodegenkey"] = this.step2_data.itemcodegenkey;
      this.step3_data_final[row_id]["ModelHeaderItemsArray"] = this.ModelHeaderItemsArray;
      this.step3_data_final[row_id]["Accessoryarray"] = this.Accessoryarray;
      this.toastr.success('', this.language.multiple_model_update, this.commonData.toast_config);
    }
    this.console.log("this.step3_data_final");
    this.console.log(this.step3_data_final);
    this.step4_final_price_calculation();
    $(".multiple_model_click_btn").removeAttr("disabled");
  }



  onValidateNextPress(navigte, for_multiple_model) {
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
    if (navigte == true) {
      $("#modelbom_next_click_id").trigger('click');
      // this.onModelBillNextPress(); // method commented 
      if (this.step3_data_final.length == 0) {
        this.fill_step3_data_array('add', '0');
        this.step2_selected_model = this.step3_data_final[0];
        this.step2_selected_model_id = 1;
      }
    } else {
      for_multiple_model();
    }
  }

  generate_unique_key() {
    this.step2_final_dataset_to_save = [];
    if (this.step3_data_final.length > 0 && this.step3_data_final !== undefined) {
      for (var mj = 0; mj < this.step3_data_final.length; mj++) { // step3_data_final_loop
        if (this.step3_data_final[mj] !== undefined) {
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
            "OPTM_DISCPERCENT": parseFloat("0").toFixed(3),
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
              return obj['OPTM_CHILDMODELID'] == tempfeatureid && obj['OPTM_TYPE'] == 3
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
              "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
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
                    "OPTM_DISCPERCENT": parseFloat(featureitemlistfilterdata[0].discount).toFixed(3),
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
            // var modelfeatureitemkey = "";
            // if (imodelfilterfeatures.length > 0) {
            //   for (var ifeaitem in imodelfilterfeatures) {
            //     var filterfeatureitems = step3_data_row.feature.filter(function (obj) {
            //       return obj['FeatureId'] == imodelfilterfeatures[ifeaitem].OPTM_FEATUREID
            //     })

            //     if (filterfeatureitems.length > 0) {
            //       for (var ifeafilteritem in filterfeatureitems) {
            //         if (imodelfilterfeatures[ifeaitem].OPTM_UNIQUEIDNT == "Y") {
            //           if (modelfeatureitemkey.length == 0) {
            //             modelfeatureitemkey = filterfeatureitems[ifeafilteritem].ItemNumber
            //           } else {
            //             modelfeatureitemkey = modelfeatureitemkey + "-" + filterfeatureitems[ifeafilteritem].ItemNumber
            //           }
            //         }
            //       }
            //     }


            //   }
            //   for (var isavedataset in temp_step2_final_dataset_save) {
            //     if (temp_step2_final_dataset_save[isavedataset].OPTM_ITEMTYPE == "1" && modelfeatureitemkey != "") {
            //       temp_step2_final_dataset_save[isavedataset].OPTM_KEY = modelfeatureitemkey.toString()
            //     }
            //   }
            // }
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
                  } else {
                    ifeatureHeaderData = step3_data_row.Accessoryarray.filter(function (obj) {
                      return obj['OPTM_FEATUREID'] == fid
                    })
                  }
                }
                if (ifeatureHeaderData.length == 0) {
                  ifeatureHeaderData = step3_data_row.ModelHeaderItemsArray.filter(function (obj) {
                    return obj['OPTM_ITEMKEY'] == step3_data_row.feature[ifeature].Item
                  })
                }
                var itemcode = step3_data_row.feature[ifeature].Item
                if (step3_data_row.feature[ifeature].is_accessory == "Y") {
                  itemtype = 3;
                } else {
                  itemtype = 2;
                }

                var formatedTotalPrice: any = step3_data_row.feature[ifeature].quantity * step3_data_row.feature[ifeature].Actualprice
                formatedTotalPrice = parseFloat(formatedTotalPrice).toFixed(3)
                if (ifeatureHeaderData.length > 0) {
                  var uniqueIdentifier = ifeatureHeaderData[0].OPTM_UNIQUEIDNT;
                }
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
                  "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
                  "OPTM_CREATEDBY": this.common_output_data.username,
                  "OPTM_MODIFIEDBY": this.common_output_data.username,
                  "UNIQUEIDNT": uniqueIdentifier,
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
                  "OPTM_DISCPERCENT": parseFloat(step3_data_row.feature[ifeature].discount).toFixed(3),
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
                // itemkey = temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
              } else {
                // itemkey = itemkey + "-" + temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
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

        for (var isave in temp_step2_final_dataset_save) {
          if (temp_step2_final_dataset_save[isave].OPTM_ITEMTYPE == 1  && temp_step2_final_dataset_save[isave].OPTM_KEY != "") {
            if (temp_step2_final_dataset_save[isave].UNIQUEIDNT == "Y") {
              if (sortitemkey.length == 0) {
                sortitemkey = temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
              } else {
                sortitemkey = sortitemkey + "-" + temp_step2_final_dataset_save[isave].OPTM_ITEMCODE
              }
            }

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

        var iValueData = [];
        iValueData = step3_data_row.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return obj['OPTM_TYPE'] == "3" && obj['checked'] == true
        })
        if (iValueData.length > 0) {
          for (let itempsavefinal = 0; itempsavefinal < iValueData.length; itempsavefinal++) {
            temp_step2_final_dataset_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": "",
              "OPTM_ITEMCODE": iValueData[itempsavefinal].OPTM_VALUE,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": "",
              "OPTM_ITMCODEGENKEY": "",
              "OPTM_ITEMTYPE": 4,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": iValueData[itempsavefinal].OPTM_LEVEL,
              "OPTM_QUANTITY": parseFloat(iValueData[itempsavefinal].OPTM_QUANTITY).toFixed(3),
              "OPTM_PRICELIST": Number(0),
              "OPTM_UNITPRICE": parseFloat("0").toFixed(3),
              "OPTM_TOTALPRICE": 0,
              "OPTM_DISCPERCENT": parseFloat("0").toFixed(3),
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": "N",
              "PARENTID": iValueData[itempsavefinal].OPTM_FEATUREID,
              "OPTM_FGCREATEDATE": "",
              "OPTM_REFITEMCODE": "",
              "OPTM_PARENTID": iValueData[itempsavefinal].OPTM_FEATUREID,
              "OPTM_PARENTTYPE": 1
            })
          }
        }



        // key generation array iteration - end 
        //  this.step2_final_dataset_to_save.push(temp_step2_final_dataset_save);
        for (let itempsavefinal = 0; itempsavefinal < temp_step2_final_dataset_save.length; itempsavefinal++) {
          this.step2_final_dataset_to_save.push({
            "OPTM_OUTPUTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTID,
            "OPTM_OUTPUTDTLID": temp_step2_final_dataset_save[itempsavefinal].OPTM_OUTPUTDTLID,
            "OPTM_ITEMNUMBER": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMNUMBER,
            "OPTM_ITEMCODE": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMCODE,
            "OPTM_KEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_KEY,
            "OPTM_PARENTKEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTKEY,
            "OPTM_TEMPLATEID": temp_step2_final_dataset_save[itempsavefinal].OPTM_TEMPLATEID,
            "OPTM_ITMCODEGENKEY": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITMCODEGENKEY,
            "OPTM_ITEMTYPE": temp_step2_final_dataset_save[itempsavefinal].OPTM_ITEMTYPE,
            "OPTM_WHSE": this.warehouse,
            "OPTM_LEVEL": temp_step2_final_dataset_save[itempsavefinal].OPTM_LEVEL,
            "OPTM_QUANTITY": temp_step2_final_dataset_save[itempsavefinal].OPTM_QUANTITY,
            "OPTM_PRICELIST": temp_step2_final_dataset_save[itempsavefinal].OPTM_PRICELIST,
            "OPTM_UNITPRICE": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_UNITPRICE).toFixed(3),
            "OPTM_TOTALPRICE": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_TOTALPRICE).toFixed(3),
            "OPTM_DISCPERCENT": parseFloat(temp_step2_final_dataset_save[itempsavefinal].OPTM_DISCPERCENT).toFixed(3),
            "OPTM_CREATEDBY": this.common_output_data.usernameOPTM_CREATEDBY,
            "OPTM_MODIFIEDBY": this.common_output_data.usernameOPTM_MODIFIEDBY,
            "UNIQUEIDNT": temp_step2_final_dataset_save[itempsavefinal].UNIQUEIDNT,
            "PARENTID": temp_step2_final_dataset_save[itempsavefinal].PARENTID,
            "OPTM_FGCREATEDATE": temp_step2_final_dataset_save[itempsavefinal].OPTM_FGCREATEDATE,
            "OPTM_REFITEMCODE": temp_step2_final_dataset_save[itempsavefinal].OPTM_REFITEMCODE,
            "OPTM_PARENTID": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTID,
            "OPTM_PARENTTYPE": temp_step2_final_dataset_save[itempsavefinal].OPTM_PARENTTYPE
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
        if (data != null && data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }

          else if (data.FinalStatus[0].OPTM_STATUS == "P") {
            this.final_order_status = this.language.process_status;
            this.final_ref_doc_entry = data.FinalStatus[0].OPTM_REFDOCENTRY;
            this.final_document_number = data.FinalStatus[0].OPTM_REFDOCNO;
            this.final_reference_number = data.FinalStatus[0].OPTM_REFDOCNO;
          } else if (data.FinalStatus[0].OPTM_STATUS == "E") {
            this.final_order_status = this.language.error_status;
            this.toastr.error('', this.language.error_occured + ': ' + data.FinalStatus[0].OPTM_ERRDESC, this.commonData.toast_config);
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
    if (header_feature_table['OPTM_TYPE'] == "1" && header_feature_table['ACCESSORY'] != "Y") {
      array = feature_child_datatable.filter(function (obj) {
        if(obj['parentfeatureid'] != "" && obj['parentfeatureid'] != null) {
          return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'] && obj['parentfeatureid'] == header_feature_table['parentfeatureid']; }
        else {
          return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'];
        }
      });
    } else if (header_feature_table['OPTM_TYPE'] == "3" && header_feature_table['ACCESSORY'] != "Y") {
      array = model_child_datatable.filter(function (obj) {
        return obj['OPTM_MODELID'] == header_feature_table['OPTM_CHILDMODELID'] && obj['OPTM_TYPE'] != "2";
      });
    }

    if(header_feature_table['OPTM_TYPE'] == "3" && header_feature_table['is_second_level'] == 1 ) {
      array = model_child_datatable.filter(function (obj) {
        return obj['OPTM_LEVEL'] == 3 && obj['is_second_level'] == 1;
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

  get_accessory_element(accessory_header_data, accessory_bom_data){
    let accessoryBOM = [];
    if(accessory_header_data.OPTM_CHILDFEATUREID != "" && accessory_header_data.OPTM_CHILDFEATUREID != undefined) {
      accessoryBOM = accessory_bom_data.filter( function(array){
        return array['OPTM_FEATUREID'] == accessory_header_data.OPTM_CHILDFEATUREID;
      });
    } else {
      accessoryBOM = accessory_bom_data.filter( function(array){
        return array['OPTM_FEATUREID'] == accessory_header_data.OPTM_FEATUREID;
      });
    }
    return accessoryBOM;
  }

  getAccessoryData(Accarray) {
    let checkedacc = false;
    var isAccExist;
    for (let iaccss = 0; iaccss < Accarray.length; iaccss++) {
      isAccExist = this.feature_accessory_list.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == Accarray[iaccss].OPTM_FEATUREID
      })


      if (isAccExist.length == 0) {
        this.feature_accessory_list.push({
          checked: checkedacc,
          ListName: Accarray[iaccss].ListName,
          OPTM_CHILDFEATUREID: Accarray[iaccss].OPTM_CHILDFEATUREID,
          OPTM_DEFAULT:Accarray[iaccss].OPTM_DEFAULT,
          name:Accarray[iaccss].OPTM_DISPLAYNAME,
          OPTM_FEATUREID: Accarray[iaccss].OPTM_FEATUREID,
          OPTM_ITEMKEY: Accarray[iaccss].OPTM_ITEMKEY,
          DocEntry: Accarray[iaccss].DocEntry,
          OPTM_LINENO:Accarray[iaccss].OPTM_LINENO,
          OPTM_PRICESOURCE: Accarray[iaccss].OPTM_PRICESOURCE,
          OPTM_PROPOGATEQTY: Accarray[iaccss].OPTM_PROPOGATEQTY,
          OPTM_QUANTITY: Accarray[iaccss].OPTM_QUANTITY,
          OPTM_TYPE: Accarray[iaccss].OPTM_TYPE,
          OPTM_VALUE: Accarray[iaccss].OPTM_VALUE
        });
      }

    }
  }

  onAccessorySelectionChange(value, rowData,accessory_header_data) {
      this.showLookupLoader = true;
      let parentfeatureid = rowData.parentfeatureid;
      let superfeatureid = "";
      let GetDataForSelectedFeatureModelItemData: any = {};
      GetDataForSelectedFeatureModelItemData.selecteddata = [];
      GetDataForSelectedFeatureModelItemData.apidata = [];
      let nodeid = "";

      GetDataForSelectedFeatureModelItemData.selecteddata.push({
        type: rowData.OPTM_TYPE,
        modelid: "",
        item: rowData.OPTM_ITEMKEY,
        parentfeatureid: rowData.OPTM_FEATUREID,
        parentmodelid: "",
        selectedvalue: "",
        CompanyDBID: this.common_output_data.companyName,
        SuperModelId: this.step2_data.model_id,
        currentDate: this.submit_date,
        superfeatureid: superfeatureid,
        unique_key:rowData.unique_key,
        nodeid:nodeid
      });
    
    let cobj = this;
    let accessoryIndex = this.selectedAccessoryBOM.findIndex(function(obj){
      return (obj.OPTM_ITEMKEY == rowData.OPTM_ITEMKEY && obj.OPTM_FEATUREID == rowData.OPTM_FEATUREID) ? obj : "";
    });

    this.selectedAccessoryBOM[accessoryIndex].checked = value;

      GetDataForSelectedFeatureModelItemData.apidata.push({
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
      });

      this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
        data => {

          if (data != null && data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.CommonService.RemoveLoggedInUser().subscribe();
                this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                return;
              }
            }
            if (value == true) {
              if (data.AccessoryFeatureData.length > 0) {
                this.setItemDataForFeatureAccessory(data.AccessoryFeatureData,accessory_header_data);
              }
              this.showLookupLoader = false;
            }
            else {
              for (let i = 0; i < this.feature_itm_list_table.length; i++) {
                if (this.feature_itm_list_table[i].FeatureId == rowData.OPTM_FEATUREID && this.feature_itm_list_table[i].Item == rowData.OPTM_ITEMKEY) {
                  this.feature_itm_list_table.splice(i, 1);
                  i = i - 1;
                }
              }
              this.showLookupLoader = false;
            }
          }

        },
        error => {
          this.showLookupLoader = false;
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        });



    this.feature_price_calculate();
    /*this.updateAccessoryCheckedStatus(value, rowData);*/
    /*this.checkedFunction(feature_model_data, elementtypeforcheckedfunction, value,false);*/

  }

  setItemDataForFeatureAccessory(ItemData,parentArray) {
    let isPriceDisabled: boolean = false;
    let isPricehide: boolean = false;
    if (ItemData.length > 0) {
      for (let i = 0; i < this.feature_itm_list_table.length; i++) {
          if (this.feature_itm_list_table[i].FeatureId == ItemData[0].OPTM_FEATUREID && this.feature_itm_list_table[i].Item == ItemData[0].OPTM_ITEMKEY) {
            this.feature_itm_list_table.splice(i, 1);
            i = i - 1;
          }
      }

      var isExist;
      let isheadercounter = 10000;
      for (let i = 0; i < ItemData.length; i++) {
        isExist = this.feature_itm_list_table.filter(function (obj) {
          return obj['FeatureId'] == ItemData[i].OPTM_FEATUREID && obj['Item'] == ItemData[i].OPTM_ITEMKEY;
        });


        var formatequantity: any;
        if (ItemData[0].OPTM_PROPOGATEQTY == "Y") {
          /*ItemData[0].OPTM_QUANTITY = parentarray[0].OPTM_QUANTITY*/
          ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
          formatequantity = ItemData[0].OPTM_QUANTITY * this.step2_data.quantity
        }
        else {
          ItemData[0].OPTM_QUANTITY = parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3)
          formatequantity = ItemData[0].OPTM_QUANTITY
        }
        if (ItemData[i].Price == null || ItemData[i].Price == undefined || ItemData[i].Price == "") {
          ItemData[i].Price = 0
        }

        var priceextn: any = formatequantity * ItemData[i].Price

        if (isExist.length == 0) {
          this.feature_itm_list_table.push({
            FeatureId: ItemData[i].OPTM_FEATUREID,
            featureName: parentArray.name,
            Item: ItemData[i].OPTM_ITEMKEY,
            ItemNumber: ItemData[i].DocEntry,
            Description: ItemData[i].OPTM_DISPLAYNAME,
            quantity: parseFloat(formatequantity).toFixed(3),
            original_quantity: parseFloat(ItemData[0].OPTM_QUANTITY).toFixed(3),
            price: ItemData[i].ListName,
            Actualprice: parseFloat(ItemData[i].Price).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "Y",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            isQuantityDisabled: false,
            ispropogateqty: ItemData[i].OPTM_PROPOGATEQTY,
            HEADER_LINENO: isheadercounter

          });
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          isheadercounter++;
        }
      }
      this.feature_price_calculate();
    }
  }

  /*selectallAccessory(value) {
    if (this.feature_accessory_list.length > 0) {
      this.showLookupLoader = true;
      for (let i = 0; i < this.feature_accessory_list.length; ++i) {
        this.feature_accessory_list[i].checked = value;
        if (value == true) {
          let GetDataForSelectedFeatureModelItemData: any = {};
          GetDataForSelectedFeatureModelItemData.selecteddata = [];
          GetDataForSelectedFeatureModelItemData.featurebomdata = [];
          GetDataForSelectedFeatureModelItemData.modelbomdata = [];
          GetDataForSelectedFeatureModelItemData.apidata = [];
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

          GetDataForSelectedFeatureModelItemData.apidata.push({
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
          });

          this.OutputService.GetDataForSelectedFeatureModelItem(GetDataForSelectedFeatureModelItemData).subscribe(
            data => {
              this.showLookupLoader = false;
              if (data != null && data != undefined) {
                if (data.length > 0) {
                  if (data[0].ErrorMsg == "7001") {
                    this.CommonService.RemoveLoggedInUser().subscribe();
                    this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
                    return;
                  }
                }
              }
              let parentfeatureid = this.feature_accessory_list[i].parentfeatureid
              let parentarray = this.Accessoryarray.filter(function (obj) {
                return obj['OPTM_FEATUREID'] == parentfeatureid
              });
              if (parentarray.length == 0) {
                parentarray = this.AccessModel.filter(function (obj) {
                  return obj['OPTM_FEATUREID'] == parentfeatureid
                });
              }
              if (data.DataForSelectedFeatureModelItem.length > 0)
                this.setItemDataForFeatureAccessory(data.DataForSelectedFeatureModelItem, parentarray);
              this.RuleIntegration(data.RuleOutputData, value)

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

  }*/

  getDefaultItems(DefaultData) {
    let isPriceDisabled: boolean = true;
    let isPricehide: boolean = true;

    for (var idefault in DefaultData) {
      var isExist;
      isExist = this.feature_itm_list_table.filter(function (obj) {
        if(obj['parent_featureid'] != null && obj['parent_featureid'] != "") {
          return obj['FeatureId'] == DefaultData[idefault].OPTM_FEATUREID && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY && obj['parent_featureid'] == DefaultData[idefault].parent_featureid;
        } else {
          return obj['FeatureId'] == DefaultData[idefault].OPTM_FEATUREID && obj['Item'] == DefaultData[idefault].OPTM_ITEMKEY;
        }

      });

      if (DefaultData[idefault].Price == null || DefaultData[idefault].Price == undefined || DefaultData[idefault].Price == "") {
        DefaultData[idefault].Price = 0;
      }

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
          original_quantity: parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3),
          price: DefaultData[idefault].ListName,
          Actualprice: parseFloat(DefaultData[idefault].Price).toFixed(3),
          pricextn: parseFloat(priceextn).toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: this.step2_data.model_id,
          OPTM_LEVEL: 1,
          isQuantityDisabled: true,
          HEADER_LINENO: DefaultData[idefault].HEADER_LINENO,
          parent_featureid:DefaultData[idefault].parent_featureid,
          nodeid:DefaultData[idefault].nodeid,
          unique_key:DefaultData[idefault].unique_key,
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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

      let pricextn0 = 0;
      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: ModelData[imodelarray].OPTM_CHILDMODELID,
          featureName: ModelData[imodelarray].child_code,
          Item: ModelData[imodelarray].OPTM_ITEMKEY,
          ItemNumber: "",
          Description: ModelData[imodelarray].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(ModelData[imodelarray].OPTM_QUANTITY).toFixed(3),
          price: ModelData[imodelarray].ListName,
          Actualprice: pricextn0.toFixed(3),
          pricextn: pricextn0.toFixed(3),
          is_accessory: "N",
          isPriceDisabled: isPriceDisabled,
          pricehide: isPricehide,
          ModelId: ModelData[imodelarray].OPTM_MODELID,
          OPTM_LEVEL: 1,
          isQuantityDisabled: true,
          HEADER_LINENO: ModelData[imodelarray].OPTM_LINENO,
          OPTM_ITEMTYPE: 1
        });
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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
            original_quantity: parseFloat(ModelItemsArray[imodelItemsarray].OPTM_QUANTITY).toFixed(3),
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
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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

      if (ModelItemsData[imodelarray].Price == null || ModelItemsData[imodelarray].Price == undefined || ModelItemsData[imodelarray].Price == "") {
        ModelItemsData[imodelarray].Price = 0;
      }

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
          original_quantity: parseFloat(ModelItemsData[imodelarray].OPTM_QUANTITY).toFixed(3),
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
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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
      var checkModelFeatureParent = this.ModelBOMDataForSecondLevel.filter(function (obj) {
        return obj['OPTM_FEATUREID'] == DefaultData[idefault].OPTM_FEATUREID
      })
      if (checkModelFeatureParent.length > 0) {
        tempmodelid = checkModelFeatureParent[0].OPTM_MODELID
      }
      else {
        tempmodelid = this.step2_data.model_id
      }

      if (isExist.length == 0) {
        this.feature_itm_list_table.push({
          FeatureId: DefaultData[idefault].OPTM_FEATUREID,
          featureName: DefaultData[idefault].parent_code,
          Item: DefaultData[idefault].OPTM_ITEMKEY,
          ItemNumber: DefaultData[idefault].DocEntry,
          Description: DefaultData[idefault].OPTM_DISPLAYNAME,
          quantity: parseFloat(formatequantity).toFixed(3),
          original_quantity: parseFloat(DefaultData[idefault].OPTM_QUANTITY).toFixed(3),
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
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }
    }
    this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_price_calculate();

  }

  countFeatureBOMChildsByFeatureId(featureId) {
    if(featureId != 0 && featureId != null && featureId != undefined && featureId != "") {
      var featureBOMDataByFeatureId = this.FeatureBOMDataForSecondLevel.filter(function (array) {
        return array.OPTM_FEATUREID == featureId;
      });
      var featureBOMChildsCount = featureBOMDataByFeatureId.length;

      var featureChildsDataWithDisabledTrue = featureBOMDataByFeatureId.filter(function (array) {
        return array.disable == true;
      });
      var featureChildsCountWithDisabledTrue = featureChildsDataWithDisabledTrue.length;

      if (featureBOMChildsCount == featureChildsCountWithDisabledTrue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
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

                  checkedRowFound = this.ischeckedRow(RuleOutputData, this.FeatureBOMDataForSecondLevel, this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID)
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
                if (RuleOutputData[iItemRule].OPTM_ISINCLUDED.toString().trim() == "False") {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = true
                } else {
                  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].disable = false
                }
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
                  checkedRowFound = this.ischeckedRow(RuleOutputData, this.ModelBOMDataForSecondLevel, this.ModelBOMDataForSecondLevel[iModelItemTable].OPTM_FEATUREID)
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
              this.feature_itm_list_table[iFeatureItemaddedTable].original_quantity = parseFloat(RuleOutputData[iItemRule].OPTM_QUANTITY).toFixed(3)

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
        // if( this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked==false &&  this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT=="Y" ){
        var tempcheckfeatureid = this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_FEATUREID

        var tempcheckedarray = [];
        tempcheckedarray = this.FeatureBOMDataForSecondLevel.filter(function (obj) {
          return tempcheckfeatureid == obj['OPTM_FEATUREID'] && obj['checked'] == true
        })
        if (tempcheckedarray.length == 0 && this.FeatureBOMDataForSecondLevel[iItemFeatureTable].OPTM_DEFAULT == "Y" && value == true) {
          tempcheckedarray.push(this.FeatureBOMDataForSecondLevel[iItemFeatureTable])
          if (tempcheckedarray.length > 0) {
            if (tempcheckedarray[0].OPTM_TYPE == "2") {
              tempcheckedarray[0].OPTM_FEATURECODE = tempcheckedarray[0].parent_code
              this.FeatureBOMDataForSecondLevel[iItemFeatureTable].checked = true
              this.getDefaultItems(tempcheckedarray)
            }

          }

        }


        // }
      }
      for (var iModelItemTable in this.ModelBOMDataForSecondLevel) {
        this.ModelBOMDataForSecondLevel[iModelItemTable].disable = false
      }

    }
    this.defaultitemflagid = "";
  }

  checkedFunction(feature_model_data, elementtypeforcheckedfunction, value,enabled) {

    for (var ifeaturechecked in this.FeatureBOMDataForSecondLevel) {
      if (feature_model_data.OPTM_TYPE == 2 && elementtypeforcheckedfunction == "radio") {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        } else if(this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key != feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }

      }else if(feature_model_data.OPTM_TYPE == 2 && elementtypeforcheckedfunction == "checkbox"){
          if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].nodeid == feature_model_data.nodeid) {
            this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
          }

      } else if(feature_model_data.OPTM_TYPE == 1 && elementtypeforcheckedfunction == "radio"){
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        } else if(this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key != feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
        if(enabled) {
          if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
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
      }
      else if (feature_model_data.OPTM_TYPE == 1 && elementtypeforcheckedfunction == "checkbox") {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].unique_key == feature_model_data.unique_key && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if(enabled) {
          if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
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
      }
      else {
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE == feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = value
        }
        if (this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.FeatureBOMDataForSecondLevel[ifeaturechecked].OPTM_VALUE != feature_model_data.OPTM_VALUE) {
          this.FeatureBOMDataForSecondLevel[ifeaturechecked].checked = false
        }
      }


    }

    for (var imodelchecked in this.ModelBOMDataForSecondLevel) {
      if (feature_model_data.OPTM_TYPE == 2) {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY == feature_model_data.OPTM_ITEMKEY) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_FEATUREID == feature_model_data.OPTM_FEATUREID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_ITEMKEY != feature_model_data.OPTM_ITEMKEY) {
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
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDFEATUREID != feature_model_data.OPTM_CHILDFEATUREID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }
      else {
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID == feature_model_data.OPTM_CHILDMODELID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = value
        }
        if (this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_MODELID == feature_model_data.OPTM_MODELID && elementtypeforcheckedfunction == "radio" && this.ModelBOMDataForSecondLevel[imodelchecked].OPTM_CHILDMODELID != feature_model_data.OPTM_CHILDMODELID) {
          this.ModelBOMDataForSecondLevel[imodelchecked].checked = false
        }
      }

    }

  }

  onModelCodeChange() {
    this.showLookupLoader = true;
    this.OutputService.onModelIdChange(this.step2_data.model_code).subscribe(
      data => {

        if (data != undefined && data.length > 0) {
          if (data[0].ErrorMsg == "7001") {
            this.showLookupLoader = false;
            this.CommonService.RemoveLoggedInUser().subscribe();
            this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
            return;
          }
        }

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
  setModelDataInOutputBom(getmodelsavedata, SelectedAccessory, modelHeaderdata) {
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
            ItemNumber: filtemodeldataheader[0].DocEntry,
            Description: filtemodeldataheader[0].OPTM_DISPLAYNAME,
            quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
            original_quantity: parseFloat(filtemodeldataheader[0].OPTM_QUANTITY).toFixed(3),
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
        console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
      }
      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 2) {
        if (getmodelsavedata[imodelsavedata].OPTM_LEVEL == 2) {
          var ModelItemsArray = [];
          ModelItemsArray = this.ModelBOMDataForSecondLevel.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE && obj['OPTM_TYPE'] == 2;
          });

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_TOTALPRICE

          if (ModelItemsArray.length > 0) {

            let data_from_mbom = this.ModelHeaderData.filter(function (obj) {
              return obj['OPTM_FEATUREID'] == ModelItemsArray[0].OPTM_FEATUREID
            })
            if(data_from_mbom.length > 0) {
              var mbom_quantity = data_from_mbom[0].OPTM_QUANTITY;
            }
            this.feature_itm_list_table.push({
              FeatureId: ModelItemsArray[0].OPTM_FEATUREID,
              featureName: ModelItemsArray[0].feature_code,
              Item: ModelItemsArray[0].OPTM_ITEMKEY,
              ItemNumber: ModelItemsArray[0].DocEntry,
              Description: ModelItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              original_quantity: parseFloat(mbom_quantity).toFixed(3),
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
            console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
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

          var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_UNITPRICE
          let data_from_mbom;
          if(modelHeaderdata.OPTM_ITEMKEY != null) {
            data_from_mbom = modelHeaderdata.filter(function (obj) {
              return obj['OPTM_ITEMKEY'] == ItemsArray[0].OPTM_ITEMKEY
            })
          }
          if(data_from_mbom != undefined) {
            if (data_from_mbom.length == 0) {
              data_from_mbom = modelHeaderdata.filter(function (obj) {
                return obj['OPTM_FEATUREID'] == ItemsArray[0].OPTM_FEATUREID
              })
            }
            var mbomQuantity = data_from_mbom[0].OPTM_QUANTITY;
          }
          if (ItemsArray.length > 0) {
            this.feature_itm_list_table.push({
              FeatureId: ItemsArray[0].OPTM_FEATUREID,
              featureName: ItemsArray[0].parent_code,
              Item: ItemsArray[0].OPTM_ITEMKEY,
              ItemNumber: ItemsArray[0].DocEntry,
              Description: ItemsArray[0].OPTM_DISPLAYNAME,
              quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
              original_quantity: parseFloat(mbomQuantity).toFixed(3),
              price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
              Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_UNITPRICE).toFixed(3),
              pricextn: parseFloat(priceextn).toFixed(3),
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide,
              ModelId: ItemsArray[0].OPTM_MODELID,
              OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
              isQuantityDisabled: true,
              HEADER_LINENO: parseFloat(imodelsavedata) + 1
            });
            console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
          }
        }
      }

      else if (getmodelsavedata[imodelsavedata].OPTM_ITEMTYPE == 3) {
        let parentfeatureid;
        let parentmodelid;
        var tempSelectedAccessoryArray;
        if (getmodelsavedata[imodelsavedata].OPTM_PARENTTYPE == 1) {
          parentfeatureid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
          parentmodelid = ""
        }
        else {
          parentfeatureid = ""
          parentmodelid = getmodelsavedata[imodelsavedata].OPTM_PARENTID
        }

        tempSelectedAccessoryArray = SelectedAccessory.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == getmodelsavedata[imodelsavedata].OPTM_ITEMCODE
        })

     
        var priceextn: any = getmodelsavedata[imodelsavedata].OPTM_QUANTITY * getmodelsavedata[imodelsavedata].OPTM_UNITPRICE

        if (tempSelectedAccessoryArray.length > 0) {
          let head_acc_data = modelHeaderdata.filter(function (obj) {
            return obj['OPTM_FEATUREID'] == tempSelectedAccessoryArray[0].OPTM_FEATUREID
          });

          this.feature_itm_list_table.push({
            FeatureId: parentfeatureid,
            featureName: head_acc_data[0].feature_code,
            Item: tempSelectedAccessoryArray[0].OPTM_ITEMKEY,
            ItemNumber: getmodelsavedata[imodelsavedata].OPTM_ITEMNUMBER,
            Description: tempSelectedAccessoryArray[0].OPTM_DISPLAYNAME,
            quantity: parseFloat(getmodelsavedata[imodelsavedata].OPTM_QUANTITY).toFixed(3),
            original_quantity: parseFloat(head_acc_data[0].OPTM_QUANTITY).toFixed(3),
            price: getmodelsavedata[imodelsavedata].OPTM_PRICELIST,
            Actualprice: parseFloat(getmodelsavedata[imodelsavedata].OPTM_UNITPRICE).toFixed(3),
            pricextn: parseFloat(priceextn).toFixed(3),
            is_accessory: "Y",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide,
            ispropogateqty: tempSelectedAccessoryArray[0].OPTM_PROPOGATEQTY,
            ModelId: this.step2_data.model_id,
            OPTM_LEVEL: getmodelsavedata[imodelsavedata].OPTM_LEVEL,
            isQuantityDisabled: true,
            HEADER_LINENO: parseFloat(imodelsavedata) + 1
          });
          console.log("this.feature_itm_list_table - ", this.feature_itm_list_table);
        }


        for (var iaccess in this.feature_accessory_list) {
          if (parentfeatureid == this.feature_accessory_list[iaccess].id) {
            this.feature_accessory_list[iaccess].checked = true
          }
        }
        this.feature_price_calculate();
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
                    // else {
                    //   this.FeatureBOMDataForSecondLevel[ifeatureBomData].checked = false
                    // }
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
    this.feature_itm_list_table = this.feature_itm_list_table.sort((a, b) => a.HEADER_LINENO - b.HEADER_LINENO)
    this.feature_price_calculate();

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

  getCheckedAccessoryData(selectedAccessory) {
    for(var i=0; i < selectedAccessory.length; i++) {
      for (var obj in this.selectedAccessoryBOM) {
        if (selectedAccessory[i].OPTM_CHILDFEATUREID != null && selectedAccessory[i].OPTM_CHILDFEATUREID != "" && selectedAccessory[i].OPTM_CHILDFEATUREID != 0) {
          if (this.selectedAccessoryBOM[obj].OPTM_FEATUREID == selectedAccessory[i].OPTM_CHILDFEATUREID && this.selectedAccessoryBOM[obj].OPTM_ITEMKEY == selectedAccessory[i].OPTM_ITEMKEY) {
            /*this.selectedAccessoryBOM[obj].Checked = "true";*/
          }
        } else {
          if (this.selectedAccessoryBOM[obj].OPTM_FEATUREID == selectedAccessory[i].OPTM_FEATUREID && this.selectedAccessoryBOM[obj].OPTM_ITEMKEY == selectedAccessory[i].OPTM_ITEMKEY) {
            /*this.selectedAccessoryBOM[obj].Checked = "true";*/
          }
        }
      }
    }
  }

  //This method will update state of accessory item data to checked true or false.
  updateAccessoryCheckedStatus(value, AccessoryBOMData) {
      for (var obj in this.selectedAccessoryBOM) {
          if(AccessoryBOMData .OPTM_CHILDFEATUREID != null && AccessoryBOMData.OPTM_CHILDFEATUREID != "") {
              if(this.selectedAccessoryBOM[obj].OPTM_FEATUREID == AccessoryBOMData.OPTM_CHILDFEATUREID && this.selectedAccessoryBOM[obj].OPTM_ITEMKEY == AccessoryBOMData.OPTM_ITEMKEY) {
                this.selectedAccessoryBOM[obj].Checked = value;
              }
          } else {
              if (this.selectedAccessoryBOM[obj].OPTM_FEATUREID == AccessoryBOMData.OPTM_FEATUREID && this.selectedAccessoryBOM[obj].OPTM_ITEMKEY == AccessoryBOMData.OPTM_ITEMKEY) {
              this.selectedAccessoryBOM[obj].Checked = value;
            }
          }
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

  ischeckedRow(RuleOutputData, FeatureModelData, featureid) {
    var tempRuleArray = RuleOutputData.filter(function (obj) {
      return obj['OPTM_ISINCLUDED'].trim() == "True"
    })


    if (tempRuleArray.length > 0) {
      for (var itemp in tempRuleArray) {
        var tempFeatArray = FeatureModelData.filter(function (obj) {
          return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "N" && obj['OPTM_FEATUREID'] == featureid
        })
        if (tempFeatArray.length == 0) {
          var tempFeatArray = FeatureModelData.filter(function (obj) {
            return obj['OPTM_ITEMKEY'] == tempRuleArray[itemp].OPTM_ITEMKEY && obj['OPTM_DEFAULT'] == "Y" && obj['checked'] == true && obj['OPTM_FEATUREID'] == featureid
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


  removefeaturesanditems(parentfeatureid) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeatunique_key;
    var itemkey;
    var tempfeatureidforfeaturebom;
    var tempNodeId;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].parentfeatureid == parentfeatureid) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        tempchildfeatunique_key=this.ModelHeaderData[itemp].unique_key
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].nodeid == tempchildfeatunique_key) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removefeaturesanditems(tempchildfeatureidmodelheader)
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempfeatureidforfeaturebom = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              tempNodeId = this.FeatureBOMDataForSecondLevel[itemp2].nodeid
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].nodeid == tempNodeId && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }


      }

    }

  }

  removefeaturesbyuncheck(featureid, featurecode) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeaturecodemodelheader;
    var itemkey;
    var tempfeatureidforfeaturebom;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].parentfeatureid == featureid && this.ModelHeaderData[itemp].feature_code == featurecode) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID == tempfeatureidmodelheader) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              tempchildfeaturecodemodelheader = this.FeatureBOMDataForSecondLevel[itemp2].feature_code
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removefeaturesbyuncheck(tempchildfeatureidmodelheader, tempchildfeaturecodemodelheader)
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempfeatureidforfeaturebom = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].FeatureId == tempfeatureidforfeaturebom && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }


      }

    }


  }

  removeModelfeaturesbyuncheck(featureid, featurecode) {
    var tempfeatureidmodelheader;
    var tempparentfeatureidmodelheader;
    var tempchildfeatureidmodelheader;
    var tempchildfeaturecodemodelheader;
    var itemkey;
    var tempfeatureidforfeaturebom;
    for (var itemp = 0; itemp < this.ModelHeaderData.length; itemp++) {
      if (this.ModelHeaderData[itemp].parentmodelid == featureid && this.ModelHeaderData[itemp].feature_code == featurecode) {
        tempfeatureidmodelheader = this.ModelHeaderData[itemp].OPTM_FEATUREID
        this.ModelHeaderData.splice(itemp, 1);
        itemp = itemp - 1

        for (var itemp2 = 0; itemp2 < this.FeatureBOMDataForSecondLevel.length; itemp2++) {
          if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID == tempfeatureidmodelheader) {
            if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "1") {
              tempchildfeatureidmodelheader = this.FeatureBOMDataForSecondLevel[itemp2].parentmodelid
              tempchildfeaturecodemodelheader = this.FeatureBOMDataForSecondLevel[itemp2].feature_code
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              this.removeModelfeaturesbyuncheck(tempchildfeatureidmodelheader, tempchildfeaturecodemodelheader)
            }
            else if (this.FeatureBOMDataForSecondLevel[itemp2].OPTM_TYPE == "2") {
              tempfeatureidforfeaturebom = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_FEATUREID
              itemkey = this.FeatureBOMDataForSecondLevel[itemp2].OPTM_ITEMKEY
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
              for (var itemp3 = 0; itemp3 < this.feature_itm_list_table.length; itemp3++) {
                if (this.feature_itm_list_table[itemp3].FeatureId == tempfeatureidforfeaturebom && this.feature_itm_list_table[itemp3].Item == itemkey) {
                  this.feature_itm_list_table.splice(itemp3, 1)
                  itemp3 = itemp3 - 1
                }
              }
            }
            else {
              this.FeatureBOMDataForSecondLevel.splice(itemp2, 1)
              itemp2 = itemp2 - 1
            }
          }
        }


      }

    }


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

          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
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
              currentDate: this.submit_date,
              GUID: sessionStorage.getItem("GUID"),
              UsernameForLic: sessionStorage.getItem("loggedInUser")
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
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.CommonService.RemoveLoggedInUser().subscribe();
              this.CommonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          }
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
        BillTo: this.customerBillTo,
        GUID: sessionStorage.getItem("GUID"),
        UsernameForLic: sessionStorage.getItem("loggedInUser")
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


  getFeatureHasAccesory(selected_feature_in_model) {
    return selected_feature_in_model.filter(obj => obj.is_accessory == 'Y');
  }
}
