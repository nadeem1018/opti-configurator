import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { Router } from '@angular/router';
import { UIHelper } from 'src/app/helpers/ui.helpers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imgPath = 'assets/images';

  private baseClassObj = new CommonData();
  constructor(
    private router: Router,
  ) { }
  public commonData = new CommonData();

  isMobile:boolean=false;
  isIpad:boolean=false;
  isDesktop:boolean=true;
  isPerfectSCrollBar:boolean = false;
  public showLoader: boolean = true;


  detectDevice(){
    let getDevice = UIHelper.isDevice();
    this.isMobile = getDevice[0];
    this.isIpad = getDevice[1];
    this.isDesktop = getDevice[2];
    if(this.isMobile==true){
    this.isPerfectSCrollBar = true;
    }else if(this.isIpad==true){
    this.isPerfectSCrollBar = false;
    }else{
    this.isPerfectSCrollBar = false;
    }
  }

  ngOnInit() {
    this.commonData.checkSession();

    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    this.showLoader = true;
    this.detectDevice();
    element.classList.add("home-view-model");
    element.classList.add("opti_body-main-module");
    element.classList.add('sidebar-toggled');

    //this.router.navigateByUrl('/item-code-generation/view');
  }
  
  ngAfterViewInit() {
    //this.router.navigateByUrl('/item-code-generation/view');
  }

}
