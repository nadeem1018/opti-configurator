import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';

//import { LookupComponent } from '../common/lookup/lookup.component';

@Component({
  //providers:[LookupComponent],
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public step1_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public doctype: any = "";
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, "10%"];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price, this.language.price_extn, "X"];
  public feature_tax_total = [
    { "key": "Tax", "value": "10%" },
    { "key": "Total", "": "$2000" },
  ];
  public item_tax_total = [
    { "key": "Tax", "value": "12%" },
    { "key": "Total", "": "$1500" },
  ];
  public new_item_list = ["item 1", "item 2", "item 3", "item 4", "item 5"];
  
  public order_creation_table_head = [this.language.hash, this.language.item, this.language.quantity, this.language.price, this.language.price_extn];
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService) { }
  lookupfor: string = '';
  serviceData: any;
  public contact_persons:any;
  public customer_ship_to:any;
  public customer_bill_to:any;

  ngOnInit() {
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    this.feature_accessory_list = [
      { "id": "1", "key": "A1", "name": "Accessory 1" },
      { "id": "2", "key": "A2", "name": "Accessory 2" },
    ];
  }

  openCustomerLookUp() {

    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'output_customer';
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )

  }

  openSalesEmpLookup() { }

  openTaxCodes() { }

  openModalList() { }
  
  onContactPersonSelectChange(selectedValue,rowIndex){
this.console.log(selectedValue);
  }

  getLookupValue($event) {
    if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if(this.step1_data.customer != undefined){
        //get contact person
        this.fillContactPerson();
      }

    }

  }

  //this will get the contact person
  fillContactPerson(){
    this.OutputService.fillContactPerson(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
        if(data.ContactPerson.length > 0){
            this.contact_persons = data.ContactPerson;
        }
          
        }
        else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error =>{
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )


  }
}
