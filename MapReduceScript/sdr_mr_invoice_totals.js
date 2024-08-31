/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 */

define(['N/search'], 
    
    function(search){

        function getInputData(){
            var invSearch = search.create({
                type: search.Type.TRANSACTION,
                filters: [
                    ['type', search.Operator.ANYOF, 'CustInvc'],
                    'and',
                    ['mainline', search.Operator.IS, true]
                ],
                columns: ['entity', 'total' ]
            });

            return invSearch;
        }

        function map(context){
            var searchResult = JSON.parse(context.value);
            var customer = searchResult.values.entity.text;
            var total = searchResult.values.total;

            context.write({
                key: customer,
                value: total
            });
        }

        function reduce(context){
            var total = 0;

            for(var i in context.values){
                total += parseFloat(context.values[i]);
            }

            log.debug('Total', 'Customer ' + context.key + '\n' +
                               'Total : ' + total);
        }

        function summarize(summary){
            log.audit('Number of queues', summary.concurrency);

            if (summary.inputSummary.error) {
                log.error('Input error', summary.inputSummary.error);
            }

            summary.reduceSummary.errors.iterator().each(function(code, message){
                log.error('Reduce Error: ' + code, message);
                return true;
            });
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    }
);