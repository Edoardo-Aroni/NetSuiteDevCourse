/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.0
 */
define(['N/record'], 
/**
 * @param {record} record  
 */    
    
function(record){
return {
    afterSubmit: function(context){
        //log.debug ('hello world');
        var employee = context.newRecord;
        var empCode = employee.getValue('custentity_sdr_employee_code');
        var supervisorName = employee.getText('supervisor');
       

        log.debug('Employee Code', empCode);
               log.debug('Supervisor Name', supervisorName);

        if (context.type == context.UserEventType.CREATE) {
            var phoneCall = record.create({  //this create the record in memory
                type: record.Type.PHONE_CALL,
                defaultValues :{
                    customform: -150   //use the standard Call form
                }
            });
            phoneCall.setValue('title','Call HR for benefits');
            phoneCall.setValue('assigned', employee.id);
            phoneCall.save();  //this create the record in the database
        }


    }
}
});