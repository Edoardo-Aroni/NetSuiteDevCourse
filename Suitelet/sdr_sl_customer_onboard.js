/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/email','N/record','N/redirect','N/ui/serverWidget'],
    
    /**
     * @param {email} email 
     * @param {record} record 
     * @param {redirect} redirect 
     * @param {serverWidget} serverWidget 
     */
    (email,record,redirect,serverWidget) => {
      

        const onRequest = (context) => {
            const request  = context.request;
            const response = context.response;

            const form = serverWidget.createForm({
                title: 'Customer Onboarding',
                hideNavBar: true            // this is optional, default value is false
            });

            const customerInfoGrp = form.addFieldGroup({
                id: 'custpage_grp_customer',
                label: 'Customer Information'
            });

            const taskGrp = form.addFieldGroup({
                id:'custpage_grp_task',
                label: 'Onboarding Task'
            });

            const emailGrp = form.addFieldGroup({
                id:'custpage_grp_email',
                label: 'Welcome Email'
            });

            const nameFld = form.addField({
                id: 'custpage_nfo_name',
                label: 'Customer Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_grp_customer'
            });

            const tskTitleFld = Form.addField({
                id: 'custpage_tsk_title',
                label: 'Task Title',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_grp_task'
            })
            
    
        }
    
        return {
            onRequest: onRequest
        };
        
    });