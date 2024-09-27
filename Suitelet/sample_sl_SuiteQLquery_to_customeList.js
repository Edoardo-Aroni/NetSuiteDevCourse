/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/query', 'N/log'],
    function(serverWidget, query, log) {

        function onRequest(context) {
            var request = context.request;
            var response = context.response;

            // Define SuiteQL query
            var suiteQL = `
                SELECT 
                    t.tranid AS transaction_id,
                    BUILTIN.DF(t.entity) AS customer,
                    t.foreigntotal AS total,
                    BUILTIN.DF(t.status) AS status,
                    t.trandate AS date
                FROM 
                    transaction AS t
                WHERE 
                    t.type = 'SalesOrd' 
                    AND t.trandate > TO_DATE('01/09/2024','dd/mm/yyyy')
                ORDER BY date DESC
            `;

            // Execute SuiteQL Query
            var queryResults = query.runSuiteQL({
                query: suiteQL
            });

            var results = queryResults.asMappedResults();

            log.debug('SuiteQL Results', results);

            // Create a list to display the results
            var list = serverWidget.createList({
                title: 'Recent Sales Orders'
            });

            // Define the columns for the list
            list.addColumn({
                id: 'tranid',
                type: serverWidget.FieldType.TEXT,
                label: 'Transaction ID'
            });
            list.addColumn({
                id: 'customer',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer'
            });
            list.addColumn({
                id: 'total',
                type: serverWidget.FieldType.TEXT,
                label: 'Total'
            });
            list.addColumn({
                id: 'status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });
            list.addColumn({
                id: 'date',
                type: serverWidget.FieldType.TEXT,
                label: 'Date'
            });

            // Add rows to the list based on SuiteQL results
            results.forEach(function(result) {
                list.addRow({
                    tranid: result["transaction_id"],
                    customer: result["customer"],
                    total: result["total"],
                    status: result["status"],
                    date: result["date"]
                });
            });

            // Display the list on the Suitelet page
            response.writePage(list);
        }

        return {
            onRequest: onRequest
        };
    });
