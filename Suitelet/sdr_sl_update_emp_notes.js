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

            var name = request.parameters.sdr_name;
            var notes = request.parameters.sdr_notes;
            var empId = request.parameters.sdr_empid;

            var form = serverWidget.createForm({
                title: 'Update Employee Notes' //title displayed below the navigation bar
                //hideNavBar: true // hide the navigation bar menu
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

            form.addSubmitButton('Continue');

            nameFld.defaultValue = name;
            notesFld.defaultValue = notes;
            empIdFld.defaultValue = empId;

            nameFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });

            empIdFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            response.writePage(form);
        }
        return{
            onRequest: onRequest
        };
    });

