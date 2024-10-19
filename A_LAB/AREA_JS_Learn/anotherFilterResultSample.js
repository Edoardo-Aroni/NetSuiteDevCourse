define(['N/query', 'N/log'], function(query, log) {
    function runQueryAndApplyEmailFilter() {
        // Step 1: Create and run a query on 'customer' record type
        var myQuery = query.create({
            type: query.Type.CUSTOMER
        });

        // Define the columns to retrieve from the query
        myQuery.columns = [
            myQuery.createColumn({ fieldId: 'internalid' }),
            myQuery.createColumn({ fieldId: 'companyname' }),
            myQuery.createColumn({ fieldId: 'email' })
        ];

        // Step 2: Run the query and collect results in an array
        var resultSet = myQuery.run();
        var results = [];
        var resultsIterator = resultSet.iterator();

        resultsIterator.each(function(result) {
            // Collect each result
            var customer = {
                internalId: result.getValue({ name: 'internalid' }),
                companyName: result.getValue({ name: 'companyname' }),
                email: result.getValue({ name: 'email' })
            };
            results.push(customer); // Add result to array
            return true; // Continue iteration
        });

        log.debug('All Results', results); // Log all unfiltered results

        // Step 3: Apply a post-query filter to filter out only customers with a specific email domain
        var filteredResults = results.filter(function(customer) {
            // Custom filter logic: check if the email contains '@example.com'
            return customer.email && customer.email.includes('@example.com');
        });

        // Log the filtered results
        log.debug('Filtered Results', filteredResults);

        return filteredResults;
    }

    return {
        runQueryAndApplyEmailFilter: runQueryAndApplyEmailFilter
    };
});

