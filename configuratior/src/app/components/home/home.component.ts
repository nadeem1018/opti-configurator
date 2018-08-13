import { Component, OnInit } from '@angular/core';
import { CommonData } from "src/app/models/CommonData";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private baseClassObj = new CommonData();
  constructor() { }

  ngOnInit() {
  }

}
