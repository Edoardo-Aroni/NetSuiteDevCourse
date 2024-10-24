/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/file', 'N/ui/serverWidget', 'N/search'],
    function(file, serverWidget, search) {

        function onRequest(context) {
            if (context.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'Download CSV File'
                });

               
                var folderId = 213; //folder ID
                
                // Create a dropdown field to list CSV files
                var fileField = form.addField({
                    id: 'custpage_file',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Select CSV File'
                });

                fileField.addSelectOption({
                    value: '',
                    text: ''
                });

                // Search for CSV files in the specified folder
                var fileSearch = search.create({
                    type: 'file', // Set to 'file' as a string
                    filters: [
                        ['folder', 'is', folderId],
                        'AND',
                        ['filetype', 'is', 'CSV']
                    ],
                    columns: ['name']
                });

                fileSearch.run().each(function(result) {
                    var fileId = result.id;
                    var fileName = result.getValue('name');
                    fileField.addSelectOption({
                        value: fileId,
                        text: fileName
                    });
                    return true;
                });

                // Add submit button
                form.addSubmitButton({
                    label: 'Download'
                });

                context.response.writePage(form);
            } else {
                // If form is submitted (POST), handle file download
                var fileId = context.request.parameters.custpage_file;

                if (fileId) {
                    try {
                        var fileObj = file.load({
                            id: fileId
                        });

                        context.response.writeFile({
                            file: fileObj
                        });
                    } catch (e) {
                        log.error({
                            title: 'Error downloading file',
                            details: e
                        });
                        context.response.write({
                            output: 'Error downloading file: ' + e.message
                        });
                    }
                } else {
                    context.response.write({
                        output: 'No file selected for download.'
                    });
                }
            }
        }

        return {
            onRequest: onRequest
        };

    });
