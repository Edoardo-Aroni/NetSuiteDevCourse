SELECT UNIQUE
fullname,
trantype ||':'||id as status
FROM
transactionstatus
WHERE 
fullname = 'Invoice : Open'