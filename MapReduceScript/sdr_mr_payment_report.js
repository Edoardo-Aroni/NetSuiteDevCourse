/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 */

define(['N/search', 'N/runtime'], 
    /**
     * 
     * @param {search} search 
     * @returns 
     */
    function(search, runtime){

        function getInputData(){
        //     var paymtSearch = search.load({
        //         id: 'customsearch_sdr_payments'
        //     });
        //     return paymtSearch;

            // return search.load({
            //     id: 'customsearch_sdr_payments'
            // });
        
        // Get the customer id from the script parameter passed by the task 
        // set in the user event script

        var script = runtime.getCurrentScript();
        var customerId = script.getParameter({
            name: 'custscript_sdr_customer_id'
        });

        // create the saved search for payments and add the customer id
        // parameter as a filter

        var paymentSearch = search.create({
            type: search.Type.TRANSACTION,  
            filters:[
                ['type', search.Operator.ANYOF, 'CustPymt'], 'and',
                ['mainline', search.Operator.IS, true],'and',
                ['entity',search.Operator.ANYOF, customerId]
            ],
            columns:['entity', 'statusref', 'amounpaid']
        });

        return paymentSearch;
        
        }

        function map(context){
            var searchResult = JSON.parse(context.value);
            log.debug('Resulting Value:', searchResult.values);

            var customer = searchResult.values.entity.text;
            var status = searchResult.values.statusref.value;
            var amount = searchResult.values.amountpaid;

            context.write({
                key: customer,
                value: {
                    status: status,
                    amount: amount
                }
            });

        }
        function reduce(context){
            var depositedTotal = 0;
            var unDepositedTotal = 0;

            for ( var i in context.values){
                var value = JSON.parse(context.values[i]);
                if(value.status == 'deposited'){
                    depositedTotal += parseFloat(value.amount);
                }
                if(value.status == 'undeposited'){
                    unDepositedTotal += parseFloat(value.amount);
                }
            }

            log.debug(context.key, 'Deposited Total: ' + depositedTotal + '\n' +
                                   'Undeposited Total: ' + unDepositedTotal);
        }
        function summarize(summary){

            log.audit('Usage Consumed', summary.usage);
            log.audit('Number of Queues used', summary.concurrency);
            log.audit('Number of Yields done', summary.yields);


        }
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        }
    }
);