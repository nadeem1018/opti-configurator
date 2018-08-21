import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  showSidebar: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  ngOnInit() { 


   }

}
