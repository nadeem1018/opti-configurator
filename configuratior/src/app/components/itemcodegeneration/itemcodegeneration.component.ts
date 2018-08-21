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
public commonData = new CommonData();
constructor(private itemgen: ItemcodegenerationService,private toastr: ToastrService) {
 
}
companyName: string ;
page_main_title = 'Item Code Generation'
public itemCodeGen:any =[];
public itemcodetable:any =[];
public stringtypevalue:any=[];
public opertions:any=[];
public stringType:any =[];
public counter:number=0;
public finalstring:string="";
public countnumberrow:number=0;
public codekey:string="";
public GetItemData:any =[];
public DefaultTypeValue:any =[];

  ngOnInit()
  {
    this.companyName = sessionStorage.getItem('selectedComp');
    this.stringtypevalue=this.commonData.stringtypevalue
    this.opertions=this.commonData.opertions
    this.GetItemData.push({
       CompanyDBId:"SFDCDB",
       ItemCode:"sdsadad"

    })
    this.itemgen.getItemCodeGenerationByCode(this.GetItemData).subscribe(
      data => {
        this.finalstring="";
        for(let i = 0; i < data.length; ++i)
        {
          this.itemcodetable.push({
            rowindex:data[i].rowindex,
            string:data[i].string,
            stringtype:data[i].stringtype,
            operations:data[i].operations,
            delete:"",
            CompanyDBId:"SFDCDB",
            codekey:data[i].codekey
          })
          this.finalstring=this.finalstring + data[i].string
        }
       
      }


    )
    
    
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
    if(this.validateRowData("SaveData")==false){
      return
    } 
    this.itemgen.saveData(this.itemcodetable).subscribe(
      data => {
        if (data == "true" ) {
          this.toastr.success('', 'Data saved successfully', this.commonData.toast_config);
          return;
        }
        else{
          this.toastr.success('', 'Data not saved', this.commonData.toast_config);
          return;
        }
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
        return false;
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
          return false;
          
        }
      }
    }
    if(this.codekey.length==0){
      this.toastr.success('', 'Code cannot be blank ', this.commonData.toast_config); 
      return false;
    }
   
  }


}
