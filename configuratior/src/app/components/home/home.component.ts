import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private baseClassObj = new CommonData();
  constructor(
    private router: Router,
  ) { }
  public commonData = new CommonData();
  ngOnInit() {
    this.commonData.checkSession();

    this.router.navigateByUrl('/item-code-generation/view');
  }
  
  ngAfterViewInit() {
    this.router.navigateByUrl('/item-code-generation/view');
  }

}
