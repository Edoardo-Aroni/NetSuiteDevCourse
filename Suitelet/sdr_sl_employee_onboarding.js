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

    (email, record, redirect, serverWidget) => {
       

        const onRequest = (context) => {
            const request  = context.request;
            const response = context.response;

            if(request.method === 'GET'){
                // add form
                const form = serverWidget.createForm({
                    title: 'Employee On-boarding'
                });
                // add field groups
                const emplInfoGrp = form.addFieldGroup({
                    id: 'custpage_grp_emp_info',
                    label: 'Employee Information'
                });

                const meetingSupervisorGrp = form.addFieldGroup({
                    id: 'custpage_grp_meeting_supervisor',
                    label: 'Meeting with Supervisor'
                });

                const welcomeEmailGrp = form.addFieldGroup({
                    id: 'custpage_grp_welcome_email',
                    label: 'Welcome Emai'
                });
                // add fields to Employee Information field group
                const firstNameFld = form.addField({
                    id: 'custpage_nfo_first_name',
                    label: 'First Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_grp_emp_info'
                });
                const middleNameFld = form.addField({
                    id: 'custpage_nfo_middle_name',
                    label: 'Middle Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_grp_emp_info'
                });
                const lastNameFld = form.addField({
                    id: 'custpage_nfo_last_name',
                    label: 'Last Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_grp_emp_info'
                });
                const emailFld = form.addField({
                    id: 'custpage_nfo_email',
                    label: 'Email',
                    type: serverWidget.FieldType.EMAIL,
                    container: 'custpage_grp_emp_info'
                });
                const supervisorFld = form.addField({
                    id: 'custpage_nfo_supervisor',
                    label: 'Supervisor',
                    type: serverWidget.FieldType.SELECT,
                    source:'employee',
                    container: 'custpage_grp_emp_info'
                });
                const subsidiaryFld = form.addField({
                    id: 'custpage_nfo_subsidiary',
                    label: 'Subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    source: 'subsidiary',
                    container: 'custpage_grp_emp_info'
                });

                //add fields to meeting with supervisor field group

                const titleFld = form.addField({
                    id: 'custpage_msup_title',
                    label: 'Title',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_grp_meeting_supervisor'
                });
                const messageMeetingFld = form.addField({
                    id: 'custpage_msup_message',
                    label: 'Message',
                    type: serverWidget.FieldType.TEXTAREA,
                    container: 'custpage_grp_meeting_supervisor'
                });
  
                //add fields to welcome email group
                const subjectFld = form.addField({
                    id: 'custpage_ewelc_subject',
                    label: 'Subject',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_grp_welcome_email'
                });
                const messageEmailFld = form.addField({
                    id: 'custpage_ewelc_email',
                    label: 'Message',
                    type: serverWidget.FieldType.TEXTAREA,
                    container: 'custpage_grp_welcome_email'
                });
                // add submit button named 'Finish'
                form.addSubmitButton('Finish');

                // set mandatory fields
                firstNameFld.isMandatory      = true;
                lastNameFld.isMandatory       = true;
                supervisorFld.isMandatory     = true;
                subsidiaryFld.isMandatory     = true;
                titleFld.isMandatory          = true;
                messageMeetingFld.isMandatory = true;
                subjectFld.isMandatory        = true;
                messageEmailFld.isMandatory   = true;

                // update field sizes
                middleNameFldField.updateDisplaySize({
                    height: 0,
                    width: 5
                });
                messageMeetingFld.updateDisplaySize({
                    height: 12,
                    width: 60
                });
                messageEmailFld.updateDisplaySize({
                    height: 12,
                    width: 60
                });

                // add field defaul values
                titleFld.defaultValue =          
                `Welcome meeting with your supervisor`;
                messageMeetingFld.defaultValue = 
                `Meet and greet with your superisor and the team`;
                subjectFld.defaultValue =        
                `Welcome to SuiteDreams`;
                messageEmailFld.defaultValue =`     
                Hi,

                We’d like to welcome you to SuiteDreams.
                Please feel free to reach out if you have
                questions.

                Best regards,
                SuiteDreams HR`; 

                response.writePage(form);

            } else {


            }
        }
    
        return {
            onRequest: onRequest
        };
        
    });