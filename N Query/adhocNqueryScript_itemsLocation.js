require(['N/query'],
    function(query){
        var myCreatedQuery = query.create({
            type: query.Type.ITEM
        });

        var locationsJoin = item.autoJoin({
            fieldId:'locations'
        });

        var locationJoin = locationsJoin.joinTo({
            fieldId:'location'
        });

        





    });