/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/* BUSINESS SCOPE: 
generate a lead count report that contains the maximum lead count created 
last rolling year.
*/
define(['N/query', 'N/file'], function(query, file) {
    function getInputData() {
        //create a query with the customer record type
        var myCreatedQuery = query.create({ type: query.Type.CUSTOMER });
        //filter the query results where stage is equal to lead and date 
        //created is within the last rolling year
        var firstCondition = myCreatedQuery.createCondition({
            fieldId: 'searchStage',
            operator: query.Operator.ANY_OF,
            values: 'Lead'
        });
        var secondCondition = myCreatedQuery.createCondition({
            fieldId: 'datecreated',
            operator: query.Operator.WITHIN,
            values: query.RelativeDateRange.LAST_ROLLING_YEAR // 'LRY'
        });

        myCreatedQuery.condition = myCreatedQuery.and(firstCondition, secondCondition);

        //create columns Entity ID & date created (formatted to Month DD, YYYY) - count and group by
        myCreatedQuery.columns = [
            myCreatedQuery.createColumn({
                fieldId: 'entityid',
                aggregate: query.Aggregate.COUNT
            }),
            myCreatedQuery.createColumn({
                type: query.ReturnType.STRING,
                formula: `TO_CHAR({datecreated},'Month DD, YYYY')`,
                groupBy: true
            })
        ];

        // convert query to SuiteQL
        var mySuiteQLQuery = myCreatedQuery.toSuiteQL();
        // get the string representation of the SuiteQL object
        var suiteQLQuery = mySuiteQLQuery.query;

        // display the string representation
        log.debug({
            title: 'Query Statement',
            details: suiteQLQuery
        });

        //run the suiteQL
        var resultSuiteQL = query.runSuiteQL(mySuiteQLQuery);
        //get the array of the actual query results
        var results = resultSuiteQL.results;

        //log query length
        log.debug({
            title: 'Query Length',
            details: results.length
        });

        // log actual values
        for (var i = 0; i < results.length; i++) {
            log.debug({
                title: 'Query Values',
                details: results[i].values
            });
        }

        return {
            type: 'suiteql',
            query: suiteQLQuery
        };
    }

    function map(context) {
        //initialize an object and parse the value property 
        var queryResult = JSON.parse(context.value);
        
        //write output to create key-value pairs
        context.write({
            key: context.key,
            value: {
                LeadCount: queryResult.values[0],
                Date: queryResult.values[1]
            }
        });
    }

    function reduce(context) {
        // evaluate each key value pair 
        context.write(context.key, context.values[0]);
    }

    function summarize(summary) {
        var keys = '';
        var queryValues = '';
        var len = 0;

        // prepare a CSV file
        var fileObj = file.create({
            name: 'lead_count_suiteql.csv',
            fileType: file.Type.CSV,
            contents: 'Lead Count This Fiscal Year\n'
        });

        // use an iterator to gather the key-value pairs
        summary.output.iterator().each(function(key, value) {
            keys += (key + ' ');

            // Concatenate the key and value from the reduce stage
            queryValues += (value + '\n').replace('{', '').replace('}', '').replace('"', '');

            // Append values to CSV
            fileObj.appendLine({
                value: (value + '\n').replace('{', '').replace('}', '').replace('"', '')
            });
            len++;

            return true;
        });

        // Log the summary details
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

        // Set folder internal ID and save file
        fileObj.folder = 199;
        var fileId = fileObj.save();
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
