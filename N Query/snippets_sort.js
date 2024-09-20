//sample
myLoadedQuery.sort = [
    myLoadedQuery.createSort({
        column: myLoadedQuery.column[0], // all sort properties only apply to the first column
        ascending: false,
        caseSensitive: true,
        locale: query.SortLocale.EN_CA,
        nullsLast: false
    })
]

// sort results depend on how the iteration execute  DECREMENT
myLoadedQuery.sort = [
    myLoadedQuery.createSort({
        column: myLoadedQuery.column[0],
        ascending: false
    })
];
var resultSet = myLoadedQuery.run();
var results = resultSet.results;

log.debug({
    title: 'Query Length: ',
    details: results.length
});

for(var i = results.length - 1; i >= 0; i--){ //sorted results begin with lowest number to the highest
    log.debug({
        title: results[i].values
    })
}

// sort results depend on how the iteration execute  INCREMENT
myLoadedQuery.sort = [
    myLoadedQuery.createSort({
        column: myLoadedQuery.column[0],
        ascending: false
    })
];
var resultSet = myLoadedQuery.run();
var results = resultSet.results;

log.debug({
    title: 'Query Length: ',
    details: results.length
});

for(var i in results){ //sorted results begin with highest number to the lower
    log.debug({
        title: results[i].values
    })
}