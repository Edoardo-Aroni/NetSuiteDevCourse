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

            const  salesRepFld = form.addField({
                id: 'custpage_nfo_salesrep',
                label: 'Sales Rep',
                type: serverWidget.FieldType.SELECT,
                container: 'custpage_grp_customer'
            });

            const phoneFld = form.addField({
                id: 'custpage_nfo_phone',
                label: 'Phone',
                type: serverWidget.FieldType.PHONE,
                container: 'custpage_grp_customer'
            });

            const tskTitleFld = form.addField({
                id: 'custpage_tsk_title',
                label: 'Task Title',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_grp_task'
            });

            const tskNoteFld = form.addField({
                id: 'custpage_tsk_notes',
                label: 'Task Notes',
                type: serverWidget.FieldType.TEXTAREA,
                container: 'custpage_grp_task'
            });

            const emSubjectFld = form.addField({
                id: 'custpage_em_subject',
                label: 'Subject',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_grp_email'
            });

            const emBodyFld = form.addField({
                id: 'custpage_em_body',
                label: 'Body',
                type: serverWidget.FieldType.TEXTAREA,
                container: 'custpage_grp_email'
            });

            const noteFld = form.addField({
                id: 'custpage_impt_note',
                label: `NOTE: These task are important customer onboarding task. Please make sure you fill in all required fields`,
                type: serverWidget.FieldType.HELP
            });

           Form.addSubmitButton();

           response.writePage(form);

        }
    
        return {
            onRequest: onRequest
        };
        
    });