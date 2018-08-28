import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent implements OnInit {
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
  constructor() { }

  ngOnInit() {
  }

}
