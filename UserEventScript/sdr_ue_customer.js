/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define(['N/record', 'N/email', 'N/runtime','N/newTask'], 
    /**
     * @param {record} record
     * @param {email} email
     * @param {runtime} runtime
     * @param {task} task
     */
    function(record, email, runtime, task){
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


        // calling map/reduce script to get the payment summary for the customer

            //create a newTask object for the map/reduce script
            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE
            });
            // set property values for the newTask objects
            mrTask.scriptId = 'customscript_sdr_mr_payments';
            mrTask.deploymentId = 'customdeploy_sdr_mr_payments';

            // pass the customer id as parameter to the newTask object
            mrTask.params = {
                'custscript_sdr_customer_id': customer.id
            };
            //log.debug(customer.id);
            // use the submit() method to execute the map/reduce script
           mrTask.submit();


        if(context.type == context.UserEventType.CREATE){

            var newTask = record.create({
                type: record.Type.newTask,
                defaultValues: {
                    customform: -120
                }

            });

            newTask.setValue('title','New Customer Follow-up');
            newTask.setValue('priority', 'HIGH');
            newTask.setValue('message', 'Please take care of this customer and follow-up with them soon.');
            if(!customerSalesRep) {
                newTask.setValue('assigned', customerSalesRep );  
            };
            newTask.save();
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