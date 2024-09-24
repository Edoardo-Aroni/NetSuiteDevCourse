require(['N/query'],
    
    function(query){

        var myCreatedquery = query.create({
            type: query.Type.SUPPORT_CASE
        });

        myCreatedquery.columns = [
            myCreatedquery.createColumn({
                fieldId: 'assigned',
                context: query.FieldContext.DISPLAY
            }),
            myCreatedquery.createColumn({
                fieldId: 'company',
                context: query.FieldContext.DISPLAY
            }),
            myCreatedquery.createColumn({
                fieldId: 'casenumber'
            }),
            myCreatedquery.createColumn({
                fieldId: 'startdate'
            }),
            myCreatedquery.createColumn({
                fieldId: 'lastcustomermessagereceived'
            }),
            myCreatedquery.createColumn({
                fieldId: 'status',
                context: query.FieldContext.DISPLAY
            }),
            myCreatedquery.createColumn({
                fieldId: 'title'
            }),
            myCreatedquery.createColumn({
                fieldId: 'category',
                context: query.FieldContext.DISPLAY
            })
        ];

        var mySuiteQLQuery = myCreatedquery.toSuiteQL();
        var SuiteQLQuery = mySuiteQLQuery.query;

        log.debug({
            title:'SuiteQL query',
            details: SuiteQLQuery
        });

        //var resultSet = myCreatedquery.run();
        var resultSet = mySuiteQLQuery.run();
        var results = resultSet.results;

        log.debug({
            title: 'Query Length: ',
            details: results.length
        });

        for (var i=0; i< results.length; i++){
            log.debug({
                title: results[i].values
            });
        }
});