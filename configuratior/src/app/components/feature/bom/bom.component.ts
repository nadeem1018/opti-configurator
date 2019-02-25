import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Input, HostListener, TemplateRef } from '@angular/core';
import { FeaturebomService } from '../../../services/featurebom.service';
import { CommonData } from "../../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { HttpRequest, HttpHeaders, HttpClient } from '@angular/common/http';
import { jaLocale, BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as $ from 'jquery';
import { UIHelper } from '../../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent implements OnInit {
  @ViewChild("featureinputbox") _el: ElementRef;
  @ViewChild("button") _ele: ElementRef;

  @HostListener('window:scroll, scroll', ['$event'])
  onScroll($event, pop:any) {
      $('body').click()
  }

  modalRef: BsModalRef;

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
  public typevaluecodefromdatabase: string = "";
  public defaultcheckbox: boolean = false;
  public currentrowindex: number;
  public isDisplayNameDisabled: boolean = false;
  public isTypeDisabled: boolean = false;
  public ishide: boolean = false;
  public isQuanityDisabled: boolean = true;
  public isQuanity: number;
  public isFeatureIdEnable: boolean = true;
  public FeatureLookupBtnhide: boolean = true;
  public showImageBlock: boolean = false;
  public selectedImage = "";
  config_params: any;
  serviceData: any;
  counter = 0;
  public header_image_data: any;
  public detail_image_data: any = [];
  public live_tree_view_data = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  public row_image_data: any;
  public detail_select_options = '';
  public isPriceDisabled: boolean = false
  public pricehide: boolean = false;
  public isPropagateQtyDisable: boolean = false;
  public GetItemData = [];
  public showLoader: boolean = true;
  public showLookupLoader: boolean = false;

  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  constructor(private route: Router, private fbom: FeaturebomService, private toastr: ToastrService, private router: Router, private ActivatedRouter: ActivatedRoute, private httpclient: HttpClient, private commanService: CommonService, private cdref: ChangeDetectorRef, private modalService: BsModalService) { }

  isMobile: boolean = false;
  isIpad: boolean = false;
  isDesktop: boolean = true;
  isPerfectSCrollBar: boolean = false;


  detectDevice() {
    let getDevice = UIHelper.isDevice();
    this.isMobile = getDevice[0];
    this.isIpad = getDevice[1];
    this.isDesktop = getDevice[2];
    if (this.isMobile == true) {
      this.isPerfectSCrollBar = true;
    } else if (this.isIpad == true) {
      this.isPerfectSCrollBar = false;
    } else {
      this.isPerfectSCrollBar = false;
    }
  }
  navigateToFeatureOrModelBom (id) {
    this.route.navigateByUrl("feature/bom/edit/"+id);
    this.feature_bom_data =[];
    this.feature_bom_table = [];
    this.getFeatureBomDetail(id);
  }
  navigateToMasterHeader(feature_id) {
    this.route.navigateByUrl('feature/model/edit/'+feature_id)
  }
  ngOnInit() {
    const element = document.getElementsByTagName('body')[0];
    element.className = '';
    this.detectDevice();
    element.classList.add('add-feature-bom');
    element.classList.add('sidebar-toggled');

    this.commonData.checkSession();
    this.detail_select_options = this.commonData.bom_type;
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      this.isUpdateButtonVisible = false;
      this.isDeleteButtonVisible = false;
      this.isFeatureIdEnable = false;
      this.FeatureLookupBtnhide = false;
      this._el.nativeElement.focus();
      this.showLoader = false;
      this.feature_bom_data.multi_select = false;
      this.feature_bom_data.multi_select_disabled = true;
      this.feature_bom_data.feature_min_selectable = 1;
      this.feature_bom_data.feature_max_selectable = 1;
    }
    else {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = true;
      this.isFeatureIdEnable = true;
      this.FeatureLookupBtnhide = true;
      this.getFeatureBomDetail(this.update_id)
    }
    }

      getFeatureBomDetail(id) {
        this.showLoader = true;
        this.fbom.GetDataByFeatureId(id).subscribe(
        data => {
          if (data.FeatureDetail.length > 0) {
            for (let i = 0; i < data.FeatureDetail.length; ++i) {
              if (data.FeatureDetail[i].OPTM_TYPE == 1) {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_CHILDFEATUREID.toString()
                this.typevaluecodefromdatabase = data.FeatureDetail[i].child_code.toString()
                this.isDisplayNameDisabled = false
                this.isTypeDisabled = false
                this.ishide = false
                this.isQuanityDisabled = false
                this.isPriceDisabled = true
                this.pricehide = true
                this.isPropagateQtyDisable = false
                data.FeatureDetail[i].OPTM_QUANTITY = (data.FeatureDetail[i].OPTM_QUANTITY)
                this.isQuanity = data.FeatureDetail[i].OPTM_QUANTITY.toString()
              }
              else if (data.FeatureDetail[i].OPTM_TYPE == 2) {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_ITEMKEY.toString()
                this.typevaluecodefromdatabase = data.FeatureDetail[i].OPTM_ITEMKEY.toString()
                this.isDisplayNameDisabled = false
                this.isTypeDisabled = false
                this.ishide = false
                this.pricehide = false
                this.isQuanityDisabled = false
                this.isPriceDisabled = false
                this.isPropagateQtyDisable = false
                data.FeatureDetail[i].OPTM_QUANTITY = (data.FeatureDetail[i].OPTM_QUANTITY)
                this.isQuanity = data.FeatureDetail[i].OPTM_QUANTITY.toString()
              }
              else {
                this.typevaluefromdatabase = data.FeatureDetail[i].OPTM_VALUE.toString()
                this.typevaluecodefromdatabase = data.FeatureDetail[i].OPTM_VALUE.toString()
                // this.isDisplayNameDisabled = false
                this.isDisplayNameDisabled = false
                //  this.isTypeDisabled = false
                this.isTypeDisabled = false
                this.isPropagateQtyDisable = true
                this.ishide = true
                this.pricehide = true
                this.isQuanityDisabled = true
                this.isPriceDisabled = true
                this.isQuanity = 0
              }
              if (data.FeatureDetail[i].OPTM_DEFAULT == "Y") {
                this.defaultcheckbox = true
              }
              else {
                this.defaultcheckbox = false
              }
              if (data.FeatureDetail[i].OPTM_PROPOGATEQTY == "Y") {
                data.FeatureDetail[i].OPTM_PROPOGATEQTY = true
              }
              else {
                data.FeatureDetail[i].OPTM_PROPOGATEQTY = false
              }

              this.row_image_data = this.commonData.get_current_url() + data.FeatureDetail[i].OPTM_ATTACHMENT
              this.counter = 0;
              if (this.feature_bom_table.length > 0) {
                this.counter = this.feature_bom_table.length
              }
              this.counter++;

              this.feature_bom_table.push({
                rowindex: this.counter,
                FeatureId: data.FeatureDetail[i].OPTM_FEATUREID,
                type: data.FeatureDetail[i].OPTM_TYPE,
                type_value: this.typevaluefromdatabase,
                type_value_code: this.typevaluecodefromdatabase,
                display_name: data.FeatureDetail[i].OPTM_DISPLAYNAME,
                quantity: this.isQuanity,
                default: this.defaultcheckbox,
                remark: data.FeatureDetail[i].OPTM_REMARKS,
                attachment: data.FeatureDetail[i].OPTM_ATTACHMENT,
                preview: this.row_image_data,
                propagate_qty: data.FeatureDetail[i].OPTM_PROPOGATEQTY,
                price_source_id: data.FeatureDetail[i].OPTM_PRICESOURCE,
                price_source: data.FeatureDetail[i].ListName,
                isDisplayNameDisabled: this.isDisplayNameDisabled,
                isTypeDisabled: this.isTypeDisabled,
                isQuanityDisabled: this.isQuanityDisabled,
                hide: this.ishide,
                pricehide: this.pricehide,
                isPropagateQtyDisable: this.isPropagateQtyDisable,
                isPriceDisabled: this.isPriceDisabled,
                CompanyDBId: data.FeatureDetail[i].OPTM_COMPANYID,
                CreatedUser: data.FeatureDetail[i].OPTM_CREATEDBY,
              });
            }
          }
          if (data.FeatureHeader.length > 0) {
            this.feature_bom_data.feature_code = data.FeatureHeader[0].OPTM_FEATURECODE;
            this.feature_bom_data.feature_id = data.FeatureDetail[0].OPTM_FEATUREID;
            this.feature_bom_data.feature_name = data.FeatureHeader[0].OPTM_DISPLAYNAME;
            this.feature_bom_data.feature_desc = data.FeatureHeader[0].OPTM_FEATUREDESC;
            this.feature_bom_data.image_path = data.FeatureHeader[0].OPTM_PHOTO;
            this.feature_bom_data.is_accessory = data.FeatureHeader[0].OPTM_ACCESSORY;

            if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
              this.detail_select_options = this.commonData.less_bom_type;

            } else {
              this.detail_select_options = this.commonData.bom_type;
            }

            if (data.FeatureHeader[0].OPTM_ISMULTISELECT == 'y' || data.FeatureHeader[0].OPTM_ISMULTISELECT == 'Y') {
              this.feature_bom_data.multi_select = true;
              this.feature_bom_data.multi_select_disabled = false;
            } else {
              this.feature_bom_data.multi_select = false;
              this.feature_bom_data.multi_select_disabled = true;
            }
            this.feature_bom_data.feature_min_selectable = data.FeatureHeader[0].OPTM_MIN_SELECTABLE;
            if (this.feature_bom_data.feature_min_selectable == null || this.feature_bom_data.feature_min_selectable == "" || this.feature_bom_data.feature_min_selectable == undefined || this.feature_bom_data.feature_min_selectable == 0){
              this.feature_bom_data.feature_min_selectable = 1;
            }

            this.feature_bom_data.feature_max_selectable = data.FeatureHeader[0].OPTM_MAX_SELECTABLE;
            if (this.feature_bom_data.feature_max_selectable == null || this.feature_bom_data.feature_max_selectable == "" || this.feature_bom_data.feature_max_selectable == undefined || this.feature_bom_data.feature_max_selectable == 0) {
              this.feature_bom_data.feature_max_selectable = 1;
            }

            if (this.feature_bom_data.image_path != "") {
              if (this.feature_bom_data.image_path != null) {
                this.header_image_data = this.commonData.get_current_url() + this.feature_bom_data.image_path
                this.showImageBlock = true;
              }
            }
            this.onExplodeClick('auto');
          }
          this.showLoader = false;
          console.log(this.feature_bom_table);
        },
          error => {
           this.showLoader = false;
       }
      )

    $('[data-toggle="popover"]').popover({
        container: 'body',
        trigger:'hover'
    })
  }

  ngAfterViewInit() {
    if (this.update_id === "" || this.update_id === null) {
      this._el.nativeElement.focus();
    }
    else {
      this._ele.nativeElement.focus();
    }
  }

  on_multiple_model_change(current_value, current_state){
    this.feature_bom_data.multi_select = current_state;
    if (current_state == false){
      this.feature_bom_data.multi_select_disabled = true;
      this.feature_bom_data.feature_min_selectable = 1;
      this.feature_bom_data.feature_max_selectable = 1;
    } else {
      this.feature_bom_data.multi_select_disabled = false;
    }
  }

  validate_min_values(value, input_id){
    if (value == 0) {
      value = 1;
      this.feature_bom_data[input_id] = (value);
      this.toastr.error('', this.language.min_selectable_quantityvalid, this.commonData.toast_config);
    }
    else {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        value = 1;
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      } else if (value == 0 || value == '' || value == null || value == undefined) {
        value = 1;
        this.toastr.error('', this.language.blank_or_zero_not_allowed_min_selectable, this.commonData.toast_config);
      } else if (value < 0) {
        value = 1;
        this.toastr.error('', this.language.negativeminselectablevalid, this.commonData.toast_config);
      } else if (rgexp.test(value) == false) {
        value = 1;
        this.toastr.error('', this.language.decimaleminselectablevalid, this.commonData.toast_config);
      } else if (this.feature_bom_data.feature_min_selectable > this.feature_bom_data.feature_max_selectable) {
        value = 1;
        this.toastr.error('', this.language.min_selectable_greater_than_max, this.commonData.toast_config);
      }
      this.feature_bom_data[input_id] = (value);
    }
    
    $('#' + input_id).val(value);
  }

  validate_max_values(value, input_id) {
    if (value == 0) {
      value = 1;
      this.feature_bom_data[input_id] = (value);
      this.toastr.error('', this.language.max_selectable_quantityvalid, this.commonData.toast_config);
    }
    else {
      var rgexp = /^\d+$/;
      if (isNaN(value) == true) {
        value = 1;
        this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
      } else if (value == 0 || value == '' || value == null || value == undefined) {
        value = 1;
        this.toastr.error('', this.language.blank_or_zero_not_allowed_max_selectable, this.commonData.toast_config);
      } else if (value < 0) {
        value = 1;
        this.toastr.error('', this.language.negativemaxselectablevalid, this.commonData.toast_config);
      } else if (rgexp.test(value) == false) {
        value = 1;
        this.toastr.error('', this.language.decimalmaxselectablevalid, this.commonData.toast_config);
      } else if (this.feature_bom_data.feature_max_selectable < this.feature_bom_data.feature_min_selectable ) {
        value = 1;
        this.toastr.error('', this.language.max_selectable_less_than_min, this.commonData.toast_config);
      }
      this.feature_bom_data[input_id] = (value);

    }
    $('#' + input_id).val(value);
  }

  onAddRow() {
    if (this.validation("Add") == false) {
      return;
    }
    this.counter = 0;
    if (this.feature_bom_table.length > 0) {
      this.counter = this.feature_bom_table.length
    }
    this.counter++;
    let first_default = false;
    if (this.feature_bom_table.length == 0) {
      first_default = true;
    }
    let table_default_type = 1;
    if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
      table_default_type = 2;
    }

    this.feature_bom_table.push({
      rowindex: this.counter,
      FeatureId: this.feature_bom_data.feature_id,
      type: table_default_type,
      type_value: "",
      type_value_code: "",
      display_name: "",
      quantity: ("1"),
      default: first_default,
      remark: "",
      attachment: "",
      preview: "",
      propagate_qty: false,
      price_source: "",
      price_source_id: "",
      isDisplayNameDisabled: false,
      isTypeDisabled: false,
      hide: false,
      isQuanityDisabled: false,
      isPriceDisabled: this.isPriceDisabled,
      isPropagateQtyDisable: this.isPropagateQtyDisable,
      pricehide: this.pricehide,
      CompanyDBId: this.companyName,
      CreatedUser: this.username,
    });
  };

  uploaddetailfile(files: any, rowindex) {
    if (files.length === 0)
      return;
    const formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }

    this.fbom.UploadFeatureBOM(formData).subscribe(data => {
      if (data.body === "False") {
        this.toastr.error('', this.language.filecannotupload, this.commonData.toast_config);
      }
      else {
        if (this.feature_bom_table.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            if (this.feature_bom_table[i].rowindex === rowindex) {
              this.feature_bom_table[i].attachment = data.body
              this.feature_bom_table[i].preview = this.commonData.get_current_url() + data.body
              // this.detail_image_data.push(this.feature_bom_table[i].attachment)  

              if (this.detail_image_data.length > 0) {
                for (let idtlimg = 0; idtlimg < this.detail_image_data.length; ++idtlimg) {
                  if (this.detail_image_data[idtlimg].index == i) {
                    this.detail_image_data[idtlimg].value = this.feature_bom_table[i].attachment
                  }
                }

              }
              else {
                this.detail_image_data.push({
                  index: i,
                  value: this.feature_bom_table[i].attachment
                })
              }

            }
          }
        }
      }
    })
  }

  onDeleteRow(rowindex) {
    if (this.feature_bom_table.length > 0) {
      for (let i = 0; i < this.feature_bom_table.length; ++i) {
        if (this.feature_bom_table[i].rowindex === rowindex) {
          let display_name = this.feature_bom_table[i].display_name;
          if (this.tree_data_json.length > 0) {
            let remove_tree_data = this.tree_data_json.filter(function (obj) {
              return (obj['component'] == display_name);
            });
            if (remove_tree_data.length > 0) {
              let tree_element_child = this.tree_data_json.filter(function (obj) {
                return obj['parentId'] == remove_tree_data[0]['component'];
              });

              /*  if (tree_element_child.length > 0) {
                 this.toastr.error('', this.language.child_exist_cannot_remove, this.commonData.toast_config);
                 return false;
               } else { */
              for (let j = 0; j < this.tree_data_json.length; j++) {
                if (remove_tree_data[0]['live_row_id'] == this.tree_data_json[j]['live_row_id']) {
                  this.tree_data_json.splice(j, 1);
                }
              }
              /* } */
            }
          }
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
    if (this.validation("Save") == false) {
      return;
    }
    if (this.feature_bom_table.length > 0) {
      this.feature_bom_table[0].id = this.update_id;
      for (let i = 0; i < this.feature_bom_table.length; ++i) {

        if (this.feature_bom_data.multi_select === false) {
          this.feature_bom_table[i].multi_select = "N"
        }
        else {
          this.feature_bom_table[i].multi_select = "Y"
        }

        this.feature_bom_table[i].feature_min_selectable =  this.feature_bom_data.feature_min_selectable;
        this.feature_bom_table[i].feature_max_selectable = this.feature_bom_data.feature_max_selectable;
        if (this.feature_bom_table[i].default === false) {
          this.feature_bom_table[i].default = "N"
        }
        else {
          this.feature_bom_table[i].default = "Y"
        }
        console.log("qty - " + this.feature_bom_table[i].propagate_qty);
        if (this.feature_bom_table[i].propagate_qty === false) {
          this.feature_bom_table[i].propagate_qty = "N"
        }
        else {
          this.feature_bom_table[i].propagate_qty = "Y"
        }

        this.feature_bom_table[i].quantity = this.feature_bom_table[i].quantity.toString();
      }
    }
    this.showLookupLoader = true;
    this.fbom.SaveModelBom(this.feature_bom_table).subscribe(
      data => {
        this.showLookupLoader = false;
        if (data == "7001") {
          this.commanService.RemoveLoggedInUser().subscribe();
          this.commanService.signOut(this.toastr, this.router);
          return;
        }

        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('feature/bom/view');
          return;
        }
        else if (data === "Cyclic Reference") {
          this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
          return;
        }
        else if (data === "AlreadyExist") {
          this.toastr.error('', this.language.DuplicateCode, this.commonData.toast_config);
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
    console.log('on bom type change');
    console.log(selectedvalue);
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = "";
        this.feature_bom_table[i].type_value_code = "";
        this.feature_bom_table[i].display_name = ""
        if (selectedvalue == 3) {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = true
          this.feature_bom_table[i].type = 3
          this.feature_bom_table[i].quantity = ("0");
          this.feature_bom_table[i].isQuanityDisabled = true
          this.feature_bom_table[i].isPriceDisabled = true
          this.feature_bom_table[i].pricehide = true
          this.feature_bom_table[i].isPropagateQtyDisable = true
        }
        else {
          this.feature_bom_table[i].isDisplayNameDisabled = false
          this.feature_bom_table[i].isTypeDisabled = false
          this.feature_bom_table[i].hide = false
          this.feature_bom_table[i].isPropagateQtyDisable = false
          if (selectedvalue == 2) {
            this.feature_bom_table[i].type = 2
            this.feature_bom_table[i].quantity = ("1");
            this.feature_bom_table[i].isQuanityDisabled = false
            this.feature_bom_table[i].isPriceDisabled = false
            this.feature_bom_table[i].pricehide = false
          }
          else {
            this.feature_bom_table[i].type = 1
            this.feature_bom_table[i].quantity = ("1");
            this.feature_bom_table[i].isQuanityDisabled = false
            this.feature_bom_table[i].isPriceDisabled = true
            this.feature_bom_table[i].pricehide = true
          }
        }


      }
    }

  }

  on_type_change(selectedvalue, rowindex) {
    console.log('on type change ');
    console.log(selectedvalue);
    this.currentrowindex = rowindex;
    this.showLookupLoader = true;
    this.getFeatureDetails(this.feature_bom_data.feature_id, "Detail", selectedvalue);

  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex;
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (this.feature_bom_table[i].type == 1 || this.feature_bom_table[i].type == 2) {

          if (value == 0) {
            value = 1;
            this.feature_bom_table[i].quantity = (value);
            this.toastr.error('', this.language.quantityvalid, this.commonData.toast_config);
          }
          else {
            var rgexp = /^\d+$/;
            if (isNaN(value) == true) {
              value = 1;
              this.toastr.error('', this.language.ValidNumber, this.commonData.toast_config);
            } else if (value == 0 || value == '' || value == null || value == undefined) {
              value = 1;
              this.toastr.error('', this.language.blank_or_zero_not_allowed, this.commonData.toast_config);
            } else if (value < 0) {
              value = 1;
              this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            } else if (rgexp.test(value) == false) {
              value = 1;
              this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            }
            this.feature_bom_table[i].quantity = (value);

          }
          $('input[name="feature_quantity"]').eq((rowindex - 1)).val((value));
        }
      }

    }
    this.cdref.detectChanges()
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
        if (this.feature_bom_data.feature_name == value) {
          this.feature_bom_table[i].display_name = "";
          this.toastr.error('', this.language.feature_child_name_no_same, this.commonData.toast_config);
          return false;
        }
        this.feature_bom_table[i].display_name = value
        this.live_tree_view_data.push({ "display_name": value, "tree_index": this.currentrowindex });
      }
    }
  }

  on_typevalue_change(value, rowindex, code, type_value_code) {
    var iIndex;
    this.currentrowindex = rowindex
    iIndex = this.currentrowindex - 1;
    for (let j = 0; j < this.feature_bom_table.length; j++) {
      var psTypeCode = this.feature_bom_table[j].type_value_code;
      if (psTypeCode != undefined && psTypeCode != "") {
        if (psTypeCode.toUpperCase() == code.toUpperCase()) {
          this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
          $(type_value_code).val("");
          return;
        }
      }

    }

    for (var i = 0; i < this.feature_bom_table.length; i++) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        this.feature_bom_table[i].type_value = value;
        this.feature_bom_table[i].type_value_code = code;
        if (this.feature_bom_table[i].type == 1) {
          this.fbom.onFeatureIdChange(this.feature_bom_table[i].type_value_code).subscribe(
            data => {
              if (data === "False") {
                this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
                this.feature_bom_table[iIndex].type_value = "";
                this.feature_bom_table[iIndex].type_value_code = "";
                this.feature_bom_table[iIndex].display_name = "";
                $(type_value_code).val("");
                return;
              }
              else {
                //this.lookupfor = 'feature_lookup';
                //First we will check the conflicts
                this.feature_bom_table[iIndex].type_value = data;
                this.checkFeaturesAlreadyAddedinParent(value, this.feature_bom_table[iIndex].type_value, iIndex, "change");
              }
            })
        }
        else if (this.feature_bom_table[i].type == 2) {
          this.fbom.onItemIdChange(this.feature_bom_table[i].type_value_code).subscribe(
            data => {

              if (data === "False") {
                this.toastr.error('', this.language.Invalid_feature_item_value, this.commonData.toast_config);
                this.feature_bom_table[iIndex].type_value = "";
                this.feature_bom_table[iIndex].type_value_code = "";
                this.feature_bom_table[iIndex].display_name = "";
                $(type_value_code).val("");
                return;
              }
              else {
                this.lookupfor = "";
                this.feature_bom_table[iIndex].type_value = data;
                this.getItemDetails(this.feature_bom_table[iIndex].type_value);
              }
            })
        }
        else {
          this.feature_bom_table[i].type_value = code;
          this.feature_bom_table[i].type_value_code = code;
        }
      }
    }


  }

  on_defualt_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.feature_bom_table[i].default = true
        }
        else {
          this.feature_bom_table[i].default = false
        }
      }
      else {
        this.feature_bom_table[i].default = false
      }
    }

  }



  getLookupValue($event) {
    if (this.lookupfor == 'feature_lookup') {
      this.feature_bom_data.feature_id = $event[0];
      this.feature_bom_data.feature_code = $event[1];
      this.getFeatureDetails($event[0], "Header", 0);
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.lookupfor = 'Item_Detail_lookup';
      for (let j = 0; j < this.feature_bom_table.length; j++) {
        var psTypeCode = this.feature_bom_table[j].type_value_code;
        if (psTypeCode != undefined && psTypeCode != "") {
          if (psTypeCode.toUpperCase() == $event[0].toUpperCase()) {
            this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
            $($event[0]).val("");
            return;
          }
        }

      }
      this.getItemDetails($event[0]);

    }
    else if (this.lookupfor == 'feature_Detail_lookup') {
      //call the method cyclic chk
      for (let j = 0; j < this.feature_bom_table.length; j++) {
        var psTypeCode = this.feature_bom_table[j].type_value_code;
        if (psTypeCode != undefined && psTypeCode != "") {
          if (psTypeCode.toUpperCase() == $event[1].toUpperCase()) {
            this.toastr.error('', this.language.DuplicateId, this.commonData.toast_config);
            $($event[1]).val("");
            return;
          }
        }

      }

      this.checkFeaturesAlreadyAddedinParent($event[0], "", this.currentrowindex - 1, "lookup");
    }
    else if (this.lookupfor == 'Price_lookup') {
      this.getPriceDetails($event[1], $event[0], this.currentrowindex);
    }

  }

  getPriceDetails(price_list_name, price, index) {
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === index) {
        this.feature_bom_table[i].price_source = price_list_name.toString()
        this.feature_bom_table[i].price_source_id = price.toString()
      }
    }
  }

  openFeatureLookUp() {
    this.showLookupLoader = true;
    console.log('inopen feature');
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          this.showLookupLoader = false;
          this.serviceData = data;
          console.log(this.serviceData);

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
      }
    )
  }

  getItemDetails(ItemKey) {
    this.fbom.getItemDetails(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < this.feature_bom_table.length; ++i) {
            if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
              this.feature_bom_table[i].type_value = data[0].ItemKey;
              this.feature_bom_table[i].type = 2
              this.feature_bom_table[i].type_value_code = data[0].ItemKey;
              this.feature_bom_table[i].display_name = data[0].Description;
              this.live_tree_view_data.push({ "display_name": data[0].Description, "tree_index": this.currentrowindex });
            }
          }
        }
      })
  }

  getFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');
    this.serviceData = []
    //this.lookupfor = 'feature_lookup';
    this.fbom.getFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          this.showLookupLoader = false;
          if (press_location == "Header") {
            if (this.lookupfor == 'feature_lookup') {
              // this.feature_bom_data.feature_id = data;
              this.feature_bom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.feature_bom_data.feature_desc = data[0].OPTM_FEATUREDESC;
              this.feature_bom_data.image_path = data[0].OPTM_PHOTO;
              this.feature_bom_data.is_accessory = data[0].OPTM_ACCESSORY;
              console.log('accesory - ' + this.feature_bom_data.is_accessory);
              if (this.feature_bom_data.is_accessory == 'y' || this.feature_bom_data.is_accessory == 'Y') {
                this.detail_select_options = this.commonData.less_bom_type;
                this.pricehide = false
                this.isPriceDisabled = false
                console.log('in if  ');
              } else {
                this.detail_select_options = this.commonData.bom_type;
                this.pricehide = true
                this.isPriceDisabled = true
                console.log('in else ');
              }
              this.showImageBlock = false;
              if (this.feature_bom_data.image_path != null) {
                if (this.feature_bom_data.image_path != "") {
                  this.header_image_data = this.commonData.get_current_url() + this.feature_bom_data.image_path;
                  this.showImageBlock = true;
                }
              }
              if (this.feature_bom_table.length > 0) {
                this.feature_bom_table = [];
              }
            }
            else {
              // this.feature_bom_table=data;
              for (let i = 0; i < this.feature_bom_table.length; ++i) {
                if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
                  this.feature_bom_table[i].type_value = data[0].OPTM_FEATUREID.toString();
                  this.feature_bom_table[i].type_value_code = data[0].OPTM_FEATURECODE.toString();
                  this.feature_bom_table[i].display_name = data[0].OPTM_DISPLAYNAME;
                  if (data[0].OPTM_PHOTO != null && data[0].OPTM_PHOTO != "") {
                    this.feature_bom_table[i].preview = this.commonData.get_current_url() + data[0].OPTM_PHOTO;
                    this.feature_bom_table[i].attachment = data[0].OPTM_PHOTO;
                  }


                }
              }
            }
            this.live_tree_view_data.push({ "display_name": data[0].OPTM_DISPLAYNAME, "tree_index": this.currentrowindex });
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
          this.showLookupLoader = false;
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
      }
    )
  }

  openPriceLookUp(ItemKey, rowindex) {
    this.showLookupLoader = true;
    this.serviceData = []
    this.currentrowindex = rowindex;
    this.fbom.GetPriceList(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'Price_lookup';
          this.showLookupLoader = false;
          this.serviceData = data;

        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.showLookupLoader = false;
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.showLookupLoader = false;
      }
    )
  }

  enlage_image(image) {
    this.lookupfor = 'large_image_view';
    this.selectedImage = image;
  }

  validation(btnpress) {
    if (this.feature_bom_data.feature_id == "" || this.feature_bom_data.feature_id == null) {
      this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      return false;
    }

    if (btnpress == "Save") {
      if (this.feature_bom_table.length == 0) {
        this.toastr.error('', this.language.Addrow, this.commonData.toast_config);
        return false;
      }
      else {
        var total_detail_elements = this.feature_bom_table.length;
        if (this.feature_bom_data.multi_select_disabled == false ){
          console.log("total_detail_elements " + total_detail_elements);
          if (total_detail_elements < this.feature_bom_data.feature_min_selectable) {
            this.toastr.error('', this.language.min_selectable_greater_total, this.commonData.toast_config);
            return false;
          }

          if (total_detail_elements < this.feature_bom_data.feature_max_selectable  ){
            this.toastr.error('', this.language.max_selectable_greater_total, this.commonData.toast_config);
            return false;
          }

          this.feature_bom_data.feature_max_selectable
          this.feature_bom_data.feature_min_selectable
        }
        for (let i = 0; i < this.feature_bom_table.length; ++i) {
          let currentrow = i + 1;
          if (this.feature_bom_table[i].type == 1 && this.feature_bom_table[i].type_value == "") {
            this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.feature_bom_table[i].type == 2 && this.feature_bom_table[i].type_value == "") {
            this.toastr.error('', this.language.SelectItem + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.feature_bom_table[i].type == 3 && this.feature_bom_table[i].type_value_code == "") {
            this.toastr.error('', this.language.SelectValue + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.feature_bom_table[i].quantity === "") {
            this.toastr.error('', this.language.quantityblank + currentrow, this.commonData.toast_config);
            return false;
          }
        }
      }

    }


  }

  on_propagate_qty_change(value, rowindex) {

    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {
        console.log('qty value ' + value);
        if (value.checked == true) {
          this.feature_bom_table[i].propagate_qty = true
        }
        else {
          this.feature_bom_table[i].propagate_qty = false
        }
      }
    }

  }

  on_price_source_change(id, value, rowindex, actualValue) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.feature_bom_table.length; ++i) {
      if (this.feature_bom_table[i].rowindex === this.currentrowindex) {

        this.fbom.CheckValidPriceListEntered(this.feature_bom_table[i].type_value, value).subscribe(
          data => {
            if (data === "False") {
              $(actualValue).val("");
              this.toastr.error('', this.language.InvalidPriceId, this.commonData.toast_config);
              return;
            }
            else if (data != null) {
              this.feature_bom_table[i].price_source_id = data
              this.feature_bom_table[i].price_source = value
              this.lookupfor = ""
            }

          })


      }
    }
  }

  onDeleteClick() {
    //var result = confirm(this.language.DeleteConfimation);
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }

  //delete record 
  delete_record() {
    this.GetItemData = []
    this.GetItemData.push({
      CompanyDBId: this.companyName,
      FeatureId: this.feature_bom_data.feature_id
    });
    this.fbom.DeleteData(this.GetItemData).subscribe(
      data => {
        console.log(data);
        if (data === "True") {
          this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
          this.router.navigateByUrl('feature/bom/view');
          return;
        } else if (data == "ReferenceExists") {
          this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
          return;
        } else {
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


  //THis will get the BOMs associated to selected feature id
  onAssociatedBOMClick() {
    if (this.feature_bom_data.feature_id != undefined) {
      this.fbom.ViewAssosciatedBOM(this.feature_bom_data.feature_id).subscribe(
        data => {
          if (data != null || data != undefined) {
            if (data.length > 0) {
              this.serviceData = data;
              this.lookupfor = 'associated_BOM';
            }
            else {
              this.toastr.error('', this.language.no_assocaited_bom, this.commonData.toast_config);
              return;
            }
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
      )
    }
    else {
      this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      return;
    }
  }

  onExplodeClick(type) {
    if (type == "manual") {
      this.showtree();
    }
    if (this.feature_bom_data.feature_id != undefined) {
      //now call bom id
      if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
        this.fbom.GetDataForExplodeViewForFeatureBOM(this.companyName, this.feature_bom_data.feature_id, this.feature_bom_data.feature_name).subscribe(
          data => {
            if (data != null || data != undefined) {
              //Earlier we were opening this in lookup
              // this.serviceData = data;
              // this.lookupfor = 'tree_view_lookup';
              let counter_temp = 0;
              let temp_data = data.filter(function (obj) {
                obj['tree_index'] = (counter_temp);
                obj['live_row_id'] = (counter_temp++);
                return obj;
              });
              this.tree_data_json = temp_data;
              console.log(this.tree_data_json);

            }
            else {
            }

          },
          error => {
            this.toastr.error('', this.language.server_error, this.commonData.toast_config);
            return;
          }
        );
      } else {
        let sequence_count = parseInt(this.tree_data_json.length + 1);
        if (this.live_tree_view_data.length > 0) {
          for (var key in this.live_tree_view_data) {
            var update_index ="";
            if (this.live_tree_view_data[key].tree_index !== undefined){
              let local_tree_index = this.live_tree_view_data[key].tree_index;
              update_index = this.tree_data_json.findIndex(function (tree_el) {
                return tree_el.tree_index == local_tree_index
              });
            }
            let temp_seq = { "sequence": sequence_count, "parentId": this.feature_bom_data.feature_name, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1", "tree_index": this.live_tree_view_data[key].tree_index };
            if (update_index == "-1"){
              this.tree_data_json.push(temp_seq);
            } else {
              this.tree_data_json[update_index] = (temp_seq);
            }
          }
          this.live_tree_view_data = [];
        }
      }
    }
    else {
      this.toastr.error('', this.language.FeatureCodeBlank, this.commonData.toast_config);
      return;
    }

  }


  onFeatureIdChange() {
    this.fbom.onFeatureIdChange(this.feature_bom_data.feature_code).subscribe(
      data => {
        console.log(data);
        if (data === "False") {
          this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
          this.feature_bom_data.feature_id = "";
          this.feature_bom_data.feature_code = "";
          this.feature_bom_data.feature_name = "";
          this.feature_bom_data.feature_desc = "";
          this.feature_bom_data.is_accessory = "";
          return;
        }
        else {
          this.lookupfor = 'feature_lookup';
          this.feature_bom_data.feature_id = data;
          this.getFeatureDetails(this.feature_bom_data.feature_id, "Header", 0);
        }
      })
  }

  //To chk the conflictions of the feature id (hierariechal cylic dependency)
  checkFeaturesAlreadyAddedinParent(enteredFeatureID, feature_type, rowindex, fromEvent) {

    this.fbom.checkFeaturesAlreadyAddedinParent(enteredFeatureID, this.feature_bom_data.feature_id).subscribe(
      data => {
        if (data.length > 0) {
          //If exists then will restrict user 
          if (data == "Exist") {
            this.toastr.error('', this.language.cyclic_ref_restriction, this.commonData.toast_config);
            this.feature_bom_table[rowindex].type_value = "";
            this.feature_bom_table[rowindex].display_name = "";
            return;
          }
          else if (data == "True") {

            if (fromEvent == "lookup") {
              //this.getFeatureDetails(enteredFeatureID, "Header", 0);
              this.getFeatureDetails(enteredFeatureID, "Header", rowindex);
            }
            else if (fromEvent == "change") {
              this.lookupfor = 'feature_Detail_lookup';
              this.getFeatureDetails(feature_type, "Header", rowindex);
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

  toggleTree(e) {
    let element = document.getElementById('right-tree-section');
    if (element.classList.contains('d-block')) {
      this.hidetree();
    } else {
      this.showtree();
    }
  }

  showtree() {
    if ($(document).find('#right-tree-section').hasClass('d-none')) {
      $(document).find('#right-tree-section').removeClass('d-none');
      $(document).find('#right-tree-section').addClass('d-block');
      $(document).find('#left-table-section').removeClass('col-md-12').addClass('col-md-9');
    }
  }


  hidetree() {
    if ($(document).find('#right-tree-section').hasClass('d-block')) {
      $(document).find('#right-tree-section').removeClass('d-block');
      $(document).find('#right-tree-section').addClass('d-none');
      $(document).find('#left-table-section').removeClass('col-md-9').addClass('col-md-12');
    }
  }
  openModal(template: TemplateRef<any>) {
      $('body').click()
      this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
  }
  childExpand(id: any){
    id.classList.toggle("expanded")
    if (id.parentNode.parentNode.childNodes[4].style.display === "none") {
        id.parentNode.parentNode.childNodes[4].style.display = "block";
    } else {
        id.parentNode.parentNode.childNodes[4].style.display = "none";
    }
}
}
