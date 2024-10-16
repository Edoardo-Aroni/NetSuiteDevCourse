/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([], function () {
    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {
        let exceptional_field = scriptContext.currentRecord.getSublistField({
            sublistId: 'item',
            fieldId: 'cseg_cost_category',
            line: scriptContext.currentRecord.getCurrentSublistIndex({ sublistId: 'item' })
        });
        exceptional_field.isDisabled = true;
    }

    return {
        lineInit: lineInit
    };
});