/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/*
Business Scope: generate a CSV file that contains a list of all pending
orders to track items to be shipped and order status.
*/
define(['N/query','N/file'],

    (query,file) => {
       

        const getInputData = () => {

            const myQuery = query.create({
                type:query.Type.TRANSACTION
            });

            const firstCondition = myQuery.createCondition({
                fieldId:'type',
                operator: query.Operator.ANY_OF,
                values:'SalesOrd'
            });
            const secondCondition = myQuery.createCondition({
                fieldId:'status',
                operator: query.Operator.ANY_OF,
                values:'SalesOrd:H'
            });
            const thirdCondition = myQuery.createCondition({
                fieldId:'ordPicked',
                operator: query.Operator.IS,
                values:false
            });

            myQuery.condition = myQuery.and(firstConditon, secondCondition, thirdCondition);

            myQuery.columns = [
                myQuery.createColumn({
                    fieldId:'tranId'
                }),
                myQuery.createColumn({
                    fieldId:'tranDisplayName'
                }),
                myQuery.createColumn({
                    fieldId:'tranDate'
                }),
                myQuery.createColumn({
                    fieldId:'foreignTotal'
                }),
                myQuery.createColumn({
                    fieldId:'entity',
                    context: query.FieldContext.DISPLAY
                }),
                myQuery.createColumn({
                    fieldId:'status',
                    context: query.FieldContext.DISPLAY
                }),
                myQuery.createColumn({
                    fieldId:'ordPicked'
                }),
                myQuery.createColumn({
                    fieldId:'shippingAddress'
                })
            ];

            const resultSet = myQuery.run(); 

            const results = resultSet.results;

            log.debug({
                title:'Query Length',
                details: results.length
            });

            for (var i = 0; i < results.length; i++) {
                log.debug({
                    title: 'Query Results',
                    details: results[i].values
                });
            }

            return myQuery;

        }
    
  
        const map = (context) => {

            const queryResult = JSON.parse(context.value);

            //write output to create key-value pairs
            context.write({
                key: context.key,
                value: {
                    DocumentNumber: queryResult.values[0],
                    Transaction: queryResult.values[1],
                    Transaction: queryResult.values[1],

                }
            });


    
        }
    
        /**
         * Executes when the reduce entry point is triggered and applies to each group.
         *
         * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
         * @since 2015.1
         */
        function reduce(context) {
    
        }
    
    
        /**
         * Executes when the summarize entry point is triggered and applies to the result set.
         *
         * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
         * @since 2015.1
         */
        function summarize(summary) {
    
        }
    
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
        
    });