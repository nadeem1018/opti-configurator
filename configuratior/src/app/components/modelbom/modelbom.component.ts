import { Component, OnInit } from '@angular/core';
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
  public commonData = new CommonData();
  public view_route_link = '/modelbom/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modelbom_data: any = [];
  public counter = 0;
  public currentrowindex: number;
  public isExplodeButtonVisible: boolean = true;
  public isVerifyButtonVisible: boolean = true;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = true;
  constructor(private router: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService) { }

  companyName: string;
  page_main_title = this.language.ModelBom
  public username: string = "";

  ngOnInit() {
    this.username = sessionStorage.getItem('loggedInUser');
  }
  onAddRow() {
    this.counter = 0;
    if (this.modelbom_data.length > 0) {
      this.counter = this.modelbom_data.length
    }
    this.counter++;

    this.modelbom_data.push({
      rowindex: this.counter,
      FeatureId: this.modelbom_data.feature_id,
      type: 1,
      type_value: "",
      display_name: "",
      uom: '',
      quantity: '',
      min_selected: '',
      max_selected: '',
      propagate_qty: 0,
      price_source: 0,
      mandatory: 0,
      unique_identifer: 0,
      isDisplayNameDisabled: true,
      isTypeDisabled: true,
      hide: false
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

  on_bom_type_change(selectedvalue, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (selectedvalue == 3) {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = true


        }
        else {
          this.modelbom_data[i].isDisplayNameDisabled = true
          this.modelbom_data[i].isTypeDisabled = true
          this.modelbom_data[i].hide = false
        }
      }
    }
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

  onSave() {

  }

  onUpdate() {

  }

  onDelete() {

  }

  onExplodeClick() {

  }

  onVerifyOutput() {

  }

}
