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

            if(request.method == 'GET'){
                const customerId        = request.parameters.custparam_sdr_customer_id;
                const customerPhone     = request.parameters.custparam_sdr_phone;
                const customerEmail     = request.parameters.custparam_sdr_email;
                const customerSalesRep  = request.parameters.custparam_sdr_salesrep;
    
    
                const form = serverWidget.createForm({
                    title: 'Customer Onboarding'
                    //hideNavBar: true            // this is optional, default value is false
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
                    type: serverWidget.FieldType.SELECT,
                    source: 'customer',
                    container: 'custpage_grp_customer'
                });
    
                const  salesRepFld = form.addField({
                    id: 'custpage_nfo_salesrep',
                    label: 'Sales Rep',
                    type: serverWidget.FieldType.SELECT,
                    source: 'employee',
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
                    label: `NOTE: These task are important customer onboarding task. Please make sure these are not skipped`,
                    type: serverWidget.FieldType.HELP
                });
    
               form.addSubmitButton('Complete Process');
    
               nameFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
               });
    
               salesRepFld.updateDisplayType({
                displayType:serverWidget.FieldDisplayType.INLINE
               });
    
               phoneFld.updateDisplayType({
                displayType:serverWidget.FieldDisplayType.INLINE
               });
    
               emBodyFld.updateDisplaySize({
                height: 20,
                width: 85
               });
    
               noteFld.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
               });
    
               tskTitleFld.isMandatory  = true;
               tskNoteFld.isMandatory   = true;
               emSubjectFld.isMandatory = true;
               emBodyFld.isMandatory    = true;
    
               nameFld.defaultValue     = customerId;
               phoneFld.defaultValue    = customerPhone;
               salesRepFld.defaultValue = customerSalesRep;
               
    
               response.writePage(form);

            } else { // POST request
                const customerId = request.parameters.custpage_nfo_name;
                const taskTitle = request.parameters.custpage_tsk_title;
                const taskNotes = request.parameters.custpage_tsk_notes;

                const task = record.create({
                    type: record.Type.TASK,
                    isDynamic: true
                });

                task.setValue({
                    fieldId: 'compamy',
                    value: customerId
                });

                task.setValue({
                    fieldId: 'title',
                    value: taskTitle
                });

                task.setValue({
                    fieldId: 'message',
                    value: taskNotes
                });

                task.save();

                redirect.toRecord({
                    id: customerId,
                    type: record.Type.CUSTOMER,
                    isEditMode: true
                });
            }
        }
    
        return {
            onRequest: onRequest
        };
        
    });

// module 3 - 53 minutes