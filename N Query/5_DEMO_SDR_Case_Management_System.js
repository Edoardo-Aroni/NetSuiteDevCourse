require(['N/query'],
    function(query) {
        var myLoadedQuery = query.load({
            id: 'custworkbook_sdr_wb_employee_cases'
        });

        var customerJoin = myLoadedQuery.joinTo({
            fieldId: 'company',
            target: 'Customer'
        });

        var contactJoin = customerJoin.autoJoin({
            fieldId: 'contactList'
        });

        var firstCondition = myLoadedQuery.createCondition({
            fieldId: 'category',
            operator: query.Operator.ANY_OF,
            values: [1, 2, 3]
        });

        var secondCondition = myLoadedQuery.createCondition({
            fieldId: 'timeElapsed',
            operator: query.Operator.GREATER,
            values: 0
        });

        var thirdCondition = contactJoin.createCondition({
            fieldId: 'phone',
            operator: query.Operator.EMPTY_NOT
        });

        myLoadedQuery.condition = myLoadedQuery.and(firstCondition, secondCondition, thirdCondition);

        myLoadedQuery.columns = [
            myLoadedQuery.createColumn({
                fieldId: 'caseNumber',
                alias: 'Case Number'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'startDate',
                alias: 'Incident Date'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'title',
                alias: 'Subject'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'status',
                context: query.FieldContext.DISPLAY,
                alias: 'Status'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'assigned',
                context: query.FieldContext.DISPLAY,
                alias: 'Assigned'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'company',
                context: query.FieldContext.DISPLAY,
                alias: 'Company'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'escalateTo',
                context: query.FieldContext.DISPLAY,
                alias: 'Escalated To'
            }),
            myLoadedQuery.createColumn({
                fieldId: 'lastCustomerMessageReceived',
                alias: 'Last Message Received'
            }),
            contactJoin.createColumn({
                fieldId: 'phone',
                alias: 'Customer Contact'
            }),
            myLoadedQuery.createColumn({
                type: query.ReturnType.STRING,
                formula: `CONCAT('Days: ', TO_CHAR(FLOOR({timeElapsed}/24)),
                                 '| hours: ', 
                                 TO_CHAR(MOD(TO_NUMBER({timeElapsed}),24)) )`,
                alias: 'Days | Hours'
            }),
            myLoadedQuery.createColumn({
                type: query.ReturnType.STRING,
                formula: `CASE
                          WHEN ({timeElapsed}/24)*20 > 0
                          THEN TO_CHAR(({timeElapsed}/24)*20, '99,999,999.99')
                          ELSE '0.00'
                          END`,
                alias: 'Billable Amount'
            })
        ];

        myLoadedQuery.sort = [
            myLoadedQuery.createSort({
                column: myLoadedQuery.columns[0],
                ascending:false,
                caseSensitive:true,
                locale:query.SortLocale.EN_CA,
                nullsLast:true
            })
        ];

        var resultSet = myLoadedQuery.run();
        var results = resultSet.results;


        log.debug({
            title: 'Query Length',
            details: results.length
        });

        for(var i=0; i<results.length; i++){
            //var mResult = results[i].values;
            var mResult = results[i].asMap();

            log.debug({title: mResult});
        }    
});