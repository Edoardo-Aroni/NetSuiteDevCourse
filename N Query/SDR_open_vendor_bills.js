require(['N/query'], 
    function(query){

        var myLoadedQuery = query.load({
            id:'custworkbook_sdr_wb_open_vendbills'
        });

        var myLoadedQuerySQL = myLoadedQuery.toSuiteQL();
        var SuiteQLQuery = myLoadedQuerySQL.query;

        log.debug({
            title:'SuiteQL query',
            details: SuiteQLQuery
        });



        var resultSet = myLoadedQuerySQL.run();

        var results = resultSet.results;

        log.debug({
            title:'Query Length: ',
            details: results.length
        });

        for (var i in results) {
            log.debug({title: results[i].values});
        }

});


