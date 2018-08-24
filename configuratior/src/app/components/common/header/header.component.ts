import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from "../../../models/CommonData";
import { CommonService } from "../../../services/common.service";
 import { ToastrService } from 'ngx-toastr';

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
    this.checkSession();
    
    this.CommonService.set_language(this.config_data['locale']);
    this.project_name = this.config_data['app_title'];
    this.language = JSON.parse(sessionStorage.getItem('current_lang')); 
  }
    
  show_success(){
    this.toastr.success('', 'Session has been stopped', this.commonData.toast_config);
  }
  show_warning(){
    this.toastr.warning('', 'Session has been stopped', this.commonData.toast_config);
  }
  show_error(){
    this.toastr.error('', 'Session has been stopped', this.commonData.toast_config);
  }
  show_info(){
    this.toastr.info('', 'Session has been stopped', this.commonData.toast_config);
  }
  
  logout(){
    this.toastr.success('', 'Session has been stopped', this.commonData.toast_config);
    /* sessionStorage.clear();
    localStorage.clear(); */
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('selectedComp');
    sessionStorage.removeItem('loggedInUser');

    // this.router.navigateByUrl('/login');
   setTimeout(function(){
     window.location.href = '/login';
   }, 1000);
  }

  checkSession(){
    if(sessionStorage.getItem('isLoggedIn') == null){
      this.router.navigateByUrl('/login');
    }  
  }

 

}
