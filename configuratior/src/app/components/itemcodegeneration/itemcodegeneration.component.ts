import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
public itemCodeGen:any =[];
public itemcodetable:any =[];
public counter:number=1;

  constructor() { }

  ngOnInit() {
  }
  
  

  

  onAddRow(){
    this.counter++;
   
    this.itemcodetable.push({
      rowindex:this.counter,
      stringtype:"ddf",
      operations:"",
      delete:"",

    })
    
  }
}
