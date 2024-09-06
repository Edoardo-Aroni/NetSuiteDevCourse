/**
 * @NApiVersion 2.0
 * @NScriptType WorkFlowActionScript
 */

define(['N/record','N/runtime'], 
    /**
     * 
     * @param {record} record 
     * @param {runtime} runtime 
     * @returns 
     */
    
    function(record, runtime){
    function onAction(context){
        // get parameter value
        var script = runtime.getCurrentScript();
        var orderDate = script.getParameter({
            name: 'custscript_sdr_order_date'
        });
        // get sales order object
        var salesOrder = context.newRecord;
        // get number of line items
        var orderLineCount = salesOrder.getLineCount({
            sublistId: 'item'
        });
         // get date in format dd/mm/yyyy
        var day = orderDate.getDate();
        var month = orderDate.getMonth() + 1; //month start from 0
        var year = orderDate.getFullYear();
        var dateOrder = day + '/' + month + '/' + year;

        // create notes variable
        var notes = 'Last Order Date: ' + dateOrder + '\n' +
                    'Unique Items ordered: ' + orderLineCount;
        // get internal id for the customer on the sales order record
        var customerSalesOrder = salesOrder.getValue('entity');
        // load customer record object
        var customer = record.load({
            type: record.Type.CUSTOMER,
            id: customerSalesOrder
        });
       //update comments with value from notes
       customer.setValue('comments', notes);
       // save changes
       customer.save();

       if (!customer.id) {
        return 'FAILED';
       }
       return 'SUCCESS';

    }
    return {
        onAction: onAction
    };
});