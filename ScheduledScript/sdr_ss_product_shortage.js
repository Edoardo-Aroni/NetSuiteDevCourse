/**
 * @NScriptType ScheduledScript
 * @NApiVersion 2.0
 */

define(['n/search'], 
/**
 * 
 * @param {search} search 
 * @returns 
 */
    function(search){
        function execute(script){

            var shortageProductSearch = search.load({
                id:'customsearch_sdr_prod_shortage'
            });

            var searchResults = shortageProductSearch.run().getRange({
                start: 0,
                end: 9
            });

        }
        return{
            execute: execute
        };
    }
);