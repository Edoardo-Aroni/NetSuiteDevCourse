/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/*
Business Scope: generate a CSV file that contains a list of all pending
orders to track items to be shipped and order status.
*/
define(['N/query', 'N/file', 'N/log'],

    (query, file, log) => {

        const getInputData = () => {
            const myQuery = query.create({
                type: query.Type.TRANSACTION
            });

            const firstCondition = myQuery.createCondition({
                fieldId: 'type',
                operator: query.Operator.ANY_OF,
                values: ['SalesOrd']
            });

            const secondCondition = myQuery.createCondition({
                fieldId: 'status',
                operator: query.Operator.ANY_OF,
                values: ['SalesOrd:H']  // H is the internal ID for "Pending Approval"
            });

            const thirdCondition = myQuery.createCondition({
                fieldId: 'ordPicked',
                operator: query.Operator.IS,
                values: false
            });

            myQuery.condition = myQuery.and(firstCondition, secondCondition, thirdCondition);

            myQuery.columns = [
                myQuery.createColumn({
                    fieldId: 'tranId'
                }),
                myQuery.createColumn({
                    fieldId: 'tranDate'
                }),
                myQuery.createColumn({
                    fieldId: 'entity',
                    context: query.FieldContext.DISPLAY
                }),
                myQuery.createColumn({
                    fieldId: 'status',
                    context: query.FieldContext.DISPLAY
                }),
                myQuery.createColumn({
                    fieldId: 'foreignTotal'
                }),
                myQuery.createColumn({
                    fieldId: 'ordPicked'
                }),
                myQuery.createColumn({
                    fieldId: 'shippingAddress',
                    context: query.FieldContext.DISPLAY
                })
            ];

            return myQuery;
        };

        const map = (context) => {
            const result = JSON.parse(context.value); // Parse the input data from the query result

            context.write({
                key: result.tranId,
                value: result // Pass the entire result for later processing in reduce/summarize
            });
        };

        const reduce = (context) => {
            // Usually used for aggregating data, but not needed in this example
        };

        const summarize = (summary) => {
            let csvData = "Transaction ID, Date, Customer, Status, Total, Picked, Shipping Address\n";

            summary.mapSummary.keys.iterator().each((key, executionNo) => {
                const mapData = JSON.parse(summary.mapSummary.lookup({ key }));

                csvData += `${mapData.tranId}, ${mapData.tranDate}, ${mapData.entity}, ${mapData.status}, ${mapData.foreignTotal}, ${mapData.ordPicked}, ${mapData.shippingAddress}\n`;

                return true;
            });

            // Create the CSV file
            const fileObj = file.create({
                name: 'PendingOrders.csv',
                fileType: file.Type.CSV,
                contents: csvData,
                folder: -15  // Temporary folder (adjust as needed)
            });

            const fileId = fileObj.save();

            log.audit('File created', `File ID: ${fileId}`);
        };

        return {
            getInputData,
            map,
            reduce,
            summarize
        };

    });
