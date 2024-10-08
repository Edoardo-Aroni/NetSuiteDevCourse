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
        // join to Product
        const productJoin = transactionLineJoin.autoJoin({fieldId:'custcol_cseg_eii_product_id'});
        // join to Department = Functional Activity
        const departmentJoin = transactionLineJoin.autoJoin({fieldId:'department'});
        // join to Location
        const locationJoin = transactionLineJoin.autoJoin({fieldId:'location'});

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
        //posting is within this period - Oct 2024
        const twoCondition = sweepQuery.createCondition({
            fieldId: 'postingperiod',
            operator: query.Operator.ANY_OF,
            values: [443]
        });
        //subsidiary is 21 = EMT
        const threeCondition = transactionLineJoin.createCondition({
            fieldId: 'subsidiary',
            operator: query.Operator.ANY_OF,
            values:[21]
        });
        //class is MBC = 258
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
        
       // COLUMNS
       sweepQuery.columns = [
        sweepQuery.createColumn({fieldId:'postingperiod.enddate'}),                             //trans_date
        subsidiaryJoin.createColumn({fieldId:'currency', context: query.FieldContext.DISPLAY}), //currency
        accountJoin.createColumn({fieldId:'acctnumber'}),                                       //account
        transactionAccountingLineJoin.createColumn({fieldId:'debit'}),                          //debit
        transactionAccountingLineJoin.createColumn({fieldId:'credit'}),                         //credit
        classJoin.createColumn({fieldId:'externalid'}),                                         //class
        productJoin.createColumn({fieldId:'externalid'}),                                       //product_id
        departmentJoin.createColumn({fieldId:'externalid'}),                                    //functional_activity
        locationJoin.createColumn({fieldId:'externalid'}),                                      //location_code
        transactionLineJoin.createColumn({fieldId:'custcol_eii_jnl_country', context:query.FieldContext.DISPLAY}) // country                                  //country
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