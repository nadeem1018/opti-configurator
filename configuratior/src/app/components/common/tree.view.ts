import { Component, Input, HostListener, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
    selector: 'treeview',
    template: `
     <ul>
        <li *ngFor="let inner_element of tree_data_json; let i= index;">  
            <ng-template #template>
                <div class="modal-body text-center image-previe-container">
                    <img [attr.src]="inner_element.modalImage"  style="max-width:100%">
                </div>
            </ng-template>
            <ng-template #popTemplate>
                <div class="text-center">
                  <img *ngIf="!inner_element.modalImage==''" [attr.src]="inner_element.modalImage" height="100" (click)="openModal(template)">
                  <div *ngIf="inner_element.modalImage=='' || inner_element.modalImage== undefined " class="no-img-msg">No Image Found</div>
                </div>
              </ng-template>
            <span 
            [popover]="popTemplate"
            container="body"
            [outsideClick]="true"            
              popoverTitle="{{inner_element.component}}"
              placement="left"
              triggers="" #pop="bs-popover"> 
              <span #btn (click)="childExpand(btn)" class="expand-btn" *ngIf="get_childrens(inner_element.component).length > 0"></span>
              <span [attr.data-branchtype]="inner_element.branchType" (click)="pop.toggle()">{{inner_element.component}}</span>
            </span>
            <treeview #tree style="display:none" [tree_data_json]="get_childrens(inner_element.component, inner_element.level)" [complete_dataset]="complete_dataset" *ngIf="get_childrens(inner_element.component).length > 0"></treeview>

    </ul>
    `,

})

export class TreeViewComponent {
    @Input() tree_data_json;
    @Input() complete_dataset;

    @HostListener('window:scroll, scroll', ['$event'])
    onScroll($event, pop:any) {
        $('body').click()
    }
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {}
    
    openModal(template: TemplateRef<any>) {
        $('body').click()
        this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
    }
    
    log(data) {
        console.log(data);
    }
    ngOnInit() {
        $('[data-toggle="popover"]').popover({
            container: 'body',
            trigger:'hover'
        })
    }

    get_childrens(component, current_level ) {
        var next_level = (parseInt(current_level) + 1);
        let data = this.complete_dataset.filter(function (obj) {
            return obj['parentId'] == component && obj.level == next_level;
        });
        return data;
    }
    // if (
    //     this.isOpen
    //     && !this._er.nativeElement.contains(event.target)
    //     && !this.popover._popover!._componentRef!.location.nativeElement!.contains(event.target)
    //   ) {
    //     this.hide();
    //   }
    childExpand(id: any){
        id.classList.toggle("expanded")
        if (id.parentNode.parentNode.childNodes[4].style.display === "none") {
            id.parentNode.parentNode.childNodes[4].style.display = "block";
        } else {
            id.parentNode.parentNode.childNodes[4].style.display = "none";
        }
    }
}