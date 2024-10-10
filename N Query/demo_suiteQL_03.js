require(['N/query'], function(query) {
    // Define SuiteQL query string
    var unbilledorders = `SELECT
                              customer.entityid,
                              customer.email
                          FROM
                              customer
                          WHERE
                              customer.unbilledorderssearch > 0`;

    // Run SuiteQL query
    var resultSet = query.runSuiteQL({
        query: unbilledorders
    });

    // Fetch results as mapped results (converts rows to key-value objects)
    var results = resultSet.asMappedResults();

//     log.debug({
//         title: 'Query Length:',
//         details: results.length
//     });

//     // Iterate over results and log each customer entityid and email
//     for (var i = 0; i < results.length; i++) {
//         log.debug({
//             title: 'Customer',
//             //details: 'Entity ID: ' + results[i].entityid + ', Email: ' + results[i].emai
//             details: `Entity ID: ${results[i].entityid}, Email: ${results[i].email}`
//         });
//     }
// });


log.debug('All Results', results); // Log all results

const validEmails = ['ret@esdf.com','info@fabreart.com','bwest@brownsystems.com'];

    // Apply post-query filtering: Filter only customers with a non-null, non-empty email
    var filteredResults = results.filter(function(customer) {
        //return customer.email && customer.email.trim() !== ''; // Check if email exists and is not empty
        //return customer.email && customer.email.toLowerCase() === 'bwest@brownsystems.com'.toLowerCase();
        return customer.email && validEmails.includes(customer.email); // Check if email is in the validEmails array

    });

    // Log the filtered results
    log.debug('Filtered Results', filteredResults);

    return filteredResults; // Return filtered results
});


