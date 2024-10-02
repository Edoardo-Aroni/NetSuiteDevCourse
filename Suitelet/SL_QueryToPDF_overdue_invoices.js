/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

// Define required modules: N/render (for PDF rendering) and N/query (for running queries)
define(['N/render', 'N/query'],
    function(render, query) {

        // The onRequest function handles incoming Suitelet requests
        function onRequest(params)
        {
            var response = params.response; // Access the response object to send output back to the client

            // XML string for creating the PDF, including the header, style, body, and the structure of the document
            var xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
"<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
"<pdf lang=\"us-US\" xml:lang=\"us-US\">\n" + 
"<head>\n" + 
    // Define a font to be used in the PDF and reference external font files
    "<link name=\"proximanovafont\" type=\"font\" subtype=\"opentype\" " +
    "src=\"https://td2937552.app.netsuite.com/core/media/media.nl?id=2618&amp;c=TD2937552&amp;h=KW_TWi-2xFlgBKqQrUHPiHLclxzYnYs51M_ZsH90OlYM77-b&amp;_xt=.otf\" " + 
    "src-bold=\"https://td2937552.app.netsuite.com/core/media/media.nl?id=2619&amp;c=TD2937552&amp;h=K8hZwot-cf7XsX1rBxEeGJsYrGMpCGX2M16PXE3SsYRudiVd&amp;_xt=.otf\" " +
    "bytes=\"2\"/>\n" + 
    // Add custom CSS styles for the PDF layout, such as styling for tables, headers, and data cells
"<style type=\"text/css\">\n" +
"img{float: right; display: inline;}\n" +
"table{ font-size: 12pt; table-layout: fixed; border: 1px solid #dddddd;}\n" +
"th{font-weight: bold; font-size: 14pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #b5dcdd; color:#2c6b96;}\n" +
"td{padding: 8px 6px; background-color:#f5f5f5; color:#333333; border: 1px solid #dddddd;}\n" +
"</style>\n" +
"</head>\n" +
"<body font-family=\"proximanovafont\" font-size=\"15\">\n" +
    // Add a company logo to the PDF
"<img src=\"https://td2955417.app.netsuite.com/core/media/media.nl?id=2004&amp;c=TD2955417&amp;h=9_AVypXBMXYYAYPo-rpCbasdj3K4wPffMeNG6ZIUkj6A2bOj\" width=\"150\" height =\"85\"/>" +
    // Initialize variables for customer name and total overdue amount
"<#assign cust = \" \">\n" +
"<#assign total = 0>\n" +
    // Iterate through the query results (represented as "page") and assign values to variables
"<#list page as line>" + 
"<#assign cust = line[5]>" + 
"<#assign total += line[3]>" + 
"</#list>\n"  +
    // Include a greeting to the customer using their name from the query result
"<b>Good Day, ${cust} </b><br/><br/>\n" +
    // Add a message indicating the overdue invoices
"Our records indicate that we have yet to receive payments on the following invoices below.<br/><br/><br/>\n" +
"<b>OVERDUE INVOICES: </b><br/>\n" + 
    // Create a table to display invoice details
"<table style=\"width: 100%; margin-top: 10px\">\n" +
"<thead>\n" +
"<tr><th>Invoice #</th><th>Invoice Date</th><th>Due Date</th><th>Total Amount</th><th>Days Overdue</th></tr>\n" +
"</thead>\n" +
"<tbody>\n" +
    // Loop through the query result and populate each row with invoice data
"<#list page as line>\n" +
"<tr><td>${line[0]}</td><td>${line[1]}</td><td>${line[2]}</td><td>${line[3]}</td><td>${line[4]}</td></tr>\n" +
"</#list>\n" +
"</tbody>\n" +
"</table>\n" +
    // Display the grand total of overdue amounts
"<br/><b>Grand Total: $ ${total?string.number}</b><br/><br/>\n" + 
"Kindly settle within 2 weeks upon receipt of this notice. Contact ${companyinformation.url} for any questions or concerns.<br/><br/>\n" +
"<b><br/><br/>Regards,<br/><br/>\n"+ 
"Accounts Receivable Department<br/>\n" +
"${companyinformation.companyname}</b>\n" +
"</body>\n" +
"</pdf>";
            
            // Create the query for fetching overdue invoices
            var overdueInvcQuery = query.create({
                type: query.Type.TRANSACTION // Transaction type is Invoice (CustInvc)
            });

            // Define query conditions
            var firstCondition = overdueInvcQuery.createCondition({
                fieldId: 'type',
                operator: query.Operator.IS,
                values: 'CustInvc'  // Only include records where the transaction type is "Invoice"
            });
            var secondCondition = overdueInvcQuery.createCondition({
                fieldId: 'daysoverduesearch',
                operator: query.Operator.GREATER,
                values: 0  // Only include invoices that are overdue (days overdue > 0)
            });
            var thirdCondition = overdueInvcQuery.createCondition({
                fieldId: 'status',
                operator: query.Operator.ANY_OF,
                values: 'CustInvc:A'  // Only include open invoices
            });
            var fourthCondition = overdueInvcQuery.createCondition({
                fieldId: 'entity',
                operator: query.Operator.EQUAL,
                values: 159  // Include invoices for a specific customer (e.g., customer ID 159, "Gentry Inc.")
            });

            // Combine the conditions using AND logic
            overdueInvcQuery.condition = overdueInvcQuery.and(firstCondition, secondCondition, thirdCondition, fourthCondition);
                            
            // Define the columns to return from the query (e.g., Invoice #, Invoice Date, Due Date, Total Amount, Days Overdue, Customer Name)
            overdueInvcQuery.columns = [
                overdueInvcQuery.createColumn({ fieldId: 'trandisplayname' }),  // Invoice number
                overdueInvcQuery.createColumn({ fieldId: 'trandate' }),  // Invoice date
                overdueInvcQuery.createColumn({ fieldId: 'duedate' }),  // Due date
                overdueInvcQuery.createColumn({ fieldId: 'foreigntotal' }),  // Total amount
                overdueInvcQuery.createColumn({
                    type: query.ReturnType.STRING,
                    formula: `CONCAT(TO_CHAR({daysoverduesearch}),' Days ')`  // Days overdue, displayed as a string with " Days"
                }),
                overdueInvcQuery.createColumn({
                    fieldId: 'entity',
                    context: query.FieldContext.DISPLAY  // Customer name
                })
            ];

            // Create the renderer to generate the PDF
            var renderer = render.create();
            renderer.templateContent = xmlStr;  // Use the XML string as the template for the PDF

            // Add the query result to the PDF template under the name "page"
            renderer.addQuery({
                templateName: "page",
                query: overdueInvcQuery
            });
            
            // Render the PDF file
            var newfile = renderer.renderAsPdf();

            // Send the PDF file as a response to the client
            response.writeFile(newfile, true);
        }
        
        // Return the onRequest function as the entry point of the Suitelet
        return {
            onRequest: onRequest
        };    
    });
