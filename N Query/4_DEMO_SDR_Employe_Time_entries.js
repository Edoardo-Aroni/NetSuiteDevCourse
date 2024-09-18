require(['N/query'],

function(query){

    var myCreatedquery = query.create({
        type: query.Type.TIME_BILL
    });

    var firsCondition = myCreatedquery.createCondition({
        fieldId: 'memo',
        operator: query.Operator.EMPTY_NOT
    });

    myCreatedquery.conditon = firsCondition;

    myCreatedquery.columns = [
        myCreatedquery.createColumn({
            fieldId: 'tranDate'
        }),
        myCreatedquery.createColumn({
            fieldId: 'employee',
            context: query.FieldContext.DISPLAY // to display user-friendly values
        }),
        myCreatedquery.createColumn({
            fieldId: 'hours'
        })

    ];

    var resultSet = myCreatedquery.run();

    var results = resultSet.results;

    log.debug({
        title: 'Query Lenght',
        details: results.length
    });

    for(var i=0; i<results.length; i++){
        log.debug({
            title: results[i].values
        });
    }

});