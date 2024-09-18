require (['N/query'], 
    
    function(query){

        var wbOpenBills = query.load({
            id:'custworkbook_sdr_wb_open_vendbills'
        });

        var resultSet = wbOpenBills.run();

        var results = resultSet.results;

        log.debug({
            title: 'Query Lenght',
            details: results.length
        });

        for (var i=0; i < results.length; i++){
            log.debug({
                title: results[i].values
            });
        }


});

