import { Component, OnInit, setTestabilityGetter, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
    selector: 'treeview',
    template: `
     <ul >
        <li *ngFor="let inner_element of tree_data_json; let i= index;">
            <span>  <i class="fa fa-minus"></i> {{inner_element.component}} </span>
            <treeview [tree_data_json]="get_childrens(inner_element.component)" [complete_dataset]="complete_dataset" *ngIf="get_childrens(inner_element.component).length > 0"></treeview>
         </li>
    </ul>
    `,

})

export class TreeViewComponent {
    @Input() tree_data_json;
    @Input() complete_dataset;

    
    log(data) {
        console.log(data);
    }

    get_childrens(component) {
        let data = this.complete_dataset.filter(function (obj) {
            return obj['parent'] == component;
        });
        return data;
    }
}