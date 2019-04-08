import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { CommonData, ColumnSetting } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

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
    page_main_title = this.language.routing;
    add_route_link = '/routing/add';
    public showLoader: boolean = true;
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";

    constructor(private rs: RoutingService, private router: Router, private toastr: ToastrService,
        private commonservice:CommonService) { }
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

    button_click1(data) {

        this.router.navigateByUrl('routing/edit/' + data.OPTM_MODELFEATUREID);
        // button click function in here
    }
    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_MODELFEATUREID;
        // var result = confirm(this.language.DeleteConfimation);
    }

    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {

            this.showLoader = true;
            this.rs.DeleteRouting(this.row_id).subscribe(
                data => {
                    this.showLoader = false;
                    // if (data === "True") {
                    //     var obj = this;
                    //     this.service_call(this.current_page, this.search_string);
                    //     this.router.navigateByUrl('routing/view');
                    //     this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    // } else {
                    //     this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    //     return;
                    // }

                    for(var i=0;  i < data.length ; i++){
                        if(data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists"){
                            this.toastr.error('', this.language.Refrence + ' at: ' + data[i].RoutingId , this.commonData.toast_config);
                        }
                        else if(data[i].IsDeleted == "1"){
                            this.toastr.success('', this.language.DataDeleteSuccesfully + ' with Routing Id : ' + data[i].RoutingId , this.commonData.toast_config);
                            this.CheckedData = [];
                            this.service_call(this.current_page, this.search_string);
                            this.router.navigateByUrl('routing/view');
                        }
                        else{
                            this.toastr.error('', this.language.DataNotDelete + ' : ' + data[i].RoutingId , this.commonData.toast_config);
                        }
                    }

                }, error => {
                    this.toastr.error('', this.language.server_error, this.commonData.toast_config);
                    this.showLoader = false;
                }
            )

        }
        this.show_dialog = false;
    }

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

    getPageValue() {
        if(this.selectedValue == null){
            this.selectedValue = 10;
        }  
        return this.selectedValue;
    }
    
    on_selection(grid_event) {
        grid_event.selectedRows = [];
    }

    saveFilterState() {
       sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
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

        if(sessionStorage.isFilterEnabled == "true" ) {
          this.isColumnFilter = true;
        } else {
          this.isColumnFilter = false;
        }

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
                if(data != undefined){
                    if(data.length > 0){
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router);
                        this.showLoader = false;
                        return;
                    } 
                  }
                }
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

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = []
        this.selectall = false

        if (checkedvalue == true) {
            if (this.dataArray.length > 0) {
                this.selectall = true
                for (let i = 0; i < this.dataArray.length; ++i) {

                    this.CheckedData.push({
                        ModelId: this.dataArray[i].OPTM_MODELFEATUREID,
                        CompanyDBId: this.companyName,
                        GUID: sessionStorage.getItem("GUID"),
                        UsernameForLic: sessionStorage.getItem("loggedInUser")
                    })
                }
            }
        }
        else {
            this.selectall = false
        }
    }
}
