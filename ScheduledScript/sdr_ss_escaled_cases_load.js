/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search'], 
    /**
     * 
     * @param {search} search 
     * @returns 
     */
    function(search){
        function execute(script){
            var caseSearch = search.load({
                id: 'customsearch_sdr_escalated_searches'
            });
            var searchResults = caseSearch.run().getRange({
                start: 0,
                end: 9
            });
        }
        return {
            execute: execute
        };
    });