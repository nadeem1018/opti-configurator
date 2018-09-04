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
  public view_route_link = '/feature/bom/view';
  public lookupfor: string = '';
  public isUpdateButtonVisible: boolean = false;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public isExplodeButtonVisible: boolean = true;
  public isAssociatedBOMButtonVisible: boolean = true;
  public update_id: string = "";
  public companyName: string = "";
  public username: string = "";
  public typevaluefromdatabase: string = "";
  public defaultcheckbox: boolean = false;
  public currentrowindex: number;
  public isDisplayNameDisabled: boolean = false;
  public isTypeDisabled: boolean = false;
  public ishide: boolean = false;
  public isQuanityDisabled: boolean = true;
  public isQuanity: number ;

  serviceData: any;
  counter = 0;


  constructor(private route: Router, private fbom: FeaturebomService, private toastr: ToastrService, private router: Router, private ActivatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
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
      this.fbom.GetDataByFeatureId(this.update_id).subscribe(
        data => {
          if (data.FeatureDetail.length > 0) {
            for (let i = 0; i < data.FeatureDetail.length; ++i) {
              if (data.FeatureDetail[i].OPTM_TYPE == 1) {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_CHILDFEATUREID.toString()
                this.isDisplayNameDisabled = false
                this.isTypeDisabled = false
                this.ishide = false
                this.isQuanityDisabled=true
                this.isQuanity=data.FeatureDetail[i].OPTM_QUANTITY
              }
              else if (data.FeatureDetail[i].OPTM_TYPE == 2) {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_ITEMKEY.toString()
                this.isDisplayNameDisabled = false
                this.isTypeDisabled = false
                this.ishide = false
                this.isQuanityDisabled=true
                this.isQuanity=data.FeatureDetail[i].OPTM_QUANTITY
              }
              else {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_VALUE.toString()
               // this.isDisplayNameDisabled = false
                this.isDisplayNameDisabled = false
              //  this.isTypeDisabled = false
                this.isTypeDisabled = false
                this.ishide = true
                this.isQuanityDisabled=false
                this.isQuanity=0
              }
              if (data.FeatureDetail[i].default == "Y") {
                this.defaultcheckbox = true
              }
              else {
                this.defaultcheckbox = false
              }


              this.feature_bom_table.push({
                rowindex: data.FeatureDetail[i].OPTM_LINENO,
                FeatureId: data.FeatureDetail[i].OPTM_FEATUREID,
                type: data.FeatureDetail[i].OPTM_TYPE,
                type_value: this.typevaluefromdatabase,
                display_name: data.FeatureDetail[i].OPTM_DISPLAYNAME,
                quantity: this.isQuanity,
                default: this.defaultcheckbox,
                remark: data.FeatureDetail[i].OPTM_REMARKS,
                attachment: data.FeatureDetail[i].OPTM_ATTACHMENT,
                isDisplayNameDisabled: this.isDisplayNameDisabled,
                isTypeDisabled: this.isTypeDisabled,
                hide: this.ishide,
                CompanyDBId: data.FeatureDetail[i].OPTM_COMPANYID,
                CreatedUser: data.FeatureDetail[i].OPTM_CREATEDBY
              });

            }
          }
          if (data.FeatureHeader.length > 0) {
            this.feature_bom_data.feature_id = data.FeatureDetail[0].OPTM_FEATUREID;
            this.feature_bom_data.feature_name = data.FeatureHeader[0].OPTM_DISPLAYNAME;
            this.feature_bom_data.feature_desc = data.FeatureHeader[0].OPTM_FEATUREDESC;
            this.feature_bom_data.image_path = data.FeatureHeader[0].OPTM_PHOTO;
            this.feature_bom_data.is_accessory = data.FeatureHeader[0].OPTM_ACCESSORY;
          }




        }


      )
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
      FeatureId: this.feature_bom_data.feature_id,
      type: 1,
      type_value: "",
      display_name: "",
      quantity: 1,
      default: "N",
      remark: "",
      attachment: "",
      isDisplayNameDisabled: false,
      isTypeDisabled: false,
      hide: false,
      isQuanityDisabled:true,
      CompanyDBId: this.companyName,
      CreatedUser: this.username
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

  onSaveClick() {

    if (this.feature_bom_table.length > 0) {
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if( this.feature_bom_table[i].default==false){
          this.feature_bom_table[i].default="N"
        }
        else{
          this.feature_bom_table[i].default="Y"
        }
       
      }
    }

    this.fbom.SaveModelBom(this.feature_bom_table).subscribe(
      data => {
        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('feature/bom/view');
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  on_bom_type_change(selectedvalue, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (selectedvalue == 3) {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = true
          this.feature_bom_table[i].type = 3
          this.feature_bom_table[i].isQuanity=0;
          this.feature_bom_table[i].isQuanityDisabled=false



        }
        else {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = false
          if (selectedvalue == 2) {
            this.feature_bom_table[i].type = 2
          }
          else {
            this.feature_bom_table[i].type = 1
          }
        }


      }
    }
    this.getFeatureDetails(this.feature_bom_data.feature_id, "Detail", selectedvalue);

  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].quantity = value


      }
    }

  }

  on_remark_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].remark = value
      }
    }
  }

  on_displayname_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].display_name = value
      }
    }
  }

  on_typevalue_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = value
      }
    }
  }

  on_defualt_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].default = "Y"
        }
        else {
          this.feature_bom_table[i].default = "N"
        }



      }
    }

  }



  getLookupValue($event) {
    if (this.lookupfor == 'feature_lookup') {
      this.feature_bom_data.feature_id = $event;
      this.getFeatureDetails($event, "Header", 0);
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.lookupfor = 'Item_Detail_lookup';
      this.getItemDetails($event);

    }
    else {
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

  getItemDetails(ItemKey) {
    this.fbom.getItemDetails(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
              this.feature_bom_table[i].type_value = data[0].ItemKey
              this.feature_bom_table[i].display_name = data[0].Description

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
                  this.feature_bom_table[i].type_value = data[0].OPTM_FEATUREID.toString()
                  this.feature_bom_table[i].display_name = data[0].OPTM_DISPLAYNAME

                }
              }
            }
          }
          else {
            if (index == 1) {
              this.lookupfor = 'feature_Detail_lookup';
            }
            else {
              this.lookupfor = 'Item_Detail_lookup';
            }

            this.serviceData = data;
          }
        }
      }
    )
  }

  

  onDeleteClick(){
    var result = confirm(this.language.DeleteConfimation);
        if (result) {
            this.fbom.DeleteData(this.feature_bom_data.feature_id).subscribe(
                data => {
                    if (data === "True") {
                        this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                        this.router.navigateByUrl('feature/bom/view');
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

  onAssociatedBOMClick(){

  }

  onExplodeClick() { 
    this.lookupfor = 'tree_view_lookup';
  }
  
}
