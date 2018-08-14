import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})


export class ModelComponent implements OnInit {
  public featureBom: any=[];
  constructor() { }

  ngOnInit() {
    
  }
  onSaveClick(){
    alert(this.featureBom.Code);
    alert(this.featureBom.Name);
    alert(this.featureBom.Desc);
    alert(this.featureBom.Date);
    alert(this.featureBom.type);
    alert(this.featureBom.Status);
    
  }
}
