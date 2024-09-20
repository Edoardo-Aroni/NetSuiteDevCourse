require(['N/query'],
    function(query){

        var myCreatedQuery = query.create({
            type: query.Type.SYSTEM_NOTE //  or  type: 'systemnote'
        });

        var firstCondition = myCreatedQuery.createCondition({
            fieldId: 'recordTypeId',
            operator: query.Operator.EMPTY_NOT // or operator 'EMPTY_NOT'
        });

        myCreatedQuery.condition = firstCondition;

        myCreatedQuery.columns = [
            myCreatedQuery.createColumn({
                fieldId: 'record'
            }),
            myCreatedQuery.createColumn({
                fieldId: 'recordTypeId',
                context: query.FieldContext.DISPLAY
            }),
            myCreatedQuery.createColumn({
                fieldId: 'field',
                context: query.FieldContext.DISPLAY
            }),
            myCreatedQuery.createColumn({
                fieldId: 'type'
            }),
            myCreatedQuery.createColumn({
                fieldId: 'oldValue'
            }),
            myCreatedQuery.createColumn({
                fieldId: 'newValue'
            })
        ];

        var resultSet = myCreatedQuery.run();

        var results = resultSet.results;

        log.debug({
            title:'Query Length',
            details:results.length
        });
        
        for(var i=0; i<results.length; i++){
            log.debug({
                title: results[i].values
            });
        }
});