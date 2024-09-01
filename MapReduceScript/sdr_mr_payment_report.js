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
            var paymtSearch = search.load({
                id: 'customsearch_sdr_payments'
            });
            return paymtSearch;
        }

        function map(context){

        }
        return {
            getInputData: getInputData,
            map: map
        }
    }
);