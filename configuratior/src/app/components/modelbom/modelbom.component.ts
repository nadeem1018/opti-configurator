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

  constructor(private router: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService) { }

  companyName: string;
  page_main_title = this.language.ModelBom
  public username: string = "";

  ngOnInit() {
    this.username = sessionStorage.getItem('loggedInUser');
  }

  file_input($event) {
    this.input_file = $event.target.files[0];

  }

  onUpload() {
    
    
    this.service.post_data_with_file(this.input_file, this.modelbom_data).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

  onSave() {

  }

  onUpdate() {

  }

  onDelete() {

  }

}
