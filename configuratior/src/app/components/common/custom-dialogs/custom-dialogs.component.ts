import { Component, OnInit,Input } from '@angular/core';


@Component({
  selector: 'app-custom-dialogs',
  templateUrl: './custom-dialogs.component.html',
  styleUrls: ['./custom-dialogs.component.scss']
})
export class CustomDialogsComponent implements OnInit {
  @Input() dialogParams:any;
  constructor() { }

  ngOnInit() {
  console.log(this.dialogParams);
  }


}
