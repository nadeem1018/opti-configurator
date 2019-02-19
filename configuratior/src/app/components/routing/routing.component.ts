import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RoutingService } from '../../services/routing.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

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
  public currentrowindex: number;
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
  language = JSON.parse(sessionStorage.getItem('current_lang'));

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
      this.show_resource_btn = false;
      this.routing_header_data.default_batch_size = 1;
      this.routing_header_data.default_lot_size = 1;
      this.routing_header_data.applicable_bom_unit = 1;
    } else {
      this.isSaveButtonVisible = false;
      this.isUpdateButtonVisible = true;
      this.isDeleteButtonVisible = true;
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
    }

  }

  on_operation_change() {
    if (this.routing_header_data.routing_for == 'feature') {
      this.show_resequence_btn = false;
      this.show_resource_btn = false;
      this.type_dropdown = this.commonData.bom_type;
      this.routing_detail_data = [];
      this.grid_option_title = this.language.Bom_FeatureValue;
    } else if (this.routing_header_data.routing_for == 'model') {
      this.show_resequence_btn = true;
      this.show_resource_btn = true;
      this.type_dropdown = this.commonData.model_bom_type;
      this.routing_detail_data = [];
      this.grid_option_title = this.language.ModelBom_FeatureValue;
    }
  }

  header_numeric_input_change(value, input_id){
    if (value == 0) {
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
 

  openFeatureLookup(flag) {

  }

  openModalLookup(flag) {

  }

  openWarehouseLook(flag) {

  }

  getFeatureDetail(feature_code) {

  }

  getModalDetail(modal_code) {

  }

  getWarehouseDetails(warehouse_code) {

  }

  openTemplateRoutingLookup(flag) {

  }

  getTemplateRoutingDetails(template_code) {

  }

  on_type_click_lookup(type, rowindex){

  }

  open_operation_lookup(type, rowindex) {
  }

  open_wc_lookup(type, rowindex) {
  }

  resequence_operation(){

  }

  open_resource_lookup(flag){
    this.showLookupLoader = true;
    this.serviceData = []
    this.lookupfor = 'routing_resource_lookup';
  }


  getLookupValue($event) {

  }



  changeEffectiveDate(picker_date) {
    var temp = new Date(picker_date);
    this.routing_header_data.EffectiveDate = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());

  }


  insert_new_operation() {
    this.counter = 0;
    if (this.routing_detail_data.length > 0) {
      this.counter = this.routing_detail_data.length
    }
    this.counter++;

    var temp = new Date();
    var temp_effective_date = new Date((temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear());

    this.routing_detail_data.push({
      lineno: this.counter,
      rowindex: this.counter,
      type: '1',
      type_value: "",
      operation_top_level: '',
      oper_id: '',
      oper_code: '',
      oper_desc: '',
      wc_id: '',
      wc_code: '',
      mtq: '1',
      count_point_operation: '',
      auto_move: '',
      effective_date: temp_effective_date,
      queue_time: '00:00',
      move_time: '00:00',
      qc_time: '00:000',
      time_uom: '',
      opn_application: '',
      isTypeDisabled: false,
      showOperationbtn: true,
    });
  }

 

  on_input_change(value, rowindex, grid_element) {
    var currentrow = 0;
    for (let i = 0; i < this.routing_detail_data.length; ++i) {
      if (this.routing_detail_data[i].rowindex === rowindex) {
        currentrow = i;
      }
    }
    console.log(currentrow);
    if (grid_element == 'selected_type') {

    }

    if (grid_element == 'type_value_code') {

    }

    if (grid_element == 'description') {

    }

    if (grid_element == 'oper_top_level') {

    }

    if (grid_element == 'oper_code') {

    }

    if (grid_element == 'oper_desc') {

    }

    if (grid_element == 'wc_code') {

    }

    if (grid_element == 'mtq') {

    }

    if (grid_element == 'count_point_operation') {

    }

    if (grid_element == 'auto_move') {

    }

    if (grid_element == 'effective_date') {

    }

    if (grid_element == 'queue_time') {

    }

    if (grid_element == 'move_time') {

    }

    if (grid_element == 'qc_time') {

    }

    if (grid_element == 'time_uom') {

    }

    if (grid_element == 'opn_application') {

    }
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
    }
  }

  onSave() {

  }

  onDelete() {

  }


}
