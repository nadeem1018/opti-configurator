import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-view-feature-model',
    templateUrl: '../../common/table.view.html',
    styleUrls: ['./model.component.scss']
})


export class ViewFeatureModelComponent implements OnInit {

    page_main_title = 'Model Feature';
    table_title = this.page_main_title;

    add_route_link = '/feature/model';

    table_head_foot = ['Name', 'Position', 'Office', 'Age', 'Start Date', 'Salary'];
    
    constructor() { }

    ngOnInit() {
    }
}