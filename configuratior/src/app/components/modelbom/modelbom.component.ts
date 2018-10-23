import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ModelbomService } from '../../services/modelbom.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { UIHelper } from '../../helpers/ui.helpers';
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
  public showheaderImageBlock: boolean = false;
  public selectedImage = "";
  public isPriceDisabled = true;
  public pricehide = true;
  public isUOMDisabled = true;
  public update_id: string = "";
  public typevaluefromdatabase: string = "";
  public typevaluecodefromdatabase: string = "";
  public isModelIdEnable: boolean = true;
  public ModelLookupBtnhide: boolean = true;
  public rule_data: any = [];
  ruleselected: any;
  public header_image_data: string = "";
  public live_tree_view_data = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  public isMinSelectedDisable = false;
  public isMaxSelectedDisable = false;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService) { }

  companyName: string;
  page_main_title = this.language.Model_Bom
  public username: string = "";
  serviceData: any;

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
    element.classList.add('add_model-bom');
    element.classList.add('sidebar-toggled');

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
            this.modelbom_data.modal_id = data.ModelDetail[0].OPTM_MODELID
            this.modelbom_data.modal_code = data.ModelHeader[0].OPTM_FEATURECODE
            this.modelbom_data.feature_name = data.ModelHeader[0].OPTM_DISPLAYNAME;
            this.modelbom_data.feature_desc = data.ModelHeader[0].OPTM_FEATUREDESC;
            this.modelbom_data.image_path = data.ModelHeader[0].OPTM_PHOTO;
            this.modelbom_data.is_ready_to_use = data.ModelHeader[0].OPTM_READYTOUSE
            if (this.modelbom_data.image_path != null || this.modelbom_data.image_path != "") {
              this.showheaderImageBlock = true;
              this.header_image_data = this.commonData.get_current_url() + this.modelbom_data.image_path
            }


            if (this.modelbom_data.is_ready_to_use == "Y") {
              this.modelbom_data.is_ready_to_use = true;
            }
            else {
              this.modelbom_data.is_ready_to_use = false;
            }


          }

          if (data.ModelDetail.length > 0) {
            for (let i = 0; i < data.ModelDetail.length; ++i) {
              if (data.ModelDetail[i].OPTM_TYPE == 1) {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_FEATUREID.toString()
                this.typevaluecodefromdatabase = data.ModelDetail[i].feature_code.toString()
                this.isPriceDisabled = true
                this.pricehide = true
                this.isUOMDisabled = true
                this.isMinSelectedDisable = false;
                this.isMaxSelectedDisable = false;
              }
              else if (data.ModelDetail[i].OPTM_TYPE == 2) {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_ITEMKEY.toString()
                this.typevaluecodefromdatabase = data.ModelDetail[i].OPTM_ITEMKEY
                this.isPriceDisabled = false
                this.pricehide = false
                this.isUOMDisabled = false
                this.isMinSelectedDisable = true;
                this.isMaxSelectedDisable = true;
              }
              else {
                this.typevaluefromdatabase = data.ModelDetail[i].OPTM_CHILDMODELID.toString()
                this.typevaluecodefromdatabase = data.ModelDetail[i].child_code.toString()
                this.isPriceDisabled = true
                this.pricehide = true
                this.isUOMDisabled = true
                this.isMinSelectedDisable = false;
                this.isMaxSelectedDisable = false;
              }
              if (data.ModelDetail[i].OPTM_READYTOUSE == "" || data.ModelDetail[i].OPTM_READYTOUSE == null || data.ModelDetail[i].OPTM_READYTOUSE == undefined || data.ModelDetail[i].OPTM_READYTOUSE == "N") {
                data.ModelDetail[i].OPTM_READYTOUSE = false
              }
              if (data.ModelDetail[i].OPTM_PROPOGATEQTY == "Y") {
                data.ModelDetail[i].OPTM_PROPOGATEQTY = true
              }
              else {
                data.ModelDetail[i].OPTM_PROPOGATEQTY = false
              }
              if (data.ModelDetail[i].OPTM_UNIQUEIDNT == "Y") {
                data.ModelDetail[i].OPTM_UNIQUEIDNT = true
              }
              else {
                data.ModelDetail[i].OPTM_UNIQUEIDNT = false
              }
              if (data.ModelDetail[i].OPTM_MANDATORY == "Y") {
                data.ModelDetail[i].OPTM_MANDATORY = true
              }
              else {
                data.ModelDetail[i].OPTM_MANDATORY = false
              }

              this.modelbom_data.push({
                rowindex: data.ModelDetail[i].OPTM_LINENO,
                ModelId: data.ModelDetail[i].OPTM_MODELID,
                description: this.modelbom_data.feature_name,
                ReadyToUse: data.ModelDetail[i].OPTM_READYTOUSE,
                type: data.ModelDetail[i].OPTM_TYPE,
                type_value: this.typevaluefromdatabase,
                type_value_code: this.typevaluecodefromdatabase,
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
                CompanyDBId: data.ModelDetail[i].OPTM_COMPANYID,
                CreatedUser: data.ModelDetail[i].OPTM_CREATEDBY,
                isPriceDisabled: this.isPriceDisabled,
                pricehide: this.pricehide,
                isUOMDisabled: this.isUOMDisabled,
                isMinSelectedDisable :this.isMinSelectedDisable,
                isMaxSelectedDisable: this.isMaxSelectedDisable
              });

            }
          }

          if(data.RuleData.length > 0){
            this.rule_data = data.RuleData;
          }
          this.onExplodeClick();
        }
      )
    }
  }

  ngAfterViewInit() {
    if (this.update_id === "" || this.update_id === null) {
      this._el.nativeElement.focus();
    }
    else {
      this._ele.nativeElement.focus();
    }
  }

  onAddRow() {
    if (this.validation("Add") == false) {
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
      ModelCode: this.modelbom_data.modal_code,
      description: this.modelbom_data.feature_desc,
      ReadyToUse: "N",
      type: 1,
      type_value: "",
      type_value_code: "",
      display_name: "",
      uom: '',
      quantity: 1,
      min_selected: 1,
      max_selected: 1,
      propagate_qty: false,
      price_source: '',
      mandatory: false,
      unique_identifer: false,
      isDisplayNameDisabled: false,
      isTypeDisabled: false,
      hide: false,
      CompanyDBId: this.companyName,
      CreatedUser: this.username,
      isPriceDisabled: true,
      pricehide: true,
      isUOMDisabled: true,
      isMinSelectedDisable : false,
      isMaxSelectedDisable :false

    });
  };

  onDeleteRow(rowindex) {
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if (this.modelbom_data[i].rowindex === rowindex) {
          let display_name = this.modelbom_data[i].display_name;
          if (this.tree_data_json.length > 0) {
            let remove_tree_data = this.tree_data_json.filter(function (obj) {
              return (obj['component'] == display_name);
            });
            if (remove_tree_data.length > 0) {
              let tree_element_child = this.tree_data_json.filter(function (obj) {
                return obj['parentId'] == remove_tree_data[0]['component'];
              });
              if (tree_element_child.length > 0) {
                this.toastr.error('', this.language.child_exist_cannot_remove, this.commonData.toast_config);
                return false;
              } else {
                for (let j = 0; j < this.tree_data_json.length; ++j) {
                  if (remove_tree_data[0]['live_row_id'] == this.tree_data_json[j]['live_row_id']) {
                    this.tree_data_json.splice(j, 1);
                  }
                }
              }
            }
          }
          this.modelbom_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.modelbom_data[i].rowindex = i + 1;
        }
      }
    }
    // remove data from exploded view tree
    //this.live_tree_view_data

  }

  clearData(rowindex) {
    //this.modelbom_data[rowindex].type_value="";
    this.modelbom_data[rowindex].uom = "";
    this.modelbom_data[rowindex].display_name = "";
    this.modelbom_data[rowindex].quantity = 0;
    this.modelbom_data[rowindex].min_selected = 1;
    this.modelbom_data[rowindex].max_selected = 1;
    this.modelbom_data[rowindex].propagate_qty = 'N';
    this.modelbom_data[rowindex].price_source = '';
    this.modelbom_data[rowindex].mandatory = 'N';
    this.modelbom_data[rowindex].unique_identifer = 'N';
  }

  on_bom_type_change(selectedvalue, rowindex) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }
    this.serviceData = []
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.clearData(i);
        this.modelbom_data[i].type_value = "";
        this.modelbom_data[i].type_value_code = "";
        if (selectedvalue == 3) {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = false
          this.modelbom_data[i].type = 3
          this.modelbom_data[i].isPriceDisabled = true
          this.modelbom_data[i].pricehide = true
          this.modelbom_data[i].isUOMDisabled = true
          this.modelbom_data[i].quantity = 1
          this.modelbom_data[i].isMinSelectedDisable = false;
          this.modelbom_data[i].isMaxSelectedDisable = false;
        }
        else {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = false
          this.modelbom_data[i].quantity = 1
          if (selectedvalue == 2) {
            this.lookupfor = 'Item_Detail_lookup';
            this.modelbom_data[i].type = 2
            this.modelbom_data[i].isPriceDisabled = false
            this.modelbom_data[i].pricehide = false
            this.modelbom_data[i].isUOMDisabled = false
            this.modelbom_data[i].isMinSelectedDisable = true;
            this.modelbom_data[i].isMaxSelectedDisable = true;
          }
          else {
            this.modelbom_data[i].type = 1
            this.lookupfor = 'feature_lookup';
            this.modelbom_data[i].isPriceDisabled = true
            this.modelbom_data[i].pricehide = true
            this.modelbom_data[i].isUOMDisabled = true
            this.modelbom_data[i].isMinSelectedDisable = false;
            this.modelbom_data[i].isMaxSelectedDisable = false;
          }

        }


      }
    }
  }

  on_type_click(selectedvalue, rowindex) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }
    this.currentrowindex = rowindex
    if (selectedvalue == 3) {
      this.getModelDetails(this.modelbom_data.modal_id, "Detail", selectedvalue)
    }
    else {
      // this.lookupfor = 'Item_Detail_lookup';

      this.getModelFeatureDetails(this.modelbom_data.modal_id, "Detail", selectedvalue);
    }

  }

  getModelFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');

    this.serviceData = []
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
                  this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID.toString();
                  this.modelbom_data[i].type_value_code = data[0].OPTM_FEATURECODE.toString();
                  this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME;
                  this.live_tree_view_data.push({ "display_name": data[0].OPTM_DISPLAYNAME, "tree_index": this.currentrowindex });


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
        else {
          this.lookupfor = "";
          this.serviceData = [];
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
    this.serviceData = []
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  openPriceLookUp(ItemKey,rowindex) {
    this.serviceData = []
    this.currentrowindex=rowindex;
    this.service.GetPriceList(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'Price_lookup';
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  getLookupValue($event) {


    if (this.lookupfor == 'ModelBom_lookup') {
      //alert($event);
      this.modelbom_data.modal_id = $event[0];
      this.modelbom_data.modal_code = $event[1];

      this.getModelDetails($event[0], "Header", 0);
    }
    else if (this.lookupfor == 'feature_Detail_lookup') {
      this.getModelFeatureDetails($event[0], "Header", 0);
    }
    else if (this.lookupfor == 'ModelBom_Detail_lookup') {
      //On choosing value from lookup we will chk its cyclic dependency
      //First we will check the conflicts
      this.checkModelAlreadyAddedinParent($event[0], this.modelbom_data.modal_id, this.currentrowindex - 1, "lookup");

    }
    else if (this.lookupfor == 'Price_lookup') {
      this.getPriceDetails($event[0],  this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_section_lookup') {
      this.rule_data = $event;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.serviceData = []
    }
    this.getItemDetails($event[0]);


  }


  getPriceDetails(price, index) {
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
              this.modelbom_data.image_path = data[0].OPTM_PHOTO;
              if (this.modelbom_data.image_path != null || this.modelbom_data.image_path != "") {
                this.header_image_data = this.commonData.get_current_url() + this.modelbom_data.image_path;
                this.showheaderImageBlock = true;
              }
            }
            else {
              for (let i = 0; i < this.modelbom_data.length; ++i) {
                if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                  console.log(data[0]);

                  this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID;
                  this.modelbom_data[i].type_value_code = data[0].OPTM_FEATURECODE;
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
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }

    )
  }

  getItemDetails(ItemKey) {
    this.serviceData = []
    this.service.getItemDetails(ItemKey).subscribe(
      data => {
        if (data != null) {
        if (data.length > 0) {
          for (let i = 0; i < this.modelbom_data.length; ++i) {
            if (this.modelbom_data[i].rowindex === this.currentrowindex) {
              this.modelbom_data[i].type_value = data[0].ItemKey;
              this.modelbom_data[i].type_value_code = data[0].ItemKey;
              this.modelbom_data[i].display_name = data[0].Description
              this.modelbom_data[i].uom = data[0].InvUOM
              this.modelbom_data[i].price_source = "";
              this.live_tree_view_data.push({ "display_name": data[0].Description, "tree_index": this.currentrowindex });
            }
          }
        }
      }
      })
  }

  on_typevalue_change(value, rowindex, code) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].type_value = value.toString()
        this.modelbom_data[i].type_value_code = code.toString()
        if (this.modelbom_data[i].type == 1) {
          this.service.onFeatureIdChangeModelBom(this.modelbom_data[i].type_value_code).subscribe(
            data => {

              if (data === "False") {
                this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
                this.modelbom_data[i].type_value = "";
                this.modelbom_data[i].type_value_code = "";
                this.modelbom_data[i].display_name= "";
                return;
              }
              else {
                this.lookupfor = ""
                this.modelbom_data[i].type_value = data;
                this.getModelFeatureDetails(this.modelbom_data[i].type_value, "Header", i)
              }

            })
        }
        else if (this.modelbom_data[i].type == 2) {
          this.service.onItemIdChangeModelBom(this.modelbom_data[i].type_value_code).subscribe(
            data => {
                console.log(data);
              if (data === "False") {
                this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
                this.modelbom_data[i].type_value = "";
                this.modelbom_data[i].type_value_code = "";
                this.modelbom_data[i].display_name= "";
                return;
              }
              else {
                this.lookupfor = "";
                this.modelbom_data[i].type_value= data;
                this.getItemDetails(this.modelbom_data[i].type_value);
              }
            })
        }
        else {
          //First we will check the conflicts
          this.checkModelAlreadyAddedinParent(value, code, i, "change");

        }
      }
    }
  }

  on_display_name_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].display_name = value;
        this.live_tree_view_data.push({ "display_name": value, "tree_index": this.currentrowindex });
      }
    }
  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value == 0) {
          this.modelbom_data[i].quantity = ""
          this.toastr.error('', this.language.quantityvalid, this.commonData.toast_config);
        }
        else {
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

  on_min_selected_change(value, rowindex,actualvalue) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].min_selected = value
         if(this.modelbom_data[i].max_selected != "") {
          if(parseInt(this.modelbom_data[i].max_selected) < parseInt(value)){
            this.modelbom_data[i].min_selected = 1;
            $(actualvalue).val(1);
            this.toastr.error('', this.language.qty_validation, this.commonData.toast_config);
            return;
          }
         }

      }
    }

  }

  on_max_selected_change(value, rowindex,actualvalue) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].max_selected = value
        if(this.modelbom_data[i].type == "1"){
          this.service.CheckMaxSelectedValue(this.modelbom_data[i].type_value).subscribe(
            data => {
            console.log(data);
            if (data != null) {
              if(value > data){
                $(actualvalue).val(1);
                this.toastr.error('', this.language.max_selected_validation, this.commonData.toast_config);
                return; 
              }
            }
            })
        }

        if(this.modelbom_data[i].min_selected != "") {
          if(parseInt(this.modelbom_data[i].min_selected) > parseInt(value)){
            this.modelbom_data[i].min_selected = 1;
            this.modelbom_data[i].max_selected =1;
            $(actualvalue).val(1);
            this.toastr.error('', this.language.qty_validation , this.commonData.toast_config);
            return;
          }
         }

      }
    }

  }

  on_propagate_qty_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].propagate_qty = true
        }
        else {
          this.modelbom_data[i].propagate_qty = false
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
          this.modelbom_data[i].mandatory = true
        }
        else {
          this.modelbom_data[i].mandatory = false
        }



      }
    }

  }

  on_unique_identifer_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].unique_identifer = true
        }
        else {
          this.modelbom_data[i].unique_identifer = false
        }



      }
    }

  }

  on_isready_change(value, rowindex) {
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (value.checked == true) {
        this.modelbom_data[i].ReadyToUse = true
      }
      else {
        this.modelbom_data[i].ReadyToUse = false
      }
    }
  }



  onSave() {
    var obj = this;
    if (obj.validation("Save") == false) {
      return;
    }

    obj.onVerifyOutput(function(response){
      console.log('in validate true '+ response);
      if(response == true){
        obj.save_data();
      } 
    });

    
  }

  validation(btnpress) {
    if (this.modelbom_data.modal_id == "" || this.modelbom_data.modal_id == null) {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return false;
    }

    if (btnpress == "Save") {
      if (this.modelbom_data.length == 0) {
        this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
        return false;
      }
      else {
        for (let i = 0; i < this.modelbom_data.length; ++i) {
          let currentrow = i + 1;
          if (this.modelbom_data[i].type == 1 && this.modelbom_data[i].type_value == "") {
            this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.modelbom_data[i].type == 2 && this.modelbom_data[i].type_value == "") {
            this.toastr.error('', this.language.SelectItem + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.modelbom_data[i].type == 3 && this.modelbom_data[i].type_value == "") {
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
  delete_record() {
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
    this.lookupfor = 'tree_view__model_bom_lookup"';

    if (this.modelbom_data.modal_id != undefined) {
      //now call bom id
      if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
        this.service.GetDataForExplodeViewForModelBOM(this.companyName, this.modelbom_data.modal_id, this.modelbom_data.feature_name).subscribe(
          data => {
            if (data != null || data != undefined) {
              // this.serviceData = data;
              // this.lookupfor = "tree_view__model_bom_lookup";
              let counter_temp = 0;
              let temp_data = data.filter(function (obj) {
                obj['live_row_id'] = (counter_temp++);
                return obj;
              });
              this.tree_data_json = temp_data;
            }
            else {
              this.toastr.error('', this.language.server_error, this.commonData.toast_config);
              return;
            }

          },
          error => {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }
        );
      }
      else {
        let sequence_count = parseInt(this.tree_data_json.length + 1);
        if (this.live_tree_view_data.length > 0) {
          console.log(this.live_tree_view_data);
          for (var key in this.live_tree_view_data) {
            this.tree_data_json.push({ "sequence": sequence_count, "parentId": this.modelbom_data.feature_name, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1" });
          }

          this.live_tree_view_data = [];
          console.log(this.tree_data_json);
        }
      }
    } else {
      this.toastr.error('', this.language.ModelIDBlank, this.commonData.toast_config);
      return;
    }
  }


  onVerifyOutput(success_call): any {
    let objDataset: any = {};
    objDataset.ModelData = [];
    objDataset.RuleData = [];
    objDataset.ModelData.push({
      CompanyDBId: this.companyName,
      ModelId: this.modelbom_data.modal_id
    });
    objDataset.RuleData = this.rule_data;


    this.service.onVerifyOutput(objDataset).subscribe(
      data => {
        if (data !== undefined && data != "") {
        if (data == "Rules Conflict") {
          this.toastr.error('', this.language.conflict, this.commonData.toast_config);
          success_call(false);
          return false;
        }
        else{
          this.toastr.success('', this.language.ruleValidated, this.commonData.toast_config);
          success_call(true);
          return true;
        }
      }
      })
  }


  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }



  onModelIdChange() {
    this.service.onModelIdChange(this.modelbom_data.modal_code).subscribe(
      data => {
        if (data === "False") {
          this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
          this.modelbom_data.modal_id = "";
          this.modelbom_data.modal_code = "";
          this.modelbom_data.feature_name = "";
          this.modelbom_data.feature_desc = "";
          return;
        }
        else {
          this.lookupfor = "ModelBom_lookup"
          this.modelbom_data.modal_id= data;
          this.getModelDetails(this.modelbom_data.modal_id, "Header", 0);

        }
      })
  }

  on_rule_click() {
    this.lookupfor = "rule_section_lookup";
    this.ruleselected = [];
    //this.ruleselected=this.rule_data;
    this.serviceData = [];
    this.service.getRuleLookupList(this.modelbom_data.modal_id).subscribe(
      data => {
        console.log(data);
        if (data.length > 0) {
          this.serviceData = data;
        }
        else{
          this.toastr.error('', this.language.norules, this.commonData.toast_config);
          return;
        }
      });
  }

  getModelItemDetails(rowIndex) {
    this.service.onModelIdChange(this.modelbom_data[rowIndex].type_value_code).subscribe(
      data => {

        if (data === "False") {
          this.toastr.error('', this.language.Model_RefValidate, this.commonData.toast_config);
          this.modelbom_data[rowIndex].type_value = "";
          this.modelbom_data[rowIndex].type_value_code = "";
          this.modelbom_data[rowIndex].display_name = "";
          return;
        }
        else {
          this.lookupfor = "";
          this.modelbom_data.modal_id= data;
          this.getModelDetails(this.modelbom_data.modal_id, "Header", rowIndex);
        }
       
      })
  }

  checkModelAlreadyAddedinParent(enteredModelID, modelbom_type_value, rowindex, fromEvent) {
    console.log(modelbom_type_value);
    this.service.CheckModelAlreadyAddedinParent(enteredModelID, this.modelbom_data.modal_id).subscribe(
      data => {
        if (data.length > 0) {
          //If exists then will restrict user 
          if (data == "Exist") {
            this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
            this.modelbom_data[rowindex].type_value = "";
            this.modelbom_data[rowindex].display_name = "";

            return;
          }
          else if (data == "True") {
            if (fromEvent == "lookup") {
              this.lookupfor = 'ModelBom_Detail_lookup';
              this.getModelDetails(enteredModelID, "Header", 0);
            }
            else if (fromEvent == "change") {
              this.getModelItemDetails(rowindex);
            }

          }
        }
        else {
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          console.log("Failed when checking hierac check for feature ID")
          return;
        }
      },
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )
  }



  //This will recurse the tree
  get_childrens(component) {
    let data = this.complete_dataset.filter(function (obj) {
      return obj['parentId'] == component;
    });
    return data;
  }

  check_component_exist(component, level) {
    level = (parseInt(level) + 1);
    let data = this.tree_data_json.filter(function (obj) {
      return obj['parentId'] == component && obj['level'] == level;
    });
    return data;
  }
  save_data(){
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if (this.modelbom_data[i].unique_identifer == false) {
          this.modelbom_data[i].unique_identifer = "N"
        }
        else {
          this.modelbom_data[i].unique_identifer = "Y"
        }
        if (this.modelbom_data[i].mandatory == false) {
          this.modelbom_data[i].mandatory = "N"
        }
        else {
          this.modelbom_data[i].mandatory = "Y"
        }
        if (this.modelbom_data[i].propagate_qty == false) {
          this.modelbom_data[i].propagate_qty = "N"
        }
        else {
          this.modelbom_data[i].propagate_qty = "Y"
        }
        if (this.modelbom_data[i].ReadyToUse == false) {
          this.modelbom_data[i].ReadyToUse = "N"
        }
        else {
          this.modelbom_data[i].ReadyToUse = "Y"
        }


      }
    }
    let objDataset: any = {};
    objDataset.ModelData = [];
    objDataset.RuleData = [];

    objDataset.ModelData = this.modelbom_data;
    objDataset.RuleData = this.rule_data;
    this.service.SaveModelBom(objDataset).subscribe(
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

  toggleTree(e){
    let element = document.getElementById('right-tree-section');
    element.classList.toggle('d-none');
    element.classList.toggle('d-block');
  
    if(element.classList.contains('d-block')) {
      $('#left-table-section').removeClass('col-md-12').addClass('col-md-9');
    }else{
      let leftSection = document.getElementById('left-table-section');
      let classes = leftSection.classList;
      $('#left-table-section').removeClass('col-md-9').addClass('col-md-12');
    }
  }

}





