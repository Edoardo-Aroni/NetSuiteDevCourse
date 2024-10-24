/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

define(['N/search'], 
    
    search => {

        const getInputData = () => {
            //The search returns the customer and total invoice amount.
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

        const map = context => {
            let searchResult = JSON.parse(context.value);
            
            // Destructure to get customer name (text) and total
            let { values: { entity: { text: customer }, total } } = searchResult;
        
            // Write the customer name and total invoice amount to the context
            context.write({
                key: customer,  // Customer name as the key
                value: total    // Total invoice amount as the value
            });
        }
        

        const reduce = context => {
            let total = 0;
        
            // Sum up the totals for each customer
            for (let i in context.values) {
                total += parseFloat(context.values[i]);
            }
        
            // Log the total amount for each customer
            log.debug('Total', 'Customer ' + context.key + '\n' +
                               'Total: ' + total);
        }
        

        const summarize = summary => {
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