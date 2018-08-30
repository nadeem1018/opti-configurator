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
  public update_id: string = "";
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

  onAddRow(){
    this.counter = 0;
    if (this.feature_bom_table.length > 0) {
      this.counter = this.feature_bom_table.length
    }
    this.counter++;
  
    this.feature_bom_table.push({
      rowindex: this.counter,
      type: "",
      type_value: "",
      display_name: "",
      quantity: "",
      default: "",
      remark: "",
      attachment: ""
    });
  };

  onDeleteRow(rowindex){
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

  on_bom_type_change(selectedvalue, rowindex){
    if (selectedvalue== 1){

    } else if (selectedvalue == 2) {

    } else if (selectedvalue == 3) {

    }
  }



  getLookupValue($event) {
   //  this.featureBom.ItemName = $event;
    this.getFeatureDetails($event);
  }

  openFeatureLookUp(status) {
    console.log('inopen feature');
    
    this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureList().subscribe(
      data => {
        if (data > 0) {
          this.serviceData = data;
          console.log(this.serviceData);
          
        }
      }
    )
  } 

  getFeatureDetails(feature_code) {
    console.log('inopen feature');

    this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureDetails(feature_code).subscribe(
      data => {
        if (data > 0) {
          // feature_bom_data.feature_id = data;
          // feature_bom_data.feature_name = data;
          // feature_bom_data.feature_desc = data;
          // feature_bom_data.image_path = data;

        }
      }
    )
  }

}
