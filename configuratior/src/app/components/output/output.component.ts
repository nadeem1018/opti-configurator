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
  public step1_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public doctype: any = "";
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", "Code" , "Name"];
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RulewbService, private toastr: ToastrService) { }

  ngOnInit() {
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
  }

  openFeatureLookUp() { }

  openSalesEmpLookup() { } 
  
  openTaxCodes() { }

  openModalList() { }
}
