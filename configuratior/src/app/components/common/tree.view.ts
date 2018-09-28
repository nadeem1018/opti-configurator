import { Component, Input } from '@angular/core';

@Component({
    selector: 'treeview',
    template: `
     <ul>
        <li *ngFor="let inner_element of tree_data_json; let i= index;">
            <span>  <i class="fa fa-circle-o"></i> {{inner_element.component}} </span>
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
            return obj['parentId'] == component;
        });
        return data;
    }
}