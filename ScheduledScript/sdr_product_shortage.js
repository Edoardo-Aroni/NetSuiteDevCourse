/**
 * @NScriptType ScheduledScript
 * @NApiVersion 2.0
 */

define(['N/search'],
    /**
     * 
     * @param {search} search 
     * @returns 
     */
    function(search){
        function execute(script){

            var prodShortageSearchObj = search.create({
                type: 'customrecord_sdr_prod_pref',
                filters:
                [
                    search.createFilter({
                    name: 'custrecord_sdr_prod_pref_qty',
                    operator: search.Operator.GREATERTHAN,
                    values: 2
                    }),
                    search.createFilter({
                    name: 'subsidiary',
                    join: 'custrecord_sdr_prod_pref_customer',
                    operator: search.Operator.ANYOF,
                    values: 1
                    })
                ],
                // filters:
                // [
                //     ["custrecord_sdr_prod_pref_qty",search.Operator.GREATERTHAN,"2"], 
                //     "AND", 
                //     ["custrecord_sdr_prod_pref_customer.subsidiary","anyof","1"]
                //  ],
                columns: [
                    search.createColumn({
                        name:'custrecord_sdr_prod_pref_item',
                        label: 'Item'
                    }),
                    search.createColumn({
                        name:'custrecord_sdr_prod_pref_customer',
                        label: 'Customer'
                    }),
                    search.createColumn({
                        name:'email',
                        join:'custrecord_sdr_prod_pref_customer'
                    }),
                    search.createColumn({
                        name:'subsidiary',
                        join: 'custrecord_sdr_prod_pref_customer'
                    }),
                    search.createColumn({
                        name:'custrecord_sdr_prod_pref_qty',
                        label: 'Preferred Quantity'
                    }),
                    search.createColumn({
                        name:'quantityavailable',
                        join:'custrecord_sdr_prod_pref_item',
                        label: 'Available'
                    })

                ]
            });

            var searchResults = prodShortageSearchObj.run().getRange({
                start: 0,
                end: 9
            });

            for (var i=0; i< searchResults.length; i++){
                var item = searchResults[i].getText('custrecord_sdr_prod_pref_item');
                var customer = searchResults[i].getText('custrecord_sdr_prod_pref_customer');
                var email = searchResults[i].getValue({
                    name: 'email',
                    join: 'custrecord_sdr_prod_pref_customer'
                    });
                var subsidiary = searchResults[i].getText({
                        name: 'subsidiary',
                        join: 'custrecord_sdr_prod_pref_customer'
                        });
                var prefQuantity = searchResults[i].getValue('custrecord_sdr_prod_pref_qty');
                var available = searchResults[i].getValue({
                    name: 'quantityavailable',
                    join: 'custrecord_sdr_prod_pref_item'
                    });

                log.debug('Preferred Quantity', 'Item: ' + item + '\n' +
                                                'Customer: ' + customer + '\n' +
                                                'email: ' + email + '\n' +
                                                'Subsidiary: ' + subsidiary + '\n' +
                                                'Preferred Qty: ' + prefQuantity + '\n' +
                                                'Available: ' + available
                );
            }
        }
        return{
            execute:execute
        };
    
    }
);