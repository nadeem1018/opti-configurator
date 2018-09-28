import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationStyleMetadata } from '../../../../node_modules/@angular/animations';
import * as $ from 'jquery';
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
  //public step2_data_all_data={};
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn, this.language.accessories];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price, this.language.price_extn, "X"];
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public acc_item_tax: number = 0
  public acc_total: number = 0
  public accessory_item_tax: number = 0;
  public accessory_item_total: number = 0;
  public acc_grand_total: number = 0
  public isModelVisible: boolean = false;
  public final_document_number: any = '';
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
  public Accessory_table_hidden_elements = [false, false, false, true];
  public order_creation_table_head = [this.language.hash, this.language.item, this.language.quantity, this.language.price, this.language.price_extn];
  feature_child_data: any = [];
  public tree_data_json:any =[];
  public complete_dataset:any = [];
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
  ngOnInit() {
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
    this.step3_data_final = [
      { "rowIndex": "1", "sl_no": "1", "item": "Model 1", "qunatity": "10", "price": "2000", "price_ext": "20", "rowIndexBtn": "1" },
      { "rowIndex": "2", "sl_no": "2", "item": "Model 2", "qunatity": "20", "price": "2000", "price_ext": "20", "rowIndexBtn": "2" },
      { "rowIndex": "3", "sl_no": "3", "item": "Model 3", "qunatity": "30", "price": "2000", "price_ext": "20", "rowIndexBtn": "3" },
      { "rowIndex": "4", "sl_no": "4", "item": "Model 4", "qunatity": "40", "price": "2000", "price_ext": "20", "rowIndexBtn": "1" },
    ];

    // dummy data for 2nd screen 
    this.tree_data_json = [
      { "sequence": "1", "component": "F1", "level": "0", "parentId": "", "element_type": "radio" },
      { "sequence": "2", "component": "F2", "level": "1", "parentId": "F1", "element_type": "radio" },
      { "sequence": "3", "component": "F3", "level": "1", "parentId": "F1", "element_type": "radio" },
      { "sequence": "4", "component": "Item0001", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      { "sequence": "5", "component": "Item0002", "level": "2", "parentId": "F2", "element_type": "checkbox" },
      { "sequence": "6", "component": "F4", "level": "2", "parentId": "F3", "element_type": "radio" },
      { "sequence": "7", "component": "F5", "level": "2", "parentId": "F3", "element_type": "radio" },
      { "sequence": "7", "component": "F6", "level": "3", "parentId": "F4", "element_type": "radio" },
      { "sequence": "8", "component": "Item0003", "level": "3", "parentId": "F5", "element_type": "radio" },
      { "sequence": "9", "component": "Item0004", "level": "3", "parentId": "F5", "element_type": "radio" },
      { "sequence": "10", "component": "Item0005", "level": "4", "parentId": "F6", "element_type": "radio" },
      { "sequence": "11", "component": "Item0006", "level": "4", "parentId": "F6", "element_type": "radio" },
      { "sequence": "13", "component": "Item0002", "level": "1", "parentId": "F1", "element_type": "checkbox" },
      { "sequence": "14", "component": "Item0011", "level": "0", "parentId": "", "element_type": "checkbox" }
    ];
    console.log(this.tree_data_json);
    // initialize jquery 
   setTimeout(()=>{
      this.tree_view_expand_collapse()
   }, 2000);
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
    this.console.log(selectedSalesEmp);
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBom_lookup') {
      this.step2_data.model_id = $event[0];
      this.step2_data.model_code = $event[1];
      this.isModelVisible = true
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
        if (data.AllFeatures.length > 0) {
          this.FeatureChildData = data.AllFeatures;
          if (data.ItemDataForFeature.length > 0) {
            this.getItemDataForFeature(data.ItemDataForFeature);
            this.feature_itm_list_temp_table.push(data.ItemDataForFeature);
          }
          if (data.FeaturesWithAccessoryYes.length > 0) {
            this.getAccessory(data.FeaturesWithAccessoryYes)
          }
          if (this.feature_child_data.length > 0) {
            let isExist = 0;
            for (let i = 0; i < this.feature_child_data.length; ++i) {
              if (this.feature_child_data[i].featureparentid == feature_id) {
                isExist = 1;
              }
            }
            if (isExist == 0) {
              this.feature_child_data.push({
                index: this.feature_child_data.length + 1,
                featureparentcode: feature_code,
                featureparentid: feature_id,
                featurechildcode: ""
              });
            }
          }
          else {
            this.feature_child_data.push({
              index: this.feature_child_data.length + 1,
              featureparentcode: feature_code,
              featureparentid: feature_id,
              featurechildcode: ""
            });
          }
          // this.accesory_price_calculate();
          this.feature_price_calculate();
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          // this.getAccessory();
          // this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
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
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].id) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            this.feature_accessory_list.push({
              id: accesorydata[i].OPTM_CHILDFEATUREID,
              key: accesorydata[i].OPTM_FEATURECODE,
              name: accesorydata[i].OPTM_DISPLAYNAME,
              checked: false
            });
          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          this.feature_accessory_list.push({
            id: accesorydata[i].OPTM_CHILDFEATUREID,
            key: accesorydata[i].OPTM_FEATURECODE,
            name: accesorydata[i].OPTM_DISPLAYNAME,
            checked: false
          });
        }
      }

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
            if (this.feature_itm_list_table[j].FeatureId == ItemData[i].id) {
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
            this.feature_itm_list_table.push({
              FeatureId: ItemData[i].OPTM_FEATUREID,
              featureName: ItemData[i].OPTM_DISPLAYNAME,
              Item: ItemData[i].OPTM_ITEMKEY,
              Description: ItemData[i].OPTM_FEATUREDESC,
              quantity: ItemData[i].OPTM_QUANTITY,
              price: ItemData[i].Pricesource,
              Actualprice: ItemData[i].Price,
              pricextn: 0,
              is_accessory: "N",
              isPriceDisabled: isPriceDisabled,
              pricehide: isPricehide

            });
          }
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
          this.feature_itm_list_table.push({
            FeatureId: ItemData[i].OPTM_FEATUREID,
            featureName: ItemData[i].OPTM_DISPLAYNAME,
            Item: ItemData[i].OPTM_ITEMKEY,
            Description: ItemData[i].OPTM_FEATUREDESC,
            quantity: ItemData[i].OPTM_QUANTITY,
            price: ItemData[i].Pricesource,
            Actualprice: ItemData[i].Price,
            pricextn: 0,
            is_accessory: "N",
            isPriceDisabled: isPriceDisabled,
            pricehide: isPricehide
          });
        }
      }

    }
    this.feature_price_calculate();
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
                      featureName: "",
                      Item: data[i].OPTM_ITEMKEY,
                      Description: data[i].OPTM_DISPLAYNAME,
                      quantity: data[i].OPTM_QUANTITY,
                      price: data[i].Pricesource,
                      Actualprice: data[i].Price,
                      pricextn: 0,
                      is_accessory: "Y",
                      isPriceDisabled: true,
                      pricehide: true

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
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: isPriceDisabled,
                    pricehide: isPricehide
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
            this.accessory_itm_list_table[i].price = 0;
            return;
          }
          this.feature_itm_list_table[i].price = value
        }
        else {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.accessory_itm_list_table[i].pricextn = 0;
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
                    quantity: data[i].OPTM_QUANTITY,
                    price: data[i].Pricesource,
                    Actualprice: data[i].Price,
                    pricextn: 0,
                    is_accessory: "Y",
                    isPriceDisabled: true,
                    pricehide: true
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
                  price: data[i].Pricesource,
                  Actualprice: data[i].Price,
                  pricextn: 0,
                  is_accessory: "Y",
                  isPriceDisabled: true,
                  pricehide: true
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
    this.feature_child_data = [];
    this.feature_accessory_list = [];
    this.feature_itm_list_table = [];
    this.accessory_itm_list_table = [];
    this.feature_item_tax = 0
    this.feature_item_total = 0
    this.acc_item_tax = 0
    this.acc_total = 0
    this.acc_grand_total = 0
    this.item_tax_total[0].value = 0;
    this.item_tax_total[1].value = 0;
    this.item_tax_total[2].value = 0;
    this.feature_tax_total[0].value = 0;
    this.feature_tax_total[1].value = 0;
    this.item_tax_total[2].value = 0;
    this._el.nativeElement.focus();

  }
  //this will get the contact person
  fillContactPerson() {
    this.OutputService.fillContactPerson(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        console.log(data);
        if (data != null || data != undefined && data.length > 0) {
          if (data.ContactPerson.length > 0) {
            this.contact_persons = data.ContactPerson;
            console.log(data);
            this.person = data.ContactPerson[0].Name;
            this.console.log(this.person);
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
        this.console.log(data);
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
      "OPTM_SHIPTO": this.step1_data.customerShipTo,
      "OPTM_BILLTO": this.step1_data.customerBillTo,
      "OPTM_CONTACTPERSON": this.step1_data.person_name,
      "OPTM_TAX": "",
      "OPTM_PAYMENTTERM": "",
      "OPTM_FGITEM": "DEMO-ITEM",
      "OPTM_KEY": "DEMO-KEY",
      "OPTM_DELIVERYDATE": this.step1_data.delivery_date,
      "OPTM_QUANTITY": "",
      "OPTM_CREATEDBY": this.common_output_data.username,
      "OPTM_MODIFIEDBY": this.common_output_data.username
    })

    //creating detail data
    final_dataset_to_save.OPConfig_OUTPUTDTL.push({
      "OPTM_OUTPUTID": "",
      "OPTM_OUTPUTDTLID": "",
      "OPTM_ITEMNUMBER": "",
      "OPTM_ITEMCODE": "",
      "OPTM_KEY": "",
      "OPTM_PARENTKEY": "",
      "OPTM_TEMPLATEID": "",
      "OPTM_ITMCODEGENKEY": "",
      "OPTM_ITEMTYPE": "",
      "OPTM_WHSE": "",
      "OPTM_QUANTITY": "",
      "OPTM_PRICELIST": "",
      "OPTM_UNITPRICE": "",
      "OPTM_TOTALPRICE": "",
      "OPTM_DISCPERCENT": "",
      "OPTM_CREATEDBY": this.common_output_data.username,
      "OPTM_MODIFIEDBY": this.common_output_data.username,
    })

    //creating connection detials
    final_dataset_to_save.ConnectionDetails.push({
      CompanyDBID: this.common_output_data.companyName
    })

    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        this.console.log(data);
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )

  }

  openPriceListLookup() {

  }

  delete_multiple_final_modal() {
    if (confirm(this.language.confirm_remove_selected_modal)) {

    }
  }

  remove_final_modal(row) {
    if (confirm(this.language.confirm_remove_modal)) {

    }
  }

  on_checkbox_checked(checkedvalue, row_data) {

  }

  refresh_bom_status() {
    console.log(' in here ');
    this.dontShowFinalLoader = true;
   this.showFinalLoader = false;

    setTimeout(() => {
       this.dontShowFinalLoader = false;
      this.showFinalLoader = true;
      this.showFinalLoader = true;
    }, 4000);
  }

  tree_view_expand_collapse(){
     let laguage = this.language;
    $(document).find('.tree li:has(ul)').addClass('parent_li').find('span.parent_span').find("i.fa").addClass("fa-plus");
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


}