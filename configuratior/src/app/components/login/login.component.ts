import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonData } from "../../models/CommonData";
import { CommonService } from "../../services/common.service";
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
  public config_data:any = [];
  public connectBtnText = "Connect";
  public language:any = [];
  private commonData = new CommonData();
  public background = this.commonData.get_current_url()+ "/assets/images/bg.jpg";
  public login = "Login..";
  public titleInfo = "Enter username and password";
  public username = "Username";
  public isUsernameBlank = "Enter Username";
  public password = "Password";
  public isPasswordBlank = "Enter Password";
  public login_btn = "Login";
  public reset_button_text = "Reset";
  public UserNotActive = 'User is not active';
  public InvalidCredentials = 'Username or password not valid';
  public CompanyRequired = 'Select Company';
  public UserNameRequired = 'Username required';
  public PasswordRequired = 'Password required';
  public onConnectSuccess:boolean = false;
  public page_title = this.commonData.project_name;
  common_params = new CommonData();
  record_per_page: any = this.common_params.default_count;
  constructor(   
    private auth: AuthenticationService, 
    private router: Router,
    private httpClientSer: HttpClient,
    private toastr: ToastrService,
    private CommonService: CommonService
  ) { }

  ngOnInit() { 
    this.selecetedComp = "";
    console.log(new Date());
    // this.CommonService.get_config();
    if (sessionStorage.getItem('isLoggedIn') == 'true') {
      this.router.navigateByUrl('/home');
    } else {
      //This Function will get the url from Database to hit Admin Portal Services
      setTimeout(()=>{
        this.getPSURL();
      }, 2000);
    }
  }

  ngAfterViewInit(){
    setTimeout(function () {
      console.log(new Date());
      this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
      this.language = JSON.parse(sessionStorage.getItem('current_lang'));
      if (this.language == undefined && this.language != "" && this.language != 0) {
        if (this.config_data != undefined && this.config_data != "") {
          if (this.config_data['locale'] != "" && this.config_data['locale'] != undefined && this.config_data['locale'] != 0) {
            //   this.CommonService.set_language(this.config_data['locale']);
            this.language = JSON.parse(sessionStorage.getItem('current_lang'));
          }
        }
        this.connectBtnText = this.language.connect;
        this.login = this.language.login;
        this.titleInfo = this.language.titleInfo;
        this.username = this.language.username;
        this.isUsernameBlank = this.language.isUsernameBlank;
        this.password = this.language.password;
        this.isPasswordBlank = this.language.isPasswordBlank;
        this.login_btn = this.language.login;
        this.reset_button_text = this.language.reset;
        this.UserNotActive = this.language.UserNotActive;
        this.InvalidCredentials = this.language.InvalidCredentials;
        this.CompanyRequired = this.language.CompanyRequired;
        this.UserNameRequired = this.language.UserNameRequired;
        this.PasswordRequired = this.language.PasswordRequired;
      }
    }, 2000);
  }

  enter_to_sublit(event){
    if(event.keyCode == 13){
      this.onConnectBtnPress();
    }
  }

  //Events
  onConnectBtnPress(){
      if(this.loginCredentials.userName == undefined || this.loginCredentials.userName == null){
        this.toastr.warning('', this.UserNameRequired, this.commonData.toast_config);
        return;
      }
      if(this.loginCredentials.password == undefined || this.loginCredentials.password == null){
        this.toastr.warning('', this.PasswordRequired, this.commonData.toast_config);
        return;
      }
      if(this.loginCredentials.userName != undefined && this.loginCredentials.password !=undefined){
     
        this.auth.login(this.loginCredentials, this.psURL).subscribe(
          data => {
        if(data!=null || data.Table.length > 0){
          if(data.Table.length > 0){
            if(data.Table[0].OPTM_ACTIVE == 1){

              this.connectBtnText = (this.language.connected != undefined) ? this.language.connected : "Connected";
              //If everything is ok then we will get comapnies
              this.getCompanies();
            }
            else{
              //If user is not active
              this.toastr.warning('', this.UserNotActive, this.commonData.toast_config);
            }
          }
          else{
            //If no table found
            this.toastr.error('', this.InvalidCredentials, this.commonData.toast_config);
          }
        }else{
            //If no username & pass matches
            this.toastr.error('', this.InvalidCredentials, this.commonData.toast_config);
        }
          })
      }
    
  }

  onLoginBtnPress(){
   
    if (this.selecetedComp == undefined && this.selecetedComp == "" ){
      this.toastr.warning('', this.CompanyRequired, this.commonData.toast_config);
      return;
    }
    else{
    if(this.selecetedComp.OPTM_COMPID == undefined){
      this.toastr.warning('', this.CompanyRequired, this.commonData.toast_config);
      return;
    } 
    sessionStorage.setItem('selectedComp', this.selecetedComp.OPTM_COMPID);
    sessionStorage.setItem('loggedInUser', this.loginCredentials.userName);
    sessionStorage.setItem('defaultRecords', this.record_per_page);
    sessionStorage.setItem('isLoggedIn', "true");
    // this.router.navigateByUrl('/home');
      // let home_page = this.commonData.application_path + '/index.html#home';
      let home_page = this.commonData.application_path + '/index.html#item-code-generation/view';
      
      window.location.href = home_page;
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
          this.psURL = "http://localhost:9500";
          //this.psURL = "http://172.16.6.140/OptiAdmin";

          sessionStorage.setItem('psURL', this.psURL);
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
          this.onConnectSuccess = true;
        }
        else{
          //If no companies found then will hide elements
          this.onConnectSuccess = false;
          this.showLoginBtn = false;
          this.showCompDropDown = false;
        }

      }
      else{
        //if No companies are retriving then we will consider that user have no company assignment
       // alert("You Don't have Permission to Access this Product");
        this.toastr.error('', this.language.isUserPermitted, this.commonData.toast_config);
      }
      }
    )
  }

  onResetClick(){
    this.onConnectSuccess = false;
    this.showLoginBtn = false;
    this.showCompDropDown = false;
    this.loginCredentials = [];
    this.loginCredentials.length = 0;
    this.connectBtnText = this.language.connect;
  }

  
}
