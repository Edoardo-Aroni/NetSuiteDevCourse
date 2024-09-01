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
        }
        return {
            getInputData: getInputData,
            map: map
        }
    }
);