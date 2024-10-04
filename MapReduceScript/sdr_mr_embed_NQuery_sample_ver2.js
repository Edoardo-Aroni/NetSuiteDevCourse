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
        // Parse the query result from the context if it's a string
        var queryResult = typeof context.value === 'string' ? JSON.parse(context.value) : context.value;

        // Write output with key-value pairs
        context.write({
            key: queryResult.values[0],  // Lead count as key (assuming first value is lead_count)
            value: queryResult
        });
    }

    function reduce(context) {
        // Write the first key-value pair to the output
        context.write({
            key: context.key,
            value: context.values[0]
        });
    }

    function summarize(summary) {
        let csvData = "Lead Count, Date\n";

        // Iterate over the output from the reduce phase
        summary.output.iterator().each(function (key, value) {
            try {
                // Check if value is an object or a string
                const mapData = typeof value === 'string' ? JSON.parse(value) : value;

                const leadCount = mapData.values[0]; // Assuming the first value is lead_count (INTEGER)
                const date = mapData.values[1]; // Assuming the second value is date (STRING)

                // Append the lead count and date to the CSV data
                csvData += `${leadCount}, ${date}\n`;
            } catch (e) {
                log.error({
                    title: 'Error Processing Summarize Data',
                    details: `Error processing key ${key}: ${e}`
                });
            }
            return true; // Continue iterating
        });

        // Prepare and create a CSV file
        var fileObj = file.create({
            name: 'lead_count_suiteql-ver2.csv',
            fileType: file.Type.CSV,
            contents: csvData,
            folder: 199
        });

        const fileId = fileObj.save();

        log.audit('File created', `File ID: ${fileId}`);
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});