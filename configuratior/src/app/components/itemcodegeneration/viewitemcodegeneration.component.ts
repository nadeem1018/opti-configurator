import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData } from "../../models/CommonData";

@Component({
    selector: 'app-item-code-view-model',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./itemcodegeneration.component.scss']
})


export class ViewItemCodeGenerationComponent implements OnInit {
    @ViewChild("searchinput") _el: ElementRef;
    public commonData = new CommonData();
    page_main_title = 'Item Code Generation';
    table_title = this.page_main_title;
    public companyName: string = "";
    public username: string = "";
    add_route_link = '/item-code-genration/add';
    record_per_page_list: any = [10, 25, 50, 100]
    record_per_page: any = 10;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    rows: any = "";
    public ViewData: any = [];
    show_table_footer: boolean = false;
    public GetItemData: any = [];


    table_head_foot = ['#', 'Code', 'Final String', 'Action'];
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    constructor(private router: Router, private itemgen: ItemcodegenerationService, private toastr: ToastrService) { }

    ngOnInit() {
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
        var dataset = this.itemgen.viewItemGenerationData(this.companyName,search,page_number,this.record_per_page).subscribe(
            data => {
                dataset = JSON.parse(data);
                console.log(dataset)
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

        this.router.navigateByUrl('item-code-genration/edit/' + id);
        // button click function in here
    }
    button_click2(id) {
        var result = confirm(this.language.DeleteConfimation);
        if (result) {
            this.GetItemData = []
            this.GetItemData.push({
                CompanyDBId: this.companyName,
                ItemCode: id
    
            })
            this.itemgen.getItemCodeReference(this.GetItemData).subscribe(
                data => {
                    if (data == "True") {
                        this.toastr.warning('', this.language.ItemCodeLink, this.commonData.toast_config);
                        return false;
                    }
                    else {
                        this.itemgen.DeleteData(this.GetItemData).subscribe(
                            data => {
                                if (data === "True") {
                                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                                    this.service_call(this.current_page, this.search_string);
                                    this.router.navigateByUrl('item-code-generation/view');
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
            )

        }
       


    }




}