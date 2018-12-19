import { Component, OnInit } from '@angular/core';
import { CommonService } from "src/app/services/common.service";
import { ToastrService } from 'ngx-toastr';
import { CommonData } from "../../../models/CommonData";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  imgPath = 'assets/images';

  constructor(private commonService: CommonService, private toastr: ToastrService, private router: Router) { }
  public menu_obj:any;
  public menu_options: any = [
    { "menu_code": 200, "menu_title": "Item Code Generation", "router_link": "item-code-generation/view", "icon_path": this.imgPath +"/leftpanel/code.svg ", "chkURL":"item-code-generation"},
    { "menu_code": 201, "menu_title": "Feature Model" , "router_link": "feature/model/view", "icon_path":this.imgPath + "/leftpanel/featuremodel.svg", "chkURL":"model" },
    { "menu_code": 202, "menu_title": "Feature BOM" , "router_link": "feature/bom/view", "icon_path":this.imgPath + "/leftpanel/featureBOM.svg", "chkURL":"bom" },
    { "menu_code": 203, "menu_title": "Model BOM", "router_link": "modelbom/view" , "icon_path":this.imgPath + "/leftpanel/modelBOM.svg", "chkURL":"modelbom" },
    { "menu_code": 204, "menu_title": "Rule Work Bench", "router_link": "rulewb/view" , "icon_path":this.imgPath + "/leftpanel/ruleworkbench.svg", "chkURL":"rulewb" },
    { "menu_code": 205, "menu_title": "Configure", "router_link": "output/view", "icon_path":this.imgPath + "/leftpanel/configure.svg", "chkURL":"output"  }
  ];

  showSidebar: boolean ;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  private commonData = new CommonData();

  selectedItem: string;

  ngOnInit() { 

    this.commonService.currentIsLoggedInDataData.subscribe(
      (data) => {
          console.log('data'+data);
          this.showSidebar = data;
          }
     );

    // get current url with last word
    let getURL = window.location.href;
    //console.log(getURL);

    let chkISFeature = getURL.includes('feature');
    

    let partsOfUrl = getURL.split('/');
    //this.selectedItem = partsOfUrl[partsOfUrl.length - 1];

    if(chkISFeature==true){
      this.selectedItem = partsOfUrl[5];
    }else{
      this.selectedItem = partsOfUrl[4];
    }

    

    //get the menus from database
    this.getMenuRecord();
  }

  //On Menu Press
  
  onMenuPress(pressedMenu, newValue, getchkValue){
    sessionStorage.setItem('currentMenu',pressedMenu[0].menu_code);
    this.selectedItem = getchkValue;
  }

  onMenuPressHome(modulename){
    this.selectedItem = modulename;
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
