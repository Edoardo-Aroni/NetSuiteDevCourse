request(['N/query'],
    function(query){

        myCreatedQuery = query.create({
            type: query.Type.CUSTOMER
        });

        myFirstCondition = myCreatedQuery.createCondition({
            fieldId:'searchStage',
            operator: query.Operator.ANY_OF,
            values:'Prospect'
        });

        myCreatedQuery.condition = myFirstCondition;


        myCreatedQuery.columns = [

            myCreatedQuery.createColumn({
                fieldId:'entityId'
            }),

            myCreatedQuery.createColumn({
                fieldId:'salesRep',
                context: query.FieldContext.DISPLAY
            }),

            myCreatedQuery.createColumn({
                fieldId:'leadSource',
                context: query.FieldContext.DISPLAY
            }),

            myCreatedQuery.createColumn({
                fieldId:'email'
            }),

            myCreatedQuery.createColumn({
                fieldId:'phone'
            })
        ];

        var resultSet = myCreatedQuery.run();

        var results = resultSet.results;

        log.debug({
            title:'Query Length',
            details: results.length
        });

        for(var i=0; i < results.length; i++){
            log.debug({
                title: results[i].values
            });
        }
    
    
});