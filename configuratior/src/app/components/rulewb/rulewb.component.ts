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
  @ViewChild("Modelinputbox") _el: ElementRef;
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
  public typevaluefromdatabase: string = "";
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
  ngOnInit() {
    this.rule_wb_data.username = sessionStorage.getItem('loggedInUser');
    this.rule_wb_data.companyName = sessionStorage.getItem('selectedComp');
    //  this.rule_wb_data.id = 1;
    this.update_id = "";
    this.update_id = this.ActivatedRouter.snapshot.paramMap.get('id');
    if (this.update_id === "" || this.update_id === null) {
      this.isUpdateButtonVisible = false;
      this.isSaveButtonVisible = true;
      this.isDeleteButtonVisible = false;
    } else {
      this.isUpdateButtonVisible = true;
      this.isSaveButtonVisible = false;
      this.isDeleteButtonVisible = false;

    }
  }


  addNewSequence() {
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
    if (this.showUpdateSequenceBtn == false){
        this.showAddSequenceBtn = true;
    }

  }

  on_input_change(rowindex, key, value) {
    this.currentrowindex = rowindex;
    for (let i = 0; i < this.rule_sequence_data.length; ++i) {
      if (this.rule_sequence_data[i].rowindex === this.currentrowindex) {
        this.rule_sequence_data[i][key] = value;
      }
    }
  }

  show_input_lookup(selected_type, rowindex) {
    if (selected_type != "") {

      if (selected_type == "1") {
        // feature service 
      } else if (selected_type == "2") {
        // modal service 
      }
    } else {

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
        row_data: this.rule_sequence_data,
      });
      this.toastr.info('', this.language.expression_generated, this.commonData.toast_config);
      this.close_rule_sequence();

    } else {
      this.toastr.error('', this.language.sequence_row_empty, this.commonData.toast_config);
    }
  }

  update_rule_sequence() {
    if (this.rule_sequence_data.length > 0) {
      let  row_auto_index:any = '';
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

}
