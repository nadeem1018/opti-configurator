import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from "../../../models/CommonData";
import { CommonService } from "../../../services/common.service";
import { ToastrService } from 'ngx-toastr';
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
  project_name:any = '';
  constructor(private router: Router, private toastr: ToastrService, private CommonService: CommonService) {}
  showHeader: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  
  ngOnInit() {
     this.CommonService.get_config();

    this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
    this.commonData.checkSession();
    
    this.CommonService.set_language(this.config_data['locale']);
    this.project_name = this.config_data['app_title'];
    this.language = JSON.parse(sessionStorage.getItem('current_lang')); 
    
    
  }

  ngOnChanges() {
    this.commonData.checkSession();
  }
 
  logout(){
    
    this.toastr.success('', 'Session has been stopped', this.commonData.toast_config);
    /* sessionStorage.clear();
    localStorage.clear(); */
    let login_page = this.commonData.application_path + '/index.html#login';
        
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('selectedComp');
    sessionStorage.removeItem('loggedInUser');

    // this.router.navigateByUrl('/login');
   setTimeout(function(){
     window.location.href = login_page;
   }, 1000);
  }

  /* checkSession(){
    let login_page = this.commonData.application_path + '/index.html#login';
    if(sessionStorage.getItem('isLoggedIn') == null){
      window.location.href = login_page;
    }  
  } */

 

}
