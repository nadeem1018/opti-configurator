import { Component, OnInit } from '@angular/core';
import { CommonData } from "src/app/models/CommonData";

@Component({
    selector: 'app-view-feature-model',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./model.component.scss']
})


export class ViewFeatureModelComponent implements OnInit {
    common_params = new CommonData();
    page_main_title = 'Model Feature';
    add_route_link = '/feature/model/add';
    table_title = this.page_main_title;

// generate table default constants
    table_pages: any;
    search_key:any;
    table_head_foot = ['Name', 'Position', 'Office', 'Age', 'Start Date', 'Salary', 'Actions'];
    record_per_page_list: any = this.common_params.default_limits;

    record_per_page: any = this.common_params.default_count;
    search_string:any= "";
    current_page: any = 1;
    page_numbers:any = "";
    rows:any = "";
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    show_table_footer:boolean = true; 
    constructor() { }

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
       let dataset =  this.dummy_data();
        this.rows = dataset.data;
        let pages:any = (parseInt(dataset.total_records) / parseInt(this.record_per_page));
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

        console.log("current_page " + this.current_page);
        console.log("record_per_page " + this.record_per_page);
        console.log("search " + this.search_string);
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
        // button click function in here
    }

    button_click2(id){
        // button click function in here
    }
    
    // for testing purpose 
    dummy_data(){
         
      return  { 
           total_records: "50", 
           data : [ 
               ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320, 800", "1"],
               ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750", "2"],
               ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000", "3"],
               ["Cedric Kellyn", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060", "4"],
               ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320, 800", "5"],
               ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750", "6"],
               ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000", "7"],
               ["Cedric Kellyn", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060", "8"],
           ]
        };
    }
}
            



