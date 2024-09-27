/**
 * @NApiVersion 2.1
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
            id: 'custworkbook_sdr_wb_employee_cases'
        });

        var customerJoin = myLoadedQuery.joinTo({
            fieldId: 'company',
            target: 'customer'
        });

        var leadSourceJoin = customerJoin.joinTo({
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
            myLoadedQuery.createColumn({
                fieldId:'casenumber'
            }),
            myLoadedQuery.createColumn({
                fieldId:'startdate'
            }),
            myLoadedQuery.createColumn({
                fieldId:'title'
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
                fieldId:'category',
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

        var list = serverWidget.createList({
            title:'Cases Handled by: ' + emp_disp
        });

        list.addColumn({
            id:'casenumber',
            type: serverWidget.FieldType.TEXT,
            label: 'Case Number'
        });
        list.addColumn({
            id:'startdate',
            type: serverWidget.FieldType.TEXT,
            label: 'Start Date'
        });
        list.addColumn({
            id:'title',
            type: serverWidget.FieldType.TEXT,
            label: 'Subject'
        });
        list.addColumn({
            id:'status',
            type: serverWidget.FieldType.TEXT,
            label: 'Status'
        });
        list.addColumn({
            id:'assigned',
            type: serverWidget.FieldType.TEXT,
            label: 'Assigned To'
        });
        list.addColumn({
            id:'company',
            type: serverWidget.FieldType.TEXT,
            label: 'Company'
        });
        list.addColumn({
            id:'escalateto',
            type: serverWidget.FieldType.TEXT,
            label: 'Escalate To'
        });
        list.addColumn({
            id:'lscampaign',
            type: serverWidget.FieldType.TEXT,
            label: 'Lead Source Campaign Category'
        });
        list.addColumn({
            id:'dayshours',
            type: serverWidget.FieldType.TEXT,
            label: 'Day | Hours'
        });
        
        for(var i in results){
            list.addRows({
                rows:[{
                    casenumber: results[i].values[0] + '',
                    startdate: results[i].values[1] + '',
                    title: results[i].values[2] + '',
                    status: results[i].values[3] + '',
                    assigned: results[i].values[4] + '',
                    company: results[i].values[5] + '',
                    escalateto: results[i].values[6] + '',
                    lscampaign: results[i].values[7] + '',
                    dayhours: results[i].values[8] + ''}]
            });
        }

        response.writePage(list);

    }
    return {
        onRequest: onRequest
    };
});