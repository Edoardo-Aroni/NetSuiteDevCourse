/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

/*
Business scope: after saving customer pass parameters from customer record
to the customer onboarding page
*/
define(['N/redirect', 'N/record'],
    /**
     * @param {redirect} redirect 
     * @param {record} record 
     */

    (redirect, record) => {
       
 
        // const beforeLoad = (context) => {
    
        // }
    
        // const beforeSubmit = (context) => {
    
        // }
    
 
        const afterSubmit = (context) => {
            const customer = context.newRecord;
            if (context.type === context.UserEventType.CREATE) {
                redirect.toSuitelet({
                    scriptId: 'customscript_srd_customer_onboard',
                    deploymentId: 'customdeploy_srd_customer_onboard',
                    parameters: {
                        custparam_sdr_customer_id: customer.id,
                        custparam_sdr_phone: customer.getValue({fieldId: 'phone'}),
                        custparam_sdr_phone: customer.getValue({fieldId: 'email'}),
                        custparam_sdr_email: customer.getValue({fieldId: 'salesrep'})
                    }
                });
            }
        }
    
        return {
            // beforeLoad: beforeLoad,
            // beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
        
    });