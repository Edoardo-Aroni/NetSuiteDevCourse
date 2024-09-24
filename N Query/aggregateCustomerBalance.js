require(['N/query'],
    function(query){

        var myCreatedQuery = query.create({
            type: query.Type.CUSTOMER
        });

        var firstCondition = myCreatedQuery.createCondition({
            fieldId:'dateCreated',
            operator: query.Operator.WITHIN,
            values:query.RelativeDateRange.LAST_ROLLING_YEAR
        });

        var secondCondition = myCreatedQuery.createCondition({
            fieldId:'currency',
            operator: query.Operator.ANY_OF,
            values:['4']
        });

        myCreatedQuery.condition = myCreatedQuery.and(firstCondition,secondCondition);

        myCreatedQuery.columns = [
            myCreatedQuery.createColumn({
                fieldId:'salesRep',
                groupBy: true,
                context: query.FieldContext.DISPLAY,
                alias:'Sales Rep'
            }),
            myCreatedQuery.createColumn({
                fieldId:'balanceSearch',
                aggregate: query.Aggregate.AVERAGE,
                alias:'AVG Customer Balance'
            }),
            myCreatedQuery.createColumn({
                fieldId:'balanceSearch',
                aggregate: query.Aggregate.SUM,
                alias:'SUM Customer Balance'
            })
        ];

        var resultSet = myCreatedQuery.run();

        var results = resultSet.results;

        log.debug({
            title:'Query Length',
            details: results.length
        });

        for(var i in results){
            log.debug({
                title:results[i].asMap()
            });
        }

    });