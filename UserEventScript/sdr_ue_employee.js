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
        var supervisorId   = employee.getValue('supervisor');

        log.debug('Employee Code', empCode);
        log.debug('Supervisor ID', supervisorId);
        log.debug('Supervisor Name', supervisorName);

        if (context.type == context.UserEventType.CREATE) {
            var phoneCall = record.create({
                type: record.Type.PHONE_CALL
            });
            phoneCall.setValue('title','Call HR for benefits');
            phoneCall.setValue('assigned', employee.id);
            phoneCall.save();
        }


    }
}
});