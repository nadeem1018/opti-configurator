import { Component, OnInit } from '@angular/core';
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
    common_params = new CommonData();
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    page_main_title = this.language.Bom_title;
    add_route_link = '/feature/bom/add';
    public commonData = new CommonData();
    table_title = this.page_main_title;
    // generate table default constants
    table_pages: any;
    search_key: any;
    table_head_foot = ['#', 'Feature ID', 'Display Name', 'Action'];
    record_per_page_list: any = this.common_params.default_limits;

    record_per_page: any = this.common_params.default_count;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public dataBind: any = "";
    
    constructor(private fbs: FeaturebomService, private router: Router, private toastr: ToastrService) { }
    show_table_footer: boolean = false;


    ngOnInit() {
        this.service_call(this.current_page, this.search_string);
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
                let pages: any = (parseInt(dataset[1]) / parseInt(this.record_per_page));
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
        var result = confirm(this.language.DeleteConfimation);
        if (result) {
            this.fbs.DeleteData(id).subscribe(
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

    }



}
    
  





