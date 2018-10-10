import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationStyleMetadata } from '../../../../node_modules/@angular/animations';
import * as $ from 'jquery';
import { JitSummaryResolver } from '../../../../node_modules/@angular/compiler';
//import { LookupComponent } from '../common/lookup/lookup.component';

@Component({
  //providers:[LookupComponent],
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  @ViewChild("modelcode") _el: ElementRef;
  @ViewChild("refresh_button") _refresh_el: ElementRef;
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public step1_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public FeatureChildData = [];
  public feature_itm_list_table = [];
  public accessory_itm_list_table = [];
  public feature_itm_list_temp_table = [];
  public parentfeatureid: string = "";
  public feature_discount_percent: number = 0;
  public accessory_discount_percent: number = 0;
  public step2_final_dataset_to_save = [];
  public tree_accessory_json = [];
  public warehouse: string = "";
  //public step2_data_all_data={};
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price, this.language.price_extn, "", "", "X"];
  public step3_data_final_hidden_elements = [false, false, false, false, false, false, true, true, false];
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public acc_item_tax: number = 0
  public bycheckboxpress: number = 0;
  public acc_total: number = 0
  public accessory_item_tax: number = 0;
  public accessory_item_total: number = 0;
  public acc_grand_total: number = 0;
  public isModelVisible: boolean = false;
  public selecteddataforelement: any;
  public final_document_number: any = '';
  public selectfeaturedata = [];
  public modelitemflag: number = 0;
  public final_array_checked_options = [];
  public feature_tax_total = [
    { "key": this.language.tax, "value": this.feature_item_tax },
    { "key": this.language.total, "value": this.feature_item_total },
  ];
  public item_tax_total = [
    { "key": this.language.product_tax, "value": this.acc_item_tax },
    { "key": this.language.product_total, "value": this.acc_total },
    { "key": this.language.accessories_discount, "value": this.acc_item_tax },
    { "key": this.language.accessories_tax, "value": this.acc_item_tax },
    { "key": this.language.accessories_total, "value": this.acc_total },
    { "key": this.language.grand_total, "value": this.acc_grand_total }
  ];
  public new_item_list = ["item 1", "item 2", "item 3", "item 4", "item 5"];
  /* public refresh_button_text = '<i class="fa fa-refresh fa-fw"></i> ' + this.language.refresh; */
  public showFinalLoader: boolean = true;
  public dontShowFinalLoader: boolean = false;
  public Accessory_table_hidden_elements = [false, false, false, true, true, true];
  public order_creation_table_head = [this.language.hash, this.language.item, this.language.quantity, this.language.price, this.language.price_extn];
  feature_child_data: any = [];
  public tree_data_json: any = [];
  public complete_dataset: any = [];
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService, private elementRef: ElementRef) { }
  serviceData: any;
  public contact_persons: any;
  public sales_employee: any = [];
  public ship_to: any;
  public bill_to: any;
  public ship_data: any = [];
  public bill_data: any = [];
  public owner_list: any = [];
  public customerBillTo: any;
  public document: any;
  public customerShipTo: any;
  public isNextButtonVisible: boolean = false;
  public person: any;
  public salesemployee: any;
  public step3_data_final = [];
  public document_date = '';
  public iLogID: any;
  public CheckedData: any = [];
  public selectallRows: boolean = false;
  public isMultiDelete: boolean = false;
  rows: any = "";
  //custom dialoag params
  public dialog_params: any = [];
  public show_dialog: boolean = false;
  public final_row_data: any;
  public final_order_status = this.language.new;
  public final_order_status_class = "text-primary";
  public final_reference_number = "";
  public final_ref_doc_entry = "";
  public ModelHeaderData = [];
