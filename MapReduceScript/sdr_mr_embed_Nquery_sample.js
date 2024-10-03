/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/* BUSINESS SCOPE: 
generate a lead count report that contains the maximum lead count created 
last rolling year.
*/
define(['N/query','N/file'],

    function(query,file) {
       

        function getInputData() {
            //create a query with the customer record type
            var myCreatedQuery = query.Create({ type: query.Type.CUSTOMER});
            //filter the query results where stage is equal to lead and date 
            //created is within the last rolling year
            var firstCondition = myCreatedQuery.createCondition({
                fieldId:'searchStage',
                operator:query.Operator.ANY_OF,
                values:'Lead'
            });
            var secondCondition = myCreatedQuery.createCondition({
                fieldId:'dateCreated',
                operator:query.Operator.WITHIN,
                values:query.RelativeDateRange.LAST_ROLLING_YEAR  // 'LRY'
            });

            myCreatedQuery.condition = myCreatedQuery.and(firstCondition,secondCondition);

            //create columns Entity ID & date created (formated to Month DD, YYYY)
            // count and group by

            myCreatedQuery.columns = [
                myCreatedQuery.createColumn({
                    fieldId:'entityid',
                    aggregate:query.Aggregate.COUNT
                }),
                myCreatedQuery.createColumn({
                    type:query.ReturnType.STRING,
                    formula:`TO_CHAR({dateCreated},'Month DD,YYYY')`,
                    groupBy:true
                })
            ];
            // convert query to SuiteQL
            var myCreatedQuery = myCreatedQuery.toSuiteQL();
            // get the string representation of the SuiteQL object
            var suiteQLQuery = myCreatedQuery.query;
            // display the string representation
            log.debug({
                title: 'Query Statement',
                details: suiteQLQuery
            });
            //run the suiteQL
            var resultSuiteQL = query.runSuiteQL(myCreatedQuery);
            //get the array of the actual query results
            var results = resultSuiteQL.results;
            //log query length
            log.debug({
                title:'Query Length',
                display: results.length
            });
            // log actual values
            for(var i = 0; i < results.length; i++){
                log.debug({
                    title:'Query Values',
                    display: results[i].values
                });
            }
            return{
                type:'suiteql',
                query: suiteQLQuery
            };
        }
    

        function map(context) {
            //initialize an object and use JSON.parse to parse the value property 
            //from the entry point parameter. This converts the JSON string back 
            //to its native js object.
            var queryResult = JSON.parse(contex.value);
            /*
            write an output to create the key value pairs that will parse to the shuffle 
            stage and then the reduce stage. To accomplish this, set the key to entry points
            key property. And indicate the value parameter as an array object.
            Create a column name that corresponds to the query column.  
            Then extract the JSON object using the values property and identify 
            the column position to access each query value.
            */
           context.write({
            key: context.key,
            value: {
                LeadCount: queryResult.value[0],
                Date: queryResult.values[1]
            }
           });
        }
    
        function reduce(context) {
    
        }
    
    
        function summarize(summary) {
    
        }
    
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
        
    });