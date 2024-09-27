/**
 * @NApiVersion 2.2
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget','N/query','N/url'],
    function(serverWidget, query, url){
    function onRequest(context){
        var request = context.request;
        var response = context.response;

        var emp_id = request.parameters.custparam_employee;
        var emp_disp = request.parameters.custparam_employee_disp;

        var myLoadedQuery = query.load({
            id: 'custworkbook_sdr_case'
        });

        var customerJoin = myLoadedQuery.joinTo({
            fieldId: 'company',
            target: 'customer'
        });

        var campaignJoin = customerJoin.joinTo({
            fieldId:'leadsource',
            target:'searchcampaign'
        });

        var firstCondition = myLoadedQuery.createCondition({
            fieldId:'assigned',
            operator:query.Operator.ANY_OF,
            values:emp_id
        });

        var secondCondition = myLoadedQuery.createCondition({
            fieldId:'timeelapsed',
            operator: query.Operator.GREATER,
            values:0
        });

        myLoadedQuery.condition = myLoadedQuery.and(firstCondition, secondCondition);
            
        myLoadedQuery.columns = [
            campaignJoin.createColumn({
                fieldId:'category'
            }),
            myLoadedQuery.createColumn({
                fieldId:'status',
                context:query.FieldContext.DISPLAY
            }),
            myLoadedQuery.createColumn({
                fieldId:'assigned',
                context:query.FieldContext.DISPLAY
            }),
            myLoadedQuery.createColumn({
                fieldId:'company',
                context:query.FieldContext.DISPLAY
            }),
            myLoadedQuery.createColumn({
                fieldId:'escaleteto',
                context:query.FieldContext.DISPLAY
            }),
            myLoadedQuery.createColumn({
                type: query.ReturnType.STRING,
                formula: `CONCAT('Days: ', TO_CHAR(FLOOR({timeElapsed}/24)),
                                '| hours: ', 
                                TO_CHAR(MOD(TO_NUMBER({timeElapsed}),24)) )`,
            })

        ];

        myLoadedQuery.sort = [
            myLoadedQuery.createSort({
                column: myLoadedQuery.columns[0],
                ascending: false
            })
        ];
        var resultSet = myLoadedQuery.run();
        var results = resultSet.results;

        log.debug({
            title: 'Query Length',
            details: results.length
        });

        








     


















    }
    return {
        onRequest: onRequest
    };
});