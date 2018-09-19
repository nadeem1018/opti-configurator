import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RulewbService } from '../../services/rulewb.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-rulewb',
  templateUrl: './rulewb.component.html',
  styleUrls: ['./rulewb.component.scss']
})
export class RulewbComponent implements OnInit {
  @ViewChild("rulecode") _el: ElementRef;
  @ViewChild("button") _ele: ElementRef;
  public commonData = new CommonData();
  public view_route_link = '/rulewb/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public rule_wb_data: any = [];
  public rule_sequence_data = [];
  public rule_feature_data = [];
  public rule_expression_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public expression_counter = 0;
  public currentrowindex: number;
  public showAddSequenceBtn: boolean = false;
  public showUpdateSequenceBtn: boolean = false;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = false;
  public show_sequence: boolean = false;
  public show_add_sequence_btn: boolean = true;
  public showImageBlock: boolean = false;
  public selectedImage = "";
  public isPriceDisabled = true;
  public pricehide = true;
  public isUOMDisabled = true;
  public update_id: string = "";
  public selectall: boolean = true;
  public typevaluefromdatabase: string = "";
  //public rule_wb_data_header: any = [];
  public ruleWorkBenchData = [];

  public isModelIdEnable: boolean = true;
  public ModelLookupBtnhide: boolean = true;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RulewbService, private toastr: ToastrService) { }

  page_main_title = this.language.rule_workbench
  serviceData: any;
  public showoutput_btn_text = this.language.show_output;
  public is_showoutput_visible = 0;
  public showOutputBtn: boolean = true;
  public generated_expression_value = "";
  public seq_count = 0;
  public editing_row = 0;
  public outputrowcounter: number = 0;
  ngOnInit() {
    this.commonData.checkSession();
    this.rule_wb_data.username = sessionStorage.getItem('loggedInUser');
    this.rule_wb_data.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.rule_wb_data.RuleId = "";
    this.rule_wb_data.discontinued = false;
    this.rule_wb_data.Excluded = false;
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      this.isUpdateButtonVisible = false;
      this.isSaveButtonVisible = true;
      this.isDeleteButtonVisible = false;
      this.show_sequence = false;
      this.show_add_sequence_btn = true
      this._el.nativeElement.focus();
    } else {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = false;


      this.service.GetDataByRuleID(this.update_id).subscribe(
        data => {
          if (data.RuleWorkBenchHeader.length > 0) {
            if(data.RuleWorkBenchHeader[0].OPTM_DISCONTINUE === "False"){
              this.rule_wb_data.discontinued =false
            }
            else{
              this.rule_wb_data.discontinued =true
            }
            if(data.RuleWorkBenchHeader[0].OPTM_EXCLUDED === "False"){
              this.rule_wb_data.Excluded = false
            }
            else{
              this.rule_wb_data.Excluded = true
            }
            this.rule_wb_data.rule_code = data.RuleWorkBenchHeader[0].OPTM_RULECODE
            this.rule_wb_data.description = data.RuleWorkBenchHeader[0].OPTM_DESCRIPTION;
            this.rule_wb_data.effective_from = data.RuleWorkBenchHeader[0].OPTM_EFFECTIVEFROM;
            this.rule_wb_data.effective_to = data.RuleWorkBenchHeader[0].OPTM_EFFECTIVETO;
          //  this.rule_wb_data.discontinued = data.RuleWorkBenchHeader[0].OPTM_DISCONTINUE;
           // this.rule_wb_data.Excluded=data.RuleWorkBenchHeader[0].OPTM_EXCLUDED; 
            this.rule_wb_data.applicable_for_feature_id = data.RuleWorkBenchHeader[0].OPTM_APPLICABLEFOR;
            this.rule_wb_data.RuleId = data.RuleWorkBenchHeader[0].OPTM_RULEID;

          }

          if (data.RuleWorkBenchInput.length > 0) {
            this.show_sequence = true;
            this.show_add_sequence_btn = false

            this.counter = 0;
            let managed_seq = [1];
            let sequence_gen = [];
            let expression = '';
            let current_exp;
            for (let i = 0; i < data.RuleWorkBenchInput.length; ++i) {
              this.counter++;
              if (data.RuleWorkBenchInput[i].OPTM_TYPE == 1) {
                this.typevaluefromdatabase = data.RuleWorkBenchInput[i].OPTM_FEATURE.toString()

              }
              else {
                this.typevaluefromdatabase = data.RuleWorkBenchInput[i].OPTM_MODEL.toString()

              }

              let fetch_data = data.RuleWorkBenchInput[i];
              this.seq_count = fetch_data.OPTM_SEQID;
              let current_count = (this.seq_count - 1);
              if (this.rule_expression_data[current_count] == undefined) {
                this.rule_expression_data[current_count] = {};
                this.rule_expression_data[current_count].expression ="";
              }
              this.rule_expression_data[current_count].rowindex = this.counter
              this.rule_expression_data[current_count].seq_count = this.seq_count;
              this.rule_expression_data[current_count].expression += " " + fetch_data.OPTM_OPERATOR + ' ' + fetch_data.OPTM_BRACES + ' ' + this.typevaluefromdatabase + ' ' + fetch_data.OPTM_CONDITION + ' ' + fetch_data.OPTM_OPERAND1 + ' ' + fetch_data.OPTM_OPERAND2;
              if (this.rule_expression_data[current_count].row_data == undefined) {
                this.rule_expression_data[current_count].row_data = [];
              }
              this.rule_expression_data[current_count].row_data.push({
                rowindex: fetch_data.OPTM_ROWID,
                seq_count: fetch_data.OPTM_SEQID,
                operator: fetch_data.OPTM_OPERATOR,
                type: fetch_data.OPTM_TYPE,
                braces: fetch_data.OPTM_BRACES,
                type_value: this.typevaluefromdatabase,
                condition: fetch_data.OPTM_CONDITION,
                operand_1: fetch_data.OPTM_OPERAND1,
                operand_2: fetch_data.OPTM_OPERAND2,
                row_expression: expression,
              });

            }

          }

          if (data.RuleWorkBenchOutput.length > 0) {
            let typefromdatabase: any;
            for (let i = 0; i < data.RuleWorkBenchOutput.length; ++i) {
              if (data.RuleWorkBenchOutput[i].OPTM_FEATUREID != "" || data.RuleWorkBenchOutput[i].OPTM_FEATUREID != null) {
                typefromdatabase = 1;

              }
              else {
                typefromdatabase = 2;

              }


              this.rule_feature_data.push({
                rowindex: i,
                check_child: true,
                feature: data.RuleWorkBenchOutput[i].OPTM_FEATUREID,
                item: data.RuleWorkBenchOutput[i].OPTM_ITEMKEY,
                value: data.RuleWorkBenchOutput[i].OPTM_VALUE,
                uom: data.RuleWorkBenchOutput[i].OPTM_UOM,
                quantity: data.RuleWorkBenchOutput[i].OPTM_QUANTITY,
                edit_quantity: data.RuleWorkBenchOutput[i].OPTM_ISQTYEDIT,
                price_source: data.RuleWorkBenchOutput[i].OPTM_PRICESOURCE,
                edit_price: data.RuleWorkBenchOutput[i].OPTM_ISPRICEEDIT,
                default: data.RuleWorkBenchOutput[i].OPTM_DEFAULT,
                type: typefromdatabase

              });

            }
          }





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

  addNewSequence() {
    if (this.validation("AddRow") == false)
      return;
    if (this.rule_expression_data.length > 0) {
      this.seq_count = this.rule_expression_data.length;
    }
    this.seq_count++;
    this.onAddRow();
    this.show_sequence = true;
    this.show_add_sequence_btn = false;
  }

  close_rule_sequence() {
    this.show_sequence = false;
    this.show_add_sequence_btn = true;
    this.showAddSequenceBtn = false;
    this.showUpdateSequenceBtn = false;
    this.rule_sequence_data = [];
    this.generated_expression_value = "";
    this.editing_row = 0;
  }

  hide_show_output() {
    if (this.is_showoutput_visible == 0) {
      this.is_showoutput_visible = 1;
      this.showoutput_btn_text = this.language.hide_output;
      //   this.showOutputBtn = true;
    } else {
      this.is_showoutput_visible = 0;
      this.showoutput_btn_text = this.language.show_output;
      //  this.showOutputBtn = false;

    }
  }

  onAddRow() {
    if (this.validation("AddRow") == false)
      return;
    this.counter = 0;
    if (this.rule_sequence_data.length > 0) {
      this.counter = this.rule_sequence_data.length
    }
    this.counter++;

    this.rule_sequence_data.push({
      rowindex: this.counter,
      seq_count: this.seq_count,
      operator: '',
      type: '',
      braces: '',
      type_value: "",
      condition: '',
      operand_1: '',
      operand_2: '',
      row_expression: ''
    });
  }

  getFetureListLookup(status) {
    console.log('inopen feature');
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.service.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
          console.log(this.serviceData);

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
    if (this.lookupfor == 'feature_lookup') {
      this.rule_wb_data.applicable_for_feature_id = $event;
      this.getFeatureDetailsForOutput();
    }
    if (this.lookupfor == 'feature_Detail_lookup') {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
          this.rule_sequence_data[i].type_value = $event
        }
      }
    }
    if (this.lookupfor == 'ModelBom_lookup') {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
          this.rule_sequence_data[i].type_value = $event

        }
      }
    }
  }

  getFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');
    this.serviceData = []
    //this.lookupfor = 'feature_lookup';
    this.service.getFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Detail") {
            if (index == 1) {
              this.lookupfor = 'feature_Detail_lookup';
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

  onDeleteRow(rowindex) {
    if (this.rule_sequence_data.length > 0) {
      for (let i = 0; i < this.rule_sequence_data.length; ++i) {
        if (this.rule_sequence_data[i].rowindex === rowindex) {
          this.rule_sequence_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.rule_sequence_data[i].rowindex = i + 1;
        }
      }
    }
  }

  getFeatureDetailsForOutput() {
    this.rule_feature_data = [];
    //this.outputrowcounter=0;
    this.service.getFeatureDetailsForOutput(this.rule_wb_data.applicable_for_feature_id).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; ++i) {
            this.outputrowcounter++;
            this.rule_feature_data.push({
              rowindex: i,
              check_child: true,
              feature: data[i].Feature,
              item: data[i].Item,
              value: data[i].Value,
              uom: data[i].UOM,
              quantity: data[i].Quantity,
              edit_quantity: "n",
              price_source: data[i].PriceSource,
              edit_price: "n",
              default: false,
              type: data[i].type

            });

          }
        }

      }

    )
  }

  genearate_expression() {
    let current_seq = this.seq_count;
    console.log(current_seq);

    let seq_data = this.rule_sequence_data.filter(function (obj) {
      return obj['seq_count'] == current_seq;
    });
    let current_exp = '';
    for (var index in seq_data) {
      if (seq_data[index].type != "" && seq_data[index].type_value != "" && seq_data[index].condition && seq_data[index].operand_1) {
        this.rule_sequence_data[index].row_expression = seq_data[index].operator + ' ' + seq_data[index].braces + ' ' + seq_data[index].type_value + ' ' + seq_data[index].condition + ' ' + seq_data[index].operand_1 + ' ' + seq_data[index].operand_2;
        current_exp += " " + seq_data[index].row_expression;
      } else {
        let error_fields = '';
        if (seq_data[index].type == "") {
          if (error_fields != "") {
            error_fields += ", ";
          }
          error_fields += " Type";
        }
        if (seq_data[index].type_value == "") {
          if (error_fields != "") {
            error_fields += ", ";
          }
          error_fields += " Model/Feature";
        }
        if (seq_data[index].condition == "") {
          if (error_fields != "") {
            error_fields += ", ";
          }
          error_fields += " Condition";

        }
        if (seq_data[index].operand_1 == "") {
          if (error_fields != "") {
            error_fields += ", ";
          }
          error_fields += " Operand 1";
        }

        this.toastr.error('', this.language.required_fields + (parseInt(index) + 1) + " - " + error_fields, this.commonData.toast_config);
        return false;
      }
    }
    this.generated_expression_value = current_exp;
    if (this.showUpdateSequenceBtn == false) {
      this.showAddSequenceBtn = true;
    }

  }

  on_input_change(rowindex, key, value) {
    this.currentrowindex = rowindex;
    for (let i = 0; i < this.rule_sequence_data.length; ++i) {
      if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
        this.rule_sequence_data[i][key] = value;
        if (key === 'type_value') {
          if (this.rule_sequence_data[i].type == 1) {
            this.service.onFeatureIdChange(this.rule_sequence_data[i].type_value).subscribe(
              data => {

                if (data === "False") {
                  this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
                  this.rule_sequence_data[i].type_value = "";
                  return;
                }
              })
          }

          else {
            this.service.onModelIdChange(this.rule_sequence_data[i].type_value).subscribe(
              data => {

                if (data === "False") {
                  this.toastr.error('', this.language.InvalidModelId, this.commonData.toast_config);
                  this.rule_sequence_data[i].type_value = "";
                  return;
                }
              })
          }
        }

      }
    }
  }

  getModelDetails() {
    this.serviceData = [];
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.serviceData = data;
        }
      }
    )
  }

  show_input_lookup(selected_type, rowindex) {
    this.currentrowindex = rowindex
    if (selected_type == 1) {
      this.getFeatureDetails(this.rule_wb_data.applicable_for_feature_id, "Detail", selected_type);
    }
    else {
      this.getModelDetails();
    }
  }

  on_typevalue_change(value, rowindex) {
    // apply validation 
    this.on_input_change(rowindex, 'type_value', value);
  }

  add_rule_sequence() {
    if (this.rule_sequence_data.length > 0) {
      this.expression_counter = 0;
      if (this.rule_expression_data.length > 0) {
        this.expression_counter = this.rule_expression_data.length
      }

      this.expression_counter++;
      this.rule_expression_data.push({
        rowindex: this.expression_counter,
        seq_count: this.rule_sequence_data[0].seq_count,
        expression: this.generated_expression_value,
        row_data: this.rule_sequence_data
      });
      this.toastr.info('', this.language.expression_generated, this.commonData.toast_config);
      this.close_rule_sequence();

      console.log(this.rule_sequence_data);
      if (this.rule_sequence_data.length > 0) {

        //  this.rule_expression_data
      }
    }
    else {
      this.toastr.error('', this.language.sequence_row_empty, this.commonData.toast_config);
    }
  }

  onFeatureIdChange() {
    this.service.onFeatureIdChange(this.rule_wb_data.applicable_for_feature_id).subscribe(
      data => {

        if (data === "False") {
          this.toastr.error('', this.language.InvalidFeatureId, this.commonData.toast_config);
          this.rule_wb_data.applicable_for_feature_id = "";
          return;
        }
        else {
          this.lookupfor = 'feature_lookup';
          this.getFeatureDetailsForOutput();
        }
      })
  }

  update_rule_sequence() {
    if (this.rule_sequence_data.length > 0) {
      let row_auto_index: any = '';
      for (let i = 0; i < this.rule_expression_data.length; ++i) {
        if (this.rule_expression_data[i].rowindex === this.editing_row) {
          row_auto_index = i;
        }
      }

      this.rule_expression_data[row_auto_index]['rowindex'] = this.editing_row;
      this.rule_expression_data[row_auto_index]['seq_count'] = this.rule_sequence_data[0].seq_count;
      this.rule_expression_data[row_auto_index]['expression'] = this.generated_expression_value;
      this.rule_expression_data[row_auto_index]['row_data'] = this.rule_sequence_data;
      this.toastr.info('', this.language.expression_updated, this.commonData.toast_config);
      this.close_rule_sequence();
    } else {
      this.toastr.error('', this.language.sequence_row_empty, this.commonData.toast_config);
    }
  }

  edit_expression(row, rowindex) {
    console.log(row);
    this.rule_sequence_data = [];
    if (row.row_data.length > 0) {
      let edit_expression_data = row.row_data;
      for (var data in edit_expression_data) {
        this.rule_sequence_data.push(edit_expression_data[data]);
      }
      this.show_sequence = true;
      this.show_add_sequence_btn = false;
      this.showAddSequenceBtn = false;
      this.showUpdateSequenceBtn = true;
      this.generated_expression_value = row.expression;
      this.editing_row = rowindex;
      this.seq_count = row.seq_count;

    }
  }

  delete_expression(rowindex) {
    if (confirm(this.language.DeleteConfimation)) {
      if (this.rule_expression_data.length > 0) {
        for (let i = 0; i < this.rule_expression_data.length; ++i) {
          if (this.rule_expression_data[i].rowindex === rowindex) {
            this.rule_expression_data.splice(i, 1);
            i = i - 1;
          }
          else {
            this.rule_expression_data[i].rowindex = i + 1;
          }
        }
      }
      this.seq_count--;
      if (this.seq_count < 0) {
        this.seq_count = 0;
      }
    }

  }

  output_change_event(name, value, rowindex) {
    for (let i = 0; i < this.rule_feature_data.length; ++i) {
      if (this.rule_feature_data[i].rowindex == rowindex) {
        if (name == "check_child") {
          this.rule_feature_data[i].check_child = value
        }
        else if (name == "feature_name") {
          this.rule_feature_data[i].feature = value
        }
        else if (name == "feature_item") {
          this.rule_feature_data[i].item = value
        }
        else if (name == "feature_value") {
          this.rule_feature_data[i].value = value
        }
        else if (name == "uom") {
          this.rule_feature_data[i].uom = value
        }
        else if (name == "quantity") {
          this.rule_feature_data[i].quantity = value
        }
        else if (name == "edit_quanity") {
          this.rule_feature_data[i].edit_quantity = value
        }
        else if (name == "price_soure") {
          this.rule_feature_data[i].price_source = value
        }
        else if (name == "edit_price") {
          this.rule_feature_data[i].edit_price = value
        }
        else {
          this.rule_feature_data[i].default = value
        }
      }

    }
  }

  check_all(value) {
    for (let i = 0; i < this.rule_feature_data.length; ++i) {
      this.rule_feature_data[i].check_child = value
    }
  }

  validation(btnpress) {
    if (btnpress == "AddRow") {
      if (this.rule_wb_data.rule_code == "" || this.rule_wb_data.rule_code == null) {
        this.toastr.error('', this.language.selectrulecode, this.commonData.toast_config);
        return false;
      }
      if (this.rule_wb_data.description == "" || this.rule_wb_data.description == null) {
        this.toastr.error('', this.language.selectdescription, this.commonData.toast_config);
        return false;
      }
      if (this.rule_wb_data.effective_from == "" || this.rule_wb_data.effective_from == null) {
        this.toastr.error('', this.language.selecteffromdate, this.commonData.toast_config);
        return false;
      }
      if (this.rule_wb_data.effective_to == "" || this.rule_wb_data.effective_to == null) {
        this.toastr.error('', this.language.selectefftodate, this.commonData.toast_config);
        return false;
      }
      if (this.rule_wb_data.applicable_for_feature_id == "" || this.rule_wb_data.applicable_for_feature_id == null) {
        this.toastr.error('', this.language.FeatureIDBlank, this.commonData.toast_config);
        return false;
      }
      if (new Date(this.rule_wb_data.effective_to) < new Date(this.rule_wb_data.effective_from)) {
        this.toastr.error('', this.language.DateValidation, this.commonData.toast_config);
        return false;
      }
    }
    else if (btnpress == "Save") {
      if (this.rule_expression_data.length == 0) {
        this.toastr.error('', this.language.Nodataforsave, this.commonData.toast_config);
        return false;
      }
    }
    else {
      if (this.rule_sequence_data.length > 0) {
        for (let i = 0; i < this.rule_sequence_data.length; ++i) {
          let currentrow = i + 1;
          if (this.rule_sequence_data[i].operator == "" || this.rule_sequence_data[i].operator == '' || this.rule_sequence_data[i].operator == null) {
            this.toastr.error('', this.language.selectoperator + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.rule_sequence_data[i].braces == "" || this.rule_sequence_data[i].braces == '' || this.rule_sequence_data[i].braces == null) {
            this.toastr.error('', this.language.selectbraces + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.rule_sequence_data[i].type_value == "" || this.rule_sequence_data[i].type_value == '' || this.rule_sequence_data[i].type_value == null) {
            if (this.rule_sequence_data[i].type == 1) {
              this.toastr.error('', this.language.SelectFeature + currentrow, this.commonData.toast_config);
              return false;
            }
            else {
              this.toastr.error('', this.language.SelectModel + currentrow, this.commonData.toast_config);
              return false;
            }

          }
          if (this.rule_sequence_data[i].condition == "" || this.rule_sequence_data[i].condition == '' || this.rule_sequence_data[i].condition == null) {
            this.toastr.error('', this.language.selectcondition + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.rule_sequence_data[i].operand_1 == "" || this.rule_sequence_data[i].operand_1 == '' || this.rule_sequence_data[i].operand_1 == null) {
            this.toastr.error('', this.language.selectoperand1 + currentrow, this.commonData.toast_config);
            return false;
          }
          if (this.rule_sequence_data[i].operand_2 == "" || this.rule_sequence_data[i].operand_2 == '' || this.rule_sequence_data[i].operand_2 == null) {
            this.toastr.error('', this.language.selectoperand2 + currentrow, this.commonData.toast_config);
            return false;
          }

        }

      }
    }
    return true;
  }

  onSave() {
    if (this.validation("Save") == false)
      return;
    if (this.rule_expression_data.length > 0) {
      let single_data_set: any = {};
      single_data_set.single_data_set_header = [];
      single_data_set.single_data_set_output = [];
      single_data_set.single_data_set_expression = [];
      single_data_set.single_data_set_header.push({
        ModelId: this.rule_wb_data.rule_code,
        description: this.rule_wb_data.description,
        effective_from: this.rule_wb_data.effective_from,
        effective_to: this.rule_wb_data.effective_to,
        discontinue: this.rule_wb_data.discontinued,
        excluded:this.rule_wb_data.Excluded,
        CreatedUser: this.rule_wb_data.username,
        applicablefor: this.rule_wb_data.applicable_for_feature_id,
        CompanyDBId: this.rule_wb_data.CompanyDBId,
        RuleId: this.rule_wb_data.RuleId

      })
      single_data_set.single_data_set_output = this.rule_feature_data
      let extracted_sequences: any = [];
      for (var key in this.rule_expression_data) {
        for (var rowkey in this.rule_expression_data[key].row_data) {
          extracted_sequences.push(this.rule_expression_data[key].row_data[rowkey]);
        }
      }
      single_data_set.single_data_set_expression = extracted_sequences
      this.service.SaveData(single_data_set).subscribe(
        data => {
          if (data === "True") {
            this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
            this.route.navigateByUrl('rulewb/view');
            return;
          }
          else {
            this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
            return;
          }
        }
      )
    }
  }
}
