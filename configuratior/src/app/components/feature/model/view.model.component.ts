import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../../helpers/ui.helpers';
//import { CustomDialogsComponent } from 'src/app/components/common/custom-dialogs/custom-dialogs.component'


@Component({
    selector: 'app-view-feature-model',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./model.component.scss']
})


export class ViewFeatureModelComponent implements OnInit {
    @ViewChild("searchinput") _el: ElementRef;
    common_params = new CommonData();
    public commonData = new CommonData();
    // generate table default constants
    table_pages: any;
    dataArray: any = [];
    search_key: any;
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    //table_head_foot = ['Select','#','Id','Code', 'Effective Date','Type', 'Display Name', 'Status', 'Action'];
    table_head_foot = [this.language.select, this.language.hash, this.language.Id, this.language.code, this.language.Bom_Displayname, this.language.Model_Date, this.language.Type, this.language.Model_Status, this.language.action];

    public columns: ColumnSetting[] = [
        {
          field: 'OPTM_FEATURECODE',
          title: this.language.code,
          type: 'text',
          width: '200'
        }, 
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Bom_Displayname,
            type: 'text',
            width: '200'
          },
          {
            field: 'OPTM_EFFECTIVEDATE',
            title: this.language.Model_Date,
            type: 'text',
            width: '100'
          },
        {
          field: 'OPTM_TYPE',
          title: this.language.Type,
          type: 'text',
          width: '100'      
        },    
        {
            field: 'OPTM_STATUS',
            title: this.language.Model_Status,
            type: 'text',
            width: '200'
          },    
      ];

    public table_hidden_elements = [false, true, true, false, false, false, false, false, false];
    record_per_page_list: any = this.common_params.default_limits;
    add_route_link = '/feature/model/add';
    page_main_title = this.language.model_feature_master;
    table_title = this.page_main_title;

    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = [];
    rows: any = "";
    public dataBind: any = "";
    CompanyDBId: string;

    constructor(private fms: FeaturemodelService, private router: Router, private toastr: ToastrService) { }
    show_table_footer: boolean = false;
    public lookupfor = '';
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public CheckedData: any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall: boolean = false;
    public isMultiDelete: boolean = false;
    public showImportButton:boolean = true;


    isMobile:boolean=false;
    isIpad:boolean=false;
    isDesktop:boolean=true;
    isPerfectSCrollBar:boolean = false;
  

    detectDevice(){
        let getDevice = UIHelper.isDevice();
        this.isMobile = getDevice[0];
        this.isIpad = getDevice[1];
        this.isDesktop = getDevice[2];
        if(this.isMobile==true){
        this.isPerfectSCrollBar = true;
        }else if(this.isIpad==true){
        this.isPerfectSCrollBar = false;
        }else{
        this.isPerfectSCrollBar = false;
        }
    }

    ngOnInit() {
        const element = document.getElementsByTagName("body")[0];
        element.className = "";
        this.detectDevice();
        element.classList.add("app_view-feature-model");
        element.classList.add("opti_body-main-module");
        element.classList.add('sidebar-toggled');
        this.commonData.checkSession();
        this.CompanyDBId = sessionStorage.getItem('selectedComp');
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        this.service_call(this.current_page, this.search_string);
    }
    ngAfterViewInit() {
        this._el.nativeElement.focus();
    }
    on_page_limit_change() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    search_results() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    service_call(page_number, search) {
        if(this.record_per_page!== undefined && sessionStorage.getItem('defaultRecords')){
            if(this.record_per_page !== sessionStorage.getItem('defaultRecords')){
                sessionStorage.setItem('defaultRecords', this.record_per_page);
            }
        } else {
            this.record_per_page = this.commonData.default_count;
            sessionStorage.setItem('defaultRecords', this.record_per_page);
        }
        var dataset = this.fms.getAllViewData(this.CompanyDBId, search, page_number, this.record_per_page).subscribe(
            data => {
                debugger
                console.log(data);
                this.dataArray = data;
                // dataset = JSON.parse(data);
                // this.rows = dataset[0];
                // let pages: any = Math.ceil(parseInt(dataset[1]) / parseInt(this.record_per_page));
                // if (parseInt(pages) == 0 || parseInt(pages) < 0) {
                //     pages = 1;
                // }
                // this.page_numbers = Array(pages).fill(1).map((x, i) => (i + 1));
                // if (page_number != undefined) {
                //     this.current_page = page_number;
                // }

                // if (search != undefined) {
                //     this.search_string = search;
                // }
            });
    }

    // action button values 
    show_button1: boolean = true;
    show_button2: boolean = true;

    button1_title = this.language.edit;
    button2_title = this.language.delete;

    button1_color = "btn-info";
    button2_color = "btn-danger";

    button1_icon = "fa fa-edit fa-fw";
    button2_icon = "fa fa-trash-o fa-fw";

    button_click1(data) {
        //alert(id)
        this.router.navigateByUrl('feature/model/edit/' + data.OPTM_FEATUREID);
    }

    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_FEATUREID;
        //var result = confirm(this.language.DeleteConfimation);

    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {
            if (this.isMultiDelete == false) {
                this.delete_row();
            }
            else {
                this.delete_multi_row();
            }
        }
        this.show_dialog = false;
    }
    //delete values
    delete_row() {
        this.GetItemData = []
        this.GetItemData.push({
            CompanyDBId: this.CompanyDBId,
            FEATUREID: this.row_id
        });
        this.fms.DeleteData(this.GetItemData).subscribe(
            data => {

                if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('feature/model/view');
                    return;
                }
                else if (data === "Exist") {
                    this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
                    return;
                }
                else {
                    this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    return;
                }
            }
        )
    }

    // for testing purpose 
    dummy_data() {
        let dd: any = {
            total_records: "50",
            data: [
                ["1", "Demo", "Desc", "2011/04/25"]
            ]

        };
        console.log(dd);
    }

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].FEATUREID == row_data) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            FEATUREID: row_data,
                            CompanyDBId: this.CompanyDBId
                        })
                    }
                    else {
                        this.CheckedData.splice(i, 1)
                    }
                }
            }
            if (isExist == 0) {
                this.CheckedData.push({
                    FEATUREID: row_data,
                    CompanyDBId: this.CompanyDBId
                })
            }
        }
        else {
            this.CheckedData.push({
                FEATUREID: row_data,
                CompanyDBId: this.CompanyDBId
            })
        }
    }

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = [];
        this.selectall = false

        if (checkedvalue == true) {
            this.selectall = true
            if (this.rows.length > 0) {
                for (let i = 0; i < this.rows.length; ++i) {

                    this.CheckedData.push({
                        FEATUREID: this.rows[i][1],
                        CompanyDBId: this.CompanyDBId
                    })
                }
            }
        }
        else {
            this.selectall = false
        }
    }

    delete() {
        if (this.CheckedData.length > 0) {
            this.isMultiDelete = true;
            this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
            this.show_dialog = true;
        }
        else {
            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }
    }

    delete_multi_row() { 
        this.fms.DeleteData(this.CheckedData).subscribe(
            data => {
                if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('feature/model/view');
                    return;
                }

                else if (data == "Exist") {
                    this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
                    return;
                }
                else {
                    this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    return;
                }
            }
        )

    }


    openImportPopup() {
        this.lookupfor = 'import_popup';

    }
}