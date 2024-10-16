/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/runtime'], (search, runtime) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            if (scriptContext.request.parameters.key !== '77227ecd-48f3-4138-8358-c30445c77927') {
                return;
            }

            if (scriptContext.request.parameters.fn === 'getAccruedPurchaseInfo') {
                // The solution was changed so that this is no longer required.
                // let account_exception_info = {};
                // search
                //     .create({
                //         type: search.Type.ACCOUNT,
                //         columns: ['internalid', 'custrecord_sansa_accrued_purch_rec_excep']
                //     })
                //     .run()
                //     .each((result) => {
                //         let item_id = Number(result.getValue({ name: 'internalid' }));
                //
                //         account_exception_info[item_id] = result.getValue({
                //             name: 'custrecord_sansa_accrued_purch_rec_excep'
                //         });
                //
                //         return true;
                //     });

                scriptContext.response.write({
                    output: JSON.stringify({
                        // account_exception_info,
                        accrued_purchase_account: Number(
                            runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_accrued_purch_rec_acc' })
                        ),
                        accrued_purchase_exceptional_account: Number(
                            runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_accrued_purch_rec_exc' })
                        ),
                        accrued_purchase_cost_category: Number(
                            runtime.getCurrentScript().getParameter({ name: 'custscript_sansa_accrued_purch_cost_cat' })
                        )
                    })
                });
            }
        }
    };

    return { onRequest };
});
