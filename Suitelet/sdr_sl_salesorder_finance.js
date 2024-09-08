/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/redirect'],
    /**
     * @param {serverWidget} serverWidget
     * @param {record} record
     * @param {redirect} redirect 
     */
    function(serverWidget, record, redirect){
        function onRequest(context){
            //get request and response from context object
            var request = context.request;
            var response = context.response;

            if(request.method == 'GET') {

            //extract values from parameters

            var salOrderNumb = request.parameters.custparam_sdr_sal_ord_num;
            var customer     = request.parameters.custparam_sdr_customer;
            var salOrderTot  = request.parameters.custparam_sdr_sal_ord_total;
            var finPrice     = request.parameters.custparam_sdr_financing_price;
            var salOrdId     = request.parameters.custparam_sdr_sal_ord_id;


            //create base form
            var form = serverWidget.createForm({
                title:'Sales Order Financing'
            });
            // add form fields: help,Customer, Txn Date, Sales Order #, Sales Order Total, FinancingPrice

            var helpFld = form.addField({
                id:'custpage_sdr_financing_help',
                type: serverWidget.FieldType.HELP,
                label:'Please assign a price to the financing of this sales order, then Submit Financing'
            });

            var salOrderNumbFld = form.addField({
                id:'custpage_sdr_sal_order_numb',
                type: serverWidget.FieldType.TEXT,
                label:'Sales Order #'
            });
            
            var customerFld = form.addField({
                id:'custpage_sdr_customer',
                type: serverWidget.FieldType.TEXT,
                label:'Customer'
            });

            // var txnDateFld = form.addField({
            //     id:'custpage_sdr_txn_date',
            //     type: serverWidget.FieldType.DATE,
            //     label:'Txn Date'
            // });

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

            var salOrdIdFld = form.addField({
                id:'custpage_sdr_sal_ord_id',
                type: serverWidget.FieldType.TEXT,
                label:'Sales Order ID'
            });

            // set field default values
            salOrderNumbFld.defaultValue = salOrderNumb;
            customerFld.defaultValue     = customer;
            salOrderTotFld.defaultValue  = salOrderTot;
            finPriceFld.defaultValue     = finPrice;
            salOrdIdFld.defaultValue     = salOrdId;


            // set field display type
            salOrderNumbFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });
            customerFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });
            salOrderTotFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });
            salOrdIdFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            // add a submit button
            form.addSubmitButton('Submit Financing');

            // render the page by writing it to response

            response.writePage(form);

        } else { //POST
            //get salesorder id and financing price from form values
            var salOrdId = request.parameters.custpage_sdr_sal_ord_id;
            var finPrice = request.parameters.custpage_sdr_fin_price;

            //load sales order
            var salesOrder = record.load({
                type: record.Type.SALES_ORDER,
                id: salOrdId  
            });
            //set value finance pricing
            salesOrder.setValue('custbody_sdr_finance_price',finPrice);
            //save change in the sales order
            salesOrder.save();
            //redirect to sales order record
            redirect.toRecord({
                type: record.Type.SALES_ORDER,
                id: salOrdId 
            });
        }

    }
        return {
            onRequest: onRequest
        };

    });