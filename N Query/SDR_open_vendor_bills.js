require(['N/query'], 
    function(query){

        var myLoadedQuery = query.load({
            id:'custworkbook_sdr_wb_open_vendbills'
        });

        var myLoadedQuerySQL = myLoadedQuery.SuiteQL;

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