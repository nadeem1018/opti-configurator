import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { NullInjector } from '../../../../node_modules/@angular/core/src/di/injector';


@Component({
  selector: 'app-itemcodegeneration',
  templateUrl: './itemcodegeneration.component.html',
  styleUrls: ['./itemcodegeneration.component.scss']
})
export class ItemcodegenerationComponent implements OnInit {
public commonData = new CommonData();
  public view_route_link = '/item-code-generation/view';
  language = JSON.parse(sessionStorage.getItem('current_lang')); 
constructor(private router: ActivatedRoute,private route: Router,private itemgen: ItemcodegenerationService,private toastr: ToastrService) {
 
}
companyName: string ;
page_main_title = this.language.ItemCodeGeneration
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
public button="save"
public isUpdateButtonVisible:boolean=false;
public isSaveButtonVisible:boolean=true;
public isDeleteButtonVisible:boolean=true;
public isCodeDisabled:boolean=true;
public username:string="";


  ngOnInit()
  {
    this.companyName = sessionStorage.getItem('selectedComp');
    this.username = sessionStorage.getItem('loggedInUser');
    this.stringtypevalue=this.commonData.stringtypevalue
    this.opertions=this.commonData.opertions
    this.codekey ="";
    this.codekey = this.router.snapshot.paramMap.get('id');
    if(this.codekey === "" || this.codekey === null){
      this.button="save"
    }
    else{
      this.button="update"
    }
    if(this.button=="update"){
      this.isUpdateButtonVisible=true;
      this.isSaveButtonVisible=false;
      this.isDeleteButtonVisible=true;
      this.isCodeDisabled=false;
      this.GetItemData=[]
      this.GetItemData.push({
        CompanyDBId:this.companyName, 
        ItemCode:this.codekey
 
     })
     this.itemgen.getItemCodeGenerationByCode(this.GetItemData).subscribe(
       data => {
         this.finalstring="";
         
         for(let i = 0; i < data.length; ++i)
         {
           this.itemcodetable.push({
             rowindex:data[i].OPTM_LINEID,
             string:data[i].OPTM_CODESTRING,
             stringtype:data[i].OPTM_TYPE,
             operations:data[i].OPTM_OPERATION,
             delete:"",
             CompanyDBId:this.companyName ,
             codekey:this.codekey,
             CreatedUser:this.username
           })
           this.finalstring=this.finalstring + data[i].OPTM_CODESTRING
         }

         
        
       }
 
 
     )
    }
    else{
      this.isCodeDisabled=true;
      this.isUpdateButtonVisible=false;
      this.isSaveButtonVisible=true;
      this.isDeleteButtonVisible=false;
    }
    
   
    
    
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
      CompanyDBId:this.companyName,
      codekey:this.codekey,
      CreatedUser:this.username
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

  onSaveClick()
  {
    if(this.validateRowData("SaveData")==false){
      return
    } 
    this.itemgen.saveData(this.itemcodetable).subscribe(
      data => {
        if (data === "True" ) {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('item-code-generation/view');
          return;
        }
        else{
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
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

  onDeleteClick()
  {
    this.validateRowData("Delete")
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
            this.toastr.warning('',this.language.ValidNumber, this.commonData.toast_config);
            return false;
          }
          if(this.itemcodetable[i].operations==1){
            this.toastr.warning('', this.language.ValidOperations, this.commonData.toast_config);
            return false;
          }
          
          
        }
        else{
          if(this.itemcodetable[i].operations!=1){
            this.toastr.warning('', this.language.ValidOperations, this.commonData.toast_config);
            return false;
          }
        }
      }

      if(this.finalstring.length>50){
        this.toastr.warning('',this.language.StringLengthValidation, this.commonData.toast_config);
        return false;
      }

      }
    }
    else{
      if( buttonpressevent!="Delete"){
        if(this.itemcodetable.length==0)
        {
          this.toastr.warning('', this.language.Addrow, this.commonData.toast_config);
          return false;
        } 
        else{
          this.countnumberrow=0;
          for(let i = 0; i < this.itemcodetable.length; ++i)
          {
            if(this.itemcodetable[i].stringtype==2 || this.itemcodetable[i].stringtype==3 )
            {
              if(isNaN(this.itemcodetable[i].string)==true){
                this.toastr.warning('',this.language.ValidNumber, this.commonData.toast_config);
                return false;
              }
              if(this.itemcodetable[i].operations==1){
                this.toastr.warning('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }
              this.countnumberrow++;
              
            }
            else{
              if(this.itemcodetable[i].operations!=1){
                this.toastr.warning('', this.language.ValidOperations, this.commonData.toast_config);
                return false;
              }
            }
            
          }
          if(this.countnumberrow==0){
            this.toastr.warning('', this.language.RowNumberType, this.commonData.toast_config);
            return false;
            
          }
        }
      }
      else{
        this.GetItemData=[]
        this.GetItemData.push({
          CompanyDBId:this.companyName, 
          ItemCode:this.codekey
   
       })
       this.itemgen.getItemCodeReference(this.GetItemData).subscribe(
         data => {
           if(data=="True"){
            this.toastr.warning('', this.language.ItemCodeLink, this.commonData.toast_config);
            return false;    
           }
           else{
            this.itemgen.DeleteData(this.GetItemData).subscribe(
              data => {
                if (data === "True" ) {
                  this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                  this.route.navigateByUrl('item-code-generation/view');
                  return;
                }
                else{
                  this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
                  return;
                }
              }
            )
           }
         }
       )
      }
     
    }
    if(this.codekey=="" || this.codekey==null ){
      this.toastr.warning('', this.language.CodeBlank, this.commonData.toast_config); 
      return false;
    }
   
  }
  


}
