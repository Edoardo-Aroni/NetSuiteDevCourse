require(['N/query'],
    function(query){
        var invcsale = `SELECT
                          transaction.closedate AS 'date closed',
                          transaction.foreigntotal AS 'fc total amount' ,
                          BUILTIN.DF(customer.id) AS 'customer name',
                          BUILTIN.DF(customer.salesrep) AS 'sales rep'
                        FROM
                          transaction
                          INNER JOIN transactionline ON
                          transaction.id = transactionline.transaction
                          INNER JOIN customer ON
                          transactionLine.entity = customer.id
                        WHERE
                          transaction.type = 'CustInvc'
                          AND transaction.status = 'CustInvc:B'
                          AND transaction.closedate BETWEEN '01/01/2024' AND '31/03/2024'
                          AND transactionline.mainline = 'T'
                          AND customer.salesrep = -5`;
     // execute query                     
     var resultSet = query.runSuiteQL({
      query: invcsale
     });
     // fetch query results
     var results = resultSet.results;
     // display results length
     log.debug({
      title:'Query Length: ',
      details: results.length
     });
     //iterate through the results
     for(var i=0; i<results.length; i++){
      log.debug(results[i].values);
     }

});