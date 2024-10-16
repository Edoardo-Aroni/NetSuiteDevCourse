/**
 * Document Extract
 * Extracts documents from NetSuite based on Saved Search and upload to Azure.
 *
 * Date                 Author                      Comments
 * 08 Jul 2024          Chris Abbott                N/A
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/runtime', 'N/search', 'N/error', 'N/compress'], (file, runtime, search, error, compress) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        // Only allow the script to continue if the correct key is supplied.
        if (
            scriptContext.request.parameters.key !==
            runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_doc_extract_key' })
        ) {
            throw '';
        }

        let file_id = scriptContext.request.parameters.file_id;
        let search_id = scriptContext.request.parameters.search_id;

        // Check that the file was originally part of one of the saved searches from the Map/Reduce script.
        let saved_search = search.load({ id: search_id });
        switch (saved_search.searchType) {
            case search.Type.INVOICE:
            case search.Type.VENDOR_BILL:
            case search.Type.TRANSACTION: {
                saved_search.filterExpression = saved_search.filterExpression.concat([
                    'and',
                    ['file.internalid', search.Operator.IS, file_id]
                ]);
                break;
            }
            case search.Type.MESSAGE: {
                saved_search.filterExpression = saved_search.filterExpression.concat([
                    'and',
                    ['attachments.internalid', search.Operator.IS, file_id]
                ]);
                break;
            }
            default: {
                throw error.create({
                    name: 'UNSUPPORTED_SEARCH_TYPE',
                    message: `Search type [${saved_search.type}] is not supported.`
                });
            }
        }

        let do_continue = false;
        saved_search.run().each((result) => {
            do_continue = true;
            return false;
        });

        if (!do_continue) {
            throw '';
        }

        let loaded_file = file.load({ id: file_id });
        if (
            loaded_file.type === file.Type.HTMLDOC ||
            loaded_file.name.toLowerCase().endsWith('.html') ||
            loaded_file.name.toLowerCase().endsWith('.htm') ||
            loaded_file.type === file.Type.PLAINTEXT ||
            loaded_file.name.toLowerCase().endsWith('.txt') ||
            loaded_file.type === file.Type.JPGIMAGE ||
            loaded_file.name.toLowerCase().endsWith('.jpg')
    ) {
            let archiver = compress.createArchiver({ type: compress.Type.ZIP });
            archiver.add({ file: loaded_file });
            let zipped_file = archiver.archive({ name: `${loaded_file.name}.zip` });

            scriptContext.response.writeFile({ file: zipped_file, isInline: true });
        } else {
            scriptContext.response.writeFile({ file: loaded_file, isInline: true });
        }
    };

    return { onRequest };
});
