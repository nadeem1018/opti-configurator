import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private baseClassObj = new CommonData();
  constructor() { }
  public commonData = new CommonData();
  ngOnInit() {
    this.commonData.checkSession();
  }

}
