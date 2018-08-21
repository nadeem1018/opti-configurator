import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from '../../../services/featuremodel.service';
import { LookupComponent } from '../../common/lookup/lookup.component';


@Component({
  providers:[LookupComponent],
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  public featureBom: any=[];
  //constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  
  constructor(private fms: FeaturemodelService, private lookup: LookupComponent) { }
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
  }
  onSaveClick(){
    alert(this.featureBom.Code);
    alert(this.featureBom.Name);
    alert(this.featureBom.Desc);
    alert(this.featureBom.Date);
    alert(this.featureBom.type);
    alert(this.featureBom.Status);
    this.fms.saveData(this.companyName,this.featureBom).subscribe(
      data => {
        if(data == "True"){
         
        } 
      })
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
  
}
