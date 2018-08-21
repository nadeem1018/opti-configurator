import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-item-code-view-model',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./itemcodegeneration.component.scss']
})


export class ViewItemCodeGenerationComponent implements OnInit {

    page_main_title = 'Item Code Generation';
    table_title = this.page_main_title;

    add_route_link = '/item-code-genration/add';

    table_head_foot = ['Name', 'Position', 'Office', 'Age', 'Start Date', 'Salary'];
    
    constructor() { }

    ngOnInit() {
    }

   
   
}