import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/services/common.service";
import { ToastrService } from 'ngx-toastr';
import { CommonData } from "../../../models/CommonData";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private commonService: CommonService,private toastr: ToastrService) { }
  public menu_obj:any;
  public menu_options: any = [
    { "menu_code": 200, "menu_title": "Item Code Generation" , "router_link": "item-code-generation/view"},
    { "menu_code": 201, "menu_title": "Feature Model" , "router_link": "feature/model/view"},
    { "menu_code": 202, "menu_title": "Feature BOM" , "router_link": "eature/bom/view"},
    { "menu_code": 203, "menu_title": "Model BOM", "router_link": "modelbom/view" }
  ];

  showSidebar: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  private commonData = new CommonData();
  ngOnInit() { 
    //get the menus from database
    this.getMenuRecord();
  }

  //Core Functions
  //This will get the menu code and rertun the filterd row
  getMenuDetails(menu_code){
    return this.menu_options.filter(e => e.menu_code == parseInt(menu_code));
  }

  //get record from DB
  getMenuRecord(){
    //This will get the psURL
    this.commonService.getMenuRecord().subscribe(
      data => {
        if (data != null) {
          this.menu_obj = data;
        }
      },
      error =>{
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
    )
  }
}
