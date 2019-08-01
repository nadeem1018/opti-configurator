import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from "../../../models/CommonData";
import { CommonService } from "../../../services/common.service";
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import 'bootstrap';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private commonData = new CommonData();
  config_data: any = "";
  language: any = "";
  project_name: any = 'OptiPro Product Configurator';
  username = "";
  version = "";
  company = "";
  language_current = "";

  constructor(private router: Router, private toastr: ToastrService, private CommonService: CommonService, private modalService: BsModalService) { }

  showHeader: boolean;
  imgPath = 'assets/images';
  public search_for:string ;
  public user_profile:string ;
  public preferences:string ;
  public signout:string ;
  public about:string ;


  ngOnInit() {

    this.CommonService.currentIsLoggedInDataData.subscribe(
      (data) => {
        this.showHeader = data;
      }
      );

    let objj = this;
    this.CommonService.get_config(function(response){
      objj.CommonService.set_language(response, function(){
        objj.config_data = JSON.parse(sessionStorage.getItem('system_config'));
        // objj.commonData.checkSession();
        if (objj.config_data != undefined && objj.config_data != "") {
          if (objj.config_data['locale'] != "" && objj.config_data['locale'] != undefined && objj.config_data['locale'] != 0) {
            // objj.CommonService.set_language(objj.config_data['locale']);
          }
          objj.project_name = objj.config_data['app_title'];
          objj.language = JSON.parse(sessionStorage.getItem('current_lang'));
          objj.setDefaultLanguage()
        }
      })
    });


  }

 /* ngOnChanges() {
    // this.commonData.checkSession();
  }*/

  setDefaultLanguage(){
    this.search_for = this.language.search_for;
    this.user_profile = this.language.user_profile;
    this.preferences = this.language.preferences;
    this.signout = this.language.signout;
    this.about = this.language.system_info;
  }

  ngAfterViewInit() {
     let objj = this;
    setTimeout(function () {
      this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
      this.language = JSON.parse(sessionStorage.getItem('current_lang'));

      objj.setDefaultLanguage();

    }, 2000);
  }
  logout() {

    this.CommonService.RemoveLoggedInUser().subscribe();

    this.CommonService.signOut(this.toastr, this.router, 'Logout');


    // this.toastr.success('', 'Session has been stopped', this.commonData.toast_config);
    // /* sessionStorage.clear();
    // localStorage.clear(); */
    // let login_page = this.commonData.application_path + '/index.html#login';

    // sessionStorage.removeItem('isLoggedIn');
    // sessionStorage.removeItem('selectedComp');
    // sessionStorage.removeItem('loggedInUser');

    // // this.router.navigateByUrl('/login');

    // setTimeout(()=>{   
      //   this.CommonService.setisLoggedInData();
      //   this.router.navigateByUrl('/login');
      // }, 1000);
    }

  /* checkSession(){
    let login_page = this.commonData.application_path + '/index.html#login';
    if(sessionStorage.getItem('isLoggedIn') == null){
      window.location.href = login_page;
    }  
  } */

  open_info_popup() {
    this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
    this.project_name = this.config_data['app_title'];
    this.username = sessionStorage.getItem('loggedInUser');
    this.version = this.config_data['system_version'];
    this.company = sessionStorage.getItem('selectedComp');
    this.language_current = this.config_data['locale_name'];
    $("#about_info").modal("show");
  }

  close_about_modal() {
    $("#about_info").modal("hide");
  }


}
