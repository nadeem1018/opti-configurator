import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { CommonData } from "src/app/models/CommonData";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-view-feature-model',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./model.component.scss']
})


export class ViewFeatureModelComponent implements OnInit {
    common_params = new CommonData();
    page_main_title = 'Model Feature';
    add_route_link = '/feature/model/add';
    public commonData = new CommonData();
    table_title = this.page_main_title;
// generate table default constants
    table_pages: any;
    search_key:any;
    table_head_foot = ['Code','Type', 'Display Name', 'Effective Date', 'Status','Action'];
    record_per_page_list: any = this.common_params.default_limits;

    record_per_page: any = this.common_params.default_count;
    search_string:any= "";
    current_page: any = 1;
    page_numbers:any = "";
    rows:any = "";
    public dataBind:any="";
    language = JSON.parse(sessionStorage.getItem('current_lang')); 
    constructor(private fms: FeaturemodelService,private router: Router,private toastr: ToastrService){}
    show_table_footer:boolean = false; 
    

    ngOnInit() {
        this.service_call(this.current_page, this.search_string);
    }

    on_page_limit_change(){
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    search_results(){
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    service_call(page_number, search){
       var dataset =  this.fms.getAllViewData("SFDCDB").subscribe(
        data => {
           dataset = JSON.parse(data);
       this.rows = dataset[0];
       let pages:any = (parseInt(dataset[1]) / parseInt(this.record_per_page));
       if (parseInt(pages) ==0 || parseInt(pages) < 0){
           pages = 1;
       }
       this.page_numbers = Array(pages).fill(1).map((x, i) => (i+1));
       if (page_number != undefined){
              this.current_page = page_number;
       }

       if (search != undefined) {
           this.search_string = search;
       }
        });
    }

    // action button values 
    show_button1:boolean = true;
    show_button2:boolean = true;

    button1_title = this.language.edit;
    button2_title = this.language.delete;

    button1_color = "btn-info";
    button2_color = "btn-danger";

    button1_icon = "fa fa-edit fa-fw";
    button2_icon = "fa fa-trash-o fa-fw";

    button_click1(id){
        //alert(id)
        this.router.navigateByUrl('feature/model/edit/'+id);
    }

    button_click2(id){
        // button click function in here
        this.fms.DeleteData("SFDCDB",id).subscribe(
            data => {
              if (data === "True" ) {
                this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                this.service_call(this.current_page, this.search_string);
                this.router.navigateByUrl('feature/model/view');
                return;
              }
              else{
                this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                return;
              }
            }
          )
    }
    
    // for testing purpose 
    dummy_data(){
        let dd:any =   { 
            total_records: "50", 
            data : [ 
                ["1", "Demo", "Desc", "2011/04/25"]
             ]
            
         };
        console.log( dd);
    }
}
            



