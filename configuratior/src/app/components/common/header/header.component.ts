import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from "src/app/models/CommonData";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private commonData = new CommonData();

  constructor(private router: Router) { }
  project_name = this.commonData.project_name; 
  showHeader: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;

  
  ngOnInit() {
    this.checkSession();
  }
 

  logout(){
    sessionStorage.clear();
    localStorage.clear();
    // this.router.navigateByUrl('/login');
    window.location.href = '/login';
  }

  checkSession(){
    if(sessionStorage.getItem('isLoggedIn') == null){
      this.router.navigateByUrl('/login');
    } 
   

  }

}
