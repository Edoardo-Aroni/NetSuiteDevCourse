require(['N/search'], function(search) {
    var unpaidVendBills = search.create({
        type: search.Type.TRANSACTION,
        filters: [
            ['type', search.Operator.ANYOF, 'VendBill', 'VendCred'],
            'AND',
            ['mainline', search.Operator.IS, 'T'],
            'AND',
            ['status', search.Operator.ANYOF, 'VendBill:A', 'VendBill:D']
        ],
        columns: [
            search.createColumn({
                name: 'entityid',
                join: 'vendor',
                label: 'Vendor',
                sort: search.Sort.ASC
            }),
            search.createColumn({
                name: 'tranid',
                label: 'Bill ID'
            }),
            search.createColumn({
                name: 'amount',
                label: 'Amount'
            }),
           search.createColumn({ 
             name: 'formulanumeric',
             formula: 'TRUNC({today} - {trandate})',
             label: 'Days Unpaid'
             }),
            search.createColumn({
                name: 'formulatext',
                formula: `CASE WHEN TRUNC({today} - {trandate}) >= 60 
                                THEN 'High' 
                                WHEN TRUNC({today} - {trandate}) >= 30 
                                THEN 'Medium' 
                                ELSE 'Low' 
                           END`,
                label: 'Critical Level'
            })
        ]
    });

    // Get search results
    var searchResults = unpaidVendBills.run().getRange({
        start: 0,
        end: 150
    });

    for (var i = 0; i < searchResults.length; i++) {
        var vendor = searchResults[i].getValue({
            name: 'entityid',
            join: 'vendor'
        });
        var billId = searchResults[i].getValue('tranid');
        var amount = searchResults[i].getValue('amount');
        
        var daysUnpaid = searchResults[i].getValue({
            name: 'formulanumeric',
            label: 'Days Unpaid'
        });
        
        var criticalLevel = searchResults[i].getValue({
            name: 'formulatext',
            label: 'Critical Level'
        });

        log.debug('Unpaid Vendor Bills', 'Vendor: ' + vendor + '\n' +
                                         'Bill ID: ' + billId + '\n' +
                                         'Amount: ' + amount + '\n' +
                                         'Days Unpaid: ' + daysUnpaid + '\n' +
                                         'Critical Level: ' + criticalLevel);
    }
});
