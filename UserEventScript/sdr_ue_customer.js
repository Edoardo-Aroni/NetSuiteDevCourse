/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define(['N/record'], 
    /**
     * @param {record} record 
     */
    function(record){
    function afterSubmit(context) {
        var customer            = context.newRecord;
        var customerId          = customer.getValue('entityid');
        var customerEmail       = customer.getValue('email');
        var customerCouponCode  = customer.getValue('custentity_sdr_coupon_code');
        var customerSalesRep    = customer.getValue('salesrep');

        log.debug('Customer ID',customerId);
        log.debug('Customer email', customerEmail);
        log.debug('Customer SalesRep', customerSalesRep);
        log.debug('Customer Coupon Code', customerCouponCode);

        if(context.type == context.UserEventType.CREATE){

            var task = record.create({
                type: record.Type.TASK

            });

            task.setValue('title','New Customer Follow-up');
            task.setValue('priority', 'HIGH');
            task.setValue('message', 'Please take care of this customer and follow-up with them soon.');
            if(!customerSalesRep) {
                task.setValue('assigned', customerSalesRep );  
            };
            task.save();
        }
    };
    return{
        afterSubmit: afterSubmit
    }
});