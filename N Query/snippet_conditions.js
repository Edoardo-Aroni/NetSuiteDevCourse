var firstCondition = myCreatedQuery.createCondition({
    fieldId:'type',
    operator: query.Operator.ANY_OF,
    values:['purchOrd']
});
var secondCondition = myCreatedQuery.createCondition({
    fieldId:'trandate',
    operator: query.Operator.WITHIN,
    values: [query.RelativeDataRange.THIS_FISCAL_YEAR.start,
             query.RelativeDataRange.THIS_FISCAL_YEAR.end]
});
var thirdCondition = myCreatedQuery.createCondition({
    fieldId: 'status',
    operator: query.Operator.CONTAINS_NOT,
    values:['G']
});

//Applying Conditions
//AND
myCreatedQuery.condition = myCreatedQuery.and(firstCondition, secondCondition, thirdCondition);
//OR
myCreatedQuery.condition = myCreatedQuery.or(firstCondition,secondCondition,thirdCondition);
//NOT
myCreatedQuery.condition = myCreatedQuery.not(firstCondition, secondCondition, thirdCondition)

//NESTED
myCreatedQuery.condition = myCreatedQuery.and(firstCondition,
myCreatedQuery.not(secondCondition,thirdCondition))

//RAW VALUES AND INTERNAL IDs

var firstCondition = myLoadedQuery.createCondition({
    fieldId:'category',
    operator: query.Operator.ANY_OF,
    values: [1, 2, 3]
});

// get the Raw Values and Internal IDs using query.FieldContex

requestAnimationFrame(['N/query'], 
    function(query){
        var myLoadedQuery = query.load({
            id: 'custworkbook_sdr_case'
        });

        myLoadedQuery.columns = [
            myCreatedQuery.createColumn({
                fieldId: 'category',
                context: query.FieldContext.RAW
            })
        ]
});

//Relative Date Object

// create a date object
var myDatesAgo = query.CreateRelativeDate({
    dateId: query.DateId.MONTHS_AGO,
    value: 2
});
var myCondition = myQuery.createCondition({
    fieldId: 'transdate',
    operator: query.Operator.WITHIN,
    values: myDatesAgo
});

//another method
var myComplexCondition = myQuery.createCondition({
    fieldId: 'trandate',
    operator: query.Operator.WITHIN,
    values: query.RelativeDateRange.PREVIOUS_ROLLING_YEAR
});





