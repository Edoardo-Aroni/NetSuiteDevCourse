require(['N/query'],
    function(query){
        var myCreatedQuery = query.create({
            type: query.Type.ITEM
        });

        var locationsJoin = myCreatedQuery.autoJoin({
            fieldId:'locations'
        });

        var locationJoin = locationsJoin.autoJoin({
            fieldId:'location'
        });

        var pricingJoin = myCreatedQuery.joinFrom({
            fieldId:'item',
            source:'pricing'
        });

        var firstCondition = myCreatedQuery.createCondition({
            fieldId:'itemType',
            operator:query.Operator.ANY_OF,
            values: 'InvtPart'
        });

        var secondCondition = myCreatedQuery.createCondition({
            fieldId:'totalQuantityOnHand',
            operator:query.Operator.GREATER,
            values:0
        });

        var thirdCondition = myCreatedQuery.createCondition({
            fieldId:'id',
            operator:query.Operator.ANY_OF,
            values:257
        });

        myCreatedQuery.condition = myCreatedQuery.and(firstCondition,secondCondition,thirdCondition);

        myCreatedQuery.columns = [
            myCreatedQuery.createColumn({
            fieldId:'itemId',
            alias:'Item Name/Number'
            }),
            myCreatedQuery.createColumn({
            fieldId:'department',
            alias:'Department',
            context: query.FieldContext.DISPLAY
            }),
            myCreatedQuery.createColumn({
            fieldId:'cost',
            alias:'Purchase Price'
            }),
            myCreatedQuery.createColumn({
            fieldId:'subsidiary',
            alias:'Subsidiary',
            context: query.FieldContext.DISPLAY
            }),
            myCreatedQuery.createColumn({
            fieldId:'totalQuantityOnHand',
            alias:'Total Quantity On Hand'
            }),
            locationJoin.createColumn({
            fieldId:'subsidiary',
            alias:'Location Subsidiary'
            }),
            locationsJoin.createColumn({
            fieldId:'location',
            alias:'Location',
            context: query.FieldContext.DISPLAY
            }),
            locationsJoin.createColumn({
            fieldId:'quantityOnHand',
            alias:'Quantity on Hand'
            }), 
            myCreatedQuery.createColumn({
            type:query.ReturnType.STRING,
            formula:`CASE 
                     WHEN {locations.quantityonhand} IS EMPTY 
                     THEN 'NO QTY' 
                     WHEN {locations.quantityonhand} < 50 
                     THEN 'YES' 
                     ELSE 'NO' 
                     END`,
            alias:'Critical Qty'
                }),
            pricingJoin.createColumn({
                fieldId:'currency',
                context: query.FieldContext.DISPLAY
            }),
            pricingJoin.createColumn({
                fieldId:'unitPrice',
                alias:'Unit Price'
            }),
            pricingJoin.createColumn({
                fieldId:'unitPrice',
                context: {
                    name: query.FieldContext.CONVERTED,
                    params: {
                        currencyId: 1,
                        date: query.RelativeDateRange.LAST_FISCAL_QUARTER
                    }
                },
                alias:'Unit Price in USD'
            })
            
        ];
        myCreatedQuery.sort = [
            myCreatedQuery.createSort({
                column: myCreatedQuery.columns[10],
                ascending:true,
                caseSensitive:true,
                locale:query.SortLocale.EN_US,
                nullsLast:true
            })
        ];

        var resultSet = myCreatedQuery.run();
        var results = resultSet.asMappedResults();

        log.debug({
            title:'Query Length',
            details: results.length
        });

        log.debug({
            title: results
        });

    });