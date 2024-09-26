require(['N/query'],
    function(query){
        var invcsale = `SELECT
                          (TO_CHAR(t.closedate, 'YYYY-MON')) AS cDate,
                          SUM(ROUND(BUILTIN.CURRENCY_CONVERT(t.foreigntotal),2)) AS invAmt ,
                          COUNT(BUILTIN.DF(cs.id)) AS custCount,
                          BUILTIN.DF(cs.salesrep) AS cusRep 
                        FROM
                          transaction AS t
                          INNER JOIN transactionline AS tl  ON
                          t.id = tl.transaction
                          INNER JOIN customer AS cs ON
                          tl.entity = cs.id
                        WHERE
                          t.type = 'CustInvc'
                          AND t.status LIKE '%B'
                          AND tl.mainline = 'T'
                        GROUP BY
		                  (TO_CHAR(t.closedate, 'YYYY-MON')),
                          BUILTIN.DF(cs.salesrep)
			            ORDER BY
		                  cusRep, 
			              cDate`;
     // execute query                     
    var resultSet = query.runSuiteQL({
      query: invcsale
    });

    var results = resultSet.results;

    log.debug({
        title: 'Query Length: ',
        details: results.length
    });

    for(var i=0; i<results.length; i++){
        log.debug(results[i].asMap());
    }
});