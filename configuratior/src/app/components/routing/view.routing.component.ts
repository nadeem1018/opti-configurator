import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../helpers/ui.helpers';

@Component({
    selector: 'app-routing-view',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./routing.component.scss']
})


export class ViewRoutingComponent implements OnInit {
    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";
    public commonData = new CommonData();
 
    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = Number(this.commonData.default_count);

    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Bom_title;
    add_route_link = '/routing/add';
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private rs: RoutingService, private router: Router, private toastr: ToastrService) { }
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
    public isColumnFilter: any = false;

    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;

    show_button1: boolean = true;
    show_button2: boolean = true;

    button1_title = this.language.edit;
    button2_title = this.language.delete;

    button1_color = "btn-info";
    button2_color = "btn-danger";

    button1_icon = "fa fa-edit fa-fw";
    button2_icon = "fa fa-trash-o fa-fw";

    public columns: ColumnSetting[] = [
        {
            field: 'OPTM_FEATURECODE',
            title: this.language.code,
            type: 'text',
            width: '200',
            attrType: 'link'
        },
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Bom_Displayname,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
        {
            field: 'OPTM_EFFECTIVEDATE',
            title: this.language.Model_Date,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_TYPE',
            title: this.language.Type,
            type: 'text',
            width: '100',
            attrType: 'text'
        },
        {
            field: 'OPTM_STATUS',
            title: this.language.Model_Status,
            type: 'text',
            width: '200',
            attrType: 'text'
        },
    ];

    getcurrentPageSize(grid_value) {
        sessionStorage.setItem('defaultRecords', grid_value);
    }

    getLookupValue($event) {

    }

    
    on_selection(grid_event) {
        grid_event.selectedRows = [];
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

    service_call(page_number, search) {
        
        var dataset = this.rs.get_all_routing_data().subscribe(
            data => {
                console.log(data);
                this.dataArray = data;
                this.showLoader = false;
            });
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

}