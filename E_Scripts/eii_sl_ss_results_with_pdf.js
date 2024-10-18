/**
 * 
 * Business scope:
 * Runs a saved search. Copies the attached PDF files to a new folder 
 * in the File Cabinet. Generates a CSV file with transaction details 
 * and the new file paths of the copied PDFs.
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */

 define(
        ['N/search',
         'N/file', 
         'N/record', 
         'N/log'
        ],
     (search, file, record, log) => {

        const onRequest = (context) => {
            try {
                const savedSearchId = 'customsearch_doc_extract_attachments'; // Use the saved search ID
                const newFolderId = createNewFolder('SS_results_with_PDFs'); // Create a new folder for copied PDFs

                const searchObj = search.load({
                    id: savedSearchId
                });

                const resultsArray = [];

                // Execute the search and process each result
                searchObj.run().each((result) => {
                    const internalId = result.getValue({ name: 'internalid' });
                    const documentNumber = result.getValue({ name: 'tranid' });
                    const transactionDate = result.getValue({ name: 'trandate' });
                    const type = result.getValue({ name: 'type' });
                    const customerName = result.getText({ name: 'entity' });

                    const attachedFileId = result.getValue({ name: 'internalid', join: 'file' });
                    const attachedFileName = result.getValue({ name: 'name', join: 'file' });

                    if (attachedFileId) {
                        log.debug('Found Attached File', attachedFileName);

                        // Copy the attached file to the new folder
                        const copiedFileUrl = copyFileToFolder(attachedFileId, attachedFileName, newFolderId);

                        // Collect result data including the new file path
                        resultsArray.push({
                            internalId: internalId,
                            documentNumber: documentNumber,
                            transactionDate: transactionDate,
                            type:type,
                            customerName: customerName,
                            attachedFileName: attachedFileName,
                            copiedFileUrl: copiedFileUrl // New file path in the File Cabinet
                        });
                    }

                    return true; // Continue processing next result
                });

                // Save the resultsArray to a CSV file
                const csvFile = saveResultsFile(resultsArray, newFolderId);

                // Return a response with the results file or confirmation
                context.response.writeFile({
                    file: csvFile,
                    isInline: true // or false to trigger download
                });

            } catch (e) {
                log.error('Error', e.message);
            }
        }

        // Function to create a new folder in the File Cabinet
        const createNewFolder = (folderName) => {
            const folderObj = record.create({
                type: record.Type.FOLDER,
                isDynamic: true
            });

            folderObj.setValue({
                fieldId: 'name',
                value: folderName
            });

            const folderId = folderObj.save();
            log.debug('New Folder Created', folderId);
            return folderId;
        }

        // Function to copy a file to a new folder
        const copyFileToFolder = (fileId, fileName, newFolderId) => {
            const fileObj = file.load({
                id: fileId
            });

            // Create a copy of the file in the new folder
            const copiedFileObj = file.create({
                name: fileName,
                fileType: fileObj.fileType,
                contents: fileObj.getContents(),
                folder: newFolderId
            });

            const newFileId = copiedFileObj.save();
            log.debug('File Copied', newFileId);

            // Get the new file's URL
            let newCopiedFileObj = file.load({ id: newFileId });
            return copiedFileObj.url; // Return the URL of the copied file
        }

        // Function to save results as a CSV file in the file cabinet
        function saveResultsFile(resultsArray, folderId) {
            const csvContent = 'Internal ID,Document Number,Transaction Date,Type,Customer Name,Attached File Name,Copied File URL\n';

            // Loop through the results array to generate CSV content
            resultsArray.forEach((result) => {
                csvContent += result.internalId + ',' + result.documentNumber + ',' + result.transactionDate+ ',' + result.type + ',' + result.customerName + ',' + result.attachedFileName + ',' + result.copiedFileUrl + '\n';
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
        }

        return {
            onRequest
        };
    });
