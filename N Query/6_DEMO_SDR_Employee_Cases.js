require(['N/query'],
    function(query){

        var myLoadedQuery = query.load({
            id: 'custworkbook_sdr_wb_employee_cases'
        });

        var mySuiteQLQuery = myLoadedQuery.toSuiteQL();

        var resultSet = mySuiteQLQuery.run();

        var results = resultSet.results;

        log.debug({
            title: 'Query Length',
            details: results.length
        });

        for(var i in results){
            log.debug({title: results[i].values});
        }
});