import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FeaturebomService } from '../../../services/featurebom.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../../helpers/ui.helpers';

@Component({
    selector: 'app-feature-bom-view',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./bom.component.scss']
})


export class ViewFeatureBOMComponent implements OnInit {

    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";

    
    @ViewChild("searchinput") _el: ElementRef;
    common_params = new CommonData();

    public listItems: Array<string> = this.common_params.default_limits;
    public selectedValue: number = Number(this.common_params.default_count);

    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Bom_title;
    add_route_link = '/feature/bom/add';
    public commonData = new CommonData();
    table_title = this.page_main_title;
    // generate table default constants
    table_pages: any;
    search_key: any;
    //table_head_foot = ['Select','#', 'Feature ID', 'Display Name', 'Action'];
    table_head_foot = [this.language.select, this.language.hash, this.language.Bom_FeatureId, this.language.Feature_Code, this.language.Bom_Displayname, this.language.action];
    public table_hidden_elements = [false, true, true, false, false, false];
    record_per_page_list: any = this.common_params.default_limits;
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private fbs: FeaturebomService, private router: Router, private toastr: ToastrService) { }
    show_table_footer: boolean = false;
    public showImportButton: boolean = false;
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public dataArray: any = [];
    public CheckedData: any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall: boolean = false;
    public isMultiDelete: boolean = false;
    public isColumnFilter: boolean = false;


    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;

    public columns: ColumnSetting[] = [
        {
            field: 'OPTM_FEATURECODE',
            title: this.language.Feature_Code,
            type: 'text',
            width: '500',
            attrType:'link'
        },
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Bom_Displayname,
            type: 'text',
            width: '500',
            attrType:'text'
        },
    ];

    getLookupValue($event) {
        
    }  

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
        this.showLoader = true;
        const element = document.getElementsByTagName("body")[0];
        element.className = "";
        this.detectDevice()
        element.classList.add("app_feature-bom-view-model");
        element.classList.add("opti_body-main-module");
        element.classList.add('sidebar-toggled');

        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        this.service_call(this.current_page, this.search_string);

    }
    ngAfterViewInit() {
      //  this._el.nativeElement.focus();
    }

    on_selection(grid_event){
        grid_event.selectedRows = [];
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
        if (this.record_per_page !== undefined && sessionStorage.getItem('defaultRecords')) {
            if (this.record_per_page !== sessionStorage.getItem('defaultRecords')) {
                sessionStorage.setItem('defaultRecords', this.record_per_page);
            }
        } else {
            this.record_per_page = this.commonData.default_count;
            sessionStorage.setItem('defaultRecords', this.record_per_page);
        }
        var dataset = this.fbs.getAllViewDataForFeatureBom(search, page_number, this.record_per_page).subscribe(
            data => {
                console.log(data);
                this.dataArray = data;
                this.showLoader = false;
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

        this.router.navigateByUrl('feature/bom/edit/' + data.OPTM_FEATUREID);
        // button click function in here
    }

    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_FEATUREID;

        // var result = confirm(this.language.DeleteConfimation);
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
            CompanyDBId: this.companyName,
            FeatureId: this.row_id
        });
        this.fbs.DeleteData(this.GetItemData).subscribe(
            data => {
                if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('feature/bom/view');
                    return;
                } else if (data == "ReferenceExists") {
                    this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
                    return;
                } else {
                    this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    return;
                }
            }
        )
    }

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].FeatureId == row_data.OPTM_FEATUREID) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            FeatureId: row_data.OPTM_FEATUREID,
                            CompanyDBId: this.companyName
                        })
                    }
                    else {
                        this.CheckedData.splice(i, 1)
                    }
                }
            }
            if (isExist == 0) {
                this.CheckedData.push({
                    FeatureId: row_data.OPTM_FEATUREID,
                    CompanyDBId: this.companyName
                })
            }
        }
        else {
            this.CheckedData.push({
                FeatureId: row_data.OPTM_FEATUREID,
                CompanyDBId: this.companyName
            })
        }


    }

    on_Selectall_checkbox_checked(checkedvalue) {

        var isExist = 0;
        this.CheckedData = [];
        this.selectall = false

        if (checkedvalue == true) {
            this.selectall = true
            if (this.dataArray.length > 0) {
                for (let i = 0; i < this.dataArray.length; ++i) {

                    this.CheckedData.push({
                        FeatureId: this.dataArray[i].OPTM_FEATUREID,
                        CompanyDBId: this.companyName
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
        if (this.CheckedData.length > 0) {
            this.fbs.DeleteData(this.CheckedData).subscribe(
                data => {
                    if (data === "True") {
                        this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                        this.service_call(this.current_page, this.search_string);
                        this.router.navigateByUrl('feature/bom/view');
                        return;
                    }
                    else {
                        this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                        return;
                    }
                }
            )

        }
        else {

            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }
    }

}







