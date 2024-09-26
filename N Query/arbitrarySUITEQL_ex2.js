require(['N/query'],
    function(query){
        var invcsale = `SELECT
                          (TO_CHAR(transaction.closedate, 'YYYY-MON-DD')) AS date_closed,
                          ROUND(BUILTIN.CURRENCY_CONVERT(transaction.foreigntotal),2) AS fc_total_amount ,
                          BUILTIN.DF(customer.id) AS customer_name,
                          BUILTIN.DF(customer.salesrep) AS sales_rep,
                          (TO_CHAR(transaction.closedate-transaction.trandate) || ' Days') AS invoice_days_open
                        FROM
                          transaction
                          INNER JOIN transactionline ON
                          transaction.id = transactionline.transaction
                          INNER JOIN customer ON
                          transactionLine.entity = customer.id
                        WHERE
                          transaction.type = 'CustInvc'
                          AND transaction.status LIKE '%B'
                          AND transaction.closedate BETWEEN '01/01/2024' AND '31/03/2024'
                          AND transactionline.mainline = 'T'
                          AND customer.salesrep = -5
                        ORDER BY
                        transaction.closedate DESC`;
     // execute query                     
     var resultSet = query.runSuiteQLPaged({
      query: invcsale,
      pageSize: 20
    }).iterator();

    resultSet.each(function(page){
        var pageIterator = page.value.data.iterator();
        
        log.debug({
            title: 'NEW PAGE MARKER'
        });
        pageIterator.each(function(row){

            log.debug({
                title: 'Invoice Details:        ',
                details: `Date Closed: ${row.value.getValue(0)}
                          FC Total Amount: ${row.value.getValue(1)}
                          Customer Name: ${row.value.getValue(2)}
                          Sales Rep: ${row.value.getValue(3)}
                          Invoice Days Open: ${row.value.getValue(4)}`
            });

            return true;
        });
        return true;
    });
});