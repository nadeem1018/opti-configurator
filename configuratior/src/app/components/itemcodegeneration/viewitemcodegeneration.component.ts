import { Component, OnInit } from '@angular/core';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-item-code-view-model',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./itemcodegeneration.component.scss']
})


export class ViewItemCodeGenerationComponent implements OnInit {

    page_main_title = 'Item Code Generation';
    table_title = this.page_main_title;
    public companyName:string="SFDCDB"
    add_route_link = '/item-code-genration/add';
    record_per_page_list:any = [10, 25, 50 , 100]
    record_per_page:any = 10;
    search_string:any= "";
    current_page: any = 1;
    page_numbers:any = "";
    rows:any = "";
    public GetItemData:any =[];
    public ViewData:any =[];
    show_table_footer:boolean = true;


    table_head_foot = ['#', 'Code', 'Final String','Action'];
    language = JSON.parse(sessionStorage.getItem('current_lang')); 
    constructor(private router: Router,private itemgen: ItemcodegenerationService,) { }

    ngOnInit() {
        this.GetItemData.push({
            CompanyDBId:"SFDCDB",
            ItemCode:"sdsadad"
     
         })
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
        var dataset =  this.itemgen.viewItemGenerationData("SFDCDB").subscribe(
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
    
        //    console.log("current_page " + this.current_page);
        //    console.log("record_per_page " + this.record_per_page);
        //    console.log("search " + this.search_string);
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
       // alert(id)
        this.router.navigateByUrl('item-code-genration/edit/'+id);
        // button click function in here
    }
    button_click2(id){
       // alert(id)
        // button click function in here
    }

     // for testing purpose 
     dummy_data(){
         
        this.itemgen.viewItemGenerationData(this.GetItemData).subscribe(
            data => {
                if(data.length>0){
                   this.ViewData=data
                }
                else{

                }

            }
        ) 
        return  {
            total_records: "50",
            data : [ 
                ["1", "Code1", "Serial-001","Code1"],
                ["2", "Code2", "Serial-002","Code2"],
                ["3", "Code3", "Serial-003","Code3"],
                ["4", "Code4", "Serial-004","Code4"],
                ["5", "Code5", "Serial-005","Code5"],
                
             ]

         };
        // return  { 
        //      total_records: "50", 

            
            //  data : [ 
            //      ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320, 800"],
            //      ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
            //      ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
            //      ["Cedric Kellyn", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060"],
            //      ["Tiger Nixon", "System Architect", "Edinburgh", "61", "2011/04/25", "$320, 800"],
            //      ["Garrett Winters", "Accountant", "Tokyo", "63", "2011/07/25", "$170,750"],
            //      ["Ashton Cox", "Junior Technical Author", "San Francisco", "66", "2009/01/12", "$86,000"],
            //      ["Cedric Kellyn", "Senior Javascript Developer", "Edinburgh", "22", "2012/03/29", "$433,060"],
            //   ]
             
        //   };
      }
   
   
}