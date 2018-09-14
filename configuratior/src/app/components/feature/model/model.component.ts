import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { LookupComponent } from '../../common/lookup/lookup.component';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as XLSX from 'ts-xlsx';
import { _keyValueDiffersFactory } from '@angular/core/src/application_module';



@Component({
  providers:[LookupComponent],
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;
  @ViewChild("select") _ele: ElementRef;
  
  public featureBom: any=[];
 //public featureModel:any ={};
 public featureModel:any =[];
 public form: FormGroup;
  
  public commonData = new CommonData();
  public view_route_link = '/feature/model/view';
  //constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  constructor(private fms: FeaturemodelService, private lookup: LookupComponent,private toastr: ToastrService,private router: Router,private ActivatedRouter: ActivatedRoute) { }
  page_main_title = 'Model/Feature Master';
  section_title="";
  companyName: string ;
  username: string;
  lookupfor:string = '';
   serviceData: any;
   item:string =''; 
   public codekey:string="";
   public button="save";
   public isUpdateButtonVisible:boolean=false;
   public isSaveButtonVisible:boolean=true;
   public isDeleteButtonVisible:boolean=true;
   public selectedFile:string="";
   public model_name_label =  this.language.Model_Name;
   public model_desc_label =  this.language.Model_Desc;
   public code_disabled= "false";
   public GetItemData: any = [];

   //custom dialoag params
   public dialog_params: any = [];
   public show_dialog: boolean = false;

   
  ngOnInit() {
    this.commonData.checkSession();
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    var todaysDate = new Date();
    this.featureBom.Date  = todaysDate;
    this.codekey ="";
    this.codekey = this.ActivatedRouter.snapshot.paramMap.get('id');
    
    if(this.codekey === "" || this.codekey === null){
      this.button="save";
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.section_title = this.language.add;
      this.featureBom.Accessory = 'N';
      this.featureBom.Status= "Active";
      this.code_disabled= "false";
      this._el.nativeElement.focus();
    }
    else{
      this.button="update";
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.section_title = this.language.edit;
      this.code_disabled= "true";
      
      this.fms.GetRecordById(this.companyName, this.codekey).subscribe(
        data => {
          console.log(data);
this.featureBom.Code= data[0].OPTM_FEATURECODE
this.featureBom.Name= data[0].OPTM_DISPLAYNAME
this.featureBom.Desc= data[0].OPTM_FEATUREDESC
this.featureBom.Date=data[0].OPTM_EFFECTIVEDATE
this.featureBom.type=data[0].OPTM_TYPE
this.featureBom.Status=data[0].OPTM_STATUS
this.featureBom.ItemName=data[0].OPTM_MODELTEMPLATEITEM
this.featureBom.Ref=data[0].OPTM_ITEMCODEGENREF
this.featureBom.Accessory=data[0].OPTM_ACCESSORY
console.log(data[0].OPTM_TYPE);
if(data[0].OPTM_TYPE == "Feature"){
  this.model_name_label=this.language.Model_FeatureName;
  this.model_desc_label= this.language.Model_FeatureDesc;
}else{
  this.model_name_label=this.language.Model_ModelName;
  this.model_desc_label= this.language.Model_ModelDesc;
}
        })
    }
  }
  ngAfterViewInit() {
    if(this.codekey === "" || this.codekey === null){
    this._el.nativeElement.focus();
    }
    else{
      this._ele.nativeElement.focus();
    }
  }

  onTypeLookupChange(){
if(this.featureBom.type == "Feature"){
  this.model_name_label=this.language.Model_FeatureName;
  this.model_desc_label= this.language.Model_FeatureDesc;
}else{
  this.model_name_label=this.language.Model_ModelName;
  this.model_desc_label= this.language.Model_ModelDesc;
}

  }
  onSaveClick(){
    this.featureModel= [];
    var validateStatus = this.Validation();
if (validateStatus == true){
    this.featureModel.push({
      CompanyDBId:this.companyName,
      FeatureCode: this.featureBom.Code,
      DisplayName: this.featureBom.Name,
      FeatureDesc: this.featureBom.Desc,
      EffectiveDate: this.featureBom.Date,
      Type: this.featureBom.type,
      FeatureStatus:this.featureBom.Status,
      ModelTemplateItem:this.featureBom.ItemName,
      ItemCodeGenerationRef : this.featureBom.Ref,
      PicturePath: this.featureBom.Image,
      CreatedUser: this.username,
      Accessory:this.featureBom.Accessory
    })
   
    this.fms.saveData(this.featureModel).subscribe(
     
      data => {
     
        if (data == "True" ) {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.router.navigateByUrl(this.view_route_link);
          return;
        }
        else if(data == "Record Already Exist"){
          this.toastr.error('',this.language.DuplicateCode, this.commonData.toast_config);
          return;
        }
        else{
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      })
    }
    }

    onTemplateItemPress(status) {
      this.lookupfor = 'model_template';
      this.getAllTemplateItems();
  
    }   
    
  getAllTemplateItems() {
    this.fms.getTemplateItems(this.companyName).subscribe(
      data => {
        this.serviceData = data;
       
      }
    )
  }

  uploadimagefile(files: any) {
    if (files.length === 0)
      return;
    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }

    this.fms.UploadFeature(formData).subscribe(data => {
      if (data.body === "False") {
        this.toastr.error('', this.language.filecannotupload, this.commonData.toast_config);
      }
      else {
        this.featureBom.Image= data.body
      }
    })
  }


  onFileChanged(event) {
    
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      this.selectedFile = reader.result.split(',')[1]
       //this.selectedFile = btoa(reader.result.split(',')[1]);
      console.log(  this.selectedFile )
    }
  }

  onItemGenerationPress(status){
    this.lookupfor = 'model_item_generation';
    this.getAllItemGenerated();
  }
  getAllItemGenerated() {
    this.fms.getGeneratedItems(this.companyName).subscribe(
      data => {
        this.serviceData = data;
      }
    )
  }

  openImportPopup() {
    this.lookupfor = 'import_popup';
   
    }  
  
  
  //validation of inputs
  Validation () {
    if(this.featureBom.Code == undefined || this.featureBom.Code == ''){
      this.toastr.error('', this.language.CodeBlank, this.commonData.toast_config);
      return false;
    }
    
    if(this.featureBom.type == undefined || this.featureBom.type == ''){
      this.toastr.error('',this.language.TypeBlank, this.commonData.toast_config);
      return false;
    }
    if(this.featureBom.Name == undefined || this.featureBom.Name== ''){
      this.toastr.error('',this.language.ModelName, this.commonData.toast_config);
      return false;
    }
    if(this.featureBom.type == "Model"){
      if(this.featureBom.ItemName == undefined || this.featureBom.ItemName == ''){
      this.toastr.error('', this.language.ModelItem,this.commonData.toast_config);
      return false;
      }
      if(this.featureBom.Ref == undefined || this.featureBom.Ref == ''){
        this.toastr.error('',this.language.ModeRef,this.commonData.toast_config);
        return false;
        }
    }
    return true;
  }
  onUpdateClick(){
    this.featureModel= [];
    var validateStatus = this.Validation();
if (validateStatus == true){
    this.featureModel.push({
      CompanyDBId:this.companyName,
      FeatureId: this.codekey,
      FeatureCode: this.featureBom.Code,
      DisplayName: this.featureBom.Name,
      FeatureDesc: this.featureBom.Desc,
      EffectiveDate: this.featureBom.Date,
      Type: this.featureBom.type,
      FeatureStatus:this.featureBom.Status,
      ModelTemplateItem:this.featureBom.ItemName,
      ItemCodeGenerationRef : this.featureBom.Ref,
      PicturePath: this.featureBom.Image,
      CreatedUser:  this.username,
      Accessory:this.featureBom.Accessory
    })
    
    this.fms.updateData(this.featureModel).subscribe(
      data => {
        console.log(data);
        if (data == "True" ) {
          this.toastr.success('', this.language.DataUpdateSuccesfully, this.commonData.toast_config);
          this.router.navigateByUrl(this.view_route_link);
          return;
        }
        else if(data == "Record Already Exist"){
          this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
          return;
        }
        else{
          this.toastr.error('', this.language.DataNotUpdate, this.commonData.toast_config);
          return;
        }
      })
    }
    }

    onDeleteClick(){
       //var result = confirm(this.language.DeleteConfimation);
       this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
       this.show_dialog = true;
    }

    
    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
      if (userSelectionValue == true) {
        this.delete_record();

      }
      this.show_dialog = false;
    }

    delete_record(){
      //Logic to delete the 
      // button click function in here
      this.GetItemData=[]
          this.GetItemData.push({
              CompanyDBId: this.companyName,
              FEATUREID:this.codekey
          });
      this.fms.DeleteData(this.GetItemData).subscribe(
        data => {
          if (data === "True" ) {
            this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
            this.router.navigateByUrl(this.view_route_link);
            return;
          }
          else if(data === "Exist"){
            this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
            return;
          }
          else{
            this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
            return;
          }
        }
      )
    }

  getLookupValue($event){
    if (this.lookupfor != "") {
      if (this.lookupfor == "model_template") {
       this.featureBom.ItemName = $event;
      }
      if (this.lookupfor == "model_item_generation") {
       this.featureBom.Ref = $event;
      }
    }
  }
  onItemCodeChange(){
    this.fms.onItemCodeChange(this.companyName,this.featureBom.ItemName).subscribe(
      data => {
        if (data === "False" ) {
          this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
          this.featureBom.ItemName="";
          return;
        }
      })

  }
  onRefCodeChange(){
    this.fms.onRefCodeChange(this.companyName,this.featureBom.Ref).subscribe(
      data => {
        console.log(data);
        if (data === "False" ) {
          this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
          this.featureBom.Ref="";
          return;
        }
      })

  }
}
