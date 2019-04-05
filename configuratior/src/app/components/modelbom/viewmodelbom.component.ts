import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModelbomService } from '../../services/modelbom.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData, ColumnSetting } from "../../models/CommonData";
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'app-model-bom-view-model',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./modelbom.component.scss']
})


export class ViewModelBomComponent implements OnInit {

    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";

    @ViewChild("searchinput") _el: ElementRef;
    public commonData = new CommonData();
    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = 10;

    public companyName: string = "";
    public username: string = "";
    add_route_link = '/modelbom/add';
    record_per_page_list: any = [10, 25, 50, 100]
    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public ViewData: any = [];
    show_table_footer: boolean = false;
    dataArray: any = [];
    public showLoader: boolean = true;
    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public CheckedData: any = [];
    public selectall: boolean = false;
    public GetItemData: any = [];
    public isMultiDelete: boolean = false;
    public isColumnFilter: boolean = false;
    public showImportButton: boolean = false;
    //table_head_foot = ['Select','#', 'Model Id', 'Name', 'Action'];
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Model_Bom;
    table_title = this.page_main_title;
    table_head_foot = [this.language.select, this.language.hash, this.language.ModelId, this.language.model_ModelCode, this.language.Name, this.language.description, this.language.action];
    public table_hidden_elements = [false, true, true, false, false, false, false];
    constructor(private router: Router, private service: ModelbomService, private toastr: ToastrService,
        private commonservice:CommonService) { }

    isMobile:boolean=false;
    isIpad:boolean=false;
    isDesktop:boolean=true;
    isPerfectSCrollBar:boolean = false;
  
    public columns: ColumnSetting[] = [
        {
          field: 'OPTM_FEATURECODE',
          title: this.language.model_ModelCode,
          type: 'text',
          width: '200',
          attrType: 'link'
        }, 
        {
            field: 'OPTM_DISPLAYNAME',
            title: this.language.Name,
            type: 'text',
            width: '200',
            attrType: 'text'
          },
          {
            field: 'OPTM_FEATUREDESC',
            title: this.language.description,
            type: 'text',
            width: '100',
            attrType: 'text'
          },
      ];

    getcurrentPageSize(grid_value){
      sessionStorage.setItem('defaultRecords', grid_value);
      console.log('=sessionStorage=======',sessionStorage.defaultRecords);
    }

    getLookupValue($event) {
        
    }  

    on_selection(grid_event) {
        grid_event.selectedRows = [];
    }

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
    saveFilterState() {
        sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
    }
    ngOnInit() {
        this.showLoader = true;
        const element = document.getElementsByTagName("body")[0];
        element.className = "";
        this.detectDevice();
        element.classList.add("app_model-bom-view-model");
        element.classList.add("opti_body-main-module");
        element.classList.add('sidebar-toggled');

        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        if(sessionStorage.getItem('defaultRecords')!== undefined && sessionStorage.getItem('defaultRecords')!=""){
          this.selectedValue =  Number(sessionStorage.getItem('defaultRecords'));
        } else {
          this.selectedValue = Number(this.commonData.default_count);
        }
        if(sessionStorage.isFilterEnabled == "true" ) {
          this.isColumnFilter = true;
        } else {
          this.isColumnFilter = false;
        }
        this.service_call(this.current_page, this.search_string);
    }
    ngAfterViewInit() {
       // this._el.nativeElement.focus();
    }
    on_page_limit_change() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    getPageValue() {
        if(this.selectedValue == null){
            this.selectedValue = 10;
        }  
        return this.selectedValue;
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
        var dataset = this.service.getAllViewDataForModelBom(search, page_number, this.record_per_page).subscribe(
            data => {
                
                console.log(data);
                this.showLoader = false;
                if(data != undefined && data !=null){
                   if(data.length > 0){
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router);
                        return;
                    } 
                }
            }
                                
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

        this.router.navigateByUrl('modelbom/edit/' + data.OPTM_MODELID);
        // button click function in here
    }
    button_click2(data) {
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.OPTM_MODELID;
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
            ModelId: this.row_id,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
        });
        this.service.DeleteData(this.GetItemData).subscribe(
            data => {
                if(data != undefined && data.length > 0){
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router);
                        return;
                    } 
                }
                if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('modelbom/view');
                    return;
                } else if (data == "ReferenceExists") {
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

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].ModelId == row_data.OPTM_MODELID) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            ModelId: row_data.OPTM_MODELID,
                            CompanyDBId: this.companyName,
                            GUID: sessionStorage.getItem("GUID"),
                            UsernameForLic: sessionStorage.getItem("loggedInUser")
                        })
                    }
                    else {
                        this.CheckedData.splice(i, 1)
                    }
                }
            }
            if (isExist == 0) {
                this.CheckedData.push({
                    ModelId: row_data.OPTM_MODELID,
                    CompanyDBId: this.companyName,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }
        }
        else {
            this.CheckedData.push({
                ModelId: row_data.OPTM_MODELID,
                CompanyDBId: this.companyName,
                GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
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
                        ModelId: this.dataArray[i].OPTM_MODELID,
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
        this.service.DeleteData(this.CheckedData).subscribe(
            data => {
                if(data != undefined && data.length > 0){
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router);
                        return;
                    } 
                }
                if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('modelbom/view');
                    return;
                }
                else {
                    this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    return;
                }
            }
        )
    }

}
