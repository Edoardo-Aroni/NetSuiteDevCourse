require(['N/query'], function(query){
    var custUnbilledQuery = `SELECT
                                customer.entityid, 
                                BUILTIN.DF(customer.defaultbillingaddress) AS billing_address,
                                ROUND(BUILTIN.CURRENCY_CONVERT(customer.balancesearch), 2) AS balance,
                                BUILTIN.CURRENCY_CONVERT(customer.unbilledorderssearch) AS unbilled_orders,
                                ROUND(((customer.creditlimit - customer.balancesearch) / NULLIF(customer.creditlimit, 0))*100, 2) AS available_credit_percentage
                             FROM
                                customer
                             JOIN
                                customersubsidiaryrelationship
                             ON
                                customer.id = customersubsidiaryrelationship.entity
                             WHERE
                                customer.salesrep = -5
                                AND customersubsidiaryrelationship.subsidiary = 1
                                AND customer.entitystatus = 13
                                AND customer.unbilledorderssearch > 0
                             ORDER BY
                                customer.entityid ASC`; 

    // var resultSet = query.runSuiteQL({
    //     query: custUnbilledQuery
    // });

    var resultSet = query.runSuiteQLPaged({
        query: custUnbilledQuery,
        pageSize: 10  //the default is 50
    }).iterator();

    resultSet.each(function(page){
        var pageIterator = page.value.data.iterator();
        
        log.debug({
            title: 'NEW PAGE MARKER'
        });
        pageIterator.each(function(row){

            log.debug({
                title: `ID: ${row.value.getValue(0)}
                        Address: ${row.value.getValue(1)}
                        Balance: ${row.value.getValue(2)}
                        Unbilled Order: ${row.value.getValue(3)}
                        % of Credit Remaining: ${row.value.getValue(4)}`
            });

            return true;
        });
        return true;
    });



    // var results = resultSet.results;

    // log.debug({
    //     title: 'Query Length: ',
    //     details: results.length
    // });

    // for (var i = 0; i < results.length; i++) {
    //     log.debug(results[i].values);
    //     // log.debug({
    //     //     title: 'Result ' + i,
    //     //     details: results[i].values
    //     // });
    // }
});
