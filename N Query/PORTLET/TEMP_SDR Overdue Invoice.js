/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */


define(['N/render'],
    function(render) {
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
        function onRequest(params)
        {
            var response = params.response;
            

            var xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
            "<pdf lang=\"us-US\" xml:lang=\"us-US\">\n" + 
            "<head>\n" + "<link name=\"proximanovafont\" type=\"font\" subtype=\"opentype\" " + 
            /*insert regular font*/  + 
            /*insert bold font*/  +
            "bytes=\"2\"/>\n" +
            "<style type=\"text/css\">\n" +
            "img{float: right; display: inline;}\n" +
            "table{ font-size: 12pt; table-layout: fixed; border: 1px solid #dddddd;}\n" +
            "th{font-weight: bold; font-size: 14pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #b5dcdd; color:#2c6b96;}\n" +
            "td{padding: 8px 6px; background-color:#f5f5f5; color:#333333; border: 1px solid #dddddd;}\n" +
            "</style>\n" +
            "</head>\n" +
            "<body font-family=\"proximanovafont\" font-size=\"15\">\n" +
            /*insert logo*/  +
            "<#assign cust = \" \">\n" +
            "<#assign total = 0>\n" +
            /*assignment of customer and total amount*/  +
            "<b>Good Day, ${cust} </b><br/><br/>\n" +
            "Our records indicate that we have yet to receive payments on the following invoices below.<br/><br/><br/>\n" +
            "<b>OVERDUE INVOICES: </b><br/>\n" + 
            "<table style=\"width: 100%; margin-top: 10px\">\n" +
            "<thead>\n" +
            "<tr><th>Invoice #</th><th>Invoice Date</th><th>Due Date</th><th>Total Amount</th><th>Days Overdue</th></tr>\n" +
            "</thead>\n" +
            "<tbody>\n" +
            /*call N/query values*/ +
            "</tbody>\n" +
            "</table>\n" +
            "<br/><b>Grand Total: $ ${total?string.number}</b><br/><br/>\n" + 
            "Kindly settle within 2 weeks upon receipt of this notice. Contact ${companyinformation.url} for any questions or concerns.<br/><br/>\n" +
            "<b><br/><br/>Regards,<br/><br/>\n"+
            "Accounts Receivable Department<br/>\n" +
            "${companyinformation.companyname}</b>\n" +
            "</body>\n" +
            "</pdf>";
            
            /*N/query code*/
            var overdueInvcQuery = query.create({
                type: query.Type.TRANSACTION
            });

            var firstCondition = overdueInvcQuery.createCondition({
                fieldId: 'type',
                operator: query.Operator.IS,
                values:'CustInvc'
            });
            var secondCondition = overdueInvcQuery.createCondition({
                fieldId:'daysOverdueSearch',
                operator:query.Operator.GREATER,
                values:0
            });
            var thirdCondition = overdueInvcQuery.createCondition({
                fieldId:'status',
                operator:query.Operator.ANY_OF,
                values:'CustInvc:A'
            });
            var fourthCondition = overdueInvcQuery.createCondition({
                fieldId:'entity',
                operator:query.Operator.EQUAL,
                values:159
            });

            overdueInvcQuery.condition = overdueInvcQuery.and(firstCondition,secondCondition,thirdCondition,fourthCondition);

            overdueInvcQuery.columns = [
                overdueInvcQuery.addColumn({
                    fieldId:'tranDisplayName'
                }),
                overdueInvcQuery.addColumn({
                    fieldId:'tranDate'
                }),
                overdueInvcQuery.addColumn({
                    fieldId:'dueDate'
                }),
                overdueInvcQuery.addColumn({
                    fieldId:'foreignTotal'
                }),
                overdueInvcQuery.addColumn({
                    fieldId:'entity',
                    context: query.FieldContext.DISPLAY
                }),
                overdueInvcQuery.addColumn({
                    type:query.ReturnType.STRING,
                    formula:`CONCAT(TO_CHAR({daysoverduesearch}),' Days')`
                }),
            ];
     
            	

            var renderer = render.create();
            renderer.templateContent = xmlStr;
            renderer.addQuery({
                templateName: "page",
                query: overdueInvcQuery
            });
            
            var newfile = renderer.renderAsPdf();
            response.writeFile(newfile, true);
        }
        
        return {
            onRequest: onRequest
        };    
    });