import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RulewbService } from '../../services/rulewb.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list:any  [];
  public step1_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public doctype: any = "";
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, ""]; 
  public feature_tax_total = [
    {"key":"Tax","value":"10%"},
    { "key": "Total", "": "$2000" },
  ];
  public item_tax_total = [
    { "key": "Tax", "value": "12%" },
    { "key": "Total", "": "$1500" },
  ]; 
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RulewbService, private toastr: ToastrService) { }

  ngOnInit() {
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    this.feature_accessory_list = [
      { "id": "1", "key": "A1", "name": "Accessory 1"},
      { "id": "2", "key":"A2", "name": "Accessory 2"},
    ];


   
  }

  openFeatureLookUp() { }

  openSalesEmpLookup() { } 
  
  openTaxCodes() { }

  openModalList() { }
}
