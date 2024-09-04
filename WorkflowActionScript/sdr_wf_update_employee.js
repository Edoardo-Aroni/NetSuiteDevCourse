/**
 * @NApiVersion 2.0
 * @NScriptType workflowactionscript
 */

define(['N/record','N/runtime'],
/**
 * 
 * @param {record} record 
 * @param {runtime} runtime 
 * @returns 
 */
    function(record,runtime){
        function onAction(context){
            var workflowTotal = runtime.getCurrentScript().getParameter({
                name:'custscript_sdr_workflow_total'
            });

            var expRep = context.newRecord;
            var expenseCount = expRep.getLineCount({
                sublistId: 'expense'
            });
            var employeeId = expRep.getValue('entity');
            var notes = 'Workflow Total: ' + workflowTotal + '\n' +
                        'Expense Count: ' + expenseCount;

            var employee = record.load({
                type: record.Type.EMPLOYEE,
                id: employeeId
            });

            employee.setValue('comments',notes);
            employee.save();

        }
        return {
            onAction: onAction
        };
    }
);
