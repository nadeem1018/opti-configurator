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

  imgPath = 'assets/images';

  constructor(private commonService: CommonService,private toastr: ToastrService) { }
  public menu_obj:any;
  public menu_options: any = [
    { "menu_code": 200, "menu_title": "Item Code Generation" , "router_link": "item-code-generation/view"},
    { "menu_code": 201, "menu_title": "Feature Model" , "router_link": "feature/model/view"},
    { "menu_code": 202, "menu_title": "Feature BOM" , "router_link": "feature/bom/view"},
    { "menu_code": 203, "menu_title": "Model BOM", "router_link": "modelbom/view" },
    { "menu_code": 204, "menu_title": "Rule Work Bench", "router_link": "rulewb/view" },
    { "menu_code": 205, "menu_title": "Configure", "router_link": "output/view" }
  ];

  showSidebar: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  private commonData = new CommonData();
  ngOnInit() { 
    //get the menus from database
    this.getMenuRecord();
  }

  //On Menu Press
  selectedItem:number=0;
  onMenuPress(pressedMenu, newValue){
    console.log(newValue);
    sessionStorage.setItem('currentMenu',pressedMenu[0].menu_code);
    this.selectedItem = newValue;
  }

  //Core Functions
  //This will get the menu code and rertun the filterd row
  getMenuDetails(menu_code){
    return this.menu_options.filter(e => e.menu_code == parseInt(menu_code));
  }

  //get record from DB
  getMenuRecord(){
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
