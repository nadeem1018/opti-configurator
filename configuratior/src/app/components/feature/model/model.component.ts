import { Component, OnInit } from '@angular/core';
import { FeaturemodelService } from 'src/app/services/featuremodel.service';
import { LookupComponent } from 'src/app/components/common/lookup/lookup.component';
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  public featureBom: any=[];
  constructor(private fms: FeaturemodelService,private lookupData: LookupComponent) { }
  companyName: string ;
  showLookup: boolean = false;
  showLookupItem: boolean = false;
  openedLookup: string = '';
  columnsToShow: Array<string> = [];
  sWorkOrderLookupColumns = "OPTM_GROUPCODE";
  isWorkOrderListRightSection: boolean = false;
  allWODetails: any;
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
      this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
      this.openedLookup = "Lookup";
      this.isWorkOrderListRightSection = status;
      //this.openRightSection(status);
      this.showLookup = true;    
      //On Form Initialization get All WO
      this.getAllTemplateItems();
  
    }   
    
  getAllTemplateItems() {
    this.fms.getTemplateItems("SFDCDB").subscribe(
      data => {
        this.allWODetails = data;
        if (this.allWODetails.length > 0) {
          this.lookupData = this.allWODetails;
         this.showLookup=true;
        }
      }
    )
  }
  onItemGenerationPress(status){
    this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
    this.openedLookup = "Lookup";
    this.isWorkOrderListRightSection = status;
    this.showLookup = true;    
    //On Form Initialization get All WO
    this.getAllItemGenerated();
  }
  getAllItemGenerated() {
    this.fms.getGeneratedItems("SFDCDB").subscribe(
      data => {
        this.allWODetails = data;
        if (this.allWODetails.length > 0) {
          this.lookupData = this.allWODetails;
         this.showLookup=true;
        }
      }
    )
  }
}
