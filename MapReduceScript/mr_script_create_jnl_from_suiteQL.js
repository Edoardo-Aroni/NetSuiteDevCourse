/*

A Map/Reduce script in SuiteScript 2.0 or 2.1 is well-suited for large data processing jobs, where a single record type might have thousands of rows. Using a SuiteQL query to gather data, you can process and create journal entries in an efficient, scalable manner.

Here's a sample Map/Reduce script in SuiteScript 2.1 that uses SuiteQL to query data and create journal entries. The script has four stages: getInputData, map, reduce, and summarize.

Step 1: Structure of the Map/Reduce Script
SuiteScript Map/Reduce functions have specific sections:

getInputData: Fetches input data. In this case, it's a SuiteQL query that returns data to be processed.
map: Takes each record from the input and processes it.
reduce: Optional if you need to aggregate data.
summarize: Runs after all data has been processed.
Breakdown of the Script:
getInputData: This section fetches open invoices using SuiteQL and returns an array of objects. Each object represents an invoice, with its details passed to the map function.

map:

Each result from the SuiteQL query is processed individually.
A journal entry is created, where the debit and credit lines are added based on the data fetched from the query.
The journal entry is saved and logged.
reduce: Not used in this case. However, this stage is useful if you want to aggregate or perform further operations after the map stage.

summarize: Logs the summary of the map/reduce execution, including errors and processed records.

Notes:
Journal Entry Lines: In this example, only one debit and one credit line are added, but you can extend this to add more lines as needed.
Customization: Modify the logic as per your use case (for example, changing the account values for debit/credit based on specific conditions).
Testing and Deployment:
Create a New Script: Navigate to Customization > Scripting > Scripts > New and upload this script.
Create a Script Deployment: Deploy the script under Customization > Scripting > Script Deployments.
*/
/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
 define(['N/query', 'N/record', 'N/runtime', 'N/log'],
    (query, record, runtime, log) => {

        /**
         * Get Input Data: SuiteQL query to fetch data.
         * @return {Array|Object|Search|RecordRef} inputSummary
         */
        const getInputData = () => {
            const suiteQL = `
                SELECT 
                    id, 
                    subsidiary, 
                    account, 
                    amount, 
                    memo, 
                    trandate 
                FROM 
                    transactions 
                WHERE 
                    type = 'Invoice' 
                    AND status = 'Open'
            `;
            
            // Run SuiteQL query
            const resultSet = query.runSuiteQL({ query: suiteQL });

            // Convert the result set into an array of objects to pass to the map function
            const results = resultSet.asMappedResults();

            log.debug('Query Results', results);
            return results;  // This will pass data to the map stage.
        };

        /**
         * Map: Process each input data record.
         * @param {Object} context - The context object passed into the map stage.
         */
        const map = (context) => {
            const data = JSON.parse(context.value); // Parse the input data (from SuiteQL result)
            
            try {
                // Create a new Journal Entry record
                const journalEntry = record.create({
                    type: record.Type.JOURNAL_ENTRY,
                    isDynamic: true
                });

                journalEntry.setValue({
                    fieldId: 'subsidiary',
                    value: data.subsidiary  // Set subsidiary
                });

                journalEntry.setValue({
                    fieldId: 'trandate',
                    value: new Date(data.trandate)  // Set transaction date
                });

                // Debit line
                journalEntry.selectNewLine({ sublistId: 'line' });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'account',
                    value: data.account  // Set account from query
                });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'debit',
                    value: data.amount  // Set debit amount
                });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'memo',
                    value: data.memo  // Set memo
                });
                journalEntry.commitLine({ sublistId: 'line' });

                // Credit line (You may have logic here to determine the credit account)
                journalEntry.selectNewLine({ sublistId: 'line' });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'account',
                    value: '201'  // Hardcoded credit account, adjust as needed
                });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'credit',
                    value: data.amount  // Set credit amount equal to debit
                });
                journalEntry.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'memo',
                    value: data.memo  // Set memo for credit line
                });
                journalEntry.commitLine({ sublistId: 'line' });

                // Save the Journal Entry record
                const journalId = journalEntry.save();

                log.debug('Journal Entry Created', `Journal ID: ${journalId}`);

                // Emit the created journal entry ID back for potential reduce or summarize stage
                context.write({
                    key: journalId,
                    value: journalId
                });
            } catch (error) {
                log.error('Error in Map Stage', error);
            }
        };

        /**
         * Reduce: (Optional) Aggregates or reduces data if needed. Not used in this example.
         * @param {Object} context - The context object passed into the reduce stage.
         */
        const reduce = (context) => {
            // Not used, but you can aggregate or further process records here if needed.
        };

        /**
         * Summarize: Executed after map/reduce completes.
         * @param {Object} summary - The summary of the Map/Reduce script.
         */
        const summarize = (summary) => {
            log.audit('Map/Reduce Summary', summary);

            summary.mapSummary.errors.iterator().each((key, error, executionNo) => {
                log.error(`Map Error for Key: ${key}`, error);
                return true;
            });

            summary.reduceSummary.errors.iterator().each((key, error, executionNo) => {
                log.error(`Reduce Error for Key: ${key}`, error);
                return true;
            });

            log.audit('Script Complete', `Processed ${summary.inputSummary.total}`);
        };

        return {
            getInputData,
            map,
            reduce,   // Optional, no operation in this script
            summarize
        };
    }
);
