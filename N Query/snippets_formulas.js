// sample 1
myLoadedQuery.createColumn({
    type: query.ReturnType.STRING,
    formula: `CONCAT('Days: ', TO_CHAR(FLOOR({timeelapsed}/24)),
                     '| hours: ', 
                     TO_CHAR(MOD(TO_NUMBER({timeslapsed}),24)))`,
})

// sample 2
myLoadedQuery.createColumn({
    type: query.ReturnType.STRING,
    formula: `CASE
              WHEN ({timeelapsed}/24)*20 > 0
              THEN TO_CHAR({timeelapsed}/24)*20, '99,999,999,99')
              ELSE '0.00'
              END`,
    alias:'Billable Amount'          
})

// sample 3 - auto join
myLoadedQuery.createColumn({
    type: query.ReturnType.STRING,
    formula: `{assigned.firstname} || ' '
              || {assigned.lastname}`
})

// sample 4 - join To (polimorphic) note use of ^
myLoadedQuery.createColumn({
    type: query.ReturnType.STRING,
    formula: `TO_CHAR({company ^ customer.balancesearch},
              '999,999,999.99')`
})

// sample 5 - joinFrom  note use of <
myLoadedQuery.createColumn({
    type: query.ReturnType.INTEGER,
    formula: `CEIL(CAST_TO_DATE(CURRENT_DATE) - {entity < transaction.closedate})`
})

