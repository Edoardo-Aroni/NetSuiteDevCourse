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
            var status = searchResult.values.statusref.text;
            var amount = searchResults.values.amountpaid;

            context.write({
                key: customer,
                value: status && amount
            });

        }
        function reduce(context){

        }
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce
        }
    }
);