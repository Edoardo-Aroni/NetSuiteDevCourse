/**
 * Document Extract
 * Extracts documents from NetSuite based on Saved Search and upload to Azure.
 *
 * Date                 Author                      Comments
 * 08 Jul 2024          Chris Abbott                N/A
 *
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define([
    'N/search',
    'N/record',
    'N/error',
    'N/runtime',
    'N/file',
    'N/https',
    'N/format',
    'N/url',
    'N/crypto/random'
], (search, record, error, runtime, file, https, format, url, random) => {
    function normaliseString(str) {
        return str.replace(/[^\x00-\x7F]/g, '?');
    }

    /**
     * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
     * @param {Object} inputContext
     * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
     *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
     * @param {Object} inputContext.ObjectRef - Object that references the input data
     * @typedef {Object} ObjectRef
     * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
     * @property {string} ObjectRef.type - Type of the record instance that contains the input data
     * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
     * @since 2015.2
     */

    const getInputData = (inputContext) => {
        log.audit('INFO', 'START of script execution.');

        let saved_search = search.load({
            id: runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_doc_extr_search_id' })
        });

        // Validate the fields included on the saved search.
        switch (saved_search.searchType) {
            case search.Type.INVOICE:
            case search.Type.VENDOR_BILL:
            case search.Type.TRANSACTION: {
                saved_search.run().each((result) => {
                    if (!result.getValue({ name: 'tranid' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Document Number'
                        });
                    }
                    if (!result.getValue({ name: 'internalid' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Internal ID'
                        });
                    }
                    if (!result.getValue({ name: 'trandate' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Date'
                        });
                    }
                    if (!result.getText({ name: 'type' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Transaction Type'
                        });
                    }
                    if (!result.getText({ name: 'entity' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Entity'
                        });
                    }
                    if (!result.getValue({ name: 'name', join: 'file' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Name (from File...)'
                        });
                    }
                    if (!result.getValue({ name: 'internalid', join: 'file' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Internal ID (from File...)'
                        });
                    }

                    return false;
                });

                break;
            }
            case search.Type.MESSAGE: {
                saved_search.run().each((result) => {
                    if (!result.getValue({ name: 'tranid', join: 'transaction' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Document Number (from Transaction...)'
                        });
                    }
                    if (!result.getValue({ name: 'internalid', join: 'transaction' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Internal ID (from Transaction...)'
                        });
                    }
                    if (!result.getValue({ name: 'trandate', join: 'transaction' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Date (from Transaction...)'
                        });
                    }
                    if (!result.getText({ name: 'type', join: 'transaction' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Transaction Type (from Transaction...)'
                        });
                    }
                    if (!result.getText({ name: 'entity', join: 'transaction' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Name (from Transaction...)'
                        });
                    }
                    if (!result.getValue({ name: 'name', join: 'attachments' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Name (from Attachments...)'
                        });
                    }
                    if (!result.getValue({ name: 'internalid', join: 'attachments' })) {
                        throw error.create({
                            name: 'MISSING_SEARCH_FIELD',
                            message: 'Missing saved search field: Internal ID (from Attachments...)'
                        });
                    }

                    return false;
                });

                break;
            }
            default: {
                throw error.create({
                    name: 'UNSUPPORTED_SEARCH_TYPE',
                    message: `Search type [${saved_search.searchType}] is not supported.`
                });
            }
        }

        // Enable the Suitelet script deployment used to return the file and add a random UUID to be used when authenticating the callbacks from Azure.
        let suitelet_deployment_id;
        search
            .create({
                type: search.Type.SCRIPT_DEPLOYMENT,
                columns: ['internalid'],
                filters: ['scriptid', search.Operator.IS, 'customdeploy_sansa_doc_extract_sl']
            })
            .run()
            .each((result) => {
                suitelet_deployment_id = result.getValue({ name: 'internalid' });
                return false;
            });

        if (typeof suitelet_deployment_id === 'undefined') {
            throw error.create({
                name: 'MISSING_SUITELET',
                message: 'Missing Suitelet deployment: customdeploy_sansa_doc_extract_sl'
            });
        }

        let uuid = random.generateUUID();
        record.submitFields({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: suitelet_deployment_id,
            values: { isdeployed: true, custscript_sansa_doc_extract_key: uuid }
        });

        // Also pass the UUID down the chain so that we can pass it to Azure.
        saved_search.columns.push(search.createColumn({ name: 'formulatext_key', formula: `'${uuid}'` }));

        // Get any errored file IDs and process these only in this run.
        let errored_file_ids = [];
        search
            .create({
                type: search.Type.SCRIPT_DEPLOYMENT,
                columns: ['internalid'],
                filters: ['scriptid', search.Operator.IS, runtime.getCurrentScript().deploymentId]
            })
            .run()
            .each((result) => {
                let script_deployment = record.load({
                    type: record.Type.SCRIPT_DEPLOYMENT,
                    id: result.getValue({ name: 'internalid' })
                });
                errored_file_ids = script_deployment.getValue({ fieldId: 'custscript_sansa_doc_extr_error_file_ids' })
                    ? script_deployment.getValue({ fieldId: 'custscript_sansa_doc_extr_error_file_ids' }).split(',')
                    : [];
                return false;
            });

        log.debug({ title: 'errored_file_ids', details: errored_file_ids });

        if (errored_file_ids.length > 0) {
            switch (saved_search.searchType) {
                case search.Type.INVOICE:
                case search.Type.VENDOR_BILL:
                case search.Type.TRANSACTION: {
                    saved_search.filterExpression = saved_search.filterExpression.concat([
                        'and',
                        ['file.internalid', search.Operator.ANYOF, errored_file_ids]
                    ]);
                    break;
                }
                case search.Type.MESSAGE: {
                    saved_search.filterExpression = saved_search.filterExpression.concat([
                        'and',
                        ['attachments.internalid', search.Operator.ANYOF, errored_file_ids]
                    ]);
                    break;
                }
                default: {
                    throw error.create({
                        name: 'UNSUPPORTED_SEARCH_TYPE',
                        message: `Search type [${saved_search.searchType}] is not supported.`
                    });
                }
            }
        }

        return saved_search;
    };

    /**
     * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
     * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
     * context.
     * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
     *     is provided automatically based on the results of the getInputData stage.
     * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
     *     function on the current key-value pair
     * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
     *     pair
     * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
     *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
     * @param {string} mapContext.key - Key to be processed during the map stage
     * @param {string} mapContext.value - Value to be processed during the map stage
     * @since 2015.2
     */

    const map = (mapContext) => {
        // Each file needs a separate instance of Reduce.
        let context_object = JSON.parse(mapContext.value);

        let key;
        switch (context_object.recordType) {
            case search.Type.INVOICE:
            case search.Type.VENDOR_BILL:
            case search.Type.TRANSACTION: {
                key = `${context_object.values['internalid'].value}---${context_object.values['internalid.file'].value}`;
                break;
            }
            case search.Type.MESSAGE: {
                key = `${context_object.values['internalid.transaction'].value}---${context_object.values['internalid.attachments'].value}`;
                break;
            }
        }

        if (typeof key === 'undefined') {
            throw error.create({
                name: 'MISSING_MAP_KEY',
                message: `Unable to determine key for map context object: ${JSON.stringify(context_object)}`
            });
        }

        mapContext.write({ key: key, value: context_object });
    };

    /**
     * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
     * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
     * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
     *     provided automatically based on the results of the map stage.
     * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
     *     reduce function on the current group
     * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
     * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
     *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
     * @param {string} reduceContext.key - Key to be processed during the reduce stage
     * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
     *     for processing
     * @since 2015.2
     */
    const reduce = (reduceContext) => {
        let context_object = JSON.parse(reduceContext.values[0]);

        let upload_file_id;
        let upload_file_name;
        let metadata;
        switch (context_object.recordType) {
            case search.Type.INVOICE:
            case search.Type.VENDOR_BILL:
            case search.Type.TRANSACTION: {
                upload_file_id = context_object.values['internalid.file'].value;
                let date = format.parse({ type: format.Type.DATE, value: context_object.values['trandate'] });
                let date_string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`;
                upload_file_name = `${context_object.values['tranid']}---${date_string}---${context_object.values['type'].text}---${context_object.values['entity'].text}---${context_object.values['internalid.file'].value}---${context_object.values['name.file']}`;
                metadata = {
                    'x-ms-meta-number': normaliseString(context_object.values['tranid']),
                    'x-ms-meta-date': date_string,
                    'x-ms-meta-type': context_object.values['type'].text,
                    'x-ms-meta-entity': normaliseString(context_object.values['entity'].text)
                };
                break;
            }
            case search.Type.MESSAGE: {
                upload_file_id = context_object.values['internalid.attachments'].value;
                let date = format.parse({
                    type: format.Type.DATE,
                    value: context_object.values['trandate.transaction']
                });
                let date_string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`;
                upload_file_name = `${context_object.values['tranid.transaction']}---${date_string}---${context_object.values['type.transaction'].text}---${context_object.values['entity.transaction'].text}---${context_object.values['internalid.attachments'].value}---${context_object.values['name.attachments']}`;
                metadata = {
                    'x-ms-meta-number': normaliseString(context_object.values['tranid.transaction']),
                    'x-ms-meta-date': date_string,
                    'x-ms-meta-type': context_object.values['type.transaction'].text,
                    'x-ms-meta-entity': normaliseString(context_object.values['entity.transaction'].text)
                };
                break;
            }
        }

        upload_file_name = upload_file_name.replace(/\//g, '-');

        if (runtime.envType !== runtime.EnvType.PRODUCTION) {
            let base_url = runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_doc_extr_az_url' });
            let sas_token = runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_doc_extr_az_token' });

            // Perform the upload.
            log.audit({ title: 'INFO', details: `Uploading file [${upload_file_name}] to Azure.` });

            // Try three times to upload the file.
            for (let i of [1, 2, 3]) {
                let response = https.put({
                    url: `${base_url}/${encodeURIComponent(upload_file_name).replaceAll('%0A', '')}?${sas_token}`,
                    headers: {
                        'x-ms-blob-type': 'BlockBlob',
                        'x-ms-copy-source': url.resolveScript({
                            scriptId: 'customscript_sansa_doc_extract_sl',
                            deploymentId: 'customdeploy_sansa_doc_extract_sl',
                            params: {
                                key: context_object.values['formulatext_key'],
                                file_id: upload_file_id,
                                search_id: runtime
                                    .getCurrentScript()
                                    .getParameter({ name: 'custscript_sansa_doc_extr_search_id' })
                            },
                            returnExternalUrl: true
                        }),
                        ...metadata
                    }
                });

                // Check the response.
                let response_code = Number(response.code);
                log.debug({ title: 'response', details: response });
                if (response_code === 201) {
                    break;
                } else {
                    if (response_code === 403) {
                        throw error.create({
                            name: 'UNAUTHORISED_ACCESS_AZURE',
                            message: `It was not possible to authorise access to access to Azure. The following response was returned: ${response.body}`
                        });
                    } else {
                        if (i === 3) {
                            log.error({
                                title: 'ERROR',
                                details: JSON.stringify({
                                    url: `${base_url}/${encodeURIComponent(upload_file_name)}?${sas_token}`,
                                    headers: {
                                        'x-ms-blob-type': 'BlockBlob',
                                        'x-ms-copy-source': url.resolveScript({
                                            scriptId: 'customscript_sansa_doc_extract_sl',
                                            deploymentId: 'customdeploy_sansa_doc_extract_sl',
                                            params: {
                                                key: context_object.values['formulatext_key'],
                                                file_id: upload_file_id,
                                                search_id: runtime
                                                    .getCurrentScript()
                                                    .getParameter({ name: 'custscript_sansa_doc_extr_search_id' })
                                            },
                                            returnExternalUrl: true
                                        }),
                                        ...metadata
                                    }
                                })
                            });
                            throw error.create({
                                name: 'ERROR_ACCESS_AZURE',
                                message: `It was not possible to access Azure. The following response was returned: ${response.body}`
                            });
                        }
                    }
                }
            }
        } else {
            log.audit({
                title: 'INFO',
                details: 'ABORTING - The script is not allowed to run in non-Production accounts.'
            });
        }
    };

    /**
     * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
     * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
     * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
     * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
     *     script
     * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
     * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
     *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
     * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
     * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
     * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
     *     script
     * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
     * @param {Object} summaryContext.inputSummary - Statistics about the input stage
     * @param {Object} summaryContext.mapSummary - Statistics about the map stage
     * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
     * @since 2015.2
     */
    const summarize = (summaryContext) => {
        // Reset the Suitelet script deployment.
        let suitelet_deployment_id;
        search
            .create({
                type: search.Type.SCRIPT_DEPLOYMENT,
                columns: ['internalid'],
                filters: ['scriptid', search.Operator.IS, 'customdeploy_sansa_doc_extract_sl']
            })
            .run()
            .each((result) => {
                suitelet_deployment_id = result.getValue({ name: 'internalid' });
                return false;
            });

        if (typeof suitelet_deployment_id !== 'undefined') {
            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: suitelet_deployment_id,
                values: { isdeployed: false, custscript_sansa_doc_extract_key: null }
            });
        }

        // Handle INPUT errors.
        if (summaryContext.inputSummary.error) {
            log.error({
                title: 'GET_INPUT_DATA_ERROR',
                details: summaryContext.inputSummary.error
            });

            throw error.create({
                name: 'GET_INPUT_DATA_ERROR',
                message: summaryContext.inputSummary.error
            });
        }

        // Handle MAP errors.
        var map_error_string = '';
        summaryContext.mapSummary.errors.iterator().each(function (key, err) {
            map_error_string += '[Error for Key: ' + key + '\n Details:\n' + err + ']\n\n';
            return true;
        });

        if (map_error_string.length > 0) {
            log.error({
                title: 'MAP_ERROR',
                details: map_error_string
            });

            throw error.create({
                name: 'MAP_ERROR',
                message: map_error_string
            });
        }

        // Handle REDUCE errors.
        var reduce_error_string = '';
        // Keep track of any errored file IDs so that we can reprocess just these on the next run.
        let errored_file_ids = [];
        summaryContext.reduceSummary.errors.iterator().each(function (key, err) {
            reduce_error_string += '[Error for Key: ' + key + '\n Details:\n' + err + ']\n\n';
            errored_file_ids.push(key.split('---')[1]);
            return true;
        });

        // Add any errored files to this script deployment.
        let this_deployment_id;
        search
            .create({
                type: search.Type.SCRIPT_DEPLOYMENT,
                columns: ['internalid'],
                filters: ['scriptid', search.Operator.IS, runtime.getCurrentScript().deploymentId]
            })
            .run()
            .each((result) => {
                this_deployment_id = result.getValue({ name: 'internalid' });
                return false;
            });

        record.submitFields({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: this_deployment_id,
            values: { custscript_sansa_doc_extr_error_file_ids: errored_file_ids.join(',') }
        });

        if (reduce_error_string.length > 0) {
            log.error({
                title: 'REDUCE_ERROR',
                details: reduce_error_string
            });

            throw error.create({
                name: 'REDUCE_ERROR',
                message: reduce_error_string
            });
        }

        log.audit('INFO', 'END of script execution.');
    };

    return { getInputData, map, reduce, summarize };
});
