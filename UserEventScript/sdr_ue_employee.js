/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.0
 */
define(['N/record','N/redirect'], 
/**
 * @param {record} record  
 * @param {redirect} redirect 
 */    
    
function(record, redirect){
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

            var event = record.create({
                type: record.Type.CALENDAR_EVENT,
                isDynamic: true
            });

            event.setValue('title', 'Welcome meeting with supervisor');

            event.selectNewLine({
                sublistId: 'attendee'
            });
            event.setCurrentSublistValue({
                sublistId: 'attendee',
                fieldId: 'attendee',
                value: employee.id
            });
            event.commitLine({
                sublistId: 'attendee'
            });


            event.selectNewLine({
                sublistId: 'attendee'
            });
            event.setCurrentSublistValue({
                sublistId: 'attendee',
                fieldId: 'attendee',
                value: employee.getValue('supervisor')
            });
            event.commitLine({
                sublistId: 'attendee'
            });

            event.save();

        }

        redirect.toSuitelet({
            script: 'customscript_sdr_sl_update_emp_notes',
            deploymentId: 'customdeploy_sdr_sl_update_emp_notes',
            parameters:{
                sdr_name:employee.getValue('entityid'),
                sdr_notes: employee.getValue('comments'),
                sdr_empid: employee.id
            }
        });
    }
}
});