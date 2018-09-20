import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';
import { FeaturebomService } from '../../../services/featurebom.service';
import { CommonData } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-feature-bom-view',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./bom.component.scss']
})


export class ViewFeatureBOMComponent implements OnInit {
    @ViewChild("searchinput") _el: ElementRef;
    common_params = new CommonData();
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Bom_title;
    add_route_link = '/feature/bom/add';
    public commonData = new CommonData();
    table_title = this.page_main_title;
    // generate table default constants
    table_pages: any;
    search_key: any;
    //table_head_foot = ['Select','#', 'Feature ID', 'Display Name', 'Action'];
    table_head_foot = [this.language.select, this.language.hash, this.language.Bom_FeatureId, this.language.Bom_Displayname, this.language.action];
    public table_hidden_elements = [false, true, false, false, false];
    record_per_page_list: any = this.common_params.default_limits;

    record_per_page: any = this.common_params.default_count;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";
    
    constructor(private fbs: FeaturebomService, private router: Router, private toastr: ToastrService) { }
    show_table_footer: boolean = false;

    //custom dialoag params
    public dialog_params:any = [];
    public show_dialog:boolean = false;
    public dialog_box_value:any;
    public row_id:any;
    public CheckedData :any = [];
    public companyName: string = "";
    public username: string = "";
    public GetItemData: any = [];
    public selectall:boolean=false;

    ngOnInit() {
        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
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
        var dataset = this.fbs.getAllViewDataForFeatureBom(search, page_number, this.record_per_page).subscribe(
            data => {
                
                dataset = JSON.parse(data);
                this.rows = dataset[0];
                let pages: any = Math.round(parseInt(dataset[1]) / parseInt(this.record_per_page));
                if (parseInt(pages) == 0 || parseInt(pages) < 0) {
                    pages = 1;
                }
                this.page_numbers = Array(pages).fill(1).map((x, i) => (i + 1));
                if (page_number != undefined) {
                    this.current_page = page_number;
                }

                if (search != undefined) {
                    this.search_string = search;
                }
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

    button_click1(id) {

        this.router.navigateByUrl('feature/bom/edit/' + id);
        // button click function in here
    }

    button_click2(id) {
        this.dialog_params.push({'dialog_type':'delete_confirmation','message':this.language.DeleteConfimation});
        this.show_dialog = true;    
        this.row_id = id;
       
       // var result = confirm(this.language.DeleteConfimation);
    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue){
        console.log("GET DUIALOG VALUE")  
        if(userSelectionValue == true){
                this.delete_row();
            }
            this.show_dialog = false;
    }

    //delete values
    delete_row(){
        this.GetItemData=[]
        this.GetItemData.push({
            CompanyDBId: this.companyName,
            FeatureId:this.row_id
        });
        this.fbs.DeleteData(this.GetItemData).subscribe(
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

     on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i] == row_data) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            FeatureId: row_data,
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
                    FeatureId: row_data,
                    CompanyDBId: this.companyName
                })
            }
        }
        else {
            this.CheckedData.push({
                FeatureId: row_data,
                CompanyDBId: this.companyName
            })
        }
     

    }

    on_Selectall_checkbox_checked(checkedvalue) {
        
        var isExist = 0;
        this.CheckedData = [];
        this.selectall=false

        if (checkedvalue == true) {
            this.selectall=true
            if(this.rows.length>0){
                for (let i = 0; i < this.rows.length; ++i) {

                    this.CheckedData.push({
                        FeatureId: this.rows[i][1],
                        CompanyDBId: this.companyName
                    })
                }
            }
           
         

        }
        else{
            this.selectall=false
        }
       

    }

    delete() {
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
        else{
            
            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }
        
    }

}
    
  





