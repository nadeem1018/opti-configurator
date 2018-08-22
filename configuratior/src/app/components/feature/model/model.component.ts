import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { LookupComponent } from '../../common/lookup/lookup.component';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  providers:[LookupComponent],
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  public featureBom: any=[];
  public featureModel:any =[];
  public commonData = new CommonData();
  public view_route_link = '/feature/model/view';
  //constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  constructor(private fms: FeaturemodelService, private lookup: LookupComponent,private toastr: ToastrService,private router: Router) { }
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
   
  ngOnInit() {
    this.companyName = sessionStorage.getItem('selectedComp');
    var todaysDate = new Date();
    this.featureBom.Date  = todaysDate;
  }
  onSaveClick(){
    this.featureModel= [];
    var validateStatus = this.Validation();
if (validateStatus == true){
    this.featureModel.push({
      CompanyDBId:"SFDCDB",
      FeatureCode: this.featureBom.Code,
      DisplayName: this.featureBom.Name,
      FeatureDesc: this.featureBom.Desc,
      EffectiveDate: this.featureBom.Date,
      Type: this.featureBom.type,
      FeatureStatus:this.featureBom.Status,
      ModelTemplateItem:this.featureBom.ItemName,
      ItemCodeGenerationRef : this.featureBom.Ref,
      PicturePath: "www",
      CreatedUser: "ash"
    })
    
    this.fms.saveData(this.featureModel).subscribe(
      data => {
        console.log(data);
        if (data == "True" ) {
          this.toastr.success('', 'Data saved successfully', this.commonData.toast_config);
          this.router.navigateByUrl(this.view_route_link);
          return;
        }
        else if(data == "Record Already Exist"){
          this.toastr.error('', 'Code already exists', this.commonData.toast_config);
          return;
        }
        else{
          this.toastr.error('', 'Data not saved', this.commonData.toast_config);
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
        if(this.serviceData.length > 0)
         this.showLookup=true;
        //}
      }
    )
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
  //validation of inputs
  Validation () {
    if(this.featureBom.Code == undefined){
      this.toastr.error('', 'Code cannot be blank', this.commonData.toast_config);
      return false;
    }
    if(this.featureBom.type == undefined){
      this.toastr.error('', 'Type cannot be blank', this.commonData.toast_config);
      return false;
    }
    if(this.featureBom.Name == undefined){
      this.toastr.error('', 'Model/Feature Name cannot be blank', this.commonData.toast_config);
      return false;
    }
    if(this.featureBom.type == "Model"){
      if(this.featureBom.ItemName == undefined){
      this.toastr.error('', 'Model Template Item cannot be blank', this.commonData.toast_config);
      return false;
      }
      if(this.featureBom.Ref == undefined){
        this.toastr.error('', 'Item Code Generation Ref cannot be blank', this.commonData.toast_config);
        return false;
        }
    }
    return true;
  }
}
