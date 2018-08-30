import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-modelbom',
  templateUrl: './modelbom.component.html',
  styleUrls: ['./modelbom.component.scss']
})
export class ModelbomComponent implements OnInit {
  public commonData = new CommonData();
  public view_route_link = '/modelbom/view';
  public selectedFile: File;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor(private router: ActivatedRoute, private route: Router, private itemgen: ItemcodegenerationService, private toastr: ToastrService) {

  }
  companyName: string;
  page_main_title = this.language.ModelBom
  public username: string = "";
  
  ngOnInit() {
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    console.log( this.selectedFile)
    alert(this.selectedFile)
  }

  onUpload() {
    // upload code goes here
  }

}
