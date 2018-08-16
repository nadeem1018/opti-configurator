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
            error:   'toast-error',
            info:    'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        }
    };

    public lookup_selected_value = '';

    /* public employee_list = [
        { id: 1, name: 'Meenesh', email: 'Meenesh@batchmaster.com', address: 'Indore, India' },
        { id: 2, name: 'Neeraj', email: 'Neeraj@batchmaster.com', address: 'Indore, India' },
        { id: 3, name: 'Ashish', email: 'Ashish@batchmaster.com', address: 'Indore, India' },
        { id: 4, name: 'Kapil', email: 'Kapil@batchmaster.com', address: 'Indore, India' },
        { id: 5, name: 'Roba', email: 'Roba@batchmaster.com', address: 'Indore, India' },
        { id: 6, name: 'Akshay', email: 'Akshay@batchmaster.com', address: 'Indore, India' },
        { id: 7, name: 'Hamza', email: 'Hamza@batchmaster.com', address: 'Indore, India' },
        { id: 8, name: 'Kishan', email: 'Kishan@batchmaster.com', address: 'Indore, India' },
        { id: 9, name: 'Sagar', email: 'Sagar@batchmaster.com', address: 'Indore, India' },
        { id: 10, name: 'Satendra', email: 'Satendra@batchmaster.com', address: 'Indore, India' }
    ]; */
}
