/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 */

define(['N/search'], 
    /**
     * 
     * @param {search} search 
     * @returns 
     */
    function(search){

        function getInputData(){
        //     var paymtSearch = search.load({
        //         id: 'customsearch_sdr_payments'
        //     });
        //     return paymtSearch;

            return search.load({
                id: 'customsearch_sdr_payments'
            });
        }

        function map(context){
            var searchResult = JSON.parse(context.value);
            log.debug('Resulting Value:', searchResult.values);

            var customer = searchResult.values.entity.text;
            var status = searchResult.values.statusref.value;
            var amount = searchResults.values.amountpaid;

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