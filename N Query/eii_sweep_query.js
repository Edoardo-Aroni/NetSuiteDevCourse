require(['N/query'], 
    
    (query) =>{

        const sweepQuery = query.create({
            type: query.Type.TRANSACTION
        });
        /* 
        CONDITIONS: 

        POSTING IS TRUE
        POSTING PERIOD IS THIS PERIOD
        AMOUNT NOT EQUAL TO 0
        ACCOUNT INCLUDE IN SWEEP IS TRUE
        CLASS IS....
        SUBSIDIARY IS....
        */

        /*
        COLUMNS:

        TRANS_DATE
        JOURNAL_CURRENCY
        NS_ACCOUNT_CODE
        DEBIT
        CREDIT
        JNL_LINE_DESC
        JNL_HEADER_MEMO
        CLASS
        PRODUCT_ID
        FUNCTIONAL_ACTIVITY
        LOCATION
        COUNTRY
        */

        //
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