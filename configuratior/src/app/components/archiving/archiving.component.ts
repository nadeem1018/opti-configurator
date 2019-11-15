import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ArchivingService } from '../../services/archiving.service';
import { ActivatedRoute, Router } from '@angular/router'
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-archiving',
  templateUrl: './archiving.component.html',
  styleUrls: ['./archiving.component.scss']
})
export class ArchivingComponent implements OnInit {
  public language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/home';
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: ArchivingService, private toastr: ToastrService, private commonService: CommonService) { }

  page_main_title = this.language.configuration_archive
  serviceData: any;
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;
  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;
  public min_date;
  public filter_section_data: any = [];
  public grid_section_data: any = [];
  public doctype: any = "";
  public row_selection: number[] = [];
  public current_grid_action_row: number = 0;
  public current_selected_row: any = [];
  public selectableSettings: any = [];
  public selectbuttonText = '';
  public selectButtonIcon = ''; 
  public lookupfor = '';
  public selectedImage = '';
  public order_status_types = [];

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

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public dialog_box_value: any;

  ngOnInit() {
    let date_obj = new Date();
    this.min_date = new Date(date_obj.setDate(date_obj.getDate() - 1));
    this.isUpdateButtonVisible = false;
    this.isSaveButtonVisible = true;
    this.isDeleteButtonVisible = false;
    var current_date = new Date();
    this.filter_section_data.to_date = (new Date((current_date.getMonth() + 1) + '/' + (current_date.getDate()) + '/' + current_date.getFullYear()));
    current_date.setDate(current_date.getDate() - 1);
    this.filter_section_data.from_date = (new Date((current_date.getMonth() + 1) + '/' + (current_date.getDate()) + '/' + current_date.getFullYear()));
    this.filter_section_data.date_range = [this.filter_section_data.from_date, this.filter_section_data.to_date];
    this.showLoader = false;
    this.selectableSettings = {
      mode: 'multiple'
    };

    let doc_type_values = this.commonData.document_type();
    this.doctype = [doc_type_values[1], doc_type_values[2], { "value": 'both', "Name": this.language.both, "selected": "0" }];
    this.doctype[2].selected = '1';
    this.filter_section_data.doc_type = 'both';
    this.filter_section_data.order_status = 'processed';
    this.order_status_types = [
    { "value": 'draft', "name": this.language.draft },
    { "value": 'pending', "name": this.language.pending_status },
    { "value": 'error', "name": this.language.error_status },
    { "value": 'processed', "name": this.language.process_status }
    ];

    this.grid_section_data.push({
      rowindex: 1,
      config_id: '1250',
      config_desc: 'Test with routing',
      doc_type: '17',
      ref_doc_entry: '45',
      models: ('Moto z2 play, Dell G-series laptop'),
      fg_item: ('Moto_0001, Dell_200'),
      doc_date: '2019/12/2',
      gross_total: "$" + parseFloat('85203.1').toFixed(3),
    });

    this.grid_section_data.push({
      rowindex: 2,
      config_id: '1251',
      config_desc: 'Test without routing',
      doc_type: '23',
      ref_doc_entry: '46',
      models: ('Moto z2 play, Dell G-series laptop'),
      fg_item: ('Moto_0001, Dell_200'),
      doc_date: '2019/12/2',
      gross_total: "$" + parseFloat('55210.1').toFixed(3),
    });


    this.selectButtonTextIconChange(1);
    this.get_all_model_list();
   /* this.service.get_all_model_list().subscribe(
      data => {
        if (data.length > 0) {}
      });*/
  }

  getLookupValue($event) {

  }


  date_range(date_range_value) {
    this.filter_section_data.date_range = date_range_value;
    this.filter_section_data.from_date = date_range_value[0];
    this.filter_section_data.to_date = date_range_value[1];
  }

  selectButtonTextIconChange(flag){
    if(flag == 1){ // show selected
      this.selectbuttonText = this.language.select_all;
      this.selectButtonIcon = 'fa fa-check-circle';
    } else if (flag == 2) { // clear selection
      this.selectbuttonText = this.language.clear_selection;
      this.selectButtonIcon = 'fa fa-minus';
    }

  }

  getSelectedRowDetail(event) {
    console.log("event - ", event);
    if (event.selectedRows.length > 0) {
      this.current_selected_row.push(event.selectedRows[0].dataItem);
      this.selectButtonTextIconChange(2);
    }

    if (event.deselectedRows.length > 0) {
      let rem_row_index = this.current_selected_row.findIndex(function (obj) {
        return (obj.rowindex == event.deselectedRows[0].dataItem.rowindex);
      });
      this.current_selected_row.splice(rem_row_index, 1);
    }

    if (this.current_selected_row.length == 0) {
      this.selectButtonTextIconChange(1);
      this.current_selected_row = [];
    }
  }

  select_all_data() {
    let temp_data = this.grid_section_data;
    if (this.current_selected_row.length > 0) {
      this.current_selected_row = [];
      this.row_selection = [];
      this.selectButtonTextIconChange(1);
    } else {
      this.current_selected_row = temp_data
      let row_index_arr = temp_data.map(function (obj) { return obj.rowindex });
      console.log("row_index_arr - ", row_index_arr);
      this.row_selection = row_index_arr;
      this.selectButtonTextIconChange(2);
    }

  }

  clear_model_list(){
    this.filter_section_data.model_list = [];
  }

  get_all_model_list() {
    this.showLookupLoader = true;
    this.clear_model_list();
    this.service.get_all_model_list().subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {

            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
            var temp = []; 
            for (var i = 0; i < data.length; i++) {
              temp.push(data[i]['OPTM_FEATURECODE']);
            }
            this.filter_section_data.model_list= temp ;
            this.showLookupLoader = false;

          } else {
            this.clear_model_list();
            this.showLookupLoader = false;
            return;
          }
        } else {
          this.clear_model_list();
          this.showLookupLoader = false;
          return;
        }
      }, error => {
        this.clear_model_list();
        this.showLookupLoader = false;
        return;
      }
      );
  }

  clear_filter_results(show_msg){
    this.grid_section_data = [];
    this.current_selected_row = [];
    this.row_selection = [];
    this.selectButtonTextIconChange(1);

    if(show_msg == 1){
      this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
    }
  }

  filter_results() {
    this.showLookupLoader = true;
    this.clear_filter_results(0);
    if (this.filter_section_data.config_desc == undefined || this.filter_section_data.config_desc == null){
      this.filter_section_data.config_desc = '';
    } 

    if (this.filter_section_data.selected_models == undefined || this.filter_section_data.selected_models == null) {
      this.filter_section_data.selected_models = [];
    } 
    console.log("this.filter_section_data ", this.filter_section_data);
    this.service.filter_results(this.filter_section_data).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            // here goes the result processing 
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
          } else {
            this.clear_filter_results(1);
            this.showLookupLoader = false;
            return;
          }
        } else {
          this.clear_filter_results(1);
          this.showLookupLoader = false;
          return;
        }
      }, error => {
        this.clear_filter_results(1);
        this.showLookupLoader = false;
        return;
      }
      );

  }

  clear_archived_data_search(){

  }

  archive_data() {

    this.showLookupLoader = true;
    let temp_array = [];
    this.service.archive_data(temp_array).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          if (data.length > 0) {
            if (data[0].ErrorMsg == "7001") {
              this.showLookupLoader = false;
              this.commonService.RemoveLoggedInUser().subscribe();
              this.commonService.signOut(this.toastr, this.route, 'Sessionout');
              return;
            }
            // here goes the result processing 
          //  this.clear_archived_data_search();
          } else {
            this.showLookupLoader = false;
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }
        } else {
          this.showLookupLoader = false;
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLookupLoader = false;
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
      );
  }


  ondoc_type_change(selected_value){

  }


}
