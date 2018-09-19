import { HttpHeaders } from '@angular/common/http';

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public project_name: string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    public href: any = window.location.href;
    public application_path = this.get_current_url();

    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
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
    language = JSON.parse(sessionStorage.getItem('current_lang'));V
    //defining properties for the call 
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    public lookup_selected_value = '';

    public stringtypevalue: any = [
        { "value": 1, "Name": this.language.string}, 
        { "value": 2, "Name": this.language.Number } 
    ];

    public opertions: any = [
        { "value": 1, "Name": this.language.NoOperation},
        { "value": 2, "Name": this.language.Increase }, 
        { "value": 3, "Name": this.language.Decrease} 
    ];

    public bom_type: any = [
        { "value": 1, "Name": this.language.feature }, 
        { "value": 2, "Name": this.language.ItemLookupTitle }, 
        { "value": 3, "Name": this.language.value}
    ];

    public model_bom_type: any = [
        { "value": 1, "Name": this.language.feature }, 
        { "value": 2, "Name": this.language.ItemLookupTitle }, 
        { "value": 3, "Name": this.language.model } 
    ];

    public rule_seq_type: any = [
        { "value": '', "Name": "" },
        { "value": 1, "Name": this.language.feature }, 
        { "value": 2, "Name": this.language.model } 
    ];

    public operator_type: any = [
        { "value": '', "Name": "" },
        { "value": 'or', "Name": this.language.OR }, 
        { "value": 'and', "Name": this.language.AND } 
    ];

    public yes_no_option: any = [
        { "value": '', "Name": "" },
        { "value": 'n', "Name": this.language.NO },
        { "value": 'y', "Name": this.language.YES }
    ];

    public bracket_list = [
        { "value": '' },
        { "value": "[" },
        { "value": "{", },
        { "value": "(" },
        { "value": "]" },
        { "value": "}", },
        { "value": ")" },
    ];

    public express_conditions = [
        { "value": "=" },
        { "value": "<" },
        { "value": ">" },
        { "value": "<=" },
        { "value": ">=" },
        { "value": this.language.Between },
        { "value": this.language.In },
    ];

    public document_type = [
        { "value": '', "Name": "" },
        { "value": 'sales_quote', "Name": this.language.SalesQuote },
        { "value": 'sales_order', "Name": this.language.SalesOrder }
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

    checkSession() {
        let login_page = this.application_path + '/index.html#login';
        if (sessionStorage.getItem('isLoggedIn') == null) {
            window.location.href = login_page;
        }
    }

}
