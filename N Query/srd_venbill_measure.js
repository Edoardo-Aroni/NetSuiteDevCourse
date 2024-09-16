require(['N/search'],
    function(search){
        var vendBillSearch = search.create({
            type: search.Type.TRANSACTION,
            filters: 
            [
                ['type', search.Operator.ANYOF, 'VendBill', 'VendCred'],
                'AND',
                ['mainline',search.Operator.IS, 'T'],
                'AND',
                ['status', search.Operator.ANYOF,'VendBill:A','VendBill:D']
            ],
            columns:
            [
                search.createColumn({
                    name:'entityid',
                    join:'vendor',
                    label:'Vendor',
                    sort: search.Sort.ASC 
                }),
                search.createColumn({
                    name:'entityid',
                    label:'Vendor'
                }),

            ]



        });
       
    });