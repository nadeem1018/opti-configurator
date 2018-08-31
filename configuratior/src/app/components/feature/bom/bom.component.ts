import { Component, OnInit } from '@angular/core';
import { FeaturebomService } from '../../../services/featurebom.service';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent implements OnInit {
  public feature_bom_data: any = [];
  public feature_bom_table: any = [];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public commonData = new CommonData();
  public view_route_link = '/feature/model/view';
  public lookupfor: string = '';
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public isExplodeButtonVisible: boolean = true;
  public isAssociatedBOMButtonVisible: boolean = true;
  public update_id: string = "";
  public currentrowindex: number;
  // public isDisplayNameDisabled: boolean = false;
  // public isTypeDisabled: boolean = false;
  
  serviceData: any;
  counter = 0;


  constructor(private fbom: FeaturebomService, private toastr: ToastrService, private router: Router, private ActivatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
    }
    else {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
    }
  }

  onAddRow() {
    this.counter = 0;
    if (this.feature_bom_table.length > 0) {
      this.counter = this.feature_bom_table.length
    }
    this.counter++;

    this.feature_bom_table.push({
      rowindex: this.counter,
      FeatureId:this.feature_bom_data.feature_id,
      type: 1,
      type_value: "",
      display_name: "",
      quantity: 0,
      default: "",
      remark: "",
      attachment: "",
      isDisplayNameDisabled:true,
      isTypeDisabled:true,
      hide:false
    });
  };

  onDeleteRow(rowindex) {
    if (this.feature_bom_table.length > 0) {
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.feature_bom_table[i].rowindex === rowindex) {
          this.feature_bom_table.splice(i, 1);
          i = i - 1;
        }
        else {
          this.feature_bom_table[i].rowindex = i + 1;
        }
      }
    }
  }

  onSaveClick(){

    this.fbom.SaveModelBom(this.feature_bom_table).subscribe(
      data => {
        if (data.length > 0) {
          // this.serviceData = data;
          // console.log(this.serviceData);

        }
      }
    )
  }

  on_bom_type_change(selectedvalue, rowindex) {
    this.currentrowindex=rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (selectedvalue== 3){
          this.feature_bom_table[i].isDisplayNameDisabled=false
          this.feature_bom_table[i].isTypeDisabled=false
          this.feature_bom_table[i].hide=true
          
    
         }
         else{
          this.feature_bom_table[i].isDisplayNameDisabled=true
          this.feature_bom_table[i].isTypeDisabled=true
          this.feature_bom_table[i].hide=false
         }
      
        
      }
    }
    this.getFeatureDetails(this.feature_bom_data.feature_id, "Detail", selectedvalue);
    
  }



  getLookupValue($event) {
    if (this.lookupfor == 'feature_lookup') {
      this.feature_bom_data.feature_id = $event;
      this.getFeatureDetails($event, "Header", 0);
    }
    else if(this.lookupfor == 'Item_Detail_lookup') {
      this.lookupfor = 'Item_Detail_lookup';
      this.getItemDetails($event);
      
    }
    else{
      this.lookupfor = 'feature_Detail_lookup';
      this.getFeatureDetails($event, "Header", 0);
    }

  }

  openFeatureLookUp(status) {
    console.log('inopen feature');

    this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
          console.log(this.serviceData);

        }
      }
    )
  }

  getItemDetails(ItemKey){
    this.fbom.getItemDetails(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
        for (let i = 0; i < this.feature_bom_table.length; ++i) {
          if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
            this.feature_bom_table[i].type_value=data[0].ItemKey
            this.feature_bom_table[i].display_name=data[0].Description
            
          }
        }
      }
      })
  }

  getFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');

    //this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Header") {
            if (this.lookupfor == 'feature_lookup') {
              // this.feature_bom_data.feature_id = data;
              this.feature_bom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.feature_bom_data.feature_desc = data[0].OPTM_FEATUREDESC;
              // this.feature_bom_data.image_path = data[0];
              this.feature_bom_data.is_accessory = data[0].OPTM_ACCESSORY;
            }
            else {
              // this.feature_bom_table=data;
              for (let i = 0; i < this.feature_bom_table.length; ++i) {
                if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
                  this.feature_bom_table[i].type_value=data[0].OPTM_FEATUREID
                  this.feature_bom_table[i].display_name=data[0].OPTM_DISPLAYNAME
                  
                }
              }
            }
          }
          else {
            if(index==1){
              this.lookupfor = 'feature_Detail_lookup';
            }
            else{
              this.lookupfor = 'Item_Detail_lookup';
            }
         
            this.serviceData = data;
          }
        }
      }
    )
  }

  onExplodeClick(){

  }

  onAssociatedBOMClick(){

  }



}
