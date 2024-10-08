require(['N/query'], 
    
    (query) =>{

        const sweepQuery = query.create({
            type: query.Type.TRANSACTION
        });
        //JOINS
        // join to Transaction Line
        const transactionLineJoin = sweepQuery.autoJoin({fieldId:'transactionlines'});
        // join to Subsidiary
        const subsidiaryJoin = transactionLineJoin.autoJoin({fieldId:'subsidiary'});
        // join to Class
        const classJoin = transactionLineJoin.autoJoin({fieldId:'class'});
        // join to Transaction Audit Line
        const transactionAccountingLineJoin = transactionLineJoin.autoJoin({fieldId:'accountingimpact'});
        // join to Account
        const accountJoin = transactionAccountingLineJoin.autoJoin({fieldId:'account'});
        // CONDITIONS
        //posting is true
        const oneCondition = sweepQuery.createCondition({
            fieldId: 'posting',
            operator: query.Operator.IS,
            values: true
        });
        //posting is within this period
        const twoCondition = sweepQuery.createCondition({
            fieldId: 'postingperiod',
            operator: query.Operator.ANY_OF,
            values: [443]
        });
        //subsidiary is 21
        const threeCondition = transactionLineJoin.createCondition({
            fieldId: 'subsidiary',
            operator: query.Operator.ANY_OF,
            values:[21]
        });
        //class is
        const fourCondition = transactionLineJoin.createCondition({
            fieldId: 'class',
            operator: query.Operator.ANY_OF,
            values:[258]
        });
        //amount is not equal 0
        const fiveCondition = transactionAccountingLineJoin.createCondition({
            fieldId: 'amount',
            operator: query.Operator.EQUAL_NOT,
            values: 0
        });
        //account include in sweep is true
        const sixCondition = accountJoin.createCondition({
            fieldId:'custrecord_eii_include_sweep',
            operator:query.Operator.IS,
            values: true
        });
        // Combine conditions into the query
        sweepQuery.condition = sweepQuery.and(
            oneCondition,
            twoCondition,
            threeCondition,
            fourCondition,
            fiveCondition,
            sixCondition
        );
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
       // COLUMNS
       sweepQuery.columns = [
        sweepQuery.createColumn({fieldId: 'postingperiod.enddate', alias:'trans_date'}),
        subsidiaryJoin.createColumn({fieldId: 'currency', context: query.FieldContext.DISPLAY}),
        accountJoin.createColumn({fieldId: 'acctnumber'}),
        transactionAccountingLineJoin.createColumn({fieldId:'debit'}),
        transactionAccountingLineJoin.createColumn({fieldId:'credit'}),
        classJoin.createColumn({fieldId: 'externalid'})
       ];


        var resultSet = sweepQuery.run();

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