/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/query', 'N/ui/serverWidget', 'N/url'], 
    function(query,serverWidget,url){
    function onRequest(context){
    //initialize the request and response objects.
        var request = context.request;
        var response = context.response;
    //Create separate variables to capture the parameters passed by the initial Suitelet
        var itemDeptId = request.parameters.custparam_dept_id;
        var itemDeptName = request.parameters.custparam_dept_name;
    //Create the initial query definition with an Item record type.        
        var invItemQuery = query.create({type: query.Type.ITEM});
    //Join the Locations record type to the parent component
        var locationsJoin = invItemQuery.autoJoin({
            fieldId: 'locations'
        });
    //Join the Location to the joined Locations record type.
        var locationJoin = locationsJoin.autoJoin({
            fieldId:'location'
        });

    var firstCondition = locationsJoin.createCondition({
        fieldId:'location',
        operator: query.Operator.EMPTY_NOT
    });

    var secondCondition = invItemQuery.createCondition({
        fieldId: 'type',
        operator: query.Operator.ANY_OF,
        values: 'InvtPart'
    });

    var thirdCondition = invItemQuery.createCondition({
        fieldId:'department',
        operator: query.Operator.EMPTY_NOT
    });

    var fourthCondition = invItemQuery.createCondition({
        fieldid:'department',
        operator: query.Operator.ANY_OF,
        values: itemDeptId
    });
    //Apply all conditions to the parent component
    invItemQuery.conditions = invItemQuery.and(firstCondition,secondCondition,thirdCondition,fourthCondition);
    //Add columns
    invItemQuery.columns = [
        invItemQuery.createColumn({
            fieldId:'itemid',
            alias: 'Item Name/Number'
        }),
        locationsJoin.createColumn({
            fieldId:'location',
            context: query.FieldContext.DISPLAY,
            alias: 'Location'
        }),
        locationsJoin.createColumn({
            fieldId:'quantityonhand',
            alias: 'Quantity on Hand'
        }),
        locationJoin.createColumn({
            fieldId: 'subsidiary',
            context: query.FieldContext.DISPLAY,
            alias: 'Subsidiary'
        }),
        invItemQuery.createColumn({
            type:query.ReturnType.STRING,
            formula:`CASE 
                     WHEN {locations.quantityonhand} < 0
                      THEN 'URGENT' 
                     WHEN {locations.quantityonhand} IS NULL 
                      THEN 'NO QTY' 
                     WHEN {locations.quantityonhand} < 50 
                      THEN 'YES' 
                     ELSE 'NO' 
                     END`,
            alias:'Critical Quantity'
        })
    ];

    var resultSet = invItemQuery.run();
    var results = resultSet.asMappedResults();

    for(var i in results){
        log.debug('results', results);
    }

    var list = serverWidget.createList({
        title:'Inventory Item ' + itemDeptName 
    });

    list.addColumn({
        id:'itemname',
        type:serverWidget.FieldType.TEXT,
        label:'Item Name/Number'
    });
    list.addColumn({
        id:'location',
        type:serverWidget.FieldType.TEXT,
        label:'Location'
    });
    list.addColumn({
        id:'quantityonhand',
        type:serverWidget.FieldType.TEXT,
        label:'Quantity on Hand'
    });
    list.addColumn({
        id:'criticalqty',
        type:serverWidget.FieldType.TEXT,
        label:'Critical Quantity'
    });

    // Add rows to the list based on SuiteQL results
    results.forEach(function(result) {
        list.addRow({
            itemname: result['Item Name/Number'],
            location: result['Location'],
            quantityonhand: result['Quantity on Hand'],
            criticalqty: result['Critical Quantity']
        });
    });

    // Display the list on the Suitelet page
    response.writePage(list);
    }
    return{
        onRequest:onRequest
    };
});