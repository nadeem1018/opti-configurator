import { Component, OnInit } from '@angular/core';
import { CommonData } from "./models/CommonData";
import { CommonService } from "./services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  private commonData = new CommonData();
  showSidebar: boolean; 
  main_class = ""; // (sessionStorage.getItem('isLoggedIn') !== null) ? "col-md-9 ml-sm-auto col-lg-10 px-4" : "col-md-12 ml-sm-auto col-lg-12 px-4";

  constructor(private CommonService: CommonService) { }

  ngOnInit() {
    this.CommonService.currentIsLoggedInDataData.subscribe(
    (data) => {
        console.log('data'+data);
        this.showSidebar = data;
        }
    );
  }
}
