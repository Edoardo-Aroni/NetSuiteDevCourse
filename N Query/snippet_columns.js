//Field Context - Converted
myCreatedQuery.createColumn({
    fieldId: 'balancesearch',
    context: {
        name: myCreatedQuery.FieldContext.CONVERTED,
        params: {
            currencyId: 1,
            date: query.RelativeDataRange.LAST_FISCAL_QUARTER
        }
    }
})

//Field Context - Hierarchy
salesRepJoin.createColumn({
    fieldId: 'subsidiary',
    context: query.FieldContext.HIERARCHY
})

//Field Context - Hierarchy Identifier
salesRepJoin.createColumn({
    fieldId: 'subsidiary',
    context: query.FieldContext.HIERARCHY_IDENTIFIER
})

//Field Context - Display
salesRepJoin.createColumn({
    fieldId: 'salesrep',
    context: query.FieldContext.DISPLAY
})

//Field Context - Raw
salesRepJoin.createColumn({
    fieldId: 'salesrep',
    context: query.FieldContext.RAW
})

// Aggregate - AVERAGE
myCreatedQuery.columns = [
    myCreatedQuery.createColumn({
        fieldId:'balancesearch',
        aggregate: query.Aggregate.AVERAGE //return the average value of every customer balance    
    })
];

// Aggregate - COUNT_DISTINCT
myCreatedQuery.createColumn({
    fieldId: 'currency',
    aggregate: query.Aggregate.COUNT_DISTINCT
})

//Aggregate - MAXIMUM and MINIMUM
myCreatedQuery.createColumn({
    fieldId:'unbilledordersearch',
    aggregate: query.Aggregate.MAXIMUM
}),
myCreatedQuery.createColumn({
    fieldId:'unbilledordersearch',
    aggregate: query.Aggregate.MINIMUM
})

//Aggregate - SUM
myCreatedQuery.createColumn({
    fieldId:'unbilledordersearch',
    aggregate: query.Aggregate.SUM
})

//Aggregate - MEDIAN
myCreatedQuery.createColumn({
    fieldId:'id',
    aggregate: query.Aggregate.MEDIAN
})




