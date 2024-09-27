/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/redirect'],
    function(serverWidget, redirect) {

        function onRequest(context) {
            var request = context.request;
            var response = context.response;

            if (request.method === 'GET') {
                // Create a form for date selection
                var form = serverWidget.createForm({
                    title: 'Select Date'
                });

                // Add a date field to the form
                var dateField = form.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Select Date'
                });

                // Add a submit button
                form.addSubmitButton({
                    label: 'Submit'
                });

                // Display the form
                response.writePage(form);

            } else if (request.method === 'POST') {
                // Get the selected date from the form
                var selectedDate = request.parameters.custpage_date;

                // Redirect to another Suitelet, passing the selected date as a parameter
                redirect.toSuitelet({
                    scriptId: 'customscript_sdr_recent_sales_orders', // Replace with your second Suitelet script ID
                    deploymentId: 'ccustomdeploy_sdr_recent_sales_orders', // Replace with your second Suitelet deployment ID
                    parameters: {
                        custparam_date: selectedDate // Passing the date as a parameter
                    }
                });
            }
        }

        return {
            onRequest: onRequest
        };
    });
