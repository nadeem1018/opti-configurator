import { HttpHeaders } from '@angular/common/http';

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public project_name: string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    public href:any = window.location.href;
    public application_path = this.get_current_url();

    public get_current_url(){
        let temp:any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1'){
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        return temp;
    }

    public toast_config = {
        closeButton: true,
        progressBar: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        iconClasses: {
            error: 'alert alert-danger',
            info: 'alert alert-info ',
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

    public stringtypevalue: any = [
        { "value": 1, "Name": "String" },
        { "value": 2, "Name": "Number" }
    ];

    public opertions: any = [
        { "value": 1, "Name": "No Operation" },
        { "value": 2, "Name": "Increase" },
        { "value": 3, "Name": "Decrease" }
    ];

    public bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Value" }
    ];

     public model_bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Model" }
    ];

    // for common view
    public default_limits = [10, 25, 50, 100];
    public default_count = 10;

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }

}
