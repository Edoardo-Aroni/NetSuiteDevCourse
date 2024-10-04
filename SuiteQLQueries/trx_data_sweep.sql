SELECT 

BUILTIN.DF(tl.subsidiary) AS subsidiary,
a.acctNumber as account,
tal.debit,
tal.credit,
tl.class,
t.tranid ||' '||tl.memo AS description,
d.externalId AS functional_activity

FROM

transaction AS t
JOIN  transactionLine AS tl
ON t.id = tl.transaction
JOIN TransactionAccountingLine AS tal
ON tl.transaction = tal.transaction
JOIN account AS a
ON tal.account = a.id
JOIN department as d
ON tl.department = d.id

WHERE

t. postingPeriod = 333   and tl.subsidiary = 93
and a.acctNumber IN ('P211040','P311000','P311002',
'P311005','P312000','P313000','P314003','P316000', 'P316004')