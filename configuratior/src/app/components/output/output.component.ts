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
  public sales_employee:any =[];
  public ship_to:any;
  public bill_to:any;
  public ship_data:any =[];
  public bill_data:any =[];
  public owner_list: any =[];
  public customerBillTo:any;

  public customerShipTo:any;

  ngOnInit() {
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    this.feature_accessory_list = [
      { "id": "1", "key": "A1", "name": "Accessory 1" },
      { "id": "2", "key": "A2", "name": "Accessory 2" },
    ];

    var todaysDate = new Date();
    //var mindate =new Date(todaysDate) ;
     let formated_posting_date = new Date( todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
    //let formated_posting_date =(todaysDate.getMonth()+1)+"/"+todaysDate.getDate()+"/"+todaysDate.getFullYear();
    this.step1_data.posting_date= formated_posting_date;
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
//this.console.log(selectedValue);
  }

  getLookupValue($event) {
    if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if(this.step1_data.customer != undefined){
        //get contact person
        this.fillContactPerson();
        this.fillShipTo();
        this.fillBillTo();
        this.fillOwners();
      }

    }

  }

  //this will get the contact person
  fillContactPerson(){
    this.OutputService.fillContactPerson(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        console.log(data);
        if (data != null || data != undefined && data.length > 0) {
        if(data.ContactPerson.length > 0){
            this.contact_persons = data.ContactPerson;
        }
        else{
          this.contact_persons = [];
        }
        if(data.DefaultSalesPerson.length > 0){
            this.sales_employee = data.DefaultSalesPerson;

      }
      else{
        this.sales_employee = [];
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
  fillShipTo(){
    this.OutputService.fillShipTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {

if (data != null || data != undefined && data.length > 0) {
 
  if(data.ShipDetail.length > 0){   
    this.ship_to = data.ShipDetail;
    this.customerShipTo = data.ShipDetail[0].ShipToDef;

    this.ship_data.push({
      CompanyDBId:this.common_output_data.companyName,
      Customer:this.step1_data.customer,
      ShipTo: this.customerShipTo

    });
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
        this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else{
          this.step1_data.ship_to_address='';        
        }
      })
}
else{
  this.ship_to= [];
  this.step1_data.ship_to_address='';
}
}
      }
    )
  }

  fillBillTo(){
    this.OutputService.fillBillTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
if (data != null || data != undefined && data.length > 0) {
  if(data.BillToDef.length > 0){
      this.bill_to = data.BillToDef;
      this.customerBillTo = data.BillToDef[0].BillToDef;

       this.bill_data.push({
         CompanyDBId:this.common_output_data.companyName,
         Customer:this.step1_data.customer,
         BillTo: this.customerBillTo
  
       });
       this.OutputService.fillBillAddress(this.bill_data).subscribe(
         data => {
           if (data != null || data != undefined && data.length > 0) {
           this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
           }
           else{
            this.step1_data.bill_to_address= '';
           }
         })
  }
  else{
    this.bill_to= [];
    this.step1_data.bill_to_address= '';
  }
}

})
  }

  fillOwners(){
    this.OutputService.fillAllOwners(this.common_output_data.companyName).subscribe(
      data => {

if (data != null || data != undefined && data.length > 0) {
this.owner_list= data;
}
else{
  this.owner_list=[];
}
      })
  }

  onShipToChange(SelectedShipTo){
    this.ship_data=[];
    this.ship_data.push({
      CompanyDBId:this.common_output_data.companyName,
      Customer:this.step1_data.customer,
      ShipTo: SelectedShipTo

    });
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
        this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else{
          this.step1_data.ship_to_address='';        
        }
      })
  }

  onBillToChange(SelectedBillTo){
    this.bill_data=[];
    this.bill_data.push({
      CompanyDBId:this.common_output_data.companyName,
      Customer:this.step1_data.customer,
      ShipTo: SelectedBillTo

    });
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
        this.step1_data.bill_to_address =  data.BillingAdress[0].BillingAdress;
        }
        else{
          this.step1_data.bill_to_address='';  
          


        }
      })
    }
    onCustomerChange(){
      this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
        data => {
          if (data === "False") {
            this.toastr.error('', this.language.invalidcustomer, this.commonData.toast_config);
            this.step1_data.customer = "";
            this.step1_data.customer_name='';
            this.contact_persons = [];
            this.sales_employee = [];
            this.ship_to= [];
            this.step1_data.ship_to_address='';  
            this.step1_data.bill_to_address= '';
            this.bill_to= [];
            this.owner_list=[];
            return;
          }

          else{
            this.GetCustomername();
            this.fillContactPerson();
            this.fillShipTo();
            this.fillBillTo();
            this.fillOwners();
          }
        })

    }

    GetCustomername(){
      this.OutputService.GetCustomername(this.common_output_data.companyName, this.step1_data.customer).subscribe(
        data => {
          this.console.log(data);
          if (data != null || data != undefined && data.length > 0) {
            this.step1_data.customer_name= data[0].Name;
          }
          else{
            this.step1_data.customer_name ='';
          }
        }
      )
    }

}
