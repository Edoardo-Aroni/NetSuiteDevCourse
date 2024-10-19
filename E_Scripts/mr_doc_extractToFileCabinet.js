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

define(['N/search', 'N/file', 'N/record', 'N/log', 'N/runtime'],
    (search, file, record, log, runtime) => {

        // Entry point: Get the input data (the saved search)
        const getInputData = () => {
            const savedSearchId = runtime.getCurrentScript().getParameter({ name: 'custscript_doc_extr_search_id' });
            return search.load({ id: savedSearchId });
        };

        // Map stage: Process each search result
        const map = (context) => {
    try {
        const searchResult = JSON.parse(context.value);
        log.debug('Processing Record', searchResult);  // Log the entire search result



        // Transaction/Message Details
let internalId = searchResult.values['internalid.transaction']?.value || searchResult.values['internalid']?.value;
let documentNumber = searchResult.values['tranid.transaction'] || searchResult.values['tranid'];
let transactionDate = searchResult.values['trandate.transaction'] || searchResult.values['trandate'];
let type = searchResult.values['type.transaction']?.text || searchResult.values['type']?.text;
let customerName = searchResult.values['entity.transaction']?.text || searchResult.values['entity']?.text;

// File Attachment Details
let attachedFileId = searchResult.values['internalid.attachments']?.value || searchResult.values['internalid.file']?.value;
let attachedFileName = searchResult.values['name.attachments'] || searchResult.values['name.file'];

        log.debug('File Attachment Check', `File ID: ${attachedFileId}, File Name: ${attachedFileName}`);

        if (attachedFileId) {
            try {
                // Attempt to load the file
                let fileObj = file.load({ id: attachedFileId });
                log.debug('File Loaded Successfully', attachedFileName);

                // Copy the file to the new folder
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
            } catch (fileLoadError) {
                // Log the error if the file cannot be loaded
                log.error('Error Loading File', `File ID: ${attachedFileId}, Error: ${fileLoadError.message}`);
            }
        } else {
            log.debug('No Attachment Found', `Internal ID: ${internalId}`);
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
                const newFolderId = runtime.getCurrentScript().getParameter({ name: 'custscript_doc_extr_folder_id' });
                const csvFile = saveResultsFile(allResults, newFolderId);

                log.audit('CSV File Created Successfully', `File ID: ${csvFile.id}`);

            } catch (e) {
                log.error('Error in Summarize Stage', e.message);
            }
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
            let newCopiedFileObj = file.load({ id: newFileId });
            return newCopiedFileObj.url; // Return the URL of the copied file
        };

        // Save results as a CSV file in the file cabinet
        const saveResultsFile = (resultsArray, folderId) => {
            let csvContent = 'Internal ID,Document Number,Transaction Date,Type,Customer Name,Attached File Name\n';

            // Loop through the results array to generate CSV content
            resultsArray.forEach((result) => {
                csvContent += `${result.internalId},${result.documentNumber},${result.transactionDate},${result.type},${result.customerName},${result.attachedFileName}\n`;
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
