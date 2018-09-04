import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonData } from "../../models/CommonData";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginCredentials:any =[];
  public psURL: string = '';
  public showCompDropDown:boolean = false;
  public showLoginBtn:boolean = false;
  public config_params:any;
  public assignedCompanies:any;
  public selecetedComp:any;
  public disbleConnectBtn:boolean = true;
  

  private commonData = new CommonData();
  public page_title = this.commonData.project_name;
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  constructor(   
    private auth: AuthenticationService, 
    private router: Router,
    private httpClientSer: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit() { 
    //this.loginCredentials.userName = 'shashank';
    //this.loginCredentials.password = 'sha@123';
    console.info('in LOGIN header');
    if (sessionStorage.getItem('isLoggedIn') == 'true') {
      this.router.navigateByUrl('/home');
    } else {
      //This Function will get the url from Database to hit Admin Portal Services
      setTimeout(()=>{
        this.getPSURL();
      }, 1000);
    }
  }

  enter_to_sublit(event){
    if(event.keyCode == 13){
      console.log('in enter function ');
      this.onConnectBtnPress();
    }
  }

  //Events
  onConnectBtnPress(){
      console.log(this.loginCredentials);
      if(this.loginCredentials.userName == undefined || this.loginCredentials.userName == null){
        this.toastr.warning('', this.language.UserNameRequired, this.commonData.toast_config);
        return;
      }
      if(this.loginCredentials.password == undefined || this.loginCredentials.password == null){
        this.toastr.warning('', this.language.PasswordRequired, this.commonData.toast_config);
        return;
      }
      if(this.loginCredentials.userName != undefined && this.loginCredentials.password !=undefined){
     
        this.auth.login(this.loginCredentials, this.psURL).subscribe(
          data => {
        if(data!=null || data.Table.length > 0){
          if(data.Table.length > 0){
            if(data.Table[0].OPTM_ACTIVE == 1){
              //If everything is ok then we will get comapnies
              this.getCompanies();
            }
            else{
              //If user is not active
              this.toastr.warning('', this.language.UserNotActive, this.commonData.toast_config);
            }
          }
          else{
            //If no table found
            this.toastr.error('', this.language.InvalidCredentials, this.commonData.toast_config);
          }
        }else{
            //If no username & pass matches
            this.toastr.error('', this.language.InvalidCredentials, this.commonData.toast_config);
        }
          })
      }
    
  }

  onLoginBtnPress(){
   
    if(this.selecetedComp == undefined){
      this.toastr.warning('', this.language.CompanyRequired, this.commonData.toast_config);
      return;
    }
    else{
    if(this.selecetedComp.OPTM_COMPID == undefined){
      this.toastr.warning('', this.language.CompanyRequired, this.commonData.toast_config);
      return;
    } 
    sessionStorage.setItem('selectedComp', this.selecetedComp.OPTM_COMPID);
    sessionStorage.setItem('loggedInUser', this.loginCredentials.userName);
    //sessionStorage.setItem('selectedWhse',this.warehouseName);
    sessionStorage.setItem('isLoggedIn', "true");
    // this.router.navigateByUrl('/home');
    window.location.href = '/home';
    }
  }
  
  onUserNameBlur(){
    
  }
  onPasswordBlur(){
  
  }
  //Core Functions 
  //To get url from DB
  getPSURL(){
    //This will get the psURL
    this.auth.getPSURL().subscribe(
      data => {
        if (data != null) {
          this.psURL = data;
          //For code analysis remove in live enviorments.
           // this.psURL = "http://localhost:57962/";
          this.psURL = "http://172.16.6.140/OptiAdmin";
        }
      }
    )
  }

  //to get the companies assigned to user
  getCompanies(){
    this.auth.getCompany(this.loginCredentials, this.psURL).subscribe(
      data => {
      if(data!=null || data!= undefined){
        this.assignedCompanies = data.Table;
        if(this.assignedCompanies != null){
          //If comp found
          this.showCompDropDown = true;
          this.showLoginBtn = true;


        }
        else{
          //If no companies found then will hide elements
          this.showCompDropDown = false;
          this.showLoginBtn = false;
        }

      }
      else{
        //if No companies are retriving then we will consider that user have no company assignment
       // alert("You Don't have Permission to Access this Product");
        this.toastr.success('', this.language.isUserPermitted, this.commonData.toast_config);
      }
     

        // if (this.modelSource != undefined
        //   && this.modelSource != null
        //   && this.modelSource.Table.length > 0) {
        //   //Show the Company Combo box
        //   this.listItems = data.Table;
        //   console.log("data", this.listItems);
        //   this.selectedValue = this.listItems[0];
        //   this.disableLoginBtn = false;
        //   this.hasCompaneyData = true;
        //   this.invalidCredentials = false;
        //   this.InvalidActiveUser = false;
          
        //   //When the first item sets in the drop down then will get its warehouse
        //   this.getWarehouse(this.selectedValue.OPTM_COMPID);
        //   this.showLoader = false;
        // }
        // else {
        //   this.disableLoginBtn = true;
        //   this.hasCompaneyData = false;
        //   this.listItems = this.defaultCompnyComboValue;
        //   this.selectedValue = this.listItems[0];
        //   this.InvalidActiveUser = true;
        //   this.showLoader = false;
        // }
      }
    )
  }

  
}
