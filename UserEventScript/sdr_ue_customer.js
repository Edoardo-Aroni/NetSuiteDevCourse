/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define(['N/record', 'N/email', 'N/runtime'], 
    /**
     * @param {record} record
     * @param {email} email
     * @param {runtime} runtime
     */
    function(record, email, runtime){
    function beforeSubmit(context){
        var customer = context.newRecord;
        if(context.type == context.UserEventType.CREATE){
            var customerSalesrep = customer.getValue('salesrep');
            if(!customerSalesrep){
                throw 'Save failed. Please make sure that the Sales Rep field is not empty.';
            }
            return true;
        }

    }

    
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
                type: record.Type.TASK,
                defaultValues: {
                    customform: -120
                }

            });

            task.setValue('title','New Customer Follow-up');
            task.setValue('priority', 'HIGH');
            task.setValue('message', 'Please take care of this customer and follow-up with them soon.');
            if(!customerSalesRep) {
                task.setValue('assigned', customerSalesRep );  
            };
            task.save();
            var currentUserId = runtime.getCurrentUser().id;
            email.send({
                author: currentUserId,
                recipients: customerEmail,
                subject: 'Welcome to SuiteDreams',
                body: 'Welcome! We are glad for you to be a customer of SuiteDreams.' 
            })

            var event = record.create({
                type: record.Type.CALENDAR_EVENT,
                isDynamic: true
            });
            var customerName = customer.getValue('companyname');
            event.setValue('title','Welcome conversation with ' + customerName);
            event.setValue('company', customer.id);

            event.selectNewLine({
                sublistId: 'attendee'
            });
            event.setCurrentSublistValue({
                sublistId: 'attendee',
                fieldId: 'attendee',
                value: customer.id
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
                value: customerSalesRep
            });
            event.commitLine({
                sublistId: 'attendee'
            });

            // Set the "Send Invitation to" field to ensure the invitations are sent
            event.setValue({
                fieldId: 'sendemail',
                value: true
            });

            event.save()

        }
    }
    return{
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
});