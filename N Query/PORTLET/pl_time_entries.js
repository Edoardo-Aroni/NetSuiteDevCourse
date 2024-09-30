/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */

define(['N/query'], 
    function(query){
        function render(params){
               var portlet = params.portlet;
               portlet.title = "Pending Time Entries";
               portlet.addColumn({
                            id: 'transcdate',
                            type: 'text',
                            label: 'Transaction Date',
                            align: 'LEFT'
               });
               portlet.addColumn({
                            id: 'emp',
                            type: 'text',
                            label: 'Employee',
                            align: 'LEFT'
               });
               portlet.addColumn({
                            id: 'cust',
                            type: 'text',
                            label: 'Customer',
                             align: 'LEFT'
               });
                portlet.addColumn({
                            id: 'billedhrs',
                            type: 'text',
                            label: 'Hours Billed',
                            align: 'LEFT'
               });
                portlet.addColumn({
                            id: 'checkdate',
                            type: 'text',
                            label: 'Check Date',
                            align: 'LEFT'
                });

               var myCreatedQuery = query.create({
                type: query.Type.TIME_BILL
               });

            myCreatedQuery.condition =
               myCreatedQuery.createCondition({
                fieldId:'approval status',
                operator: query.Operator.ANY_OF,
                values: 2
               });

            myCreatedQuery.columns = [
               myCreatedQuery.createColumn({fieldId: trandate}),
               myCreatedQuery.createColumn({
                fieldId: 'employee',
                context: query.FieldContext.DISPLAY
               }),
               myCreatedQuery.createColumn({
                fieldId: 'customer',
                context: query.FieldContext.DISPLAY
               }),
               myCreatedQuery.createColumn({
                label:'Hours',
                type: query.ReturnType.STRING,
                formula: `CONCAT(TO_CHAR({hours}), 'hours')`
               }),
               myCreatedQuery.createColumn({
                label: 'Check Date',
                type: query.ReturnType.STRING,
                formula:  `CASE 
                           WHEN {trandate} = TRUNC(CURRENT_DATE) THEN 'DUE TODAY' 
                           WHEN {trandate} < TRUNC(CURRENT_DATE) THEN 'PRIOR TO TODAY' 
                           END`
                })
            ];

            //sort according to transaction date

            myCreatedQuery.sort = [
                myCreatedQuery.createSort({
                    column: myCreatedQuery.columns[0],
                    ascending: true
                })
            ];

               var resultSet = myCreatedQuery.run();
               var iterator = resultSet.iterator();
               iterator.each(function(result){
                var currentResult = result.value;
                params.portlet.addRow({
                    transacdate: currentResult.getValue(0),
                    emp: currentResult.getValue(1),
                    cust: currentResult.getValue(2),
                    billedhrs: currentResult.getValue(3),
                    checkdate: currentResult.getValue(4)
                });
                return true;
               });
    }

    return {
        render: render
    };
});