import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
    public toDelete: any = {
    };

    show_table_footer: boolean = false;
    public CheckedData: any = [];







    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public selectall: boolean = false;
    public GetItemData: any = [];


    //table_head_foot = ['checkbox_here', '#', 'Code', 'Final String', 'Action'];
    language = JSON.parse(sessionStorage.getItem('current_lang'));
table_head_foot = [this.language.checkbox_here, this.language.hash, this.language.code, this.language.finalstring, this.language.action];
    constructor(private router: Router, private itemgen: ItemcodegenerationService, private toastr: ToastrService) { }

    ngOnInit() {
        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
        this.service_call(this.current_page, this.search_string);
        //this.CheckedData.CheckedRow=[];
        //   this.CheckedData.CompanyDBId=[];

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

    log(data) {
        console.log(data);
    }

    service_call(page_number, search) {
        var dataset = this.itemgen.viewItemGenerationData(this.companyName, search, page_number, this.record_per_page).subscribe(
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
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = id;

        // var result = confirm(this.language.DeleteConfimation);

    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
        console.log("GET DUIALOG VALUE")
        if (userSelectionValue == true) {
            this.delete_row();
        }
        this.show_dialog = false;
    }

    //delete values
    delete_row() {
        // console.log("YES DELETE--"+this.row_id);
        this.GetItemData = []
        this.GetItemData.push({
            CompanyDBId: this.companyName,
            ItemCode: this.row_id

        })
        this.itemgen.getItemCodeReference(this.GetItemData).subscribe(
            data => {
                if (data == "True") {
                    this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
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

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i] == row_data) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            ItemCode: row_data,
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
                    ItemCode: row_data,
                    CompanyDBId: this.companyName
                })
            }
        }
        else {
            this.CheckedData.push({
                ItemCode: row_data,
                CompanyDBId: this.companyName
            })
        }


    }

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = []
        this.selectall = false

        if (checkedvalue == true) {
            if (this.rows.length > 0) {
                this.selectall = true
                for (let i = 0; i < this.rows.length; ++i) {

                    this.CheckedData.push({
                        ItemCode: this.rows[i][2],
                        CompanyDBId: this.companyName
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
            //for (let i = 0; i < this.CheckedData.length; ++i) {
            this.itemgen.getItemCodeReference(this.CheckedData).subscribe(
                data => {
                    if (data == "True") {
                        this.toastr.error('', this.language.ItemCodeLink, this.commonData.toast_config);
                        return;
                    }
                    else {
                        this.itemgen.DeleteSelectedData(this.CheckedData).subscribe(
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
            // }
        }
        else {
            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }

    }




}