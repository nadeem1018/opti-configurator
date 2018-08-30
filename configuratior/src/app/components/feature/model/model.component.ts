import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { LookupComponent } from '../../common/lookup/lookup.component';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  providers:[LookupComponent],
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  public featureBom: any=[];
 public featureModel:any ={};
 //public featureModel:any =[];
 public form: FormGroup;
  
  public commonData = new CommonData();
  public view_route_link = '/feature/model/view';
  //constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  constructor(private fms: FeaturemodelService, private lookup: LookupComponent,private toastr: ToastrService,private router: Router,private ActivatedRouter: ActivatedRoute) { }
  page_main_title = 'Model Feature';
  companyName: string ;
  showLookup: boolean = false;
  showLookupItem: boolean = false;
  openedLookup: string = '';
  lookupfor:string = '';
  columnsToShow: Array<string> = [];
  sWorkOrderLookupColumns = "ItemCode";
  isWorkOrderListRightSection: boolean = false;
  allWODetails: any;
   serviceData: any;
   item:string =''; 
   public codekey:string="";
   public button="save";
   public isUpdateButtonVisible:boolean=false;
   public isSaveButtonVisible:boolean=true;
   public isDeleteButtonVisible:boolean=true;
   public selectedFile:string="";


   
  ngOnInit() {
    this.companyName = sessionStorage.getItem('selectedComp');
    var todaysDate = new Date();
    this.featureBom.Date  = todaysDate;
    this.codekey ="";
    this.codekey = this.ActivatedRouter.snapshot.paramMap.get('id');
    if(this.codekey === "" || this.codekey === null){
      this.button="save";
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
    }
    else{
      this.button="update";
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.fms.GetRecordById("SFDCDB", this.codekey).subscribe(
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
        })
    }
  }
  onSaveClick(){
    this.featureModel.Feature= [];
    this.featureModel.Picture= [];
    var validateStatus = this.Validation();
   // console.log(this.featureBom.ItemName);
if (validateStatus == true){
    this.featureModel.Feature.push({
      CompanyDBId:"SFDCDB",
      FeatureCode: this.featureBom.Code,
      DisplayName: this.featureBom.Name,
      FeatureDesc: this.featureBom.Desc,
      EffectiveDate: this.featureBom.Date,
      Type: this.featureBom.type,
      FeatureStatus:this.featureBom.Status,
      ModelTemplateItem:this.featureBom.ItemName,
      ItemCodeGenerationRef : this.featureBom.Ref,
      // PicturePath:this.selectedFile,
      CreatedUser: "ash",
      Accessory:this.featureBom.Accessory
    })
   
    this.featureModel.Picture.push({
      PicturePath:this.selectedFile

    });
    //  const fd=new FormData()
    //  fd.append('image',this.selectedFile,this.selectedFile.name)
    
    //  fd.append('Feature',JSON.stringify(this.featureModel))
    
   // alert(fd)
   // var jsFeature=JSON.stringify(this.featureModel);
   // fd.append("jsonData",jsFeature)
   
    this.fms.saveData(this.featureModel).subscribe(
     // this.fms.saveData(fd).subscribe(
      data => {
       // console.log(data);
        if (data == "True" ) {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.router.navigateByUrl(this.view_route_link);
          return;
        }
        else if(data == "Record Already Exist"){
          this.toastr.error('', 'Code already exists', this.commonData.toast_config);
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
      this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
      this.openedLookup = "Lookup";
      this.isWorkOrderListRightSection = status;
      //this.openRightSection(status);
      this.showLookup = true;    
      //On Form Initialization get All WO
      this.getAllTemplateItems();
      this.lookup.model_template_lookup();
  
    }   
    
  getAllTemplateItems() {
    this.fms.getTemplateItems("SFDCDB").subscribe(
      data => {
        this.serviceData = data;
       // console.log(data);
        //if(this.serviceData.length > 0)
         this.showLookup=true;
        //}
      }
    )
  }

  // onFileChanged(event) {
  //   this.selectedFile = <File>event.target.files[0]
  //   console.log( this.selectedFile)
  // }

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
    this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
    this.openedLookup = "Lookup";
    this.isWorkOrderListRightSection = status;
    this.showLookup = true;    
    //On Form Initialization get All WO
    this.getAllItemGenerated();
    this.lookup.model_item_generation_lookup();
  }
  getAllItemGenerated() {
    this.fms.getGeneratedItems("SFDCDB").subscribe(
      data => {
        this.serviceData = data;
        if (this.serviceData.length > 0) {
          //this.lookupData = this.allWODetails;
         this.showLookup=true;
        }
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
    console.log(this.featureBom.ItemName);
if (validateStatus == true){
    this.featureModel.push({
      CompanyDBId:"SFDCDB",
      FeatureId: this.codekey,
      FeatureCode: this.featureBom.Code,
      DisplayName: this.featureBom.Name,
      FeatureDesc: this.featureBom.Desc,
      EffectiveDate: this.featureBom.Date,
      Type: this.featureBom.type,
      FeatureStatus:this.featureBom.Status,
      ModelTemplateItem:this.featureBom.ItemName,
      ItemCodeGenerationRef : this.featureBom.Ref,
      PicturePath: this.selectedFile,
      CreatedUser: "ash",
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
          this.toastr.error('', 'Code already exists', this.commonData.toast_config);
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
      var result = confirm(this.language.DeleteConfimation);
if (result) {
    //Logic to delete the 
     // button click function in here
     this.fms.DeleteData("SFDCDB",this.codekey).subscribe(
      data => {
        if (data === "True" ) {
          this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
          this.router.navigateByUrl(this.view_route_link);
          return;
        }
        else{
          this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
          return;
        }
      }
    )
}
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
}
