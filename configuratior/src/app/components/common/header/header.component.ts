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
  project_name:any = 'OptiPro Product Configurator';
  constructor(private router: Router, private toastr: ToastrService, private CommonService: CommonService) {}
  showHeader: boolean ;
  imgPath = 'assets/images';
  
  ngOnInit() {

    this.CommonService.currentIsLoggedInDataData.subscribe(
      (data) => {
          console.log('data'+data);
          this.showHeader = data;
          }
    );


     this.CommonService.get_config();

    this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
   // this.commonData.checkSession();
    if (this.config_data != undefined && this.config_data != "" ){
       if (this.config_data['locale'] != "" && this.config_data['locale'] != undefined && this.config_data['locale'] != 0){
       // this.CommonService.set_language(this.config_data['locale']);
      }
      this.project_name = this.config_data['app_title'];
      this.language = JSON.parse(sessionStorage.getItem('current_lang')); 
    }
    
  }

  ngOnChanges() {
   // this.commonData.checkSession();
  }
 
  logout(){

    this.CommonService.RemoveLoggedInUser().subscribe(
      data => {
        debugger
        if(data){
          alert("remove license done");
        }else{
          alert("there is some issue in removing license");
        }

        // this.router.navigateByUrl('account');
      },
      error => {
        debugger
        alert("remove license Failed");
      }
    );
    
    this.CommonService.signOut(this.toastr, this.router);


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

 

}
