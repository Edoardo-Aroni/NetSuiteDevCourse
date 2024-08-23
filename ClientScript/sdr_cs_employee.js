/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */

define([], function(){
    function fieldChange(context){
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

    return{
        fieldChange : fieldChange
    };


});