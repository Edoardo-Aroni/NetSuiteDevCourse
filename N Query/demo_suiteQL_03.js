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

    log.debug({
        title: 'Query Length:',
        details: results.length
    });

    // Iterate over results and log each customer entityid and email
    for (var i = 0; i < results.length; i++) {
        log.debug({
            title: 'Customer',
            details: 'Entity ID: ' + results[i].entityid + ', Email: ' + results[i].email
        });
    }
});
