import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { RulewbService } from '../../services/rulewb.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  public commonData = new CommonData();
  public common_output_data:any = [];
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title = this.language.output_window;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private service: RulewbService, private toastr: ToastrService) { }

  ngOnInit() {
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
  }

}
