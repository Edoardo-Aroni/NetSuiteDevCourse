require(['N/query'], function(query) {
    // = FROM customer
    var myCreatedQuery = query.create({
        type: query.Type.CUSTOMER
    });
    
    // = SELECT customer.entityid and customer.email
    myCreatedQuery.columns = [
        myCreatedQuery.createColumn({ fieldId: 'entityid' }),
        myCreatedQuery.createColumn({ fieldId: 'email' })
    ];
    
   
    // = WHERE customer.unbilledorderssearch > 0
    myCreatedQuery.condition = myCreatedQuery.createCondition({
        fieldId: 'unbilledorderssearch',
        operator: query.Operator.GREATER,
        values: 0
    });

    // Run query and get results
    var resultSet = myCreatedQuery.run();
    var results = resultSet.results;

    log.debug({
        title: 'Query Length:',
        details: results.length
    });

    // Iterate over the results and log each customer's details
    // for (var i = 0; i < results.length; i++) {
    //     log.debug({
    //         title: 'Customer',
    //         details: results[i].values
    //     });
    // }

    for (var i in results){
        log.debug({title: results[i].values});
    }
});



// SELECT customer.entityid, customer.email FROM customer WHERE customer.unbilledorderssearch > 0