/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search','N/error'],
    /**
     * @param{search} search
     * @param{error} error
     */
      (search, error) => {
  
          /**
           * Defines the function definition that is executed before record is submitted.
           * @param {Object} scriptContext
           * @param {Record} scriptContext.newRecord - New record
           * @param {Record} scriptContext.oldRecord - Old record
           * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
           * @since 2015.2
           */
          const beforeSubmit = (context) => {
            const record = context.newRecord;
            const sublistId = 'line';
            const lineCount = record.getLineCount(sublistId);
            const lineAcctIdsNoName = getAllAcctIdsNoName(record, lineCount, sublistId);
            lineAcctIdsNoName.forEach(lineAccountId => {
              let lineAccountType = lookupAccountType(lineAccountId)
              log.debug('lineAccountType', lineAccountType);
              if (lineAccountType==='AcctRec' || lineAccountType==='AcctPay') {
                const validationError = error.create({
                  name: 'VALIDATION_CAUGHT',
                  message: 'Journal Lines with Account Type AR or AP must have a Name',
                  notifyOff: true
                });
                throw validationError;
              }
            })
          }
  
          function getAllAcctIdsNoName(record, lineCount, sublistId) {
            let allAcctIdsNoName = [];
            for (let line = 0; line < lineCount; line++) {
              let lineName = record.getSublistValue({
                sublistId: sublistId,
                fieldId: 'entity',
                line: line
              });
              if (lineName) {
                log.debug('lineName', lineName);
              } else {
                let lineAccountId = record.getSublistValue({
                  sublistId: sublistId,
                  fieldId: 'account',
                  line: line
                });
                allAcctIdsNoName.push(lineAccountId);
              }
            }
            let uniqueAcctIdsNoName = [...new Set(allAcctIdsNoName)];
            log.debug('uniqueAcctIdsNoName', uniqueAcctIdsNoName);
            return uniqueAcctIdsNoName;
          }
  
          function lookupAccountType(accountId) {
            const accountFields = search.lookupFields({
              type: search.Type.ACCOUNT,
              id: accountId,
              columns: ['type']
            });
            if (accountFields && accountFields.type && accountFields.type[0]) {
              return accountFields.type[0].value;
            } else {
              return ''
            }
          }
  
          return {beforeSubmit}
  
      });
  