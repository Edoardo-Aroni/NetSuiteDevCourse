require(['N/query'],
    function(query){
        var invcsale = `SELECT
                          transaction.closedate,
                          transaction.foreigntotal
                        FROM
                          transaction,
                          transactionline
                        WHERE
                          transaction.id = transactionline.transaction
                          AND transaction.type = 'CustInvc'
                          AND transaction.status = 'CustInvc:B'
                          AND transaction.closedate BETWEEN '01/01/2024' AND '31/03/2024'
                          AND transactionline.mainline IS true`;
        

})