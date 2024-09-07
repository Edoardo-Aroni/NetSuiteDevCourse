/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], 
    /**
     * 
     * @param {serverWidget} serverWidget 
     * @returns 
     */
    function(serverWidget){
        function onRequest(context){
            var request = context.request;
            var response = context.response;

            var form = serverWidget.createForm({
                title: 'Update Employee Notes', //title displayed below the navigation bar
                hideNavBar: true // hide the navigation bar menu
            });

            var nameFld = form.addField({
                id:'custpage_sdr_emp_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });

            var notesFld = form.addField({
                id:'custpage_sdr_emp_notes',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Notes'
            });

            var empIdFld = form.addField({
                id:'custpage_sdr_emp_emp_id',
                type: serverWidget.FieldType.TEXT,
                label: 'Emp ID'
            });

            form.addSubmitButton();

            response.writePage(form);
        }
        return{
            onRequest: onRequest
        };
    });