public ModelBOMDataForSecondLevel = [];
public FeatureBOMDataForSecondLevel = [];

  ngOnInit() {

    const element = document.getElementsByTagName('body')[0];
    element.className = '';
    element.classList.add('sidebar-toggled');


    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    this.step1_data.document = "sales_quote";
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
    this.feature_accessory_list = []
    this.step2_data.quantity = 0;
    this._el.nativeElement.focus();
    var todaysDate = new Date();
    //var mindate =new Date(todaysDate) ;
    let formated_posting_date = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
    //let formated_posting_date =(todaysDate.getMonth()+1)+"/"+todaysDate.getDate()+"/"+todaysDate.getFullYear();
    this.step1_data.posting_date = formated_posting_date;
    this.isNextButtonVisible = false;

    //dummy data for 3rd screen 
    // this.step3_data_final = [
    //   {
    //     "rowIndex": "1", "sl_no": "1", "item": "Model 1", "qunatity": "10", "price": "2000", "price_ext": "20", "rowIndexBtn": "1","model_id": this.step2_data.model_id,
    //     "feature": [{
    //       "feature_name": "Feature001",
    //       "item": "item001",
    //       "item_desc": "itemdesc001",
    //       "quantity": 100,
    //       "price": 2000,
    //       "price_ext": 20,
    //       "feature_accessories": "FEATUREACCESS001"
    //     }],
    //     "accessories": [{
    //       "code": "ACCES001",
    //       "name": "ACCESSNAME001"
    //     }]
    //   }
    // ];

    // dummy data for 2nd screen 
    this.tree_data_json = [
      // { "sequence": "1", "component": "F1", "level": "0", "parentId": "", "element_type": "radio" },
      // { "sequence": "2", "component": "F2", "level": "1", "parentId": "F1", "element_type": "radio" },
      // { "sequence": "3", "component": "F3", "level": "1", "parentId": "F1", "element_type": "radio" },
      // { "sequence": "4", "component": "Item0001", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      // { "sequence": "5", "component": "Item0002", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      // { "sequence": "6", "component": "F4", "level": "2", "parentId": "F3", "element_type": "radio" },
      // { "sequence": "7", "component": "F5", "level": "2", "parentId": "F3", "element_type": "radio" },
      // { "sequence": "7", "component": "F6", "level": "3", "parentId": "F4", "element_type": "radio" },
      // { "sequence": "8", "component": "Item0003", "level": "3", "parentId": "F5", "element_type": "radio" },
      // { "sequence": "9", "component": "Item0004", "level": "3", "parentId": "F5", "element_type": "radio" },
      // { "sequence": "10", "component": "Item0005", "level": "4", "parentId": "F6", "element_type": "radio" },
      // { "sequence": "11", "component": "Item0006", "level": "4", "parentId": "F6", "element_type": "radio" },
      // { "sequence": "13", "component": "Item0002", "level": "1", "parentId": "F1", "element_type": "checkbox" },
      // { "sequence": "14", "component": "Item0011", "level": "0", "parentId": "", "element_type": "checkbox" }
    ];

    // initialize jquery 
    /* setTimeout(() => {
      this.tree_view_expand_collapse()
    }, 2000); */
  }

  openFeatureLookUp() {
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.OutputService.getFeatureList(this.step2_data.model_id).subscribe(
      data => {
        if (data.length > 0) {
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

  openChildFeatureLookUp(feature_id, feature_code) {
    this.serviceData = []
    this.parentfeatureid = feature_id
    this.lookupfor = 'feature_Detail_Output_lookup';
    this.OutputService.getFeatureDetails(feature_id, this.step2_data.model_id).subscribe(
      data => {
        if (data.AllFeatures.length > 0) {
          this.serviceData = data.AllFeatures
        }
      })
  }

  openCustomerLookUp() {

    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'output_customer';
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

  openSalesEmpLookup() { }

  openTaxCodes() { }

  onContactPersonChange(contact) {
    this.person = contact;
    this.step1_data.person_name = this.person;
  }

  openModalList() {
    this.serviceData = []
    this.OutputService.GetModelList().subscribe(
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

  onSalesPersonChange(selectedSalesEmp) {
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBom_lookup') {
      this.onclearselection();
      this.step2_data.model_id = $event[0];
      this.step2_data.model_code = $event[1];
      this.step2_data.model_name = $event[2];
      this.isModelVisible = true
      // this.GetDataForModelBomOutput();
      this.GetAllDataForModelBomOutput();
    }
    else if (this.lookupfor == 'feature_lookup') {
      this.step2_data.feature_id = $event[0];
      this.step2_data.feature_code = $event[1];
      this.getFeatureDetails($event[0], $event[1]);
    }
    else if (this.lookupfor == 'feature_Detail_Output_lookup') {
      for (let i = 0; i < this.feature_child_data.length; ++i) {
        if (this.feature_child_data[i].featureparentid == this.parentfeatureid) {
          this.feature_child_data[i].featurechildcode = $event[1];
        }

      }
      this.getFeatureDetails($event[0], $event[1]);
    }
    else if (this.lookupfor == 'Price_lookup') {
      // this.getPriceDetails($event[0], "Header", this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_section_lookup') {
      // this.rule_data = $event;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.serviceData = []
    }
    else if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if (this.step1_data.customer != undefined) {
        this.isNextButtonVisible = true;
        //get contact person
        this.fillContactPerson();
        this.fillShipTo();
        this.fillBillTo();
        this.fillOwners();
      }
      else {
        this.isNextButtonVisible = false;
      }
    }
    // this.getItemDetails($event[0]);
  }

  getFeatureDetails(feature_id, feature_code) {
    this.serviceData = []
    this.OutputService.getFeatureDetails(feature_id, this.step2_data.model_id).subscribe(
      data => {
        if (data.ItemDataForFeature.length > 0) {
          this.getItemDataForFeature(data.ItemDataForFeature);
        }
        if (data.FeaturesWithAccessoryYes.length > 0) {
          this.getAccessory(data.FeaturesWithAccessoryYes)
        }
        if (data.DefaultWarehouse.length > 0) {
          this.warehouse = data.DefaultWarehouse[0].DEFAULTWAREHOUSE
        }
        this.feature_price_calculate();
        if (this.selecteddataforelement != null || this.selecteddataforelement != undefined) {
          this.generatekey(this.selecteddataforelement)
        }

      }
    )
  }

  on_input_change(inputid, value) {
    if (inputid == "quantity") {
      if (value < 0) {
        this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = 0;
        return;
      }
      var rgexp = /^\d+$/;
      if (rgexp.test(value) == false) {
        this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = 0;
        return;
      }
      else {
        this.step2_data.quantity = value
      }


    }
  }

  getAccessory(accesorydata: any) {
    if (accesorydata.length > 0) {
      let checkedacc = false;
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].OPTM_CHILDFEATUREID) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            if (accesorydata[i].OPTM_DEFAULT == "Y") {
              checkedacc = true
            }
            else {
              checkedacc = false
            }
            this.feature_accessory_list.push({
              id: accesorydata[i].OPTM_CHILDFEATUREID,
              key: accesorydata[i].OPTM_FEATURECODE,
              name: accesorydata[i].OPTM_DISPLAYNAME,
              model_id: this.step2_data.model_id,
              checked: checkedacc,
              parentId: this.selectfeaturedata[0].parentId
            });
          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          if (accesorydata[i].OPTM_DEFAULT == "Y") {
            checkedacc = true
          }
          else {
            checkedacc = false
          }
          this.feature_accessory_list.push({
            id: accesorydata[i].OPTM_CHILDFEATUREID,
            key: accesorydata[i].OPTM_FEATURECODE,
            name: accesorydata[i].OPTM_DISPLAYNAME,
            model_id: this.step2_data.model_id,
            checked: checkedacc,
            parentId: this.selectfeaturedata[0].parentId
          });
        }
      }

    }
  }

  getAccessoryForBydefault(accesorydata: any) {
    if (accesorydata.length > 0) {
      let checkedacc = false;
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].OPTM_CHILDFEATUREID) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            if (accesorydata[i].Mandatory == "Y") {
              if (accesorydata[i].checked == "Y") {
                checkedacc = true
              }
              else {
                checkedacc = false
              }
              this.feature_accessory_list.push({
                id: accesorydata[i].FeatureId,
                key: accesorydata[i].parentId,
                name: accesorydata[i].parentId,
                model_id: this.step2_data.model_id,
                checked: checkedacc,
                parentId: accesorydata[i].parentId
              });
            }

          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          if (accesorydata[i].Mandatory == "Y") {
            if (accesorydata[i].checked == "Y") {
              checkedacc = true
            }
            else {
              checkedacc = false
            }
            this.feature_accessory_list.push({
              id: accesorydata[i].FeatureId,
              key: accesorydata[i].parentId,
              name: accesorydata[i].parentId,
              model_id: this.step2_data.model_id,
              checked: checkedacc,
              parentId: accesorydata[i].parentId
            });
          }

        }
      }

    }
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      if (this.feature_accessory_list[i].checked == true)
        for (let j = 0; j < this.tree_data_json.length; ++j) {
          if (this.tree_data_json[j].component == this.feature_accessory_list[i].parentId && this.tree_data_json[j].Mandatory == "Y") {
            this.tree_data_json[j].checked = true
          }
        }
      this.onAccessoryChange(this.feature_accessory_list[i].checked, this.feature_accessory_list[i])
    }

  }

  getItemDataForFeature(ItemData) {
    let isPriceDisabled: boolean = false;
    let isPricehide: boolean = false;
    if (ItemData.length > 0) {
      if (this.feature_itm_list_table.length > 0) {
        let isExist = 0;

        for (let i = 0; i < ItemData.length; ++i) {
          for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
            if (this.feature_itm_list_table[j].FeatureId == ItemData[i].OPTM_FEATUREID && this.feature_itm_list_table[j].featureName == ItemData[i].OPTM_DISPLAYNAME) {
              isExist = 1;
            }
          }
          if (ItemData[i].OPTM_ISPRICEEDIT == "y") {
            isPriceDisabled = false
            isPricehide = false
          }
          else {
            isPriceDisabled = true
            isPricehide = true
          }

          if (isExist == 0) {
            if (this.selectfeaturedata.length > 0) {
              for (let isel = 0; isel < this.selectfeaturedata.length; ++isel) {
                if (this.selectfeaturedata[isel].component == ItemData[i].OPTM_DISPLAYNAME) {
                  this.feature_itm_list_table.push({
                    FeatureId: ItemData[i].OPTM_FEATUREID,
                    featureName: ItemData[i].OPTM_DISPLAYNAME,
                    Item: ItemData[i].OPTM_ITEMKEY,
                    ItemNumber: ItemData[i].ITEMNUMBER,
                    Description: ItemData[i].OPTM_FEATUREDESC,
                    quantity: ItemData[i].OPTM_QUANTITY,
                    price: ItemData[i].Pricesource,
                    Actualprice: ItemData[i].Price,
                    pricextn: 0,
                    is_accessory: "N",
                    isPriceDisabled: isPriceDisabled,
                    pricehide: isPricehide,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id

                  });
                }
              }

            }
            else {
              if (this.modelitemflag == 1) {
                this.feature_itm_list_table.push({
                  FeatureId: ItemData[i].OPTM_FEATUREID,
                  featureName: ItemData[i].OPTM_DISPLAYNAME,
                  Item: ItemData[i].OPTM_ITEMKEY,
                  ItemNumber: ItemData[i].ITEMNUMBER,
                  Description: ItemData[i].OPTM_FEATUREDESC,
                  quantity: ItemData[i].OPTM_QUANTITY,
                  price: ItemData[i].Pricesource,
                  Actualprice: ItemData[i].Price,
                  pricextn: 0,
                  is_accessory: "N",
                  isPriceDisabled: isPriceDisabled,
                  pricehide: isPricehide,
                  parentId: this.step2_data.model_id,
                  model_id: this.step2_data.model_id

                });
              }
            }
          }
          isExist = 0;
        }
      }
      else {
        for (let i = 0; i < ItemData.length; ++i) {
          if (ItemData[i].OPTM_ISPRICEEDIT == "y") {
            isPriceDisabled = false
            isPricehide = false
          }
          else {
            isPriceDisabled = true
            isPricehide = true
          }
          if (this.selectfeaturedata.length > 0) {
            for (let isel = 0; isel < this.selectfeaturedata.length; ++isel) {
              if (this.selectfeaturedata[isel].component == ItemData[i].OPTM_DISPLAYNAME) {
                this.feature_itm_list_table.push({
                  FeatureId: ItemData[i].OPTM_FEATUREID,
                  featureName: ItemData[i].OPTM_DISPLAYNAME,
                  Item: ItemData[i].OPTM_ITEMKEY,
                  ItemNumber: ItemData[i].ITEMNUMBER,
                  Description: ItemData[i].OPTM_FEATUREDESC,
                  quantity: ItemData[i].OPTM_QUANTITY,
                  price: ItemData[i].Pricesource,
                  Actualprice: ItemData[i].Price,
                  pricextn: 0,
                  is_accessory: "N",
                  isPriceDisabled: isPriceDisabled,
                  pricehide: isPricehide,
                  parentId: this.selectfeaturedata[0].parentId,
                  model_id: this.step2_data.model_id
                });
              }
            }

          }
          else {
            if (this.modelitemflag == 1) {
              this.feature_itm_list_table.push({
                FeatureId: ItemData[i].OPTM_FEATUREID,
                featureName: ItemData[i].OPTM_DISPLAYNAME,
                Item: ItemData[i].OPTM_ITEMKEY,
                ItemNumber: ItemData[i].ITEMNUMBER,
                Description: ItemData[i].OPTM_FEATUREDESC,
                quantity: ItemData[i].OPTM_QUANTITY,
                price: ItemData[i].Pricesource,
                Actualprice: ItemData[i].Price,
                pricextn: 0,
                is_accessory: "N",
                isPriceDisabled: isPriceDisabled,
                pricehide: isPricehide,
                parentId: this.step2_data.model_id,
                model_id: this.step2_data.model_id

              });
            }
          }


        }
      }

    }
    this.modelitemflag = 0;
    this.feature_price_calculate();
    // this.generatekey();
  }

  generatekey(selecteddata) {
    let itemkeydata = [];
    if (this.feature_itm_list_table.length > 0) {
      // let itemkey;
      // let counter=0;
      // for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      //   for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
      //     if(this.feature_itm_list_table[i].model_id==this.step2_data.model_id){
      //       if (this.feature_itm_list_table[i].parentId == this.tree_data_json[itree].FeatureId && this.tree_data_json[itree].checked==true) {
      //         itemkeydata.push({
      //           ItemNumber: counter,
      //           Component: this.tree_data_json[itree].component,
      //           parentId: this.tree_data_json[itree].parentId,
      //           ItemKey: "",
      //           FeatureId: this.feature_itm_list_table[i].FeatureId
      //         });
      //         counter++;
      //       }
      //     }
      //     else{
      //       if (this.feature_itm_list_table[i].parentId == this.tree_data_json[itree].parentId && this.tree_data_json[itree].checked==true) {
      //         itemkeydata.push({
      //           ItemNumber: counter,
      //           Component: this.tree_data_json[itree].component,
      //           parentId: this.tree_data_json[itree].parentId,
      //           ItemKey: "",
      //           FeatureId: this.feature_itm_list_table[i].FeatureId
      //         });
      //         counter++;
      //       }
      //     }

      //   }
      // }
      // let j = 0;
      // for (let i = 0; i < itemkeydata.length; ++i) {
      //   for (let j = i; j < itemkeydata.length; ++j) {
      //     if (itemkeydata[i].Component == itemkeydata[j].parentId) {
      //       if (itemkey.length == 0) {
      //         itemkey = itemkeydata[i].ItemNumber
      //       }
      //       else {
      //         itemkey = itemkey + "-" + itemkeydata[i].ItemNumber
      //       }

      //     }
      //   }
      // }
    }
  }

  // feature_price_calculate() {
  //   // if (this.feature_itm_list_table.length > 0) {
  //   let itotal = 0;
  //   let isumofpriceitem = 0;
  //   let itax = 0;
  //   let idiscount = 0;

  //   for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
  //     isumofpriceitem = isumofpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].price);
  //   }
  //   if (isumofpriceitem > 0) {
  //     itax = (isumofpriceitem * this.feature_item_tax) / 100
  //   }
  //   if (isumofpriceitem > 0) {
  //     idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
  //   }
  //   itotal = isumofpriceitem + itax + idiscount
  //   this.feature_item_total = itotal
  //   this.acc_grand_total = this.feature_item_total + this.acc_total

  //   this.feature_tax_total[0].value = this.feature_item_tax
  //   this.feature_tax_total[1].value = this.feature_item_total
  //   this.item_tax_total[2].value = this.acc_grand_total
  //   // }
  // }

  feature_price_calculate() {
    let igrandtotal = 0;
    let iproducttotal = 0;
    let iacctotal = 0;
    let isumofpropriceitem = 0;
    let isumofaccpriceitem = 0;
    let iprotax = 0;
    let iaccotax = 0;
    let iaccdiscount = 0;
    let iprodiscount = 0;

    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      if (this.feature_itm_list_table[iacc].is_accessory == "Y") {
        isumofaccpriceitem = isumofaccpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
      }
      else {
        isumofpropriceitem = isumofpropriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].Actualprice);
      }

    }
    if (isumofpropriceitem > 0) {
      iprotax = (isumofpropriceitem * this.feature_item_tax) / 100
      iprodiscount = (isumofpropriceitem * this.feature_discount_percent) / 100
    }
    if (isumofaccpriceitem > 0) {
      iaccotax = (isumofaccpriceitem * this.acc_item_tax) / 100
      iaccdiscount = (isumofaccpriceitem * this.accessory_discount_percent) / 100
    }

    iproducttotal = isumofpropriceitem + iprotax - iprodiscount
    iacctotal = isumofaccpriceitem + iaccotax - iaccdiscount
    igrandtotal = iproducttotal + iacctotal
    this.feature_item_total = iproducttotal
    this.accessory_item_total = iacctotal
    this.acc_grand_total = igrandtotal

    // this.feature_tax_total[0].value = this.feature_item_tax
    // this.feature_tax_total[1].value = this.feature_item_total
    // this.item_tax_total[2].value = this.acc_grand_total
    // }
  }

  // accesory_price_calculate() {
  //   // if (this.accessory_itm_list_table.length > 0) {
  //   let itotal = 0;
  //   let isumofpriceitem = 0;
  //   let itax = 0;
  //   let idiscount = 0;

  //   for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
  //     isumofpriceitem = isumofpriceitem + (this.accessory_itm_list_table[iacc].quantity * this.accessory_itm_list_table[iacc].price);
  //   }
  //   if (isumofpriceitem > 0) {
  //     itax = (isumofpriceitem * this.acc_item_tax) / 100
  //   }
  //   if (isumofpriceitem > 0) {
  //     idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
  //   }
  //   itotal = isumofpriceitem + itax + idiscount
  //   this.acc_total = itotal

  //   this.acc_grand_total = this.feature_item_total + this.acc_total

  //   this.item_tax_total[0].value = this.acc_item_tax
  //   this.item_tax_total[1].value = this.acc_total
  //   this.item_tax_total[2].value = this.acc_grand_total


  //   //  }
  // }

  onAccessoryChange(value, row) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      if (this.feature_accessory_list[i].id == row.id) {
        this.feature_accessory_list[i].checked = value;
        if (this.feature_accessory_list[i].checked == true) {
          this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id, this.step2_data.model_id).subscribe(data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; ++i) {
                let isExist = 0;
                let isPriceDisabled: boolean = false;
                let isPricehide: boolean = false;
                if (data[i].OPTM_ISPRICEEDIT == "y") {
                  isPriceDisabled = false
                  isPricehide = false
                }
                else {
                  isPriceDisabled = true
                  isPricehide = true
                }
                // for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
                //   if (this.accessory_itm_list_table[iacc].Item == data[i].OPTM_ITEMKEY && this.accessory_itm_list_table[iacc].FeatureId == data[i].OPTM_FEATUREID) {
                //     isExist = 1;
                //   }
                // }
                // if (isExist == 0) {
                //   this.accessory_itm_list_table.push({
                //     FeatureId: data[i].OPTM_FEATUREID,
                //     Item: data[i].OPTM_ITEMKEY,
                //     Description: data[i].OPTM_DISPLAYNAME,
                //     quantity: data[i].OPTM_QUANTITY,
                //     price: 0,
                //     pricextn: 0
                //   });
                // }
                if (this.feature_itm_list_table.length > 0) {
                  for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
                    if (this.feature_itm_list_table[j].Item == data[i].OPTM_ITEMKEY && this.feature_itm_list_table[j].FeatureId == data[i].OPTM_FEATUREID) {
                      isExist = 1;
                    }
                  }
                  if (isExist == 0) {
                    this.feature_itm_list_table.push({
                      FeatureId: data[i].OPTM_FEATUREID,
                      featureName: data[i].OPTM_DISPLAYNAME,
                      Item: data[i].OPTM_ITEMKEY,
                      ItemNumber: data[i].ITEMNUMBER,
                      Description: data[i].OPTM_DISPLAYNAME,
                      quantity: data[i].OPTM_QUANTITY,
                      price: data[i].Pricesource,
                      Actualprice: data[i].Price,
                      pricextn: 0,
                      is_accessory: "Y",
                      isPriceDisabled: true,
                      pricehide: true,
                      parentId: this.selectfeaturedata[0].parentId,
                      model_id: this.step2_data.model_id

                    });
                  }
                }
                else {
                  this.feature_itm_list_table.push({
                    FeatureId: data[i].OPTM_FEATUREID,
                    featureName: data[i].OPTM_DISPLAYNAME,
                    Item: data[i].OPTM_ITEMKEY,
                    ItemNumber: data[i].ITEMNUMBER,
                    Description: data[i].OPTM_DISPLAYNAME,
                    quantity: data[i].OPTM_QUANTITY,
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: isPriceDisabled,
                    pricehide: isPricehide,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id
                  });
                }


              }
              this.feature_price_calculate();
            }

          })

        }
        else {
          if (this.feature_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
              if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.feature_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }


            }
          }
          this.feature_price_calculate();
        }
      }
    }
    // this.accesory_price_calculate();

  }

  // on_accessory_input_change(inputid, value, rowid, item) {
  //   for (let i = 0; i < this.accessory_itm_list_table.length; ++i) {
  //     if (rowid == this.accessory_itm_list_table[i].FeatureId && item == this.accessory_itm_list_table[i].Item) {
  //       if (inputid == "quantity") {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].quantity = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].quantity = value
  //       }
  //       else if (inputid == "price") {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].price = 0;
  //           return;
  //         }
  //         var rgexp = /^\d+$/;
  //         if (rgexp.test(value) == false) {
  //           this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].quantity = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].price = value
  //       }
  //       else {
  //         if (value < 0) {
  //           this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
  //           this.accessory_itm_list_table[i].pricextn = 0;
  //           return;
  //         }
  //         this.accessory_itm_list_table[i].pricextn = value
  //       }

  //       // this.accesory_price_calculate();


  //     }

  //   }
  // }

  on_feature_input_change(inputid, value, rowid, item) {
    for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      if (rowid == this.feature_itm_list_table[i].FeatureId && item == this.feature_itm_list_table[i].Item) {
        if (inputid == "quantity") {
          if (value < 0) {
            this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = 0;
            return;
          }
          var rgexp = /^\d+$/;
          if (rgexp.test(value) == false) {
            this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = 0;
            return;
          }
          this.feature_itm_list_table[i].quantity = value
        }
        else if (inputid == "price") {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].price = 0;
            return;
          }
          this.feature_itm_list_table[i].price = value
        }
        else {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.feature_itm_list_table[i].pricextn = 0;
            return;
          }
          this.feature_itm_list_table[i].pricextn = value
        }

        this.feature_price_calculate();

      }

    }
  }

  selectall(value) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      this.feature_accessory_list[i].checked = value;
      if (value == true) {
        this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id, this.step2_data.model_id).subscribe(data => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; ++i) {
              let isExist = 0;
              let isPriceDisabled: boolean = false;
              let isPricehide: boolean = false;
              if (data[i].OPTM_ISPRICEEDIT == "y") {
                isPriceDisabled = false
                isPricehide = false
              }
              else {
                isPriceDisabled = true
                isPricehide = true
              }

              // for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
              //   if (this.accessory_itm_list_table[iacc].Item == data[i].OPTM_ITEMKEY && this.accessory_itm_list_table[iacc].FeatureId == data[i].OPTM_FEATUREID) {
              //     isExist = 1;
              //   }
              // }
              // if (isExist == 0) {
              //   this.accessory_itm_list_table.push({
              //     FeatureId: data[i].OPTM_FEATUREID,
              //     Item: data[i].OPTM_ITEMKEY,
              //     Description: data[i].OPTM_DISPLAYNAME,
              //     quantity: data[i].OPTM_QUANTITY,
              //     price: 0,
              //     pricextn: 0
              //   });
              // } 
              if (this.feature_itm_list_table.length > 0) {
                for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
                  if (this.feature_itm_list_table[j].Item == data[i].OPTM_ITEMKEY && this.feature_itm_list_table[j].FeatureId == data[i].OPTM_FEATUREID) {
                    isExist = 1;
                  }
                }
                if (isExist == 0) {
                  this.feature_itm_list_table.push({
                    FeatureId: data[i].OPTM_FEATUREID,
                    featureName: "",
                    Item: data[i].OPTM_ITEMKEY,
                    Description: data[i].OPTM_DISPLAYNAME,
                    ItemNumber: "",
                    quantity: data[i].OPTM_QUANTITY,
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: true,
                    pricehide: true,
                    parentId: this.selectfeaturedata[0].parentId,
                    model_id: this.step2_data.model_id
                  });
                }
              }
              else {
                this.feature_itm_list_table.push({
                  FeatureId: data[i].OPTM_FEATUREID,
                  featureName: "",
                  Item: data[i].OPTM_ITEMKEY,
                  Description: data[i].OPTM_DISPLAYNAME,
                  quantity: data[i].OPTM_QUANTITY,
                  ItemNumber: "",
                  price: data[i].Pricesource,
                  Actualprice: data[i].Price,
                  pricextn: 0,
                  is_accessory: "Y",
                  isPriceDisabled: true,
                  pricehide: true,
                  parentId: this.selectfeaturedata[0].parentId,
                  model_id: this.step2_data.model_id
                });
              }
            }
            this.feature_price_calculate();

          }

        })
      }
      else {
        if (this.feature_itm_list_table.length > 0) {
          for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
            if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
              this.feature_itm_list_table.splice(iacc, 1)
              iacc = iacc - 1;
            }


          }
        }
        this.feature_price_calculate();
      }
    }
    //this.accesory_price_calculate();


  }

  on_calculation_change(inputid, value) {
    if (value < 0) {
      this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
      return;
    }
    if (inputid == "product_discount") {
      this.feature_discount_percent = value;
    }
    else {
      this.accessory_discount_percent = value;
    }
    this.feature_price_calculate();
  }

  onclearselection() {
    this.serviceData = [];
    this.step2_data = [];
    this.tree_data_json = [];
    this.feature_child_data = [];
    this.feature_accessory_list = [];
    this.feature_itm_list_table = [];
    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_item_total = 0
    this.acc_total = 0;
    this.acc_grand_total = 0;
    this.feature_tax_total[0].value = 0;
    this.feature_tax_total[1].value = 0;
    this.feature_discount_percent = 0;
    this.accessory_discount_percent = 0;
    this.step2_data.quantity = 0;
    this._el.nativeElement.focus();

  }

  GetAllDataForModelBomOutput() {
    this.OutputService.GetDataByModelIDForFirstLevel(this.step2_data.model_id, this.step2_data.model_name).subscribe(
      data => {
        if (data != null || data != undefined) {
        //  this.GetDataForSelectedFeatureModelItem(2,"",13,"");
        console.log(data);
        this.ModelHeaderData = data.ModelHeaderData;
        this.ModelBOMDataForSecondLevel = data.ModelBOMDataForSecondLevel;
        this.FeatureBOMDataForSecondLevel = data.FeatureBOMDataForSecondLevel;

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

  onselectionchange(type,modelid,featureid,item) {
    this.OutputService.GetDataForSelectedFeatureModelItem(type,modelid,featureid,item).subscribe(
      data => {
        if (data != null || data != undefined) {

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



  GetDataForModelBomOutput() {
    this.lookupfor = 'tree_view__model_bom_Output_lookup"';
    this.tree_data_json = [];
    if (this.tree_data_json == undefined || this.tree_data_json.length == 0) {
      this.OutputService.GetDataForModelBomOutput(this.step2_data.model_id, this.step2_data.model_name).subscribe(
        data => {
          if (data != null || data != undefined) {
            // this.serviceData = data;
            // this.lookupfor = "tree_view__model_bom_lookup";
            let counter_temp = 0;
            let temp_data = data.Table2.filter(function (obj) {
              // obj['live_row_id'] = (counter_temp++);
              return obj;
            });
            for (let i = 0; i < temp_data.length; ++i) {
              if (temp_data[i].checked == "Y") {
                temp_data[i].checked = true
              }
              else {
                temp_data[i].checked = false
              }
              if (temp_data[i].MaxSelectable == "1") {
                temp_data[i].element_type = "radio"
              }
              else {
                if (temp_data[i].MaxSelectable > 1) {
                  temp_data[i].element_type = "checkbox"
                }

              }
            }
            this.tree_data_json = temp_data;
            this.tree_accessory_json = data.Table3;
            this.GetDataByModelId(this.step2_data.model_id);
            this.getAccessoryForBydefault(data.Table3)

            setTimeout(() => {
              this.tree_view_expand_collapse()
            }, 2000);
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
      // let sequence_count = parseInt(this.tree_data_json.length + 1);
      // if (this.live_tree_view_data.length > 0) {
      //   console.log(this.live_tree_view_data);
      //   for (var key in this.live_tree_view_data) {
      //     this.tree_data_json.push({ "sequence": sequence_count, "parentId": this.modelbom_data.feature_name, "component": this.live_tree_view_data[key].display_name, "level": "1", "live_row_id": this.tree_data_json.length, "is_local": "1" });
      //   }

      //   this.live_tree_view_data = [];
      //   console.log(this.tree_data_json);
      // }
    }
  }

  on_element_input_change(data, value) {
    this.selectfeaturedata = [];
    this.selectfeaturedata.push(data)
    if (this.feature_accessory_list.length > 0) {
      for (let i = 0; i < this.feature_accessory_list.length; ++i) {
        if (this.feature_accessory_list[i].parentId == data.parentId) {
          if (this.feature_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
              if (this.feature_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.feature_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }
            }
          }
          this.feature_price_calculate();
          this.feature_accessory_list.splice(i, 1);
          i = i - 1;
        }
      }
    }
    // let itotalcheckfeature = 0;
    // for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
    //   if (this.tree_data_json[itree].FeatureId == data.FeatureId && this.tree_data_json[itree].checked == true) {
    //     itotalcheckfeature = itotalcheckfeature + 1;
    //   }
    //   if (itotalcheckfeature >= data.MaxSelectable && this.tree_data_json[itree].component == data.component) {
    //     this.tree_data_json[itree].checked = false
    //     this.toastr.error('', "cannot select greater than maximum selectable limit", this.commonData.toast_config);
    //     return;
    //   }
    //   else {
    //     if(this.tree_data_json[itree].component == data.component){
    //       this.tree_data_json[itree].checked = true
    //     }
    //   }
    // }
    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      if (this.feature_itm_list_table[iacc].FeatureId == data.FeatureId) {
        if (data.MaxSelectable == 1) {
          this.feature_itm_list_table.splice(iacc, 1)
          iacc = iacc - 1;
          for (let itree = 0; itree < this.tree_data_json.length; ++itree) {
            if (this.tree_data_json[itree].FeatureId == data.FeatureId) {
              //itotalcheckfeature = itotalcheckfeature + 1;
              if (this.tree_data_json[itree].component != data.component) {
                this.tree_data_json[itree].checked = false
              }

            }
          }
        }
      }
      if (value == false) {
        if (data.component == this.feature_itm_list_table[iacc].featureName) {
          this.feature_itm_list_table.splice(iacc, 1)
          iacc = iacc - 1;
        }
      }
    }
    if (value == true) {
      if (data.FeatureId == this.step2_data.model_id) {
        this.bycheckboxpress = 1
        this.GetDataByModelId(this.step2_data.model_id)
      }
      else {

        this.getFeatureDetails(data.FeatureId, this.step2_data.model_id);
        this.selecteddataforelement = data;
      }
    }





  }

  GetDataByModelId(id) {
    this.OutputService.GetDataByModelId(id).subscribe(
      data => {
        this.modelitemflag = 1;
        this.getItemDataForFeature(data.ModelDetail);
        this.modelitemflag = 0;
        this.selectfeaturedata = [];
        for (let iacc = 0; iacc < this.tree_data_json.length; ++iacc) {
          if (this.tree_data_json[iacc].checked == true && this.tree_data_json[iacc].OPTM_ITEMKEY != "" && this.tree_data_json[iacc].parentId != this.step2_data.model_code && this.tree_data_json[iacc].Mandatory == "Y") {
            this.selectfeaturedata.push(this.tree_data_json[iacc])
            if (this.feature_accessory_list.length > 0) {
              for (let i = 0; i < this.feature_accessory_list.length; ++i) {
                if (this.feature_accessory_list[i].parentId == this.tree_data_json[iacc].parentId) {
                  if (this.feature_itm_list_table.length > 0) {
                    for (let iaccss = 0; iaccss < this.feature_itm_list_table.length; ++iaccss) {
                      if (this.feature_itm_list_table[iaccss].FeatureId == this.feature_accessory_list[i].id) {
                        this.feature_itm_list_table.splice(iaccss, 1)
                        iaccss = iaccss - 1;
                      }
                    }
                  }
                  this.feature_price_calculate();
                  this.feature_accessory_list.splice(i, 1);
                  i = i - 1;
                }
              }
            }
            if (this.bycheckboxpress == 0) {
              for (let iaccess = 0; iaccess < this.feature_itm_list_table.length; ++iaccess) {
                if (this.feature_itm_list_table[iaccess].parentId == this.tree_data_json[iacc].parentId) {
                  this.feature_itm_list_table.splice(iaccess, 1)
                  iaccess = iaccess - 1;
                }
              }

            }

          }
        }
        // this.on_element_input_change(this.tree_data_json[iacc],false)


        for (let iaccss = 0; iaccss < this.selectfeaturedata.length; iaccss++) {
          this.getFeatureDetails(this.selectfeaturedata[iaccss].FeatureId, this.step2_data.model_id);
        }

        this.bycheckboxpress = 0;
      }
    )

  }



  //this will get the contact person
  fillContactPerson() {
    this.OutputService.fillContactPerson(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          if (data.ContactPerson.length > 0) {
            this.contact_persons = data.ContactPerson;
            this.person = data.ContactPerson[0].Name;
            this.step1_data.person_name = this.person;
          }
          else {
            this.contact_persons = [];
          }
          if (data.DefaultSalesPerson.length > 0) {
            this.sales_employee = data.DefaultSalesPerson;
            this.salesemployee = data.DefaultSalesPerson[0].SlpName;
            this.step1_data.sales_employee = data.DefaultSalesPerson[0].SlpName;

          }
          else {
            this.sales_employee = [];
          }
        }
        else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )


  }
  fillShipTo() {
    this.OutputService.fillShipTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {

        if (data != null || data != undefined && data.length > 0) {

          if (data.ShipDetail.length > 0) {
            this.ship_to = data.ShipDetail;
            this.customerShipTo = data.ShipDetail[0].ShipToDef;
            this.step1_data.ship_to = data.ShipDetail[0].ShipToDef;


            this.ship_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              ShipTo: this.customerShipTo

            });
            this.OutputService.fillShipAddress(this.ship_data).subscribe(
              data => {
                if (data != null || data != undefined && data.length > 0) {
                  this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
                }
                else {
                  this.step1_data.ship_to_address = '';
                }
              })
          }
          else {
            this.ship_to = [];
            this.step1_data.ship_to_address = '';
          }
        }
      }
    )
  }

  fillBillTo() {
    this.OutputService.fillBillTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          if (data.BillToDef.length > 0) {
            this.bill_to = data.BillToDef;
            this.customerBillTo = data.BillToDef[0].BillToDef;
            this.step1_data.bill_to = data.BillToDef[0].BillToDef;

            this.bill_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              BillTo: this.customerBillTo

            });
            this.OutputService.fillBillAddress(this.bill_data).subscribe(
              data => {
                if (data != null || data != undefined && data.length > 0) {
                  this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
                }
                else {
                  this.step1_data.bill_to_address = '';
                }
              })
          }
          else {
            this.bill_to = [];
            this.step1_data.bill_to_address = '';
          }
        }

      })
  }

  fillOwners() {
    this.OutputService.fillAllOwners(this.common_output_data.companyName).subscribe(
      data => {

        if (data != null || data != undefined && data.length > 0) {
          this.owner_list = data;
        }
        else {
          this.owner_list = [];
        }
      })
  }

  onShipToChange(SelectedShipTo) {

    this.step1_data.ship_to = SelectedShipTo;

    this.ship_data = [];
    this.ship_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedShipTo

    });
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else {
          this.step1_data.ship_to_address = '';
        }
      })
  }

  onBillToChange(SelectedBillTo) {
    this.step1_data.bill_to = SelectedBillTo;
    this.bill_data = [];
    this.bill_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedBillTo

    });
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
        }
        else {
          this.step1_data.bill_to_address = '';



        }
      })
  }
  onCustomerChange() {
    this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data === "False") {
          this.toastr.error('', this.language.invalidcustomer, this.commonData.toast_config);
          this.isNextButtonVisible = false;
          this.step1_data.customer = "";
          this.step1_data.customer_name = '';
          this.contact_persons = [];
          this.sales_employee = [];
          this.ship_to = [];
          this.step1_data.ship_to_address = '';
          this.step1_data.bill_to_address = '';
          this.bill_to = [];
          this.owner_list = [];
          return;
        }

        else {
          this.isNextButtonVisible = true;
          this.GetCustomername();
          this.fillContactPerson();
          this.fillShipTo();
          this.fillBillTo();
          this.fillOwners();
        }
      })

  }

  GetCustomername() {
    this.OutputService.GetCustomername(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )
  }

  onDocumentChange() {
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = this.language.SalesQuote;
    }
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = this.language.SalesOrder;
    }
  }

  onFinishPress() {
    let final_dataset_to_save: any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTDTL = [];
    final_dataset_to_save.ConnectionDetails = [];

    //creating header data
    final_dataset_to_save.OPConfig_OUTPUTHDR.push({
      "OPTM_OUTPUTID": "",
      "OPTM_DOCTYPE": this.step1_data.document,
      "OPTM_BPCODE": this.step1_data.customer,
      "OPTM_SHIPTO": this.step1_data.ship_to,
      "OPTM_BILLTO": this.step1_data.bill_to,
      "OPTM_CONTACTPERSON": this.step1_data.person_name,
      "OPTM_TAX": this.acc_item_tax,
      "OPTM_PAYMENTTERM": "",
      "OPTM_FGITEM": this.step2_data.model_code,
      "OPTM_KEY": "DEMO-KEY",
      "OPTM_DELIVERYDATE": this.step1_data.delivery_date,
      "OPTM_QUANTITY": this.step2_data.quantity,
      "OPTM_CREATEDBY": this.common_output_data.username,
      "OPTM_MODIFIEDBY": this.common_output_data.username
    })

    //creating details table array
    final_dataset_to_save.OPConfig_OUTPUTDTL = this.step2_final_dataset_to_save;

    //creating connection detials
    final_dataset_to_save.ConnectionDetails.push({
      CompanyDBID: this.common_output_data.companyName
    })

    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          if (data[0].Status == "True") {
            this.iLogID = data[0].LogId;
            this.toastr.success('', this.language.OperCompletedSuccess, this.commonData.toast_config);
          }
          else {
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
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

  openPriceListLookup() {

  }

  delete_multiple_final_modal() {
    console.log(this.final_array_checked_options);
    if (this.final_array_checked_options.length > 0) {

      this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
      this.show_dialog = true;


    } else {
      this.toastr.error('', this.language.no_model_selected, this.commonData.toast_config);
    }

  }

  remove_final_modal(row_data) {
    this.isMultiDelete = false;
    this.final_row_data = row_data;
    this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
    this.show_dialog = true;
  }

  on_checkbox_checked(checkedvalue, row_data) {
    this.rows = row_data;
    if (checkedvalue.checked == true) {
      this.isMultiDelete = true;
      this.final_array_checked_options.push(row_data);
    }
    else {
      let i = this.final_array_checked_options.indexOf(row_data);
      this.final_array_checked_options.splice(i, 1)
    }
    console.log(this.final_array_checked_options);
  }

  refresh_bom_status() {
    this.dontShowFinalLoader = true;
    this.showFinalLoader = false;
    this.getFinalBOMStatus();
  }

  tree_view_expand_collapse() {
    let laguage = this.language;
    // $(document).find('.tree li:has(ul)').addClass('parent_li').find('span.parent_span').find("i.fa").addClass("fa-plus");
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

  //Row Deletion
  //This will take confimation box value
  get_dialog_value(userSelectionValue) {
    if (userSelectionValue == true) {
      if (this.isMultiDelete == false) {
        this.delete_row();
      }
      else {
        this.delete_all_row_data();
      }
    }
    this.show_dialog = false;
  }

  delete_row() {
    this.cleanupAccessories(this.final_row_data.model_id);
    this.cleanupFeatureItemList(this.final_row_data.model_id);
    this.cleanuptree();
    this.cleanupFinalArray(this.final_row_data.model_id);

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();

    this.feature_item_tax = 0;
    this.feature_item_total = 0;
    this.acc_item_tax = 0;
    this.accessory_discount_percent = 0;
    this.accessory_item_total = 0;
    this.acc_grand_total = 0;
  }

  delete_all_row_data() {
    for (let iCount = 0; iCount < this.final_array_checked_options.length; iCount++) {
      //clean Accessory List Array
      this.cleanupAccessories(this.final_array_checked_options[iCount].model_id);
      //Clean Feature List Array
      this.cleanupFeatureItemList(this.final_array_checked_options[iCount].model_id);
      //Clean Final Array (step3_data_final_data)
      this.cleanupFinalArray(this.final_array_checked_options[iCount].model_id);
    }

    //Clean Tree Data
    this.cleanuptree();

    //After the removal of all data of that model will recalculate the prices
    this.feature_price_calculate();
  }

  cleanupAccessories(current_model_id) {
    //Get the modal id and clean the data of accessories here
    for (let count = 0; count < this.feature_accessory_list.length; count++) {
      if (current_model_id == this.feature_accessory_list[count].model_id) {
        this.feature_accessory_list.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanupFeatureItemList(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.feature_itm_list_table.length; count++) {
      if (current_model_id == this.feature_itm_list_table[count].model_id) {
        this.feature_itm_list_table.splice(count, 1);
        count = count - 1;
      }
    }

  }

  cleanupFinalArray(current_model_id) {
    //Get the modal id and clean the data of Features List here
    for (let count = 0; count < this.step3_data_final.length; count++) {
      if (current_model_id == this.step3_data_final[count].model_id) {
        this.step3_data_final.splice(count, 1);
        count = count - 1;
      }
    }
  }

  cleanuptree() {
    this.tree_data_json = [];
    this.complete_dataset = [];
    this.tree_data_json.length = 0;
    this.complete_dataset.length = 0;
  }

  //For next press towards finsh screen
  onModelBillNextPress() {
    //Clear the array
    console.log('this.feature_itm_list_table');
    console.log(this.feature_itm_list_table);

    this.step3_data_final = [];
    this.step2_final_dataset_to_save = [];
    this.step3_data_final.push({
      "rowIndex": "1",
      "sl_no": "1",
      "item": this.step2_data.model_code,
      "qunatity": this.step2_data.quantity,
      "price": this.acc_grand_total,
      "price_ext": 0,
      "feature": this.feature_itm_list_table,
      "accesories": this.feature_accessory_list,
      "model_id": this.step2_data.model_id,
    })
    this.step2_final_dataset_to_save = [];
    if (this.step2_final_dataset_to_save.length == 0) {

    }

    if (this.feature_accessory_list.length <= 0 && this.feature_itm_list_table.length <= 0) {
      //Clear the array when user play with next prev button
      this.step3_data_final = [];
    }
    for (let i = 0; i < this.feature_itm_list_table.length; i++) {
      for (let jtree = 0; jtree < this.tree_data_json.length; jtree++) {
        if (this.step2_final_dataset_to_save.length == 0 && this.tree_data_json[jtree].ModelType == 0) {
          this.step2_final_dataset_to_save.push({
            "OPTM_OUTPUTID": "",
            "OPTM_OUTPUTDTLID": "",
            "OPTM_ITEMNUMBER": this.tree_data_json[jtree].ItemNumber,
            "OPTM_ITEMCODE": this.tree_data_json[jtree].component,
            "OPTM_KEY": "",
            "OPTM_PARENTKEY": "",
            "OPTM_TEMPLATEID": this.tree_data_json[jtree].ModelTemplateItem,
            "OPTM_ITMCODEGENKEY": this.tree_data_json[jtree].ItemCodeGeneration,
            "OPTM_ITEMTYPE": this.tree_data_json[jtree].ModelType,
            "OPTM_WHSE": this.warehouse,
            "OPTM_LEVEL": this.tree_data_json[jtree].level,
            "OPTM_QUANTITY": this.step2_data.quantity,
            "OPTM_PRICELIST": this.feature_itm_list_table[i].price,
            "OPTM_UNITPRICE": this.feature_itm_list_table[i].Actualprice,
            "OPTM_TOTALPRICE": this.feature_itm_list_table[i].Actualprice * this.feature_itm_list_table[i].quantity,
            "OPTM_DISCPERCENT": this.feature_itm_list_table[i].pricextn,
            "OPTM_CREATEDBY": this.common_output_data.username,
            "OPTM_MODIFIEDBY": this.common_output_data.username,
            "UNIQUEIDNT": this.tree_data_json[jtree].UniqueIdentifier,
            "PARENTID": this.tree_data_json[jtree].parentId,
            "OPTM_FGCREATEDATE":"",
            "OPTM_REFITEMCODE": "",
          })
        }
        if (this.feature_itm_list_table[i].featureName == this.tree_data_json[jtree].component && this.feature_itm_list_table[i].is_accessory == "N") {
          //creating detail data
          let isExist = 0;
          for (let iexist = 0; iexist < this.step2_final_dataset_to_save.length; iexist++) {
            if (this.step2_final_dataset_to_save[iexist].OPTM_ITEMCODE == this.feature_itm_list_table[i].Item && this.step2_final_dataset_to_save[iexist].PARENTID == this.tree_data_json[jtree].parentId) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            this.step2_final_dataset_to_save.push({
              "OPTM_OUTPUTID": "",
              "OPTM_OUTPUTDTLID": "",
              "OPTM_ITEMNUMBER": this.tree_data_json[jtree].ItemNumber,
              "OPTM_ITEMCODE": this.feature_itm_list_table[i].Item,
              "OPTM_KEY": "",
              "OPTM_PARENTKEY": "",
              "OPTM_TEMPLATEID": this.tree_data_json[jtree].ModelTemplateItem,
              "OPTM_ITMCODEGENKEY": this.tree_data_json[jtree].ItemCodeGeneration,
              "OPTM_ITEMTYPE": this.tree_data_json[jtree].ModelType,
              "OPTM_WHSE": this.warehouse,
              "OPTM_LEVEL": this.tree_data_json[jtree].level,
              "OPTM_QUANTITY": this.feature_itm_list_table[i].quantity,
              "OPTM_PRICELIST": this.feature_itm_list_table[i].price,
              "OPTM_UNITPRICE": this.feature_itm_list_table[i].Actualprice,
              "OPTM_TOTALPRICE": this.feature_itm_list_table[i].Actualprice * this.feature_itm_list_table[i].quantity,
              "OPTM_DISCPERCENT": this.feature_itm_list_table[i].pricextn,
              "OPTM_CREATEDBY": this.common_output_data.username,
              "OPTM_MODIFIEDBY": this.common_output_data.username,
              "UNIQUEIDNT": this.tree_data_json[jtree].UniqueIdentifier,
              "PARENTID": this.tree_data_json[jtree].parentId
            })
          }
          isExist = 0;

        }
        else {
          if (this.feature_itm_list_table[i].is_accessory == "Y") {
            for (let jacctree = 0; jacctree < this.tree_accessory_json.length; jacctree++) {
              if (this.feature_itm_list_table[i].featureName == this.tree_accessory_json[jacctree].component) {
                let isaccExist = 0;
                for (let iexist = 0; iexist < this.step2_final_dataset_to_save.length; iexist++) {
                  if (this.step2_final_dataset_to_save[iexist].OPTM_ITEMCODE == this.feature_itm_list_table[i].Item && this.step2_final_dataset_to_save[iexist].PARENTID == this.tree_accessory_json[jtree].parentId) {
                    isaccExist = 1;
                  }
                }
                if (isaccExist == 0) {
                  this.step2_final_dataset_to_save.push({
                    "OPTM_OUTPUTID": "",
                    "OPTM_OUTPUTDTLID": "",
                    "OPTM_ITEMNUMBER": this.tree_accessory_json[jtree].ItemNumber,
                    "OPTM_ITEMCODE": this.feature_itm_list_table[i].Item,
                    "OPTM_KEY": "",
                    "OPTM_PARENTKEY": "",
                    "OPTM_TEMPLATEID": this.tree_accessory_json[jtree].ModelTemplateItem,
                    "OPTM_ITMCODEGENKEY": this.tree_accessory_json[jtree].ItemCodeGeneration,
                    "OPTM_ITEMTYPE": this.tree_accessory_json[jtree].ModelType,
                    "OPTM_WHSE": this.warehouse,
                    "OPTM_LEVEL": this.tree_accessory_json[jtree].level,
                    "OPTM_QUANTITY": this.feature_itm_list_table[i].quantity,
                    "OPTM_PRICELIST": this.feature_itm_list_table[i].price,
                    "OPTM_UNITPRICE": this.feature_itm_list_table[i].Actualprice,
                    "OPTM_TOTALPRICE": this.feature_itm_list_table[i].Actualprice * this.feature_itm_list_table[i].quantity,
                    "OPTM_DISCPERCENT": this.feature_itm_list_table[i].pricextn,
                    "OPTM_CREATEDBY": this.common_output_data.username,
                    "OPTM_MODIFIEDBY": this.common_output_data.username,
                    "UNIQUEIDNT": this.tree_accessory_json[jtree].UniqueIdentifier,
                    "PARENTID": this.tree_accessory_json[jtree].parentId
                  })
                }
                isaccExist = 0;
              }
            }
          }
        }
      }
    }
    let modelindex;
    let itemkeystring = "";
    let itemcodeparent = ""
    for (let isave = 0; isave < this.step2_final_dataset_to_save.length; isave++) {
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE == "0") {
        modelindex = isave;
        itemcodeparent = this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE;
      }
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE == "2" || this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE == "3") {
        if (this.step2_final_dataset_to_save[isave].UNIQUEIDNT == "Y") {
          if (itemkeystring.length == 0) {
            itemkeystring = this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER
          }
          else {
            itemkeystring = itemkeystring + "-" + this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER

          }

        }
      }
      this.step2_final_dataset_to_save[modelindex].OPTM_KEY = itemkeystring
    }
    for (let isave = 0; isave < this.step2_final_dataset_to_save.length; isave++) {
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE != "0") {
        this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY = itemkeystring
      }

    }
    itemkeystring = "";
    itemcodeparent = ""
    for (let isave = 0; isave < this.step2_final_dataset_to_save.length; isave++) {
      if (this.step2_final_dataset_to_save[isave].OPTM_ITEMTYPE == "1") {
        modelindex = isave;
        itemcodeparent = this.step2_final_dataset_to_save[isave].OPTM_ITEMCODE;

        if (itemcodeparent == this.step2_final_dataset_to_save[isave].PARENTID && this.step2_final_dataset_to_save[isave].UNIQUEIDNT == "Y") {
          if (itemkeystring.length == 0) {
            itemkeystring = this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER
          }
          else {
            itemkeystring = itemkeystring + "-" + this.step2_final_dataset_to_save[isave].OPTM_ITEMNUMBER
          }
        }
        this.step2_final_dataset_to_save[modelindex].OPTM_KEY = itemkeystring
      }
    }
    for (let isave = 0; isave < this.step2_final_dataset_to_save.length; isave++) {
      if (itemcodeparent == this.step2_final_dataset_to_save[isave].PARENTID) {
        this.step2_final_dataset_to_save[isave].OPTM_PARENTKEY = itemkeystring
      }
    }



  }

  //For getting final status this mehod will handle 
  getFinalBOMStatus() {
    this.OutputService.getFinalBOMStatus(this.iLogID).subscribe(
      data => {
        if (data != null && data.length > 0) {
          if (data[0].Status == "P") {
            this.final_order_status = this.language.process_status;
            this.final_ref_doc_entry = data[0].RefDocEntry;
            this.final_document_number = data[0].RefDocNo;
            this.stoprefreshloader();
          }
          else {
            this.final_order_status = this.language.pending_status;
            this.stoprefreshloader();
          }
        }
        else {
          this.stoprefreshloader();
          this.toastr.error('', this.language.server_error, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.stoprefreshloader();
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )

  }

  stoprefreshloader() {
    this.dontShowFinalLoader = false;
    this.showFinalLoader = true;
  }

  get_feature_elements(header_feature_table, feature_child_datatable, model_child_datatable){
  var array = []; 
    if(header_feature_table['OPTM_TYPE'] == "1"){

      array = feature_child_datatable.filter(function(obj){
        return obj['OPTM_FEATUREID'] == header_feature_table['OPTM_FEATUREID'];
      });
    } else if(header_feature_table['OPTM_TYPE'] == "3"){
      array =  model_child_datatable.filter(function(obj){
        return obj['OPTM_MODELID'] == header_feature_table['OPTM_CHILDMODELID'];
      });
    }
    if(header_feature_table['OPTM_MAXSELECTABLE']>1){
       header_feature_table['element_type'] = "checkbox";
       header_feature_table['element_class'] = "custom-control custom-checkbox";
    }
    else{
      header_feature_table['element_type'] = "radio";
      header_feature_table['element_class'] = "custom-control custom-radio";
    }
    return array;
     
  }
  
}