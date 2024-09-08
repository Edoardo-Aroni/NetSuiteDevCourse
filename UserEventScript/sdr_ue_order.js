/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define(['N/redirect'], 
    /**
     * 
     * @param {redirect} redirect 
     * @returns 
     */
    function(redirect){
    function afterSubmit(context){
        var salesOrder = context.newRecord;

        redirect.toSuitelet({
            scriptId: 'customscript_sdr_sl_salesorder_finance',
            deploymentId: 'customdeploy_sdr_sl_salesorder_finance',
            parameters:{
                custparam_sdr_sal_ord_num:salesOrder.getValue('tranid'),
                custparam_sdr_customer: salesOrder.getValue('entity'),
                custparam_sdr_sal_ord_total: salesOrder.getValue('total'),
                custparam_sdr_financing_price: salesOrder.getValue('custbody_sdr_finance_price'),
                custparam_sdr_sal_ord_id: salesOrder.id
            }
        });
    }
    return{
        afterSubmit:afterSubmit
    };
});