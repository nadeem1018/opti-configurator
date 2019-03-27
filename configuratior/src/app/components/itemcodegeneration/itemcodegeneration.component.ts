import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { UIHelper } from '../../helpers/ui.helpers';



@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;
  @ViewChild("button") _button: ElementRef;
  
  public commonData = new CommonData();
  public view_route_link = '/item-code-generation/view';
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor(private router: ActivatedRoute, private route: Router, private itemgen: ItemcodegenerationService, private toastr: ToastrService,private commanService: CommonService) {

  }
  companyName: string;
  page_main_title = this.language.ItemCodeGeneration
  public itemCodeGen: any = [];
  public itemcodetable: any = [];
  public stringtypevalue: any = [];
  public opertions: any = [];
  public stringType: any = [];
  public counter: number = 0;
  public finalstring: string = "";
  public countnumberrow: number = 0;
  public codekey: string = "";
  public GetItemData: any = [];
  public DefaultTypeValue: any = [];
  public button = "save"
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = true;
  public isCodeDisabled: boolean = true;
  public username: string = "";
  public showLoader: boolean = true;
  //button show/hide variables
  public showAddRowbtn:boolean = true;
  public showRemoveBtn:boolean = true;
  public isReadOnly:boolean
  public isUpdationAllowed:boolean
  public isAdditionAllowed:boolean
  public isDeletionAllowed:boolean
  public isFullPermitted:boolean
  public PermissionStr:any = [];
  public isOperationDisable:boolean=true;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  isMobile:boolean=false;
  isIpad:boolean=false;
  isDesktop:boolean=true;
  isPerfectSCrollBar:boolean = false;
  

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

    const element = document.getElementsByTagName('body')[0];
    element.className = '';
    this.detectDevice();
    element.classList.add('sidebar-toggled');

    this.commonData.checkSession();
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    
    //get permissions
    this.getUserPermissionDetials();
    
    this.stringtypevalue = this.commonData.stringtypevalue
    this.opertions = this.commonData.opertions
    this.codekey = "";
    this.codekey = this.router.snapshot.paramMap.get('id');
    if (this.codekey === "" || this.codekey === null) {
      this.button = "save"
    }
    else {
      this.button = "update"
    }
    if (this.button == "update") {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.isCodeDisabled = false;
      this.GetItemData = []
      this.GetItemData.push({
        CompanyDBId: this.companyName,
        ItemCode: this.codekey

      })
      this.itemgen.getItemCodeGenerationByCode(this.GetItemData).subscribe(
        data => {
          this.finalstring = "";

          for (let i = 0; i < data.length; ++i) {
            if(data[i].OPTM_TYPE==1){
              this.isOperationDisable=true
            }

            if(data[0].Reference==false && data[i].OPTM_TYPE==2){
              this.isOperationDisable=false
            }
  
            this.itemcodetable.push({
              rowindex: data[i].OPTM_LINEID,
              string: data[i].OPTM_CODESTRING,
              stringtype: data[i].OPTM_TYPE,
              operations: data[i].OPTM_OPERATION,
              delete: "",
              CompanyDBId: this.companyName,
              codekey: this.codekey,
              CreatedUser: this.username,
              isOperationDisable:this.isOperationDisable
             
            })
            this.finalstring = this.finalstring + data[i].OPTM_CODESTRING
          }
          this.showLoader  = false;
        }
      )

      //Check Permission
     
      this.checkPermission("edit");
    }
    else{
      
     // this.setfocus=true
      this.isCodeDisabled=true;
      this.isUpdateButtonVisible=false;
      this.isSaveButtonVisible=true;
      this.isDeleteButtonVisible=false;
      // this.counter=1;
      this.onAddRow(1);
     /*  this.itemcodetable.push({
        rowindex:this.counter,
        string:"",
        stringtype:1,
        operations:1,
        delete:"",
        CompanyDBId:this.companyName,
        codekey:this.codekey,
        CreatedUser:this.username,
        isOperationDisable:true
      }) */
     
      //Check Permission
      this.showLoader  = false;
      this.checkPermission("save");
      
    }

      //Check Permission
      this.checkPermission("general");
  }
  ngAfterViewInit() {
    if(this.codekey === "" || this.codekey === null){
    this._el.nativeElement.focus();
    }
    else{
      this._button.nativeElement.focus();
    }
  }
  onAddRow(oninit) {
    if( oninit == 0 ){
      if (this.validateRowData("AddRow") == false) {
        return
      }
    }
    if (this.itemcodetable.length == 0) {
      this.counter = 0;
    }
    else {
      this.counter = this.itemcodetable.length
    }
    this.counter++;

    this.itemcodetable.push({
      rowindex: this.counter,
      string: "",
      stringtype: 1,
      operations: 1,
      delete: "",
      CompanyDBId: this.companyName,
      codekey: this.codekey,
      CreatedUser: this.username,
      isOperationDisable:true
    })

  }

  onDeleteRow(rowindex) {
    if (this.itemcodetable.length > 0) {
      for (let i = 0; i < this.itemcodetable.length; ++i) {
        if (this.itemcodetable[i].rowindex === rowindex) {
          this.itemcodetable.splice(i, 1);
          i = i - 1;

        }
        else {
          this.itemcodetable[i].rowindex = i + 1;
        }

      }
      this.finalstring = "";
      for (let i = 0; i < this.itemcodetable.length; ++i) {
        this.finalstring = this.finalstring + this.itemcodetable[i].string
      }
    }
  }

  onSaveClick() {
    if (this.validateRowData("SaveData") == false) {
      return;
    }
    console.log(this.itemcodetable);
    this.itemgen.saveData(this.itemcodetable).subscribe(
      data => {
      
        if (data == "7001") {
          this.commanService.RemoveLoggedInUser().subscribe();
          this.commanService.signOut(this.toastr, this.route);
          return;
        } 

        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('item-code-generation/view');
          return;
        } else if (data == "AlreadyExists"){
          this.toastr.error('', this.language.item_code_cannot_update, this.commonData.toast_config);
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      }
    )

  }

  onStringTypeSelectChange(selectedvalue, rowindex) {
    for (let i = 0; i < this.itemcodetable.length; ++i) {
      if (this.itemcodetable[i].rowindex === rowindex) {
        this.itemcodetable[i].stringtype = selectedvalue;
        if(selectedvalue==1){
          this.itemcodetable[i].isOperationDisable=true;
          this.itemcodetable[i].operations=1;
        }
        else{
          this.itemcodetable[i].isOperationDisable=false
        }
      }

    }

  }

  onStringOperationsSelectChange(selectedvalue, rowindex) {
    for (let i = 0; i < this.itemcodetable.length; ++i) {
      if (this.itemcodetable[i].rowindex === rowindex) {
        this.itemcodetable[i].operations = selectedvalue;
      }
    }

  }

  onDeleteClick() {
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
    // var result = confirm(this.language.DeleteConfimation);
    // if (result) {
    //   this.validateRowData("Delete")
    // }
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      this.validateRowData("Delete")
    }
    this.show_dialog = false;
  }
  onCodeStrBlur(code) {
    if(code !== "" && this.commonData.excludeSpecialCharRegex.test(code) === true) {
      this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
    }
  }
  onStrBlur(selectedvalue, rowindex, string_number) {
    if (string_number == 2){ // validate string on blur
      var rgexp = /^\d+$/;
      if (rgexp.test(selectedvalue) == false) {
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      }
    } else  {
      if (this.commonData.excludeSpecialCharRegex.test(selectedvalue.trim()) === true) {
        this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
      }
    }
    if (this.itemcodetable.length > 0) {
      this.finalstring = "";
      for (let i = 0; i < this.itemcodetable.length; ++i) {
        if (this.itemcodetable[i].rowindex === rowindex) {
          this.itemcodetable[i].string = selectedvalue.trim();
          this.itemcodetable[i].codekey = this.codekey.trim(); //bug:18908
        }
        this.finalstring = this.finalstring + this.itemcodetable[i].string
      }
    }

  }

  validateRowData(buttonpressevent) {
    if (buttonpressevent == "AddRow") {
      if (this.itemcodetable.length > 0) {

        for (let i = 0; i < this.itemcodetable.length; ++i) {
          if (this.itemcodetable[i].stringtype == 2 || this.itemcodetable[i].stringtype == 3) {
            if (isNaN(this.itemcodetable[i].string) == true) {
              this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
              return false;
            }
            if (this.itemcodetable[i].operations == 1) {
              this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
              return false;
            }

          }
          else {
            if (this.itemcodetable[i].operations != 1) {
              this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
              return false;
            }
          }
          if(this.itemcodetable[i].codekey =="" || this.itemcodetable[i].codekey ==null){
            this.itemcodetable[i].codekey=this.codekey
          }
          
        }
      }
    }
    else {
      if (buttonpressevent != "Delete") {
        if (this.itemcodetable.length == 0) {
          this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
          return false;
        }
        else {
          this.countnumberrow = 0;
          for (let i = 0; i < this.itemcodetable.length; ++i) {
            if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
              this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
              return false;
            } 
            else if(this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " "){
              this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
              return false;
            }
            else if(this.commonData.excludeSpecialCharRegex.test(this.codekey) === true) {
              this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
              return false;
            }
            if (this.itemcodetable[i].stringtype == 2 || this.itemcodetable[i].stringtype == 3) {
              if (isNaN(this.itemcodetable[i].string) == true) {
                this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
                return false;
              }
              if (this.itemcodetable[i].operations == 1) {
                this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }
              this.countnumberrow++;

            } else if(this.itemcodetable[i].stringtype == 1 && this.commonData.excludeSpecialCharRegex.test(this.itemcodetable[i].string) === true) {
              this.toastr.error('', this.language.ValidString, this.commonData.toast_config);
              return false;
            }
            else {
              if (this.itemcodetable[i].operations != 1) {
                this.toastr.error('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }

            }
            if(this.itemcodetable[i].string.trim() == ""){
              this.toastr.error('', this.language.EnterString, this.commonData.toast_config);
              return false;
            }

          }
          if (this.countnumberrow == 0) {
            this.toastr.error('', this.language.RowNumberType, this.commonData.toast_config);
            return false;

          }
        }
      }
      else {
        this.GetItemData = []
        this.GetItemData.push({
          CompanyDBId: this.companyName,
          ItemCode: this.codekey,
          GUID: sessionStorage.getItem("GUID"),
          UsernameForLic: sessionStorage.getItem("loggedInUser")
        })
        this.itemgen.getItemCodeReference(this.GetItemData).subscribe(
          data => {
            
            if (data == "True") {
              this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
              return false;
            }
            else {
              this.itemgen.DeleteData(this.GetItemData).subscribe(
                data => {
                  if(data != undefined && data.length > 0){
                    if (data[0].ErrorMsg == "7001") {
                        this.commanService.RemoveLoggedInUser().subscribe();
                        this.commanService.signOut(this.toastr, this.route);
                        return;
                    } 
                 }
                  if (data === "True") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.route.navigateByUrl('item-code-generation/view');
                    return;
                  }
                  else {
                    this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                    return;
                  }
                }
              )
            }
          }
        )
      }

    }
    if (this.codekey == " " || this.codekey == "" || this.codekey == null) {
      this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
      return false;
    }
    else if(this.codekey.trim() == "" || this.codekey.trim() == null || this.codekey.trim() == " "){
      this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
      return false;
    }
    if (this.finalstring.length > 50) {
      this.toastr.error('', this.language.StringLengthValidation, this.commonData.toast_config);
      return false;
    }

  }
  CheckDuplicateCode(){
    this.itemgen.CheckDuplicateCode(this.companyName, this.codekey).subscribe(
      data => {

        if(data != undefined && data.length > 0){
          if (data[0].ErrorMsg == "7001") {
              this.commanService.RemoveLoggedInUser().subscribe();
              this.commanService.signOut(this.toastr, this.route);
              return;
          } 
       }
       
        if(data[0].TOTALCOUNT > 0){
          this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
          this.codekey= "";
          return;
        }
        else{
          console.log(this.itemcodetable);
          for (let iCount = 0; iCount < this.itemcodetable.length; ++iCount) {
            this.itemcodetable[iCount]['codekey'] = this.codekey.replace(/ +/g, "");
          }
        } 
      }
    )
  }

  //get user permission
  getUserPermissionDetials(){

    this.commanService.getPermissionDetails().subscribe(
      data => {
        if(data !=null || data != undefined){
          // let isReadOnly:boolean
          // let isUpdationAllowed:boolean
          // let isAdditionAllowed:boolean
          // let isDeletionAllowed:boolean
          // let isFullPermitted:boolean

        // this.PermissionStr = data[0].OPTM_PERMISSION.split(",");

          // PermissionStr.forEach(function (indexValue) {
          //   if (PermissionStr[indexValue] == "A") {
          //       isAdditionAllowed = true;
          //   }
          //   else if (PermissionStr[indexValue] == "U") {
          //       isUpdationAllowed = true;
          //   }
          //   else if (PermissionStr[indexValue] == "D") {
          //       isDeletionAllowed = true;
          //   }
          //   else if (PermissionStr[indexValue] == "R") {
          //       isReadOnly = true;
          //   }
          // }); 

          // if (isAdditionAllowed === true && isUpdationAllowed == true && isDeletionAllowed === true) {
          //     this.showAddRowbtn = false;

          // }
        // else if (isAdditionAllowed === true && isUpdationAllowed == true) {
        //     oCurrentController.getView().byId("btnStartResumeId").setVisible(true);
        //     oCurrentController.getView().byId("btnBatchSerial").setVisible(true);
        //     oCurrentController.getView().byId("btnFinishId").setVisible(true);
        //     oCurrentController.getView().byId("btnInterruptId").setVisible(true);
        //     oCurrentController.getView().byId("btnAbortId").setVisible(true);
        //     oCurrentController.getView().byId("btnSubmitId").setVisible(true);
        //     var oTable = oCurrentController.getView().byId("tblResourceId");
        //     oTable.setShowOverlay(false);
        //     oCurrentController.getView().byId("txtQtyProducedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyAcceptedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyRejectedId").setVisible(true);
        //     oCurrentController.getView().byId("cmbxReason").setVisible(true);
        //     oCurrentController.getView().byId("txtRemarkId").setVisible(true);
        //     oCurrentController.getView().byId("txtAbortReasonId").setVisible(true);
        //     oCurrentController.getView().byId("btnGenerateQRCode").setVisible(true);
        // }
      
        // else if (isUpdationAllowed === true && isDeletionAllowed === true) {
        //     oCurrentController.getView().byId("btnStartResumeId").setVisible(true);
        //     oCurrentController.getView().byId("btnBatchSerial").setVisible(true);
        //     oCurrentController.getView().byId("btnFinishId").setVisible(true);
        //     oCurrentController.getView().byId("btnInterruptId").setVisible(true);
        //     oCurrentController.getView().byId("btnAbortId").setVisible(true);
        //     oCurrentController.getView().byId("btnSubmitId").setVisible(true);
        //     var oTable = oCurrentController.getView().byId("tblResourceId");
        //     oTable.setShowOverlay(false);
        //     oCurrentController.getView().byId("txtQtyProducedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyAcceptedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyRejectedId").setVisible(true);
        //     oCurrentController.getView().byId("cmbxReason").setVisible(true);
        //     oCurrentController.getView().byId("txtRemarkId").setVisible(true);
        //     oCurrentController.getView().byId("txtAbortReasonId").setVisible(true);
        //     oCurrentController.getView().byId("btnGenerateQRCode").setVisible(true);
        // }
      
        // else if (isUpdationAllowed === true) {
        //     oCurrentController.getView().byId("btnStartResumeId").setVisible(true);
        //     oCurrentController.getView().byId("btnBatchSerial").setVisible(true);
        //     oCurrentController.getView().byId("btnFinishId").setVisible(true);
        //     oCurrentController.getView().byId("btnInterruptId").setVisible(true);
        //     oCurrentController.getView().byId("btnAbortId").setVisible(true);
        //     oCurrentController.getView().byId("btnSubmitId").setVisible(true);
        //     var oTable = oCurrentController.getView().byId("tblResourceId");
        //     oTable.setShowOverlay(false);
        //     oCurrentController.getView().byId("txtQtyProducedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyAcceptedId").setVisible(true);
        //     oCurrentController.getView().byId("txtQtyRejectedId").setVisible(true);
        //     oCurrentController.getView().byId("cmbxReason").setVisible(true);
        //     oCurrentController.getView().byId("txtRemarkId").setVisible(true);
        //     oCurrentController.getView().byId("txtAbortReasonId").setVisible(true);
        //     oCurrentController.getView().byId("btnGenerateQRCode").setVisible(true);
        // }
      
          
        }
        else{
          this.toastr.error('', this.language.permission_load_error, this.commonData.toast_config);
        }
      },
      error =>{
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
      }
    ) 
  }

  checkPermission(mode){
    setTimeout(function(){
    
    if(this.PermissionStr != undefined){

    this.PermissionStr.forEach(function (indexValue) {
      if (this.PermissionStr[indexValue] == "A") {
          this.isAdditionAllowed = true;
      }
      else if (this.PermissionStr[indexValue] == "U") {
          this.isUpdationAllowed = true;
      }
      else if (this.PermissionStr[indexValue] == "D") {
          this.isDeletionAllowed = true;
      }
      else if (this.PermissionStr[indexValue] == "R") {
          this.isReadOnly = true;
      }
    }); 

    if(mode == "add"){
        if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
          this.isSaveButtonVisible = true;
        }
        else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
          this.isSaveButtonVisible = true;
        }
        // else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {
          
        // }
        // else if (this.isUpdationAllowed === true) {
      
        // }
    }
    if(mode == "edit"){
      if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
        this.isUpdateButtonVisible = true;
      }
      else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
        this.isUpdateButtonVisible = true;
      }
      else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {
        this.isUpdateButtonVisible = true;
      }
      else if (this.isUpdationAllowed === true) {
        this.isUpdateButtonVisible = true;
      }

    }
    // if(mode == "delete"){
    //    this.showRemoveBtn = true;
    // }
    if(mode == "general"){
          if (this.isAdditionAllowed === true && this.isUpdationAllowed == true && this.isDeletionAllowed === true) {
              this.showAddRowbtn = false;
              this.showRemoveBtn = true;
          }
          else if (this.isAdditionAllowed === true && this.isUpdationAllowed == true) {
            this.showAddRowbtn = false;
          }
          else if (this.isUpdationAllowed === true && this.isDeletionAllowed === true) {
            this.showRemoveBtn = true;
          }
          else if (this.isUpdationAllowed === true) {
         
          }
    }
  }
    
    }, 3000);
 }

}
