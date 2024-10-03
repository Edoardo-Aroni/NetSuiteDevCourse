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
            // evaluate each key value pair 
            context.write(context.key,context.values[0]);
        }
    
        function summarize(summary) {
            //create separate variables for key value and query length
            function summarize(summarize){
                var keys = '';
                var queryValues = '';
                var len = 0;
            }
            /* 
            prepare a CSV file to append the query values in the summary stage. 
            create a CSV file using the N/file module. Initialize a file object 
            and use the file.create method.
            Concatenate a new line character at the end of the initial content.
            */
            var fileObj = file.create({
                name: 'lead_count_suiteql.csv',
                fileType: 'CSV',
                contents:'Lead Count This Fiscal Year ' +'\n'
            });
            /*
            use an iterator to gather the key value pairs that the reduce stage sends.
            */
        context.output.iterator().each(function(key, value){
                keys += (key + ' ');
            
            /* 
            Concatenate the key saved from the reduce stage to one of the created string 
            variables and include the value from the reduce stage to one of the created 
            string variables.

            */
           queryValues += (value + '\n').replace('{','').replace('}', '').replace('"','');
           /*
            On the value parameter, concatenate the value from the reduce stage and use 
            the JavaScript replace method to remove unnecessary characters. 
            Increment the variable length on each iteration. 
            Use the file.append line method to insert the query values into the file.
            */
           fileObj.appendLine({
            value: (value + '\n').replace('{','').replace('}', '').replace('"','')
           });
           len++

           return true;
        });
        //Use logging statements to view the key value and query length in the 
        //execution log.
        log.audit({
            title: 'Keys',
            details: keys
        });
        log.audit({
            title: 'Values',
            details: queryValues
        });
        log.audit({
            title: 'Length',
            details: len
        });

        //use the file.folder property and set this to the folder internal ID
        fileObj.folder = '';
        //use the file.save method to upload the generated file into the new folder. 
        //This also saves an updated file whenever the script is deployed again.
        var fileId = fileObj.save();
    
    }
    
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
        
    });