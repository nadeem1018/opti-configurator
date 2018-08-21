import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor() { }
  showFooter: boolean = (sessionStorage.getItem('isLoggedIn') !== null) ? true : false;
  config_data = JSON.parse(sessionStorage.getItem('system_config'));
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  
  ngOnInit(){ 
  }

  ngOnChanges() {  }

}
