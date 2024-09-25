require(['N/query'],
    function(query){
        var unbilledorders = `SELECT
                              customer.entityid,
                              customer.email
                              FROM
                              customer
                              WHERE
                              customer.unbilledorderssearch > 0`;

    var resultSet = query.runSuiteQL({
        query: unbilledorders
    });

    var results = resultSet.results;

    log.debug({
        title: 'Query Length:',
        details: results.length
    });

    for (var i in results){
        log.debug({title: results[i].values});
    }
});