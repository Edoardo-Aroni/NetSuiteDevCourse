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
            //get request and response from context object
            var request = context.request;
            var response = context.response;


            //create base form
            var form = serverWidget.createForm({
                title:'Sales Order Financing'
            });
            // add form fields: Customer, Txn Date, Sales Order #, Sales Order Total, FinancingPrice

            var customerFld = form.addField({
                id:'custpage_sdr_customer',
                type: serverWidget.FieldType.TEXT,
                label:'Customer'
            });

            var txnDateFld = form.addField({
                id:'custpage_sdr_txn_date',
                type: serverWidget.FieldType.DATE,
                label:'Txn Date'
            });

            var salOrderNumbFld = form.addField({
                id:'custpage_sdr_sal_order_numb',
                type: serverWidget.FieldType.TEXT,
                label:'Sales Order #'
            });

            var salOrderTotFld = form.addField({
                id:'custpage_sdr_sal_order_tot',
                type: serverWidget.FieldType.CURRENCY,
                label:'Sales Order Total'
            });

            var finPriceFld = form.addField({
                id:'custpage_sdr_fin_price',
                type: serverWidget.FieldType.CURRENCY,
                label:'Financing Price'
            });

            // add a submit button
            form.addSubmitButton('Save Finance Info.');

            // render the page by writing it to response

            context.response.writePage(form);



            



        }
        return {
            onRequest: onRequest
        };

    });