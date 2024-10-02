/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/render', 'N/query'],
    function(render, query) {

        function onRequest(params)
        {
            var response = params.response;
            

            var xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
            "<pdf lang=\"us-US\" xml:lang=\"us-US\">\n" + 
            "<head>\n" + "<link name=\"proximanovafont\" type=\"font\" subtype=\"opentype\" " + 
            /*insert regular font*/ "src=\"https://td2937552.app.netsuite.com/core/media/media.nl?id=2618&amp;c=TD2937552&h=KW_TWi-2xFlgBKqQrUHPiHLclxzYnYs51M_ZsH90OlYM77-b&amp;_xt=.otf\""+ 
            /*insert bold font*/ + "src-bold=\"https://td2937552.app.netsuite.com/core/media/media.nl?id=2619&amp;c=TD2937552&h=K8hZwot-cf7XsX1rBxEeGJsYrGMpCGX2M16PXE3SsYRudiVd&amp;_xt=.otf\"/"
            "bytes=\"2\"/>\n" +
            "<style type=\"text/css\">\n" +
            "img{float: right; display: inline;}\n" +
            "table{ font-size: 12pt; table-layout: fixed; border: 1px solid #dddddd;}\n" +
            "th{font-weight: bold; font-size: 14pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #b5dcdd; color:#2c6b96;}\n" +
            "td{padding: 8px 6px; background-color:#f5f5f5; color:#333333; border: 1px solid #dddddd;}\n" +
            "</style>\n" +
            "</head>\n" +
            "<body font-family=\"proximanovafont\" font-size=\"15\">\n" +
            /*insert logo*/"<img src=\"https://td2955417.app.netsuite.com/core/media/media.nl?id=2004&c=TD2955417&h=9_AVypXBMXYYAYPo-rpCbasdj3K4wPffMeNG6ZIUkj6A2bOj\" width=\"150\" height =\"85\"/>\"" +
            "<#assign cust = \" \">\n" +
            "<#assign total = 0>\n" +
            "<#list page as line>" + "<#assign cust = line[5]>" + "<#assign total += line[3]>" + "</#list>\n"  +
            "<b>Good Day, ${cust} </b><br/><br/>\n" +
            "Our records indicate that we have yet to receive payments on the following invoices below.<br/><br/><br/>\n" +
            "<b>OVERDUE INVOICES: </b><br/>\n" + 
            "<table style=\"width: 100%; margin-top: 10px\">\n" +
            "<thead>\n" +
            "<tr><th>Invoice #</th><th>Invoice Date</th><th>Due Date</th><th>Total Amount</th><th>Days Overdue</th></tr>\n" +
            "</thead>\n" +
            "<tbody>\n" +
            "<#list page as line>\n" +
            "<tr><td>${line[0]}</td><td>${line[1]}</td><td>${line[2]}</td><td>${line[3]}</td><td>${line[4]}</td></tr>\n" +
            "</#list>\n" +
            "</tbody>\n" +
            "</table>\n" +
            "<br/><b>Grand Total: $ ${total?string.number}</b><br/><br/>\n" + 
            "Kindly settle within 2 weeks upon receipt of this notice. Contact ${companyinformation.url} for any questions or concerns.<br/><br/>\n" +
            "<b><br/><br/>Regards,<br/><br/>\n"+
            "Accounts Receivable Department<br/>\n" +
            "${companyinformation.companyname}</b>\n" +
            "</body>\n" +
            "</pdf>";
            
                //creating the query
                 var overdueInvcQuery = query.create({
                     type: query.Type.TRANSACTION
                });

                 var firstCondition = overdueInvcQuery.createCondition({
                                       fieldId: 'type',
                                       operator: query.Operator.IS,
                                       values: 'CustInvc'                             //transaction type is Invoice
                                    });
                 var secondCondition = overdueInvcQuery.createCondition({
                                       fieldId: 'daysoverduesearch',
                                       operator: query.Operator.GREATER,
                                       values: 0
                                    });
                var thirdCondition = overdueInvcQuery.createCondition({
                                       fieldId: 'status',
                                       operator: query.Operator.ANY_OF,
                                       values: 'CustInvc:A' //Status is Invoice:Open
                                    });
                var fourthCondition = overdueInvcQuery.createCondition({
                                       fieldId: 'entity',
                                       operator: query.Operator.EQUAL,
                                       values: 159                                      //any specific customer; 159 is Gentry Inc.
                                    });
                overdueInvcQuery.condition = overdueInvcQuery.and(firstCondition, secondCondition, thirdCondition, fourthCondition);     
                            
             
                 overdueInvcQuery.columns = [
                     overdueInvcQuery.createColumn({
                        fieldId: 'trandisplayname'
                     }),
                     overdueInvcQuery.createColumn({
                        fieldId: 'trandate'
                     }),
                     overdueInvcQuery.createColumn({
                        fieldId: 'duedate',
                     }),
                     overdueInvcQuery.createColumn({
                        fieldId: 'foreigntotal'
                     }),
                     overdueInvcQuery.createColumn({
                        type: query.ReturnType.STRING,
                        formula:  `CONCAT(TO_CHAR({daysoverduesearch}),' Days ')`,
                     }),
                     overdueInvcQuery.createColumn({
                         fieldId: 'entity',
                         context: query.FieldContext.DISPLAY
                     })
                 ];//end
    

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