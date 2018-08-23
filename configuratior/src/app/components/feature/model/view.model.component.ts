import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
@Component({
    selector: 'app-view-feature-model',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./model.component.scss']
})


export class ViewFeatureModelComponent implements OnInit {
    
    page_main_title = 'Model Feature';
    add_route_link = '/feature/model/add';
    table_title = this.page_main_title;
// generate table default constants
    table_pages: any;
    search_key:any;
    table_head_foot = ['Code','Type', 'Display Name', 'Effective Date', 'Status'];
    record_per_page_list:any = [10, 25, 50 , 100]
    record_per_page:any = 10;
    search_string:any= "";
    current_page: any = 1;
    page_numbers:any = "";
    rows:any = "";
    public dataBind:any="";
    language = JSON.parse(sessionStorage.getItem('current_lang')); 
    constructor(private fms: FeaturemodelService){}

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
            // console.log(data);
            // console.log(JSON.parse(data));
            
           dataset = JSON.parse(data);
           
          
       console.log( dataset);
       this.rows = dataset[0];
       console.log("rows" + this.rows);
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

       console.log("current_page " + this.current_page);
       console.log("record_per_page " + this.record_per_page);
       console.log("search " + this.search_string);
        });
     
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
            



