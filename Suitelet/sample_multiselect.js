/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Create the form
            var form = serverWidget.createForm({
                title: 'Multi-Select Field Suitelet'
            });
            
            // Add a multi-select field
            var multiSelectField = form.addField({
                id: 'custpage_multiselect_field',
                type: serverWidget.FieldType.MULTISELECT,
                label: 'Select Items'
            });

            // Add options to the multi-select field
            multiSelectField.addSelectOption({
                value: 'option1',
                text: 'Option 1'
            });
            multiSelectField.addSelectOption({
                value: 'option2',
                text: 'Option 2'
            });
            multiSelectField.addSelectOption({
                value: 'option3',
                text: 'Option 3'
            });
            
            // Add a submit button
            form.addSubmitButton({
                label: 'Submit'
            });

            // Display the form
            context.response.writePage(form);
        } else {
            // Handle POST request (after form submission)
            var selectedValues = context.request.parameters.custpage_multiselect_field;
            context.response.write('Selected Values: ' + selectedValues);
        }
    }

    return {
        onRequest: onRequest
    };
});
