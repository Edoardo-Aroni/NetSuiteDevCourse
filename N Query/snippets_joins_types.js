// autoJoin = Regular join  - Query.autojoin(options)

var myCreatedQuery = query.Create({
    type: query.Type.CUSTOMER
});

var salesRepJoin = myCreatedQuery.autoJoin({
    fieldId: 'salesrep'
});

myCreatedQuery.columns = [
    salesRepJoin.createColumn({
        fieldId:'id'
    })
];

// join to = polimorphic join - Query.joinTo(options)

var myCreatedQuery = query.create({
    type: query.Type.TRANSACTION
});

var createdByJoin = myCreatedQuery.joinTo({
    fieldId: 'createdby',
    target: 'employee'
});

myCreatedQuery.columns = [
    myCreatedByJoin.createColumn({
        fieldId: 'entityid'
    });
]

// join From  - Query.joinFrom(options)

var myCreatedQuery = query.create({
    type: query.Type.EMPLOYEE
});

var transactionJoin = myCreatedQuery.joinFrom({
    fieldId: 'entity',
    source: 'transaction'
});

myCreatedQuery.columns = [
    transactionJoin.createColumn({
        fieldId: 'daysoverduesearch'
    })
]