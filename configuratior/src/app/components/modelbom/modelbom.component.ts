import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ModelbomService } from '../../services/Modelbom.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-modelbom',
  templateUrl: './modelbom.component.html',
  styleUrls: ['./modelbom.component.scss']
})
export class ModelbomComponent implements OnInit {
  @ViewChild("Modelinputbox") _el: ElementRef;
  @ViewChild("button") _ele: ElementRef;
  public commonData = new CommonData();
  public view_route_link = '/modelbom/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modelbom_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public currentrowindex: number;
  public isExplodeButtonVisible: boolean = true;
  public isVerifyButtonVisible: boolean = true;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public showImageBlock: boolean = false;
  public selectedImage = "";
  public isPriceDisabled = true;
  public pricehide = true;
  public isUOMDisabled = true;
  public update_id: string = "";
  public typevaluefromdatabase: string = "";
  public isModelIdEnable: boolean = true;
  public ModelLookupBtnhide: boolean = true;
  

  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService) { }

  companyName: string;
  page_main_title = this.language.Model_Bom
  public username: string = "";
  serviceData: any;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;

  ngOnInit() {
    this.commonData.checkSession();
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
   /*  this.image_data = [
      "../../../assets/images/test/1.jpg",
      "../../../assets/images/test/2.jpg",
      "../../../assets/images/test/3.jpg",
      "../../../assets/images/test/4.jpg",
      "../../../assets/images/test/5.jpg",
      "../../../assets/images/test/6.jpg",
      "../../../assets/images/test/7.jpg",
      "../../../assets/images/test/8.jpg",
    ]; */
    if (this.image_data.length > 0) {
      this.showImageBlock = true;
    }
    if (this.update_id === "" || this.update_id === null) {
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.isModelIdEnable = false;
      this.ModelLookupBtnhide = false;
      this._el.nativeElement.focus();
    }
    else {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.isModelIdEnable = true;
      this.ModelLookupBtnhide = true;

      this.service.GetDataByModelId(this.update_id).subscribe(
        data => {
          if (data.ModelHeader.length > 0) {
            this.modelbom_data.modal_id=data.ModelDetail[0].OPTM_MODELID
            this.modelbom_data.feature_name = data.ModelHeader[0].OPTM_DISPLAYNAME;
            this.modelbom_data.feature_desc = data.ModelHeader[0].OPTM_FEATUREDESC;
           }

          if (data.ModelDetail.length > 0) {
            for (let i = 0; i < data.ModelDetail.length; ++i) {
              if (data.ModelDetail[i].OPTM_TYPE == 1) {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_FEATUREID.toString()
                this.isPriceDisabled = true
                this.pricehide = true
                this.isUOMDisabled = true
              }
              else if (data.ModelDetail[i].OPTM_TYPE == 2) {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_ITEMKEY.toString()
                this.isPriceDisabled = false
                this.pricehide = false
                this.isUOMDisabled = false
              }
              else {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_CHILDMODELID.toString()
                this.isPriceDisabled = true
                this.pricehide = true
                this.isUOMDisabled = true
              }

              this.modelbom_data.push({
                rowindex: data.ModelDetail[i].OPTM_LINENO,
                ModelId: data.ModelDetail[i].OPTM_MODELID,
                description:this.modelbom_data.feature_name ,
                readytouse: data.ModelDetail[i].OPTM_READYTOUSE,
                type: data.ModelDetail[i].OPTM_TYPE,
                type_value:  this.typevaluefromdatabase,
                display_name: data.ModelDetail[i].OPTM_DISPLAYNAME,
                uom: data.ModelDetail[i].OPTM_UOM,
                quantity: data.ModelDetail[i].OPTM_QUANTITY,
                min_selected: data.ModelDetail[i].OPTM_MINSELECTABLE,
                max_selected: data.ModelDetail[i].OPTM_MAXSELECTABLE,
                propagate_qty: data.ModelDetail[i].OPTM_PROPOGATEQTY,
                price_source: data.ModelDetail[i].OPTM_PRICESOURCE,
                mandatory: data.ModelDetail[i].OPTM_MANDATORY,
                unique_identifer: data.ModelDetail[i].OPTM_UNIQUEIDNT,
                isDisplayNameDisabled: false,
                isTypeDisabled: false,
                hide: false,
                CompanyDBId:data.ModelDetail[i].OPTM_COMPANYID,
                CreatedUser: data.ModelDetail[i].OPTM_CREATEDBY,
                isPriceDisabled:   this.isPriceDisabled,
                pricehide: this.pricehide ,
                isUOMDisabled:this.isUOMDisabled
              });

            }
          }
          




        }


      )
    }
  }

  ngAfterViewInit() {
    if(this.update_id === "" || this.update_id === null){
    this._el.nativeElement.focus();
    }
    else{
      this._ele.nativeElement.focus();
    }
  }

  onAddRow() {
    if(this.validation("Add")==false){
      return;
    }
    this.counter = 0;
    if (this.modelbom_data.length > 0) {
      this.counter = this.modelbom_data.length
    }
    this.counter++;

    this.modelbom_data.push({
      rowindex: this.counter,
      ModelId: this.modelbom_data.modal_id,
      description: this.modelbom_data.feature_desc,
      readytouse: "N",
      type: 1,
      type_value: "",
      display_name: "",
      uom: '',
      quantity: 1,
      min_selected: 1,
      max_selected: 1,
      propagate_qty: 'N',
      price_source: '',
      mandatory: 'N',
      unique_identifer: 'N',
      isDisplayNameDisabled: false,
      isTypeDisabled: false,
      hide: false,
      CompanyDBId: this.companyName,
      CreatedUser: this.username,
      isPriceDisabled: true,
      pricehide: true,
      isUOMDisabled:true
      
    });
  };

  onDeleteRow(rowindex) {
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if (this.modelbom_data[i].rowindex === rowindex) {
          this.modelbom_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.modelbom_data[i].rowindex = i + 1;
        }
      }
    }
  }

  clearData(rowindex){
    //this.modelbom_data[rowindex].type_value="";
    this.modelbom_data[rowindex].uom="";
    this.modelbom_data[rowindex].display_name="";
    this.modelbom_data[rowindex].quantity=0;
    this.modelbom_data[rowindex].min_selected=1;
    this.modelbom_data[rowindex].max_selected=1;
    this.modelbom_data[rowindex].propagate_qty='N';
    this.modelbom_data[rowindex].price_source='';
    this.modelbom_data[rowindex].mandatory='N';
    this.modelbom_data[rowindex].unique_identifer='N';
  }

  on_bom_type_change(selectedvalue, rowindex) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }
    this.serviceData =[]
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.clearData(i);
        if (selectedvalue == 3) {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = false
          this.modelbom_data[i].type = 3
          this.modelbom_data[i].isPriceDisabled = true
          this.modelbom_data[i].pricehide = true
          this.modelbom_data[i].isUOMDisabled = true
          this.modelbom_data[i].quantity=1
         



        }
        else {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = false
          this.modelbom_data[i].quantity=1
          if (selectedvalue == 2) {
            this.lookupfor = 'Item_Detail_lookup';
            this.modelbom_data[i].type = 2
            this.modelbom_data[i].isPriceDisabled = false
            this.modelbom_data[i].pricehide = false
            this.modelbom_data[i].isUOMDisabled = false
          }
          else {
            this.modelbom_data[i].type = 1
           this.lookupfor = 'feature_lookup';
            this.modelbom_data[i].isPriceDisabled = true
            this.modelbom_data[i].pricehide = true
            this.modelbom_data[i].isUOMDisabled = true


          }
        }


      }
    }
    // if (selectedvalue == 3) {
    //   this.getModelDetails(this.modelbom_data.modal_id, "Detail",selectedvalue )
    // }
    // else {
    //   this.lookupfor = 'Item_Detail_lookup';
    //   this.getModelFeatureDetails(this.modelbom_data.modal_id, "Detail", selectedvalue);
    // }


  }

  on_type_click(selectedvalue, rowindex) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }
    this.currentrowindex = rowindex
    if (selectedvalue == 3) {
      this.getModelDetails(this.modelbom_data.modal_id, "Detail",selectedvalue )
    }
    else {
      this.lookupfor = 'Item_Detail_lookup';
      this.getModelFeatureDetails(this.modelbom_data.modal_id, "Detail", selectedvalue);
    }

  }

  getModelFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');

    this.serviceData =[]
    this.service.getModelFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Header") {
            if (this.lookupfor == 'feature_lookup') {
              // this.feature_bom_data.feature_id = data;
              this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;

            }
            else {
              // this.feature_bom_table=data;
              for (let i = 0; i < this.modelbom_data.length; ++i) {
                if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                  this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID.toString()
                  this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME
                  
                  

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
        else{
          this.lookupfor = "";
          this.serviceData=[];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }





  /* file_input($event) {
    this.input_file = $event.target.files[0];

  }

  onUpload() {
    
    
    this.service.post_data_with_file(this.input_file, this.modelbom_data).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  } */

  openFeatureLookUp(status) {
    console.log('inopen feature');
    this.serviceData=[]
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.serviceData = data;
          console.log(this.serviceData);

        }
        else{
          this.lookupfor = "";
          this.serviceData=[];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  openPriceLookUp(ItemKey) {
    this.serviceData=[]
    this.service.GetPriceList(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'Price_lookup';
          this.serviceData = data;
          console.log(this.serviceData);

        }
        else{
          this.lookupfor = "";
          this.serviceData=[];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  getLookupValue($event) {
    if (this.lookupfor == 'ModelBom_lookup') {
      this.modelbom_data.modal_id = $event;
      this.getModelDetails($event, "Header", 0);
    }
    else if (this.lookupfor == 'feature_Detail_lookup') {
      this.getModelFeatureDetails($event, "Header", 0);
    }
    else if (this.lookupfor == 'ModelBom_Detail_lookup') {
      this.getModelDetails($event, "Header", 0);
    }
    else if (this.lookupfor == 'Price_lookup') {
      this.getPriceDetails($event, "Header", this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_selection_lookup') {
    //   this.getPriceDetails($event, "Header", this.currentrowindex);
    }
    else {
      this.lookupfor = 'Item_Detail_lookup';
      this.serviceData=[]
      this.getItemDetails($event);

    }


  }


  getPriceDetails(price, press_location, index) {
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === index) {
        this.modelbom_data[i].price_source = price.toString()
      }
    }
  }


  getModelDetails(Model_code, press_location, index) {

    this.service.getModelDetails(Model_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Header") {
            if (this.lookupfor == 'ModelBom_lookup') {
              this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;
            }
            else{
              for (let i = 0; i < this.modelbom_data.length; ++i) {
                if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                  this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID.toString()
                  this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME

                }
              }
            }
          }
          else {
            if (index == 3) {
              this.lookupfor = 'ModelBom_Detail_lookup';
            }
            this.serviceData = data;
          }


        }
        else{
          this.lookupfor = "";
          this.serviceData=[];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }

    )
  }

  getItemDetails(ItemKey) {
    this.serviceData =[]
    this.service.getItemDetails(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < this.modelbom_data.length; ++i) {
            if (this.modelbom_data[i].rowindex === this.currentrowindex) {
              this.modelbom_data[i].type_value = data[0].ItemKey.toString()
              this.modelbom_data[i].display_name = data[0].Description
              this.modelbom_data[i].uom=data[0].InvUOM
              this.modelbom_data[i].price_source="";

            }
          }
        }
      })
  }

  on_typevalue_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].type_value = value.toString()
        if(this.modelbom_data[i].type == 1){
          this.service.onFeatureIdChangeModelBom(this.modelbom_data[i].type_value).subscribe(
            data => {
              
              if (data === "False" ) {
                this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
                this.modelbom_data[i].type_value= "";
                return;
              }
              else{
                this.lookupfor=""
                this.getModelFeatureDetails(this.modelbom_data[i].type_value, "Header", i)
              }
              
            })
        }
        else if(this.modelbom_data[i].type == 2){
          this.service.onItemIdChangeModelBom(this.modelbom_data[i].type_value).subscribe(
            data => {
              
              if (data === "False" ) {
                this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
                this.modelbom_data[i].type_value= "";
                return;
              }
              else{
                this.lookupfor = "";
                this.getItemDetails(this.modelbom_data[i].type_value);
              }
            })
        }
        else{
          this.service.onModelIdChange(this.modelbom_data[i].type_value).subscribe(
            data => {
              
              if (data === "False" ) {
                this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
                this.modelbom_data[i].type_value= "";
                return;
              }
              else{
                this.lookupfor = "";
              this.getModelDetails(this.modelbom_data.modal_id, "Header", i);
              }
            })
        }
      }
    }
  }

  on_display_name_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].display_name = value
      }
    }
  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if(value == 0){
          this.modelbom_data[i].quantity = ""
          this.toastr.error('', this.language.quantityvalid, this.commonData.toast_config);
        }
        else{
          this.modelbom_data[i].quantity = value
        }
      


      }
    }

  }

  on_uom_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].uom = value


      }
    }

  }

  on_min_selected_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].min_selected = value


      }
    }

  }

  on_max_selected_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].max_selected = value


      }
    }

  }

  on_propagate_qty_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].propagate_qty = "Y"
        }
        else {
          this.modelbom_data[i].propagate_qty = "N"
        }



      }
    }

  }

  on_price_source_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].price_source = value


      }
    }

  }

  on_mandatory_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].mandatory = "Y"
        }
        else {
          this.modelbom_data[i].mandatory = "N"
        }



      }
    }

  }

  on_unique_identifer_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].unique_identifer = "Y"
        }
        else {
          this.modelbom_data[i].unique_identifer = "N"
        }



      }
    }

  }





  onSave() {
    if(this.validation("Save")==false){
      return;
    }
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if (this.modelbom_data[i].unique_identifer == false) {
          this.modelbom_data[i].unique_identifer = "N"
        }
        else if (this.modelbom_data[i].unique_identifer == true) {
          this.modelbom_data[i].unique_identifer = "Y"
        }
        else if (this.modelbom_data[i].mandatory == false) {
          this.modelbom_data[i].mandatory = "N"
        }
        else if (this.modelbom_data[i].mandatory == true) {
          this.modelbom_data[i].mandatory = "Y"
        }
        else if (this.modelbom_data[i].propagate_qty == false) {
          this.modelbom_data[i].propagate_qty = "N"
        }
        else if (this.modelbom_data[i].propagate_qty == true) {
          this.modelbom_data[i].propagate_qty = "Y"
        }


      }
    }

    this.service.SaveModelBom(this.modelbom_data).subscribe(
      data => {
        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('modelbom/view');
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  validation(btnpress) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }
    
    if(btnpress=="Save"){
      if (this.modelbom_data.length==0) {
        this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
        return false;
      }
      else{
        for (let i = 0; i < this.modelbom_data.length; ++i) {
          let currentrow= i+1;
          if(this.modelbom_data[i].type==1 && this.modelbom_data[i].type_value == "")
          {
            this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
            return false;
          }
           if(this.modelbom_data[i].type==2 && this.modelbom_data[i].type_value == "")
          {
            this.toastr.error('', this.language.SelectItem + currentrow, this.commonData.toast_config);
            return false;
          }
          if(this.modelbom_data[i].type==3 && this.modelbom_data[i].type_value == "")
          {
            this.toastr.error('', this.language.SelectModel + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.modelbom_data[i].quantity == "") {
            this.toastr.error('', this.language.quantityblank + currentrow, this.commonData.toast_config);
            return false;
          }
        } 
      }

    }
   

  }


  onDelete() {
   // var result = confirm(this.language.DeleteConfimation);
   this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
   this.show_dialog = true;
  }

  //delete record will be execute from here
  delete_record(){
    this.service.DeleteData(this.modelbom_data.modal_id).subscribe(
      data => {
        if (data === "True") {
          this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
          this.route.navigateByUrl('modelbom/view');
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      this.delete_record();
    }
    this.show_dialog = false;
  }


  onExplodeClick() {
    this.lookupfor = 'tree_view_lookup';

    if(this.modelbom_data.modal_id != undefined){
      //now call bom id
      
  //     this.service.GetDataForExplodeViewForModelBOM(this.companyName,this.modelbom_data.modal_id).subscribe(
  //       data => {
  //         if(data !=null || data != undefined){
  //             this.serviceData = data;
  //             this.lookupfor = 'tree_view_lookup';
  //           }
  //           else{
  //           }
            
  //         },
  //         error =>
  //         {
  //           this.toastr.error('', this.language.server_error, this.commonData.toast_config);
  //           return; 
  //         }
  //       )
  //   }
  //   else{
  //     this.toastr.error('', this.language.FeatureIDBlank, this.commonData.toast_config);
  //     return;
  //   }
    
   }

  }

  onVerifyOutput() {

  }


  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

 

  onModelIdChange(){
    this.service.onModelIdChange(this.modelbom_data.modal_id).subscribe(
      data => {
        
        if (data === "False" ) {
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.modelbom_data.modal_id="";
          return;
        }
        else{
          this.lookupfor="ModelBom_lookup"
          this.getModelDetails(this.modelbom_data.modal_id, "Header", 0);
        
        }
      })
  }

  on_rule_click(){
    this.lookupfor = "rule_section_lookup";
    this.serviceData = [];
    this.service.getRuleLookupList().subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
        }
      });
  }
}



 