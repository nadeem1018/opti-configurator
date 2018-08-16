import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
public itemCodeGen:any =[];
public itemcodetable:any =[];
public stringtypevalue:any=[
{"value":1,
"Name":"String"
},
{"value":2,
"Name":"Number"
}
];
public stringtypeselectedvalue:string;
public stringType:any =[];
public counter:number=0;
public finalstring:string="";


  constructor() { }

  ngOnInit()
  {
  }

  onAddRow()
  {
    if(this.itemcodetable.length==0){
      this.counter=0;
    }
    else{
      this.counter=this.itemcodetable.length
    }
    this.counter++;
   
    this.itemcodetable.push({
      rowindex:this.counter,
      string:"",
      stringtype:1,
      operations:1,
      delete:"",

    })

    

  }

  onDeleteRow(rowindex)
  {
    if(this.itemcodetable.length>0)
    {
    for(let i = 0; i < this.itemcodetable.length; ++i)
    {
        if (this.itemcodetable[i].rowindex === rowindex)
         {
              this.itemcodetable.splice(i,1);
              i=i-1;
            
         }
        else{
          this.itemcodetable[i].rowindex =i+1;
        }
      
    }
    this.finalstring="";
    for(let i = 0; i < this.itemcodetable.length; ++i){
      this.finalstring=this.finalstring + this.itemcodetable[i].string
    }
   }
  }

  onSaveAndUpdate()
  {
alert(JSON.stringify(this.itemcodetable))
  }

  onStringTypeSelectChange(selectedvalue,rowindex)
  {
    for(let i = 0; i < this.itemcodetable.length; ++i)
    {
      if (this.itemcodetable[i].rowindex === rowindex) 
      {
            this.itemcodetable[i].stringtype=selectedvalue;
      }
    }

  }

  onStringOperationsSelectChange(selectedvalue,rowindex)
  {
    for(let i = 0; i < this.itemcodetable.length; ++i)
    {
      if (this.itemcodetable[i].rowindex === rowindex) 
      {
            this.itemcodetable[i].operations=selectedvalue;
      }
    }

  }

  onStrBlur(selectedvalue,rowindex){
    if(this.itemcodetable.length>0)
    {
      this.finalstring="";
    for(let i = 0; i < this.itemcodetable.length; ++i)
    {
      if (this.itemcodetable[i].rowindex === rowindex) 
      {
            this.itemcodetable[i].string=selectedvalue;
      }
      this.finalstring=this.finalstring + this.itemcodetable[i].string
    }
  }

  }


}
