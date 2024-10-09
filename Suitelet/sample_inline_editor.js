/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Create the form
            var form = serverWidget.createForm({
                title: 'Inline Editor Sublist Suitelet'
            });

            // Add a text field to the form
            form.addField({
                id: 'custpage_main_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Main Field'
            });

            // Add a sublist with INLINEEDITOR
            var sublist = form.addSublist({
                id: 'custpage_items_sublist',
                type: serverWidget.SublistType.INLINEEDITOR,
                label: 'Items Sublist'
            });

            // Add fields to the sublist
            sublist.addField({
                id: 'custpage_item',
                type: serverWidget.FieldType.TEXT,
                label: 'Item'
            });
            
            sublist.addField({
                id: 'custpage_quantity',
                type: serverWidget.FieldType.INTEGER,
                label: 'Quantity'
            });
            
            sublist.addField({
                id: 'custpage_price',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Price'
            });

            // Add a submit button to the form
            form.addSubmitButton({
                label: 'Submit'
            });

            // Display the form
            context.response.writePage(form);
        } else {
            // Handle POST request (form submission)
            var mainFieldValue = context.request.parameters.custpage_main_field;

            // Fetch the values entered in the sublist
            var sublistLineCount = context.request.getLineCount({
                group: 'custpage_items_sublist'
            });

            var submittedItems = [];
            for (var i = 0; i < sublistLineCount; i++) {
                var item = context.request.getSublistValue({
                    group: 'custpage_items_sublist',
                    name: 'custpage_item',
                    line: i
                });
                
                var quantity = context.request.getSublistValue({
                    group: 'custpage_items_sublist',
                    name: 'custpage_quantity',
                    line: i
                });
                
                var price = context.request.getSublistValue({
                    group: 'custpage_items_sublist',
                    name: 'custpage_price',
                    line: i
                });

                submittedItems.push({
                    item: item,
                    quantity: quantity,
                    price: price
                });
            }

            // Return the submitted data
            context.response.write('Main Field: ' + mainFieldValue + '<br />');
            context.response.write('Submitted Items: ' + JSON.stringify(submittedItems));
        }
    }

    return {
        onRequest: onRequest
    };
});
