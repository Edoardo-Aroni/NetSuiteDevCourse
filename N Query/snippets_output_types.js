//sample

var results = myCreatedQuery.runPage({
    pageSize: 10
});
log.debug({
    title: 'Total Pages: ',
    details: results.PageRanges.length
});
log.debug({
    title:'Total Result Size: ',
    details: results.count
});

var myPageResults = results.iterator();

myPageResults.each(function(page){
    log.debug('Page Start');
    var pageIterator = page.value.data.iterator();
    pageIterator.each(function(row){
        log.debug({
            title:'Entity ID: ',
            details: row.value.getValue(0)
        });
        return true;
    })
    return true;
})

// sample asMap()

myCreatedQuery.columns = [
    myCreatedQuery.createColumn({
        fieldId: 'entityid',
        alias: 'customer' //requires an alias for the key
    }),
    myCreatedQuery.createColumn({
        fieldId: 'salesrep',
    }),
    myCreatedQuery.createColumn({
        fieldId: 'overduebalancesearch',
    }),   
];

var resultSet = myCreatedQuery.run();
var results = resultSet.results;

for(var i in results){
    log.debug({
        title:results[i].asMap()
    });
}

// sample asMappedResults()

myCreatedQuery.columns = [
    myCreatedQuery.createColumn({
        fieldId: 'entityid',
        alias: 'customer' //requires an alias for the key
    }),
    myCreatedQuery.createColumn({
        fieldId: 'salesrep',
    }),
    myCreatedQuery.createColumn({
        fieldId: 'overduebalancesearch',
    }),   
];

var resultSet = myCreatedQuery.run();
var results = resultSet.asMappedResults();

log.debug({
    title: results
});

