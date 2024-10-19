/**
 * 
 * Business scope:
 * Runs a saved search. Copies the attached PDF files to a new folder 
 * in the File Cabinet. Generates a CSV file with transaction details 
 * and the new file paths of the copied PDFs.
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   
 * 
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

define(['N/search', 'N/file', 'N/record', 'N/log'],
    (search, file, record, log) => {

        // Entry point: Get the input data (the saved search)
        const getInputData = () => {
            //const savedSearchId = 'customsearch_doc_extract_attachments'; // Your saved search ID
            const savedSearchId = runtime.getCurrentScript().getParameter({ name: 'custscript_doc_extr_search_id' })
            return search.load({ id: savedSearchId });
        };

        // Map stage: Process each search result
        const map = (context) => {
            try {
                const searchResult = JSON.parse(context.value);

                // Transaction/Message Details
                let internalId = searchResult.id;
                let documentNumber = searchResult.values.tranid;
                let transactionDate = searchResult.values.trandate;
                let type = searchResult.values.type;
                let customerName = searchResult.values.entity;

                // File Attachment Details
                let attachedFileId = searchResult.values['file.internalid'];
                let attachedFileName = searchResult.values['file.name'];

                if (attachedFileId) {
                    log.debug('Found Attached File', attachedFileName);

                    // Copy the file to a new folder
                    //const newFolderId = createNewFolder('SS_results_with_PDFs_v2');
                    const newFolderId = runtime.getCurrentScript().getParameter({ name: 'custscript_doc_extr_folder_id' });
                    const copiedFileUrl = copyFileToFolder(attachedFileId, attachedFileName, newFolderId);

                    // Pass the result to the Reduce stage
                    context.write({
                        key: internalId,
                        value: {
                            internalId: internalId,
                            documentNumber: documentNumber,
                            transactionDate: transactionDate,
                            type: type,
                            customerName: customerName,
                            attachedFileName: attachedFileName,
                            copiedFileUrl: copiedFileUrl
                        }
                    });
                }
            } catch (e) {
                log.error('Error in Map Stage', e.message);
            }
        };

        // Reduce stage: Collect data for each transaction
        const reduce = (context) => {
            let resultsArray = [];

            context.values.forEach((value) => {
                let result = JSON.parse(value);
                resultsArray.push(result);
            });

            // Pass the result to Summarize stage
            context.write({
                key: 'results',
                value: resultsArray
            });
        };

        // Summarize stage: Generate the CSV and save it to the File Cabinet
        const summarize = (summary) => {
            try {
                let allResults = [];

                summary.output.iterator().each((key, value) => {
                    let resultBatch = JSON.parse(value);
                    allResults = allResults.concat(resultBatch);
                    return true;
                });

                // Save the results to a CSV file
                const newFolderId = createNewFolder('SS_results_with_PDFs_v2');
                const csvFile = saveResultsFile(allResults, newFolderId);

                log.audit('CSV File Created Successfully', `File ID: ${csvFile.id}`);

            } catch (e) {
                log.error('Error in Summarize Stage', e.message);
            }
        };

        // Helper Functions:

        // Create a new folder in the File Cabinet
        const createNewFolder = (folderName) => {
            let folderObj = record.create({ type: record.Type.FOLDER, isDynamic: true });
            folderObj.setValue({ fieldId: 'name', value: folderName });
            const folderId = folderObj.save();
            log.debug('New Folder Created', folderId);
            return folderId;
        };

        // Copy a file to a new folder
        const copyFileToFolder = (fileId, fileName, newFolderId) => {
            let fileObj = file.load({ id: fileId });

            // Create a copy of the file in the new folder
            let copiedFileObj = file.create({
                name: fileName,
                fileType: fileObj.fileType,
                contents: fileObj.getContents(),
                folder: newFolderId
            });

            const newFileId = copiedFileObj.save();
            log.debug('File Copied', newFileId);

            // Get the new file's URL
            let copiedFileObj = file.load({ id: newFileId });
            return copiedFileObj.url; // Return the URL of the copied file
        };

        // Save results as a CSV file in the file cabinet
        const saveResultsFile = (resultsArray, folderId) => {
            let csvContent = 'Internal ID,Document Number,Transaction Date,Type,Customer Name,Attached File Name,Copied File URL\n';

            // Loop through the results array to generate CSV content
            resultsArray.forEach((result) => {
                csvContent += `${result.internalId},${result.documentNumber},${result.transactionDate},${result.type},${result.customerName},${result.attachedFileName},${result.copiedFileUrl}\n`;
            });

            // Create the CSV file
            const csvFileObj = file.create({
                name: 'TransactionResultsWithCopiedPDFs.csv',
                fileType: file.Type.CSV,
                contents: csvContent,
                folder: folderId // Save the CSV in the same folder
            });

            const fileId = csvFileObj.save();
            log.debug('CSV File Saved', fileId);

            return file.load({ id: fileId }); // Return the CSV file object
        };

        return {
            getInputData,
            map,
            reduce,
            summarize
        };
    }
);
