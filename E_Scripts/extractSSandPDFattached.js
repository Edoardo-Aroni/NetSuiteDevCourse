/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

 define(['N/search', 'N/file', 'N/record', 'N/log'],
    function (search, file, record, log) {

        function onRequest(context) {
            try {
                var savedSearchId = 'customsearch_data_extract_2'; // Use your saved search ID
                var newFolderId = createNewFolder('Copied_PDFs'); // Create a new folder for copied PDFs

                var searchObj = search.load({
                    id: savedSearchId
                });

                var resultsArray = [];

                // Execute the search and process each result
                searchObj.run().each(function (result) {
                    var transactionId = result.getValue({ name: 'internalid' });
                    var transactionDate = result.getValue({ name: 'trandate' });
                    var customerName = result.getText({ name: 'entity' });
                    var amount = result.getValue({ name: 'total' });

                    var attachedFileId = result.getValue({ name: 'internalid', join: 'file' });
                    var attachedFileName = result.getValue({ name: 'name', join: 'file' });

                    if (attachedFileId) {
                        log.debug('Found Attached File', attachedFileName);

                        // Copy the attached file to the new folder
                        var copiedFileUrl = copyFileToFolder(attachedFileId, attachedFileName, newFolderId);

                        // Collect result data including the new file path
                        resultsArray.push({
                            transactionId: transactionId,
                            transactionDate: transactionDate,
                            customerName: customerName,
                            amount: amount,
                            attachedFileName: attachedFileName,
                            copiedFileUrl: copiedFileUrl // New file path in the File Cabinet
                        });
                    }

                    return true; // Continue processing next result
                });

                // Save the resultsArray to a CSV file
                var csvFile = saveResultsFile(resultsArray, newFolderId);

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
        function createNewFolder(folderName) {
            var folderObj = record.create({
                type: record.Type.FOLDER,
                isDynamic: true
            });

            folderObj.setValue({
                fieldId: 'name',
                value: folderName
            });

            var folderId = folderObj.save();
            log.debug('New Folder Created', folderId);
            return folderId;
        }

        // Function to copy a file to a new folder
        function copyFileToFolder(fileId, fileName, newFolderId) {
            var fileObj = file.load({
                id: fileId
            });

            // Create a copy of the file in the new folder
            var copiedFileObj = file.create({
                name: fileName,
                fileType: fileObj.fileType,
                contents: fileObj.getContents(),
                folder: newFolderId
            });

            var newFileId = copiedFileObj.save();
            log.debug('File Copied', newFileId);

            // Get the new file's URL
            var copiedFileObj = file.load({ id: newFileId });
            return copiedFileObj.url; // Return the URL of the copied file
        }

        // Function to save results as a CSV file in the file cabinet
        function saveResultsFile(resultsArray, folderId) {
            var csvContent = 'Transaction ID,Transaction Date,Customer Name,Amount,Attached File Name,Copied File URL\n';

            // Loop through the results array to generate CSV content
            resultsArray.forEach(function (result) {
                csvContent += result.transactionId + ',' + result.transactionDate + ',' + result.customerName + ',' + result.amount + ',' + result.attachedFileName + ',' + result.copiedFileUrl + '\n';
            });

            // Create the CSV file
            var csvFileObj = file.create({
                name: 'TransactionResultsWithCopiedPDFs.csv',
                fileType: file.Type.CSV,
                contents: csvContent,
                folder: folderId // Save the CSV in the same folder
            });

            var fileId = csvFileObj.save();
            log.debug('CSV File Saved', fileId);

            return file.load({ id: fileId }); // Return the CSV file object
        }

        return {
            onRequest: onRequest
        };
    });
