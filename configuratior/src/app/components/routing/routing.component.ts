import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RoutingService } from '../../services/routing.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';
import { TypeaheadOptions } from 'ngx-bootstrap';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.scss']
})
export class RoutingComponent implements OnInit {
  public commonData = new CommonData();
  public view_route_link = '/routing/view';
  public input_file: File = null;
  public routing_header_data: any = [];
  public routing_detail_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public update_id = '';
  public min;
  public show_insert_operation_btn: boolean = true;
  public show_resequence_btn: boolean = true;
  public show_resource_btn: boolean = true;
  public isSaveButtonVisible: boolean = false;
  public isUpdateButtonVisible: boolean = false;
  public isDeleteButtonVisible: boolean = false;
  public showLookupLoader: boolean = false;
  public type_dropdown = '';
  public grid_option_title = '';
  public row_selection: number[] = [];
  public current_grid_action_row: number = 0;
  public current_selected_row: any = [];
  public selectableSettings: any = [];
  public showLoader: boolean = true;
  public selectedImage = "";
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public customPatterns = { '0': { pattern: new RegExp('\[0-9\]') } }

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RoutingService, private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService) { }

  companyName: string;
  page_main_title = this.language.routing
  public grid_title = this.language.bom_details;
  public username: string = "";
  serviceData: any;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;

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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    console.log("scrolling...window");
    $('body').click()
  }

  ngOnInit() {
    let d = new Date();
    let current_date = new Date();
    this.min = new Date(d.setDate(d.getDate() - 1));
    this.routing_header_data.EffectiveDate = new Date((current_date.getMonth() + 1) + '/' + current_date.getDate() + '/' + current_date.getFullYear());
    this.selectableSettings = {
      mode: 'single'
    };
    const element = document.getElementsByTagName('body')[0];
    element.className = '';
    this.detectDevice();
    element.classList.add('add_model-bom');
    element.classList.add('sidebar-toggled');

    this.commonData.checkSession();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');

    if (this.update_id === "" || this.update_id === null) {
      this.routing_header_data.routing_for = 'feature';
      this.on_operation_change();
      this.isSaveButtonVisible = true;
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.show_resequence_btn = false;
      this.show_resource_btn = true;
      this.routing_header_data.default_batch_size = 1;
      this.routing_header_data.default_lot_size = 1;
      this.routing_header_data.applicable_bom_unit = 1;
      this.showLoader = false;
    } else {
      this.isSaveButtonVisible = false;
      this.isUpdateButtonVisible = true;
      this.isDeleteButtonVisible = true;
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
    }
  }

  ngOnChanges() {
    console.log("in ngChange of routingTS");
  }

  on_operation_change() {
    this.current_selected_row = [];
    if (this.routing_header_data.routing_for == 'feature') {
      this.reset_model()
      this.show_resequence_btn = false;
      this.show_resource_btn = true;
      this.type_dropdown = this.commonData.bom_type;

      this.grid_option_title = this.language.Bom_FeatureValue;
    } else if (this.routing_header_data.routing_for == 'model') {
      this.reset_feature()
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
      this.type_dropdown = this.commonData.model_bom_type;
      this.grid_option_title = this.language.ModelBom_FeatureValue;
    }
    this.current_selected_row = [];
    this.row_selection = [];
  }

  reset_feature() {
    this.routing_header_data.feature_id = "";
    this.routing_header_data.feature_code = "";
    this.routing_header_data.feature_description = "";
    this.routing_detail_data = [];
  }

  reset_model() {
    this.routing_header_data.modal_id = "";
    this.routing_header_data.modal_code = "";
    this.routing_header_data.modal_description = "";
    this.routing_header_data.warehouse_id = "";
    this.routing_header_data.warehouse_code = "";
    this.routing_header_data.default_batch_size = 1;
    this.routing_header_data.default_lot_size = 1;
    this.routing_header_data.applicable_bom_unit = 1;
    this.routing_detail_data = [];
    this.routing_header_data.use_mtq_in_planing = false;
    $("#use_mtq_in_planing").prop('checked', false);
    this.routing_header_data.opm_num_format = "";
    this.routing_header_data.use_template_routing = false;
    $("#use_template_routing").prop('checked', false);
    this.routing_header_data.template_routing_id = "";
    this.routing_header_data.template_routing_code = "";

  }

  header_numeric_input_change(value, input_id) {
    if (value == 0 && value != '') {
      value = 1;
      this.routing_header_data[input_id] = (value);
      this.toastr.error('', this.language.valuezerovalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
    }
    else {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        value = 1;
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      } else if (value == 0 || value == '' || value == null || value == undefined) {
        value = 1;
        this.toastr.error('', this.language.blank_or_zero_allowed + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
      } else if (value < 0) {
        value = 1;
        this.toastr.error('', this.language.negativevalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
      } else if (rgexp.test(value) == false) {
        value = 1;
        this.toastr.error('', this.language.decimalvalid + ' ' + this.language.in + ' ' + this.language[input_id], this.commonData.toast_config);
      }
      this.routing_header_data[input_id] = (value);

    }
    $('#' + input_id).val(value);
  }



  getLookupValue($event) {

    console.log('in getLookupValue' + 'lookup for - ' + this.lookupfor, $event);
    if (this.lookupfor == 'feature_lookup') {
      this.routing_header_data.feature_id = $event[0];
      this.routing_header_data.feature_code = $event[1];
      this.routing_header_data.feature_description = $event[2];
      this.GetDataByFeatureId($event[0], "header", 0);
    }

    if (this.lookupfor == 'ModelBom_lookup') {
      this.routing_header_data.modal_id = $event[0];
      this.routing_header_data.modal_code = $event[1];
      this.routing_header_data.modal_description = $event[2];
      this.GetDataByModelId($event[0], "header", 0);
    }

    if (this.lookupfor == 'warehouse_lookup') {
      this.routing_header_data.warehouse_id = $event[0];
      this.routing_header_data.warehouse_code = $event[0];
    }

    if (this.lookupfor == 'operation_lookup') {
      this.routing_detail_data[this.current_grid_action_row].oper_id = $event[0];
      this.routing_detail_data[this.current_grid_action_row].oper_code = $event[0];
      this.routing_detail_data[this.current_grid_action_row].wc_id = $event[4];
      this.routing_detail_data[this.current_grid_action_row].wc_code = $event[4];
      this.current_grid_action_row = 0;
    }

    if (this.lookupfor == "workcenter_lookup") {
      this.routing_detail_data[this.current_grid_action_row].wc_id = $event[2];
      this.routing_detail_data[this.current_grid_action_row].wc_code = $event[2];
      this.current_grid_action_row = 0;
    }

    var obj = this;
    setTimeout(() => {
      console.log('in getlookupvalue on routing ts');
      obj.lookupfor = "";
    });
  }

  resequence_operation() {

  }

  getSelectedRowDetail(event) {
    if (event.selectedRows.length > 0) {
      this.current_selected_row = event.selectedRows[0].dataItem;
    } else {
      this.current_selected_row = [];
    }

    console.log('this.current_selected_row');
    console.log(this.current_selected_row);
  }


  openFeatureLookup(flag) {
    this.showLookupLoader = true;
    console.log('inopen feature');
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.service.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
          console.log(this.serviceData);
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
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

  openModalLookup(flag) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
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

  clearInvalidfeature() {
    this.routing_header_data.feature_id = '';
    this.routing_header_data.feature_code = '';
    this.routing_header_data.feature_description = '';
    this.routing_detail_data = [];
   
  }

  clearInvalidModel() {
    this.routing_header_data.modal_id = '';
    this.routing_header_data.modal_code = '';
    this.routing_header_data.modal_description = "";
    this.routing_detail_data = [];
    
  }

  getFeatureDetail(feature_code) {
    this.showLookupLoader = true;
    this.service.getFeatureDetail(feature_code).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            this.routing_header_data.feature_id = data[0].FeatureId;
            this.routing_header_data.feature_code = data[0].FeatureCode;
            this.routing_header_data.feature_description = data[0].DisplayName
            this.GetDataByFeatureId(this.routing_header_data.feature_id, 'header', 0);
          } else {
            this.clearInvalidfeature();
            this.toastr.error('', this.language.InvalidFeatureCode, this.commonData.toast_config);
            this.showLookupLoader = false;
            return;
          }
        } else {
          this.clearInvalidfeature();
          this.toastr.error('', this.language.InvalidFeatureCode, this.commonData.toast_config);
          this.showLookupLoader = false;
          return;
        }
      }, error => {
        this.clearInvalidfeature();
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        this.showLookupLoader = false;
        return;
      }
    );
  }

  getModalDetail(model_code) {

    this.showLookupLoader = true;
    this.service.getModalDetail(model_code).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            this.routing_header_data.modal_id = data[0].ModelId;
            this.routing_header_data.modal_code = data[0].ModelCode;
            this.routing_header_data.modal_description = data[0].DisplayName;
            this.GetDataByModelId(this.routing_header_data.modal_id, 'header', 0);
          } else {
            this.clearInvalidModel();
            this.toastr.error('', this.language.InvalidModelCode, this.commonData.toast_config);
            this.showLookupLoader = false;
            return;
          }
        } else {
          this.clearInvalidModel();
          this.toastr.error('', this.language.InvalidModelCode, this.commonData.toast_config);
          this.showLookupLoader = false;
          return;
        }
      }, error => {
        this.clearInvalidModel();
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        this.showLookupLoader = false;
        return;
      }
    );
  }



  GetDataByFeatureId(feature_code, press_location, index) {
    this.routing_detail_data = [];
    if (press_location == 'header') {
      this.showLookupLoader = true;
      this.service.GetDataByFeatureId(feature_code).subscribe(
        data => {
          console.log(data);
          if (data.FeatureDetail.length > 0) {


            var temp = new Date(this.routing_header_data.EffectiveDate);
            var temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
            for (let i = 0; i < data.FeatureDetail.length; ++i) {
              var featuredata = data.FeatureDetail[i];
              let value = '';
              let value_code = '';
              var desc = '';
              this.counter = 0;
              if (this.routing_detail_data.length > 0) {
                this.counter = this.routing_detail_data.length
              }
              this.counter++;
              if (featuredata.OPTM_TYPE == 1) {
                value = featuredata.OPTM_CHILDFEATUREID;
                value_code = featuredata.child_code;

              } else if (featuredata.OPTM_TYPE == 2) {
                value = featuredata.OPTM_ITEMKEY;
                value_code = featuredata.OPTM_ITEMKEY;
              } else if (featuredata.OPTM_TYPE == 3) {
                value = featuredata.OPTM_VALUE;
                value_code = featuredata.OPTM_VALUE;
              }
              desc = featuredata.OPTM_DISPLAYNAME;
              this.routing_detail_data.push({
                lineno: this.counter,
                rowindex: this.counter,
                type: featuredata.OPTM_TYPE,
                type_value: value,
                type_value_code: value_code,
                description: desc,
                operation_top_level: '',
                oper_id: '',
                oper_code: '',
                oper_desc: '',
                wc_id: '',
                wc_code: '',
                mtq: '1',
                count_point_operation: false,
                auto_move: false,
                effective_date: temp_effective_date,
                queue_time: '00:00',
                move_time: '00:00',
                qc_time: '00:00',
                time_uom: '',
                opn_application: true,
                isTypeDisabled: true,
                showOperationbtn: false,
              });
            }
            this.showLookupLoader = false;
          } else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          }
        }, error => {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        });
    }
  }

  GetDataByModelId(modal_code, press_location, index) {
    this.routing_detail_data = [];
    if (press_location == 'header') {
      this.showLookupLoader = true;
      this.service.GetDataByModelId(modal_code).subscribe(
        data => {
          console.log(data);
          if (data.ModelDetail.length > 0) {
            for (let i = 0; i < data.ModelDetail.length; ++i) {
              let modeldata = data.ModelDetail[i];
              let value = '';
              let value_code = '';
              var desc = '';
              this.counter = 0;
              if (this.routing_detail_data.length > 0) {
                this.counter = this.routing_detail_data.length
              }
              this.counter++;
              var temp = new Date(this.routing_header_data.EffectiveDate);
              var temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
              if (modeldata.OPTM_TYPE == 1) {
                value = modeldata.OPTM_CHILDFEATUREID;
                value_code = modeldata.feature_code;

              } else if (modeldata.OPTM_TYPE == 2) {
                value = modeldata.OPTM_ITEMKEY;
                value_code = modeldata.OPTM_ITEMKEY;
              } else if (modeldata.OPTM_TYPE == 3) {
                value = modeldata.OPTM_CHILDMODELID;
                value_code = modeldata.child_code;
              }
              desc = modeldata.OPTM_DISPLAYNAME;
              this.routing_detail_data.push({
                lineno: this.counter,
                rowindex: this.counter,
                type: modeldata.OPTM_TYPE,
                type_value: value,
                type_value_code: value_code,
                description: desc,
                operation_top_level: '',
                oper_id: '',
                oper_code: '',
                oper_desc: '',
                wc_id: '',
                wc_code: '',
                mtq: '1',
                count_point_operation: false,
                auto_move: false,
                effective_date: temp_effective_date,
                queue_time: '00:00',
                move_time: '00:00',
                qc_time: '00:00',
                time_uom: '',
                opn_application: true,
                isTypeDisabled: true,
                showOperationbtn: false,
              });
            }
            this.showLookupLoader = false;
          } else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
            
          }
        }, error => {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        });
    } else {

    }
  }

  clearInvalidWarehouse() {
    this.routing_header_data.warehouse_code = '';
    this.toastr.error('', this.language.InvalidWHCode, this.commonData.toast_config);
  }

  openWarehouseLook(flag) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.service.getWarehouseList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'warehouse_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
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

  getWarehouseDetails(warehouse_code) {
    this.showLookupLoader = true;
    this.service.getWarehouseDetail(warehouse_code).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            this.routing_header_data.warehouse_code = warehouse_code;
            this.showLookupLoader = false;
          } else {
            this.clearInvalidWarehouse();
            this.showLookupLoader = false;
            return;
          }
        } else {
          this.clearInvalidWarehouse();
          this.showLookupLoader = false;
          return;
        }
      }, error => {
        this.clearInvalidWarehouse();
        this.showLookupLoader = false;
        return;
      }
    );
  }

  openTemplateRoutingLookup(flag) {
    this.showLookupLoader = true;
    this.serviceData = [];
    this.showLookupLoader = false;
  }

  getTemplateRoutingDetails(template_code) {

  }

  on_type_click_lookup(type, rowindex) {
    this.showLookupLoader = true;
    this.serviceData = [];
    this.showLookupLoader = false;
  }

  open_operation_lookup(type, rowindex) {
    this.serviceData = [];

    if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == null || this.routing_header_data.warehouse_code == undefined) {
      this.toastr.error('', this.language.noselectWarehouse, this.commonData.toast_config);
      return;
    }

    this.showLookupLoader = true;
    this.service.getOperationList(this.routing_header_data.warehouse_code).subscribe(
      data => {
        if (data.length > 0) {
          this.current_grid_action_row = this.getGridCurrentRow(rowindex);
          this.lookupfor = 'operation_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    )
  }

  open_wc_lookup(type, rowindex) {
    this.serviceData = [];

    if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == null || this.routing_header_data.warehouse_code == undefined) {
      this.toastr.error('', this.language.noselectWarehouse, this.commonData.toast_config);
      return;
    }

    this.showLookupLoader = true;
    this.service.getWCList(this.routing_header_data.warehouse_code).subscribe(
      data => {
        if (data.length > 0) {
          this.current_grid_action_row = this.getGridCurrentRow(rowindex);
          this.lookupfor = 'workcenter_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
        return;
      }
    )
  }

  open_operation_resources(flag) {
    if (Object.keys(this.current_selected_row).length > 0) {
      if (this.current_selected_row.oper_code != ""){
        this.showLookupLoader = true;
        // service call for operation wise resource 
        this.serviceData = [];
        this.service.getOperationResource(this.current_selected_row.oper_code).subscribe(
          data => {
            this.serviceData.oper_code =  this.current_selected_row.oper_code;
            this.serviceData.wc_code = this.current_selected_row.wc_code;
            this.serviceData.oper_res = [];
            if (data != null){
              if (data.length > 0) {
                this.serviceData.oper_res = data;
                this.lookupfor = 'routing_resource_lookup';
                this.showLookupLoader = false;
              }
              else {
                this.lookupfor = "routing_resource_lookup";
                this.serviceData.oper_res = [];
                this.showLookupLoader = false;
                /* this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config); */
                return;
              } 
            } else {
              this.lookupfor = "routing_resource_lookup";
              this.serviceData.oper_res = [];
              this.showLookupLoader = false;
              /* this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config); */
              return;
            }
          },
          error => {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }
        )
        this.showLookupLoader = false;
      } else {
        this.toastr.info('', this.language.Operationcodemissing + ' ' + this.current_selected_row.rowindex, this.commonData.toast_config);
        return;
      }
      
    } else {
      this.toastr.info('', this.language.select_atleast_oper, this.commonData.toast_config);
      return;
    }
  }

  changeEffectiveDate(picker_date) {
    var temp = new Date(picker_date);
    this.routing_header_data.EffectiveDate = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
  }

  confirm_override_grid_effective_date() {
    this.dialog_params.push({ 'dialog_type': 'confirmation', 'message': this.language.confirm_override_detials_effective_date });
    this.show_dialog = true;
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    console.log('in get_dialog_value', userSelectionValue);
    if (userSelectionValue == true) {
      this.over_ride_grid_effective_date();
    }
    this.show_dialog = false;
  }

  over_ride_grid_effective_date() {
    console.log('in over_ride_grid_effective_date');
    var temp = new Date(this.routing_header_data.EffectiveDate);
    var temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    // var temp_effective_date = new Date(temp.getFullYear(), (temp.getMonth()), temp.getDate());
    for (let i = 0; i < this.routing_detail_data.length; ++i) {
      this.routing_detail_data[i].effective_date = temp_effective_date;
    }
  }

  validate_header_info() {
    if (this.routing_header_data.routing_for == 'feature') {
      if (this.routing_header_data.feature_code == "") {
        this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
        return false;
      }
    } else if (this.routing_header_data.routing_for == 'model') {
      if (this.routing_header_data.modal_code == "") {
        this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
        return false;
      }

      if (this.routing_header_data.wc_code == "") {
        this.toastr.error('', this.language.warehouseCodeBlank, this.commonData.toast_config);
        return false;
      }
    }
  }


  insert_new_operation(type) { // type = insert || type = add
    if (this.validate_header_info() == false) {
      return false;
    }
    this.counter = 0;
    if (this.routing_detail_data.length > 0) {
      this.counter = this.routing_detail_data.length
    }
    this.counter++;

    if (type == 'add') {
      this.current_selected_row = [];
      this.row_selection = [];
    } else {
      this.current_selected_row
    }

    if (type == 'insert') {
      var current_row_index = this.current_selected_row.rowindex;
      this.counter = current_row_index +1; 
      var row_shift_counter = 0;
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex > current_row_index){
          this.routing_detail_data[i].rowindex = this.routing_detail_data[i].rowindex + 1;
          this.routing_detail_data[i].lineno = this.routing_detail_data[i].lineno + 1;
        }
      }

    }


    var temp_d = new Date(this.routing_header_data.EffectiveDate);
    var temp_effective_date = new Date((temp_d.getMonth() + 1) + '/' + temp_d.getDate() + '/' + temp_d.getFullYear());
    var new_row = {
      lineno: this.counter,
      rowindex: this.counter,
      type: '1',
      type_value: "",
      type_value_code: "",
      description: '',
      operation_top_level: '',
      oper_id: '',
      oper_code: '',
      oper_desc: '',
      wc_id: '',
      wc_code: '',
      mtq: '1',
      count_point_operation: false,
      auto_move: false,
      effective_date: temp_effective_date,
      queue_time: '00:00',
      move_time: '00:00',
      qc_time: '00:00',
      time_uom: '',
      opn_application: true,
      isTypeDisabled: true,
      showOperationbtn: true,
    };

    if (type == 'add') {
      this.routing_detail_data.push(new_row);
     }

    if (type == 'insert') {
      this.routing_detail_data.splice(current_row_index, 0, new_row);
      // this.routing_detail_data[current_row_index] = new_row;
    }
   
  }

  getGridCurrentRow(rowindex) {
    var currentrow = 0;
    if (this.routing_detail_data.length > 0) {
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex === rowindex) {
          currentrow = i;
        }
      }
    }
    return currentrow
  }


  on_input_change(value, rowindex, grid_element) {
    var currentrow = 0;
    currentrow = this.getGridCurrentRow(rowindex);
    if (grid_element == 'selected_type') {
      this.routing_detail_data[currentrow].selected_type = value;
    }

    if (grid_element == 'type_value_code') {
      this.routing_detail_data[currentrow].type_value_code = value;
    }

    if (grid_element == 'description') {
      this.routing_detail_data[currentrow].description = value;
    }

    if (grid_element == 'oper_top_level') {
      this.routing_detail_data[currentrow].oper_top_level = value;
    }

    if (grid_element == 'oper_code') {
      this.showLookupLoader = true;
      this.service.getOperationDetail(value, 'detail', rowindex).subscribe(
        data => {
          console.log(data);
          if (data != null) {
            if (data.length > 0) {
              this.routing_detail_data[currentrow].oper_id = data[0].OPRCode;
              this.routing_detail_data[currentrow].oper_code = data[0].OPRCode;
              this.routing_detail_data[currentrow].wc_id = data[0].DfltWCCode;
              this.routing_detail_data[currentrow].wc_code = data[0].DfltWCCode;
              this.showLookupLoader = false;
            } else {
              this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.routing_detail_data[currentrow].oper_id = "";
              this.routing_detail_data[currentrow].oper_code = "";
              $(".row_oper_id").eq(currentrow).val("");
              $(".row_oper_code").eq(currentrow).val("");
              this.routing_detail_data[currentrow].wc_id = "";
              this.routing_detail_data[currentrow].wc_code = "";
              $(".row_wc_id").eq(currentrow).val("");
              $(".row_wc_code").eq(currentrow).val("");
              this.showLookupLoader = false;
              return;
            }
          } else {
            this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
            this.routing_detail_data[currentrow].oper_id = "";
            this.routing_detail_data[currentrow].oper_code = "";
            $(".row_oper_id").eq(currentrow).val("");
            $(".row_oper_code").eq(currentrow).val("");
            this.routing_detail_data[currentrow].wc_id = "";
            this.routing_detail_data[currentrow].wc_code = "";
            $(".row_wc_id").eq(currentrow).val("");
            $(".row_wc_code").eq(currentrow).val("");
            this.showLookupLoader = false;
            return;
          }
        }, error => {
          this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
          this.routing_detail_data[currentrow].oper_id = "";
          this.routing_detail_data[currentrow].oper_code = "";
          $(".row_oper_id").eq(currentrow).val("");
          $(".row_oper_code").eq(currentrow).val("");
          this.routing_detail_data[currentrow].wc_id = "";
          this.routing_detail_data[currentrow].wc_code = "";
          $(".row_wc_id").eq(currentrow).val("");
          $(".row_wc_code").eq(currentrow).val("");
          this.showLookupLoader = false;
          return;
        }
      );

    }

    if (grid_element == 'oper_desc') {
      this.routing_detail_data[currentrow].oper_desc = value;
    }

    if (grid_element == 'wc_code') {

      this.showLookupLoader = true;
      this.service.getWCDetail(value, 'detail', rowindex).subscribe(
        data => {
          console.log(data);
          if (data != null) {
            if (data.length > 0) {
              this.routing_detail_data[currentrow].wc_id = data[0].WCCode;
              this.routing_detail_data[currentrow].wc_code = data[0].WCCode;
              this.showLookupLoader = false;
            } else {
              this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.routing_detail_data[currentrow].wc_id = "";
              this.routing_detail_data[currentrow].wc_code = "";
              $(".row_wc_id").eq(currentrow).val("");
              $(".row_wc_code").eq(currentrow).val("");
              this.showLookupLoader = false;
              return;
            }
          } else {
            this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
            this.routing_detail_data[currentrow].wc_id = "";
            this.routing_detail_data[currentrow].wc_code = "";
            $(".row_wc_id").eq(currentrow).val("");
            $(".row_wc_code").eq(currentrow).val("");
            this.showLookupLoader = false;
            return;
          }
        }, error => {
          this.toastr.error('', this.language.invalidwccodeRow + ' ' + rowindex, this.commonData.toast_config);
          this.routing_detail_data[currentrow].wc_id = "";
          this.routing_detail_data[currentrow].wc_code = "";
          $(".row_wc_id").eq(currentrow).val("");
          $(".row_wc_code").eq(currentrow).val("");
          this.showLookupLoader = false;
          return;
        }
      );


    }

    if (grid_element == 'mtq') {
      this.routing_detail_data[currentrow].mtq = value;
    }

    if (grid_element == 'count_point_operation') {
      if (this.routing_detail_data[currentrow].auto_move == true && value == true) {
        this.routing_detail_data[currentrow].count_point_operation = false;
        $(".count_point_operation_checkbox").eq(currentrow).prop("checked", false);
        this.toastr.error('', this.language.auto_move_count_point_cannot_bechecked + ' - ' + rowindex, this.commonData.toast_config);
      } else {
        this.routing_detail_data[currentrow].count_point_operation = value;
      }
    }

    if (grid_element == 'auto_move') {

      if (this.routing_detail_data[currentrow].count_point_operation == true && value == true) {
        this.routing_detail_data[currentrow].auto_move = false;
        $(".auto_move_checkbox").eq(currentrow).prop("checked", false);
        this.toastr.error('', this.language.auto_move_count_point_cannot_bechecked + ' - ' + rowindex, this.commonData.toast_config);
      } else {
        if (rowindex == 1 && value == true) {
          this.routing_detail_data[currentrow].auto_move = false;
          $(".auto_move_checkbox").eq(currentrow).prop("checked", false);
          this.toastr.error('', this.language.first_oper_cannot_automove, this.commonData.toast_config);
          return;
        }
        this.routing_detail_data[currentrow].auto_move = value;
      }
    }

    if (grid_element == 'effective_date') {
      console.log("effective_date ", value);
      var temp = new Date(value);
      this.routing_detail_data[currentrow].effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    }

    if (grid_element == 'queue_time') {
      this.routing_detail_data[currentrow].queue_time = value;
    }

    if (grid_element == 'move_time') {
      this.routing_detail_data[currentrow].move_time = value;
    }

    if (grid_element == 'qc_time') {
      this.routing_detail_data[currentrow].qc_time = value;
    }

    if (grid_element == 'time_uom') {
      this.routing_detail_data[currentrow].time_uom = value;
    }

    if (grid_element == 'opn_application') {
      if(value == false){
        this.routing_detail_data[currentrow].oper_id = "";
        this.routing_detail_data[currentrow].oper_code = "";
        this.routing_detail_data[currentrow].oper_desc = "";
        this.routing_detail_data[currentrow].wc_id = "";
        this.routing_detail_data[currentrow].wc_code = "";
        this.routing_detail_data[currentrow].mtq = 1;
        this.routing_detail_data[currentrow].auto_move = false;
        this.routing_detail_data[currentrow].queue_time = "00:00";
        this.routing_detail_data[currentrow].move_time = "00:00";
        this.routing_detail_data[currentrow].qc_time = "00:00";
        this.routing_detail_data[currentrow].time_uom = "";
      }
      this.routing_detail_data[currentrow].opn_application = value;
    }

    console.log("this.routing_detail_data ", this.routing_detail_data);
  }

  onDeleteRow(rowindex) {
    if (this.routing_detail_data.length > 0) {
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex === rowindex) {
          this.routing_detail_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.routing_detail_data[i].rowindex = i + 1;
        }
      }
      this.current_selected_row = [];
      this.row_selection = [];
    }
  }

  onSave() {

  }

  onDelete() {

  }


}
