 import { HttpHeaders } from '@angular/common/http';

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public project_name:string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    
    public toast_config = {
        closeButton: true,
        progressBar: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        iconClasses : {
            error:   'alert alert-danger',
            info:    'alert alert-info ',
            success: 'alert alert-success ',
            warning: 'alert alert-warning'
        }
    };

      //defining properties for the call 
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    public lookup_selected_value = '';

    public stringtypevalue:any=[
        {"value":1, "Name":"String"},
        {"value":2,  "Name":"Number"}
    ];
    
    public opertions:any= [
        {"value":1,  "Name":"No Operation"  },  
        {"value":2,  "Name":"Increase"  },  
        {"value":3,  "Name":"Decrease"  }
    ];
    
}
