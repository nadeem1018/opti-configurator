import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from "src/app/models/CommonData";
 import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private commonData = new CommonData();

  constructor(private router: Router, private toastr: ToastrService) {}
  
  project_name = this.commonData.project_name; 
  showHeader: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  
  ngOnInit() {
    this.checkSession();
   
    
  }

  logout(){
    this.toastr.success('', 'Session has been stopped', this.commonData.toast_config);
    sessionStorage.clear();
    localStorage.clear();
    // this.router.navigateByUrl('/login');
   setTimeout(function(){
     window.location.href = '/login';
   }, 3000);
  }

  checkSession(){
    if(sessionStorage.getItem('isLoggedIn') == null){
      this.router.navigateByUrl('/login');
    }  
  }

 

}
