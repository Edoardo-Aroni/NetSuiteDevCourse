requestAnimationFrame(['N/query'],
    function(query){
        var myLoadedQuery = query.load({
            id:'custworkbook_sdr_wb_employee_cases'
        });

        var customerJoin = myLoadedQuery.joinTo({
            fieldId:'company',
            target:'Customer'
        });

        var contactJoin = customerJoin.autoJoin({
            fieldId:'contactList'
        });

        var firstCondition = myLoadedQuery.createCondition({
            fieldId:'category',
            operator:query.Operator.ANY_OF,
            values:[1,2,3]
        });

        var secondCondition = myLoadedQuery.createCondition({
            fieldId:'timeelapsed',
            operator:query.Operator.GREATER,
            values:0
        });

        var thirdCondition = contactJoin.createCondition({
            fieldId:'phone',
            operator:query.Operator.EMPTY_NOT
        });

        myLoadedQuery.condition = myLoadedQuery.and(firstCondition,secondCondition,thirdCondition);

        myLoadedQuery.columns = [


        ]

        //8:31








});