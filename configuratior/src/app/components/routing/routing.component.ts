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
  public routing_detail_resource_data: any = [];
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
  public routing_type = ""
  public selectedImage = "";
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public customPatterns = { '0': { pattern: new RegExp('\[0-9\]') } }

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RoutingService, private toastr: ToastrService, private commonService: CommonService, private modalService: BsModalService) { }

  companyName: string;
  page_main_title = this.language.routing
  public grid_title = this.language.bom_details;
  public username: string = "";
  serviceData: any;
  public is_delete_called: boolean = false;
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public form_mode = '';
  isOperationDisabled: boolean = false;

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
      this.form_mode = 'add';
      this.isOperationDisabled = false;
    } else {
      this.isSaveButtonVisible = false;
      this.isUpdateButtonVisible = true;
      this.isDeleteButtonVisible = true;
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
      this.form_mode = 'edit';
      this.isOperationDisabled = true;
      this.showLoader = true;
      this.service.get_routing_details(this.update_id).subscribe(
        data => {
          console.log("get_routing_details ", data)
          if (data != undefined) {
            if (data.LICDATA != undefined) {
              if (data.LICDATA[0].ErrorMsg == "7001") {
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route);
                this.showLoader = false;
                return;
              }
            }

            if (data.Header.length > 0) {
              let data_header = data.Header[0];
              let routing_for = '';
              let feature_id = '';
              let feature_code = '';
              let feature_desc = '';
              let model_id = '';
              let model_code = '';
              let model_desc = '';

              if (data_header.OPTM_TYPE == 1) {
                routing_for = 'feature';
                feature_id = data_header.OPTM_MODELFEATUREID;
                feature_code = data_header.OPTM_MODELFEATURECODE
                feature_desc = data_header.OPTM_DESCRIPTION;
                this.grid_option_title = this.language.Bom_FeatureValue;
                this.type_dropdown = this.commonData.bom_type;
                this.routing_type = 'feature';
              } else if (data_header.OPTM_TYPE == 2) {
                routing_for = 'model';
                model_id = data_header.OPTM_MODELFEATUREID;
                model_code = data_header.OPTM_MODELFEATURECODE
                model_desc = data_header.OPTM_DESCRIPTION;
                this.grid_option_title = this.language.ModelBom_FeatureValue;
                this.type_dropdown = this.commonData.model_bom_type;
                this.routing_type = 'model'
              }


              let use_mtq_in_planing;
              if (data_header.OPTM_USEMTQIN_PLN == 'Y') {
                use_mtq_in_planing = true;
              } else {
                use_mtq_in_planing = false;
              }

              let use_template_routing;
              if (data_header.OPTM_USETEMPLATEPRODUCT == 'Y') {
                use_template_routing = true;
              } else {
                use_template_routing = false;
              }

              var eff_date_temp = new Date(data_header.OPTM_EFF_DATE);
              let temp_effective_date = new Date((eff_date_temp.getMonth() + 1) + '/' + eff_date_temp.getDate() + '/' + eff_date_temp.getFullYear());

              this.routing_header_data = {
                EffectiveDate: temp_effective_date,
                applicable_bom_unit: data_header.OPTM_APCLBLBOMUNIT,
                default_batch_size: data_header.OPTM_DFLT_BATCH_SIZE,
                default_lot_size: data_header.OPTM_DFLT_LOT_SIZE,
                feature_code: feature_code,
                feature_description: feature_desc,
                feature_id: feature_id,
                modal_code: model_code,
                modal_description: model_desc,
                modal_id: model_id,
                opm_num_format: data_header.OPTM_OPN_NUM_FORMAT,
                routing_for: routing_for,
                template_routing_id: data_header.OPTM_TEMPLATEPRODUCT,
                template_routing_code: data_header.OPTM_TEMPLATEPRODUCT_CODE,
                use_mtq_in_planing: use_mtq_in_planing,
                use_template_routing: use_template_routing,
                warehouse_code: data_header.OPTM_WH_ID,
                warehouse_id: data_header.OPTM_WH_ID,
              };
            }

            if (data.Detail.length > 0) {

              for (let d_dtli = 0; d_dtli < data.Detail.length; d_dtli++) {
                let data_detail = data.Detail[d_dtli];

                var deff_date_temp = new Date(data_detail.OPTM_EFF_DATE);
                let detail_effective_date = new Date((deff_date_temp.getMonth() + 1) + '/' + deff_date_temp.getDate() + '/' + deff_date_temp.getFullYear());

                let operation_top_level;
                if (data_detail.OPTM_OPER_AT_TOP_LEVEL == 'Y') {
                  operation_top_level = true;
                } else {
                  operation_top_level = false;
                }

                let count_point_operation;
                if (data_detail.OPTM_CNT_POINT_OPR == 'Y') {
                  count_point_operation = true;
                } else {
                  count_point_operation = false;
                }

                let auto_move;
                if (data_detail.OPTM_AUTOMOVE == 'Y') {
                  auto_move = true;
                } else {
                  auto_move = false;
                }

                let opn_application;
                if (data_detail.OPTM_OPR_APPLICABLE == 'Y') {
                  opn_application = true;
                } else {
                  opn_application = false;
                }

                let showOperationbtn = false;
                let isOpenApplicableVisible = true;
                if (data_detail.OPTM_TYPE == 4 || data_detail.OPTM_TYPE == '4') {
                  showOperationbtn = true;
                  isOpenApplicableVisible = false;
                }


                if (this.routing_header_data.routing_for == "feature") {
                  if (data_detail.OPTM_TYPE == 3 || data_detail.OPTM_TYPE == '3') {
                    opn_application = false;
                    isOpenApplicableVisible = false;
                  }
                }

                if (data_detail.OPTM_TYPE == 1) {
                  if (data_detail.OPTM_ACCESSORY == 'Y' || data_detail.OPTM_ACCESSORY == 'y') {
                    opn_application = false;
                    isOpenApplicableVisible = false;
                  }
                }

                // here goes oper type check at time of edit 
                let count_point_operation_disabled = false;
                if (data_detail.OPTM_OPR_TYPE == '4' || data_detail.OPTM_OPR_TYPE == '5') {
                  count_point_operation_disabled = true;
                }

                this.routing_detail_data.push({
                  optm_id: data_detail.OPTM_ID,
                  lineno: data_detail.OPTM_LINE_NO,
                  rowindex: data_detail.OPTM_LINE_NO,
                  type: data_detail.OPTM_TYPE,
                  type_value: (data_detail.OPTM_VALUE),
                  type_value_code: (data_detail.OPTM_VALUE_CODE),
                  description: data_detail.OPTM_DISPLAYNAME,
                  operation_top_level: operation_top_level,
                  oper_id: data_detail.OPTM_OPR_ID,
                  oper_code: data_detail.OPTM_OPR_ID,
                  oper_desc: data_detail.OPTM_OPR_DESC,
                  oper_type: data_detail.OPTM_OPR_TYPE,
                  wc_id: data_detail.OPTM_WC_ID,
                  wc_code: data_detail.OPTM_WC_ID,
                  mtq: data_detail.OPTM_MIN_TRF_QTY,
                  count_point_operation: count_point_operation,
                  auto_move: auto_move,
                  effective_date: detail_effective_date,
                  qc_time: data_detail.OPTM_QCTIME,
                  queue_time: data_detail.OPTM_QUEUE_TIME,
                  move_time: data_detail.OPTM_MOVE_TIME,
                  time_uom: data_detail.OPTM_TIME_UOM,
                  opn_application: opn_application,
                  isTypeDisabled: true,
                  isOpenApplicableVisible: isOpenApplicableVisible,
                  showOperationbtn: showOperationbtn,
                  count_point_operation_disabled: count_point_operation_disabled,
                  unique_key: data_detail.OPTM_UNIQUE_KEY,
                  oper_consumption_method: data_detail.OPTM_OPER_CONSUM_METHOD,
                  oper_consumption_method_str: this.commonData.res_consumption_method[data_detail.OPTM_OPER_CONSUM_METHOD],
                });

                if (data.ResourceDetail.length > 0) {

                  let data_resource_detail = data.ResourceDetail.filter(function (obj) {
                    return (obj.OPTM_UNIQUE_KEY == data_detail.OPTM_UNIQUE_KEY) ? obj : "";
                  });
                  if (data_resource_detail.length > 0) {
                    let temp_array = [];
                    for (let dr_dtli = 0; dr_dtli < data_resource_detail.length; dr_dtli++) {
                      let data_resource_detailddd = data_resource_detail[dr_dtli];

                      if (this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] == undefined || this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)].length == 0) {
                        this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] = [];
                      }

                      temp_array.push({
                        optm_id: data_resource_detailddd.OPTM_ID,
                        lineno: data_resource_detailddd.OPTM_LINE_ID,
                        rowindex: data_resource_detailddd.OPTM_LINE_ID,
                        OPRCode: data_resource_detailddd.OPTM_OPR_ID,
                        ResCode: data_resource_detailddd.OPTM_RESO_ID,
                        ResName: data_resource_detailddd.OPTM_RESONAME,
                        ResType: '',
                        ResUOM: data_resource_detailddd.OPTM_UOM,
                        ResCons: data_resource_detailddd.OPTM_CONSUMPTION,
                        ResInv: data_resource_detailddd.OPTM_INVERSE,
                        ResUsed: data_resource_detailddd.OPTM_NOF_RESO_USED,
                        TimeUOM: data_resource_detailddd.OPTM_TIMEUOM,
                        TimeCons: data_resource_detailddd.OPTM_CONSU,
                        TimeInv: data_resource_detailddd.OPTM_RINVERSE,
                        resource_consumption_type: data_resource_detailddd.OPTM_CONSTYPE,
                        basis: data_resource_detailddd.OPTM_BASIS,
                        schedule: false,
                        is_resource_disabled: true,
                        unique_key: data_resource_detailddd.OPTM_UNIQUE_KEY,
                      });

                      this.routing_detail_resource_data[(data_detail.OPTM_LINE_NO - 1)] = temp_array;
                    }
                  }
                }
              }
            }

            this.showLoader = false;
            console.log(this.routing_detail_resource_data);
          } else {
            this.showLoader = false;
            this.route.navigateByUrl('routing/view');
            this.toastr.error('', this.language.no_routing_found, this.commonData.toast_config);
            return;

          }

        },
        error => {
          this.showLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        });
    }
  }

  ngOnChanges() { }

  on_operation_change() {
    this.current_selected_row = [];
    if (this.routing_header_data.routing_for == 'feature') {
      this.reset_model()
      this.show_resequence_btn = false;
      this.show_resource_btn = true;
      this.type_dropdown = this.commonData.bom_type;
      this.routing_type = 'feature';

      this.grid_option_title = this.language.Bom_FeatureValue;
    } else if (this.routing_header_data.routing_for == 'model') {
      this.reset_feature()
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
      this.type_dropdown = this.commonData.model_bom_type;
      this.grid_option_title = this.language.ModelBom_FeatureValue;
      this.routing_type = 'model';
    }
    this.current_selected_row = [];
    this.row_selection = [];

  }

  reset_feature() {
    this.routing_header_data.feature_id = "";
    this.routing_header_data.feature_code = "";
    this.routing_header_data.feature_description = "";
    this.routing_detail_data = [];
    this.routing_detail_resource_data = [];
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
    this.routing_detail_resource_data = [];
    this.routing_header_data.use_mtq_in_planing = false;
    $("#use_mtq_in_planing").prop('checked', false);
    this.routing_header_data.opm_num_format = 1;
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
      let rgexp = /^\d+$/;
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
      this.routing_detail_data[this.current_grid_action_row].count_point_operation = false;
      this.routing_detail_data[this.current_grid_action_row].count_point_operation_disabled = false;

      if (this.current_grid_action_row == 0 && $event[2] == '4') {
        this.clearInvalidOperationData(this.current_grid_action_row);
        this.toastr.error('', this.language.firstOperationInspectionQC, this.commonData.toast_config);
        return;
      }

      let lastRowIndex = (this.routing_detail_data.length - 1);
      if (lastRowIndex == this.current_grid_action_row) { // last row 
        if ($event[2] == '1') {
          this.clearInvalidOperationData(this.current_grid_action_row);
          this.toastr.error('', this.language.lastOperSetup, this.commonData.toast_config);
          return;
        }
      }

      this.routing_detail_data[this.current_grid_action_row].oper_id = $event[0];
      this.routing_detail_data[this.current_grid_action_row].oper_code = $event[0];
      this.routing_detail_data[this.current_grid_action_row].oper_desc = $event[1];
      this.routing_detail_data[this.current_grid_action_row].oper_type = $event[2];
      this.routing_detail_data[this.current_grid_action_row].wc_id = $event[4];
      this.routing_detail_data[this.current_grid_action_row].wc_code = $event[4];
      this.routing_detail_data[this.current_grid_action_row].oper_consumption_method = $event[7];
      this.routing_detail_data[this.current_grid_action_row].oper_consumption_method_str = this.commonData.res_consumption_method[$event[7]];
      let obj = this;


      if ($event[2] == '4' || $event[2] == '5') {
        this.routing_detail_data[this.current_grid_action_row].count_point_operation = true;
        this.routing_detail_data[this.current_grid_action_row].count_point_operation_disabled = true;
      }

      this.getOperationResourceDetail(this.routing_detail_data[this.current_grid_action_row].oper_code, this.routing_detail_data[this.current_grid_action_row].oper_type, this.routing_detail_data[this.current_grid_action_row].oper_consumption_method, this.current_grid_action_row, this.routing_detail_data[this.current_grid_action_row].unique_key, function () {
        // obj.current_grid_action_row = 0;
      });
    }

    if (this.lookupfor == "workcenter_lookup") {
      this.routing_detail_data[this.current_grid_action_row].wc_id = $event[2];
      this.routing_detail_data[this.current_grid_action_row].wc_code = $event[2];
      //  this.current_grid_action_row = 0;
    }

    if (this.lookupfor == "routing_resource_lookup") {
      let temp_array = [];
      for (let i = 0; i < $event.length; ++i) {
        console.log("$event[i] ", $event[i]);
        if ($event[i].resource_code != undefined) {
          temp_array.push({
            lineno: i + 1,
            rowindex: i + 1,
            OPRCode: $event[i].operation_no,
            ResCode: $event[i].resource_code,
            ResName: $event[i].resource_name,
            ResType: $event[i].resource_type,
            ResUOM: $event[i].resource_uom,
            ResCons: ($event[i].resource_consumption).toString(),
            ResInv: ($event[i].resource_inverse).toString(),
            ResUsed: $event[i].no_resource_used,
            TimeUOM: $event[i].time_uom,
            TimeCons: ($event[i].time_consumption).toString(),
            TimeInv: ($event[i].time_inverse).toString(),
            resource_consumption_type: '1',
            basis: '1',
            schedule: false,
            is_resource_disabled: true,
            unique_key: $event[i].unique_key,
          });
        }
      }
      console.log("temp_array- ", temp_array);
      if (temp_array.length > 0) {
        this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] = temp_array;
      }
    }

    if (this.lookupfor == "template_routing_lookup") {
      this.routing_header_data.template_routing_id = $event[0];
      this.routing_header_data.template_routing_code = $event[1];
    }

    let obj = this;
    setTimeout(() => {
      obj.lookupfor = "";
    });
    console.log("this.routing_detail_resource_data - ", this.routing_detail_resource_data);
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
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
        }
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
          console.log(this.serviceData);
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.clearInvalidfeature();
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.serviceData = [];
        this.lookupfor = "";
        this.clearInvalidfeature();
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

        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
        }

        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.clearInvalidModel();
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
        this.clearInvalidModel();
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
          if (data != undefined) {
            if (data.length > 0) {
              if (data[0].ErrorMsg == "7001") {
                this.commonService.RemoveLoggedInUser().subscribe();
                this.commonService.signOut(this.toastr, this.route);
                this.showLookupLoader = false;
                return;
              }
            }
          }
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
          if (data != undefined && data.LICDATA != undefined) {
            if (data.LICDATA[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }

          if (data.FeatureDetail.length > 0) {

            let temp = new Date(this.routing_header_data.EffectiveDate);
            let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
            for (let i = 0; i < data.FeatureDetail.length; ++i) {
              let featuredata = data.FeatureDetail[i];
              let value = '';
              let value_code = '';
              let desc = '';
              this.counter = 0;
              if (this.routing_detail_data.length > 0) {
                this.counter = this.routing_detail_data.length
              }
              this.counter++;

              let open_allow = true;
              let open_allow_show = true;
              if (featuredata.OPTM_TYPE == 1) {
                value = (featuredata.OPTM_CHILDFEATUREID).toString();
                value_code = featuredata.child_code;
                if (featuredata.OPTM_ACCESSORY == 'Y' || featuredata.OPTM_ACCESSORY == 'y') {
                  open_allow = false;
                  open_allow_show = false
                }
              } else if (featuredata.OPTM_TYPE == 2) {
                value = (featuredata.OPTM_ITEMKEY).toString();
                value_code = featuredata.OPTM_ITEMKEY;
              } else if (featuredata.OPTM_TYPE == 3) {
                value = (featuredata.OPTM_VALUE).toString();
                value_code = featuredata.OPTM_VALUE;
                open_allow = false;
                open_allow_show = false;
              }
              desc = featuredata.OPTM_DISPLAYNAME;
              this.routing_detail_data.push({
                lineno: this.counter,
                rowindex: this.counter,
                type: featuredata.OPTM_TYPE,
                type_value: (value),
                type_value_code: (value_code).toString(),
                description: desc,
                operation_top_level: false,
                oper_id: '',
                oper_code: '',
                oper_desc: '',
                oper_type: '',
                oper_consumption_method: '',
                oper_consumption_method_str: '',
                wc_id: '',
                wc_code: '',
                mtq: '1',
                count_point_operation: false,
                auto_move: false,
                effective_date: temp_effective_date,
                queue_time: '00:00',
                move_time: '00:00',
                qc_time: '00:00',
                time_uom: '1',
                opn_application: open_allow,
                isTypeDisabled: true,
                showOperationbtn: false,
                count_point_operation_disabled: false,
                isOpenApplicableVisible: open_allow_show,
                unique_key: this.commonData.random_string(55)
              });
            }
            this.showLookupLoader = false;
          } else {
            this.showLookupLoader = false;
            this.clearInvalidfeature();
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          }
        }, error => {
          this.showLookupLoader = false;
          this.clearInvalidfeature();
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
          if (data != undefined && data.LICDATA != undefined) {
            if (data.LICDATA[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
          console.log(data);
          /*if(navigate_to_header == true) {
            data.ModelHeader =[];
          }
          if(data.ModelHeader.length == 0) {
            if (navigate_to_header == true) {
              console.log('===true=====');
              console.log('====modal_code===',modal_code);
              this.route.navigateByUrl('feature/model/edit/'+modal_code);
            } else {
              console.log('===false===');
              this.route.navigateByUrl('modelbom/view');
            }
          }*/
          if (data.ModelDetail.length > 0) {
            for (let i = 0; i < data.ModelDetail.length; ++i) {
              let modeldata = data.ModelDetail[i];
              let value = '';
              let value_code = '';
              let desc = '';
              this.counter = 0;
              if (this.routing_detail_data.length > 0) {
                this.counter = this.routing_detail_data.length
              }
              this.counter++;
              let temp = new Date(this.routing_header_data.EffectiveDate);
              let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
              let open_allow = true;
              let open_allow_show = true;

              if (modeldata.OPTM_TYPE == 1) {
                value = (modeldata.OPTM_FEATUREID).toString();
                value_code = modeldata.feature_code;
                console.log('in here ', modeldata.OPTM_TYPE, 'vlaue ', value_code, ' accessory ', modeldata.Accessory);
                if (modeldata.Accessory == 'Y' || modeldata.Accessory == 'y') {
                  open_allow = false;
                  open_allow_show = false;
                }

              } else if (modeldata.OPTM_TYPE == 2) {
                value = (modeldata.OPTM_ITEMKEY).toString();
                value_code = modeldata.OPTM_ITEMKEY;
              } else if (modeldata.OPTM_TYPE == 3) {
                value = (modeldata.OPTM_CHILDMODELID).toString();
                value_code = modeldata.child_code;
              }
              desc = modeldata.OPTM_DISPLAYNAME;
              this.routing_detail_data.push({
                lineno: this.counter,
                rowindex: this.counter,
                type: modeldata.OPTM_TYPE,
                type_value: (value),
                type_value_code: (value_code).toString(),
                description: desc,
                operation_top_level: '',
                oper_id: '',
                oper_code: '',
                oper_desc: '',
                oper_type: '',
                oper_consumption_method: '',
                oper_consumption_method_str: '',
                wc_id: '',
                wc_code: '',
                mtq: '1',
                count_point_operation: false,
                auto_move: false,
                effective_date: temp_effective_date,
                queue_time: '00:00',
                move_time: '00:00',
                qc_time: '00:00',
                time_uom: '1',
                opn_application: open_allow,
                isTypeDisabled: true,
                showOperationbtn: false,
                count_point_operation_disabled: false,
                isOpenApplicableVisible: open_allow_show,
                unique_key: this.commonData.random_string(55)
              });
            }
            this.showLookupLoader = false;
          } else {
            this.showLookupLoader = false;
            this.clearInvalidModel();
            this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);

          }
        }, error => {
          this.showLookupLoader = false;
          this.clearInvalidModel();
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
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
        }
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
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
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
    this.serviceData = []
    this.service.TemplateRoutingList().subscribe(
      data => {
        /*  if (data != undefined) {
           if (data.length > 0) {
             if (data[0].ErrorMsg == "7001") {
               this.commonService.RemoveLoggedInUser().subscribe();
               this.commonService.signOut(this.toastr, this.route);
               this.showLookupLoader = false;
               return;
             }
           }
         } */
        if (data.length > 0) {
          this.lookupfor = 'template_routing_lookup';
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
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
        }
        if (data.length > 0) {
          this.current_grid_action_row = this.getGridCurrentRow(rowindex);
          this.lookupfor = 'operation_lookup';
          this.showLookupLoader = false;
          let temp_data_arr = [];
          console.log("commonData - ", this.commonData.operation_type);
          for (var ii = 0; ii < data.length; ii++) {
            data[ii].operTypeStr = this.commonData.operation_type[data[ii].OPRType];
            temp_data_arr.push(data[ii]);

          }
          console.log(temp_data_arr);
          this.serviceData = temp_data_arr;

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
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              this.showLookupLoader = false;
              return;
            }
          }
        }
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

  getOperationResourceDetail(oper_code, oper_type, oper_consumption_type, rowindex, operation_line_unique_key, callback) {
    this.showLookupLoader = true;
    if (this.routing_detail_resource_data[rowindex] == undefined || this.routing_detail_resource_data[rowindex].length > 0) {
      this.routing_detail_resource_data[rowindex] = [];
    }
    this.service.getOperationResource(oper_code).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              return;
            }
          }
        }

        if (data.length > 0) {
          let operData = [];
          let localhcounter;
          for (let i = 0; i < data.length; ++i) {
            localhcounter = 0;
            if (this.routing_detail_resource_data.length > 0) {
              localhcounter = this.routing_detail_resource_data.length
            }
            localhcounter++;
            data[i].lineno = localhcounter;
            data[i].rowindex = localhcounter;
            data[i].unique_key = operation_line_unique_key;
            data[i].resource_consumption_type = '1';
            data[i].basis = '1';
            data[i].schedule = false;
            data[i].oper_consumption_method = oper_consumption_type;
            data[i].oper_type = oper_type;
            operData.push(data[i]);
          }
          this.routing_detail_resource_data[rowindex] = operData;
        }
        if (callback != "" || callback !== undefined) {
          callback();
        }
      },
      error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        if (callback != "" || callback !== undefined) {
          callback();
        }
        return;
      }
    );
  }

  open_operation_resources(flag) {
    if (Object.keys(this.current_selected_row).length > 0) {
      if (this.current_selected_row.oper_code != "") {
        this.showLookupLoader = true;
        // service call for operation wise resource 
        this.serviceData = [];
        /*  this.service.getOperationResource(this.current_selected_row.oper_code).subscribe(
           data => { */
        this.serviceData.oper_code = this.current_selected_row.oper_code;
        this.serviceData.wc_code = this.current_selected_row.wc_code;
        this.serviceData.unique_key = this.current_selected_row.unique_key;
        this.serviceData.oper_res = (this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] != undefined) ? this.routing_detail_resource_data[(this.current_selected_row.rowindex - 1)] : [];
        this.lookupfor = 'routing_resource_lookup';
        this.showLookupLoader = false;


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
    let temp = new Date(picker_date);
    this.routing_header_data.EffectiveDate = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
  }

  confirm_override_grid_effective_date() {
    this.dialog_params.push({ 'dialog_type': 'confirmation', 'message': this.language.confirm_override_detials_effective_date });
    this.show_dialog = true;
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {

    if (this.is_delete_called == true) {
      if (userSelectionValue == true) {
        this.onDelete(this.update_id);
      }
      this.show_dialog = false;
      this.is_delete_called = false;
    } else {
      console.log('in get_dialog_value', userSelectionValue);
      if (userSelectionValue == true) {
        this.over_ride_grid_effective_date();
      }
      this.show_dialog = false;

    }

  }

  over_ride_grid_effective_date() {
    console.log('in over_ride_grid_effective_date');
    let temp = new Date(this.routing_header_data.EffectiveDate);
    let temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    // let temp_effective_date = new Date(temp.getFullYear(), (temp.getMonth()), temp.getDate());
    for (let i = 0; i < this.routing_detail_data.length; ++i) {
      this.routing_detail_data[i].effective_date = temp_effective_date;
    }
  }

  validate_header_info() {
    var output: any = '1';
    if (this.routing_header_data.routing_for == 'feature') {
      if (this.routing_header_data.feature_code == "" || this.routing_header_data.feature_code == undefined || this.routing_header_data.feature_code == null) {
        this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
        output = '0';
      }
    } else if (this.routing_header_data.routing_for == 'model') {
      if (this.routing_header_data.modal_code == "" || this.routing_header_data.modal_code == undefined || this.routing_header_data.modal_code == null) {
        this.toastr.error('', this.language.ModelCodeBlank, this.commonData.toast_config);
        output = '0';
      } else {
        if (this.routing_header_data.warehouse_code == "" || this.routing_header_data.warehouse_code == undefined || this.routing_header_data.warehouse_code == null) {
          this.toastr.error('', this.language.warehouseCodeBlank, this.commonData.toast_config);
          output = '0';
        }
      }
    }
    return output;
  }


  insert_new_operation(type) { // type = insert || type = add
    if (this.validate_header_info() == '0') {
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

    let current_row_index = 0;
    if (type == 'insert') {
      current_row_index = this.current_selected_row.rowindex;
      this.counter = current_row_index + 1;
      let row_shift_counter = 0;
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex > current_row_index) {
          this.routing_detail_data[i].rowindex = this.routing_detail_data[i].rowindex + 1;
          this.routing_detail_data[i].lineno = this.routing_detail_data[i].lineno + 1;
        }
      }

    }


    let temp_d = new Date(this.routing_header_data.EffectiveDate);
    let temp_effective_date = new Date((temp_d.getMonth() + 1) + '/' + temp_d.getDate() + '/' + temp_d.getFullYear());
    let new_row = {
      lineno: this.counter,
      rowindex: this.counter,
      type: '4',
      type_value: "",
      type_value_code: "",
      description: '',
      operation_top_level: '',
      oper_id: '',
      oper_code: '',
      oper_desc: '',
      oper_type: '',
      oper_consumption_method: '',
      wc_id: '',
      wc_code: '',
      mtq: '1',
      count_point_operation: false,
      auto_move: false,
      effective_date: temp_effective_date,
      queue_time: '00:00',
      move_time: '00:00',
      qc_time: '00:00',
      time_uom: '1',
      opn_application: true,
      isTypeDisabled: true,
      showOperationbtn: true,
      isOpenApplicableVisible: false,
      count_point_operation_disabled: false,
      unique_key: this.commonData.random_string(55)
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
    let currentrow = 0;
    if (this.routing_detail_data.length > 0) {
      for (let i = 0; i < this.routing_detail_data.length; ++i) {
        if (this.routing_detail_data[i].rowindex === rowindex) {
          currentrow = i;
        }
      }
    }
    return currentrow
  }

  clearInvalidOperationData(currentrow) {

    if (this.routing_detail_resource_data[currentrow] != undefined) {
      this.routing_detail_resource_data[currentrow] = [];
    }
    this.routing_detail_data[currentrow].oper_id = "";
    this.routing_detail_data[currentrow].oper_code = "";
    this.routing_detail_data[currentrow].oper_desc = "";
    this.routing_detail_data[currentrow].oper_type = "";
    this.routing_detail_data[currentrow].oper_consumption_method = "";
    this.routing_detail_data[currentrow].count_point_operation = false;
    this.routing_detail_data[currentrow].count_point_operation_disabled = false;
    $(".row_oper_id").eq(currentrow).val("");
    $(".row_oper_code").eq(currentrow).val("");
    this.routing_detail_data[currentrow].wc_id = "";
    this.routing_detail_data[currentrow].wc_code = "";
    $(".row_wc_id").eq(currentrow).val("");
    $(".row_wc_code").eq(currentrow).val("");
  }


  on_input_change(value, rowindex, grid_element) {
    let currentrow = 0;
    currentrow = this.getGridCurrentRow(rowindex);
    if (grid_element == 'selected_type') {
      this.routing_detail_data[currentrow].selected_type = value;
    }

    if (grid_element == 'type_value_code') {
      this.routing_detail_data[currentrow].type_value_code = (value).toString();
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
            if (data != undefined) {
              if (data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  this.commonService.RemoveLoggedInUser().subscribe();
                  this.commonService.signOut(this.toastr, this.route);
                  this.showLookupLoader = false;
                  return;
                }
              }
            }

            if (data.length > 0) {
              if (currentrow == 0 && data[0].OPRType == '4') {
                this.toastr.error('', this.language.firstOperationInspectionQC, this.commonData.toast_config);
                this.clearInvalidOperationData(currentrow);
                this.showLookupLoader = false;
                return;
              }

              let lastRowIndex = (this.routing_detail_data.length - 1);
              if (lastRowIndex == currentrow) { // last row 
                if (data[0].OPRType == '1') {
                  this.toastr.error('', this.language.lastOperSetup, this.commonData.toast_config);
                  this.clearInvalidOperationData(currentrow);
                  this.showLookupLoader = false;
                  return;
                }
              }

              this.routing_detail_data[currentrow].oper_id = data[0].OPRCode;
              this.routing_detail_data[currentrow].oper_code = data[0].OPRCode;
              this.routing_detail_data[currentrow].oper_desc = data[0].OPRDesc;
              this.routing_detail_data[currentrow].oper_consumption_method = data[0].OPRConsumMthd;
              this.routing_detail_data[currentrow].oper_consumption_method_str = this.commonData.res_consumption_method[data[0].OPRConsumMthd];

              this.routing_detail_data[currentrow].oper_type = data[0].OPRType;
              this.routing_detail_data[currentrow].wc_id = data[0].DfltWCCode;
              this.routing_detail_data[currentrow].wc_code = data[0].DfltWCCode;

              this.routing_detail_data[currentrow].count_point_operation = false;
              this.routing_detail_data[currentrow].count_point_operation_disabled = false;

              if (data[0].OPRType == '4' || data[0].OPRType == '5') {

                this.routing_detail_data[currentrow].count_point_operation = true;
                this.routing_detail_data[currentrow].count_point_operation_disabled = true;
              }
              this.getOperationResourceDetail(data[0].OPRCode, data[0].OPRType, data[0].OPRConsumMthd, currentrow, this.routing_detail_data[currentrow].unique_key, function () { });
            } else {
              this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
              this.clearInvalidOperationData(currentrow);
              this.showLookupLoader = false;
              return;
            }
          } else {
            this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
            this.clearInvalidOperationData(currentrow);
            this.showLookupLoader = false;
            return;
          }
        }, error => {
          this.toastr.error('', this.language.invalidOperationcodeRow + ' ' + rowindex, this.commonData.toast_config);
          this.clearInvalidOperationData(currentrow);
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

            if (data != undefined) {
              if (data.length > 0) {
                if (data[0].ErrorMsg == "7001") {
                  this.commonService.RemoveLoggedInUser().subscribe();
                  this.commonService.signOut(this.toastr, this.route);
                  this.showLookupLoader = false;
                  return;
                }
              }
            }
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
      if (value == 0 && value != '') {
        value = 1;
        this.toastr.error('', this.language.mtq_cannot_be_blank_zero + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
      }
      else {
        let rgexp = /^\d+$/;
        if (isNaN(value) == true) {
          value = 1;
          this.toastr.error('', this.language.mtq_valid_number, this.commonData.toast_config);
        } else if (value == 0 || value == '' || value == null || value == undefined) {
          value = 1;
          this.toastr.error('', this.language.mtq_cannot_be_blank_zero + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        } else if (value < 0) {
          value = 1;
          this.toastr.error('', this.language.mtq_value_nagative + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        } else if (rgexp.test(value) == false) {
          value = 1;
          this.toastr.error('', this.language.mtq_value_decimal + ' ' + this.language.at_row + ' ' + rowindex, this.commonData.toast_config);
        }
      }
      this.routing_detail_data[currentrow].mtq = value;
      $(".mtq_grid_level").eq(currentrow).val(value);
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
      let temp = new Date(value);
      this.routing_detail_data[currentrow].effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());
    }

    if (grid_element == 'queue_time') {

      this.routing_detail_data[currentrow].queue_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'move_time') {
      this.routing_detail_data[currentrow].move_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'qc_time') {
      this.routing_detail_data[currentrow].qc_time = this.format_time_in_hh_mm(value);
    }

    if (grid_element == 'time_uom') {
      this.routing_detail_data[currentrow].queue_time = "00:00";
      this.routing_detail_data[currentrow].move_time = "00:00";
      this.routing_detail_data[currentrow].qc_time = "00:00";
      this.routing_detail_data[currentrow].time_uom = value;
    }

    if (grid_element == 'opn_application') {
      if (value == false) {
        this.routing_detail_data[currentrow].oper_top_level = value;
        this.routing_detail_data[currentrow].oper_id = "";
        this.routing_detail_data[currentrow].oper_code = "";
        this.routing_detail_data[currentrow].oper_desc = "";
        this.routing_detail_data[currentrow].wc_id = "";
        this.routing_detail_data[currentrow].wc_code = "";
        this.routing_detail_data[currentrow].mtq = 1;
        this.routing_detail_data[currentrow].auto_move = value;
        this.routing_detail_data[currentrow].count_point_operation_disabled = value;
        this.routing_detail_data[currentrow].queue_time = "00:00";
        this.routing_detail_data[currentrow].move_time = "00:00";
        this.routing_detail_data[currentrow].qc_time = "00:00";
        this.routing_detail_data[currentrow].time_uom = "";
      }
      this.routing_detail_data[currentrow].opn_application = value;
    }

    console.log("this.routing_detail_data ", this.routing_detail_data);
    console.log("this.routing_detail_resource_data[oper_code]", this.routing_detail_resource_data);
  }

  format_time_in_hh_mm(value) {
    if (value == "") {
      return "00:00";
    }
    if (!/:/.test(value)) { value += ':00'; }
    return value.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0');
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
    if (this.validate_header_info() == '0') {
      return false;
    }

    if (this.routing_header_data.use_template_routing == true && (this.routing_header_data.template_routing_code == "" || this.routing_header_data.template_routing_code == undefined)) {
      this.toastr.error('', this.language.please_select_template_routing, this.commonData.toast_config);
      return;
    }

    if (this.routing_detail_data.length > 0 && this.routing_detail_data != undefined) {
      for (let DetailIndex = 0; DetailIndex < this.routing_detail_data.length; DetailIndex++) {
        if (this.routing_detail_data[DetailIndex].oper_top_level == true) {
          if (this.routing_detail_data[DetailIndex].oper_code == undefined || this.routing_detail_data[DetailIndex].oper_code == null || this.routing_detail_data[DetailIndex].oper_code == '') {
            this.toastr.error('', this.language.operationmandatoryTopLevel + ' ' + (DetailIndex + 1), this.commonData.toast_config);
            return;
          }
        }
      }
    }

    if (this.routing_header_data.opm_num_format == '' || this.routing_header_data.opm_num_format == null || this.routing_header_data.opm_num_format == undefined) {
      this.toastr.error('', this.language.opn_num_format_blank, this.commonData.toast_config);
      return;
    } else {
      if (this.routing_header_data.opm_num_format == 0) {
        this.toastr.error('', this.language.opn_num_format_zero, this.commonData.toast_config);
        return;
      }
    }

    let objDataset: any = {};
    console.log(this.routing_header_data);
    console.log(this.routing_detail_data);

    // initialize
    objDataset.Connection = [];
    objDataset.Header = [];
    objDataset.Detail = [];
    objDataset.DetailResource = [];

    // override above array  
    objDataset.Connection.push({
      "loggedInUser": sessionStorage.getItem('loggedInUser'),
      "CompanyDBID": sessionStorage.getItem('selectedComp'),
      "GUID": sessionStorage.getItem("GUID"),
      "UsernameForLic": sessionStorage.getItem("loggedInUser"),
      "mode": this.form_mode
    });
    if (Object.keys(this.routing_header_data).length > 0) {
      let use_mtq_in_planing;
      if (this.routing_header_data.use_mtq_in_planing == true) {
        use_mtq_in_planing = 'Y';
      } else {
        use_mtq_in_planing = 'N';
      }
      let use_template_routing;
      if (this.routing_header_data.use_template_routing == true) {
        use_template_routing = 'Y';
      } else {
        use_template_routing = 'N';
      }
      objDataset.Header.push({
        EffectiveDate: this.routing_header_data.EffectiveDate,
        applicable_bom_unit: this.routing_header_data.applicable_bom_unit,
        default_batch_size: this.routing_header_data.default_batch_size,
        default_lot_size: this.routing_header_data.default_lot_size,
        feature_code: this.routing_header_data.feature_code,
        feature_description: this.routing_header_data.feature_description,
        feature_id: this.routing_header_data.feature_id,
        modal_code: this.routing_header_data.modal_code,
        modal_description: this.routing_header_data.modal_description,
        modal_id: this.routing_header_data.modal_id,
        opm_num_format: this.routing_header_data.opm_num_format,
        routing_for: this.routing_header_data.routing_for,
        template_routing_code: this.routing_header_data.template_routing_code,
        template_routing_id: this.routing_header_data.template_routing_id,
        use_mtq_in_planing: use_mtq_in_planing,
        use_template_routing: use_template_routing,
        warehouse_code: this.routing_header_data.warehouse_code,
        warehouse_id: this.routing_header_data.warehouse_id,
      });
    }

    let routing_detail_tmp_arr = [];
    if (this.routing_detail_data.length > 0 && this.routing_detail_data != undefined) {
      for (let resOper = 0; resOper < this.routing_detail_data.length; resOper++) {
        let oper_arr_data = this.routing_detail_data[resOper];
        if (oper_arr_data.operation_top_level == true) {
          oper_arr_data.operation_top_level = 'Y';
        } else {
          oper_arr_data.operation_top_level = 'N';
        }

        /* if (oper_arr_data.oper_type == true) {
          oper_arr_data.oper_type = 'N';
        } else {
          oper_arr_data.oper_type = 'Y';
        } */

        if (oper_arr_data.count_point_operation == true) {
          oper_arr_data.count_point_operation = 'Y';
        } else {
          oper_arr_data.count_point_operation = 'N';
        }

        if (oper_arr_data.auto_move == true) {
          oper_arr_data.auto_move = 'Y';
        } else {
          oper_arr_data.auto_move = 'N';
        }
        /*
        if (oper_arr_data.use_template_routing == true) {
          oper_arr_data.time_uom = 'Y';
        } else{
          oper_arr_data.time_uom = 'N';          
        } */

        if (oper_arr_data.opn_application == true) {
          oper_arr_data.opn_application = 'Y';
        } else {
          oper_arr_data.opn_application = 'N';
        }
        routing_detail_tmp_arr.push(oper_arr_data);
      }
    }

    let routing_detail_res_tmp_arr = [];
    if (this.routing_detail_resource_data.length > 0 && this.routing_detail_resource_data != undefined) {
      for (let resi = 0; resi < this.routing_detail_resource_data.length; resi++) {
        if (this.routing_detail_resource_data[resi] !== undefined && this.routing_detail_resource_data[resi] !== "") {
          let res_arr_data = this.routing_detail_resource_data[resi];
          for (let resd = 0; resd < res_arr_data.length; resd++) {
            res_arr_data[resd].schedule = 0;
            if (res_arr_data[resd].schedule == true) {
              res_arr_data[resd].schedule = 1;
            }
            routing_detail_res_tmp_arr.push(res_arr_data[resd]);
          }
        }
      }
    }

    this.showLookupLoader = true;
    objDataset.Detail = routing_detail_tmp_arr;
    objDataset.DetailResource = routing_detail_res_tmp_arr;

    console.log("objDataset ", objDataset);
    this.service.SaveUpdateRouting(objDataset).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          this.commonService.RemoveLoggedInUser().subscribe();
          this.commonService.signOut(this.toastr, this.route);
          return;
        }

        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('routing/view');
        } else {
          if (data == "AlreadyExist") {
            this.toastr.error('', this.language.routing_for + ' ' + this.language.this + ' ' + this.routing_header_data.routing_for + ' ' + this.language.alreadyExist, this.commonData.toast_config);
            return;
          } else {
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
            return;
          }

        }
      }, error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        this.showLookupLoader = false;
      }
    )
  }


  deleteConfirm() {
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    this.is_delete_called = true;
  }

  onDelete(model_feature_id) {
    this.showLookupLoader = true;
    this.service.DeleteRouting(model_feature_id).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data != undefined) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route);
              return;
            }
          }
        }

        if (data === "True") {
          this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
          this.route.navigateByUrl('routing/view');
        } else {
          this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        this.showLookupLoader = false;
      }
    )
  }


  // navigation functions - start

  navigateToFeatureModelHeader(type) {
    var type_value = type.trim();
    if (type_value == 'feature') {
      this.route.navigateByUrl('feature/model/edit/' + this.routing_header_data.feature_id);
    } else if (type_value == 'model') {
      this.route.navigateByUrl('feature/model/edit/' + this.routing_header_data.modal_id);
    }
  }
  navigateToFeatureOrModelBom(type_value, type) {
    if (type == '1') {
      this.route.navigateByUrl("feature/bom/edit/" + type_value);
    } else if (type == '3') {
      this.route.navigateByUrl("modelbom/edit/" + type_value);
      /*this.GetDataByModelId(this.routing_header_data.modal_id, 'header', 0,true);*/
    }
  }

  // navigation functions - end
}
