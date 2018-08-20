import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';

@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
private commonData = new CommonData();
constructor(private itemgen: ItemcodegenerationService,private toastr: ToastrService) {
 
}
companyName: string ;
page_main_title = 'Item Code Generation'
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
public countnumberrow:number=0;
public codekey:string="";



  

  ngOnInit()
  {
    this.companyName = sessionStorage.getItem('selectedComp');
  }

  onAddRow()
  {
    if(this.validateRowData("AddRow")==false){
      return
    }
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
      CompanyDBId:"SFDCDB",
      codekey:this.codekey

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
    alert(this.codekey)
    if(this.validateRowData("SaveData")==false){
      return
    } 
    this.itemgen.saveData(this.itemcodetable).subscribe(
      data => {
        // this.allWODetails = data;
        // if (this.allWODetails.length > 0) {
          //this.lookupData = this.allWODetails;
        //  this.showLookup=true;
        //}
      }
    )
 
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

  onStrBlur(selectedvalue,rowindex)
  {
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

  validateRowData(buttonpressevent)
  {
    if(buttonpressevent=="AddRow"){
      if(this.itemcodetable.length>0)
      {
       
      for(let i = 0; i < this.itemcodetable.length; ++i)
      {
        if(this.itemcodetable[i].stringtype==2 || this.itemcodetable[i].stringtype==3 )
        {
          if(isNaN(this.itemcodetable[i].string)==true){
            this.toastr.success('', 'Enter valid number', this.commonData.toast_config);
            return false;
          }
          
          
        }
        else{
          if(this.itemcodetable[i].operations!=1){
            this.toastr.success('', 'Enter valid operation', this.commonData.toast_config);
            return false;
          }
        }
      }

      if(this.finalstring.length>50){
        this.toastr.success('', 'Item code key cannot be greater than 50 characters', this.commonData.toast_config);
        return false;
      }

      }
    }
    else{
      if(this.itemcodetable.length==0)
      {
        this.toastr.success('', 'Enter any row', this.commonData.toast_config);
      } 
      else{
        this.countnumberrow=0;
        for(let i = 0; i < this.itemcodetable.length; ++i)
        {
          if(this.itemcodetable[i].stringtype==2 || this.itemcodetable[i].stringtype==3 )
          {
            this.countnumberrow++;
          }
        }
        if(this.countnumberrow==0){
          this.toastr.success('', 'Atleast one row should be number type', this.commonData.toast_config);
          //alert("invalid operation")
        }
      }
    }
   
  }


}
