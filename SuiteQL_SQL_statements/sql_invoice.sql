                SELECT 
                    t. id, 
                    tl.subsidiary, 
                    tal.account, 
                    tal.amount, 
                    tl.memo, 
                    t.trandate 
                FROM 
                    transaction AS t
                    JOIN  transactionLine AS tl
                    ON t.id = tl.transaction
                    JOIN TransactionAccountingLine AS tal
                    ON tl.transaction = tal.transaction

                WHERE 
                     t.status = 'CustInvc:A'