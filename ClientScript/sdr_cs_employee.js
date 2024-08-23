/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */

define([], function(){
    function fieldChanged(context){
        var employee = context.currentRecord; // for client side script we use currentRecord instead of newRecord

        // add a filter to check which field the user is manipulating

        if(context.fieldId == 'phone' ){
            var fax = employee.getValue('fax');

            // false check !fax check if the fax number is empty

            if(!fax){
                var phone = employee.getValue('phone');
                employee.setValue('fax', phone);  // copy the value of the phone to the fax field
            }

        }


    }

    function validateField(context){
        var employee = context.currentRecord;

        if(context.fieldId == 'custentity_sdr_employee_code'){
            var empCode = employee.getValue('custentity_sdr_employee_code');

            if(empCode == 'x') {
                alert('Invalid Employee Code Value. Please try again');
                return false;  // to prevent the user to save the record
            } 
        }    
        return true; // allow the user to save the value
    }

    function saveRecord(context){
        var employee = context.currentRecord;

        var empCode = employee.getValue('custentity_sdr_employee_code');
        if(empCode == 'x') {
            alert('Invalid Employee Code Value. Please try again');
            return false;  // to prevent the user to save the record
        }

        return true; // allow the user to save the value

    }

    return{
        fieldChanged : fieldChanged,
        validateField: validateField,
        saveRecord   : saveRecord
    };


});