/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

define(['N/search'], 
    
    (search) => {

        const getInputData = () => {
            const invSearch = search.create({
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

        const map = (context) =>{
            log.debug('map',context);
            const searchResult = JSON.parse(context.value);
            const customer = searchResult.values.entity.text;
            const total = searchResult.values.total;

            context.write({
                key: customer,
                value: total
            });
        }

        const reduce = (context) =>{
            log.debug('reduce',context);
            let total = 0;

            for(let i in context.values){
                total += parseFloat(context.values[i]);
            }

            log.debug('Total', 'Customer ' + context.key + '\n' +
                               'Total : ' + total);
        }

        const summarize = (summary) => {
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
            getInputData,
            map,
            reduce,
            summarize
        };
    }
);