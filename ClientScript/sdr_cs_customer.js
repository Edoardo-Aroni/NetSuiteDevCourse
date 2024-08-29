/**
 * @NScriptType ClientScript
 * @NApiVersion 2.0
 */

define([], function() {

    function pageInit(context){
        var customer = context.currentRecord;
        var prodPrefCount = customer.getLineCount({
            sublistId: 'recmachcustrecord_sdr_prod_pref_customer'
        });

        alert('This customer has ' + prodPrefCount + ' product preferences.');
    }

    function lineInit(context){
        var customer = context.currentRecord;
        if(context.sublistId == 'recmachcustrecord_sdr_prod_pref_customer'){
            var preferredQty = customer.getCurrentSublistValue({
                sublistId: 'recmachcustrecord_sdr_prod_pref_customer',
                fieldId: 'custrecord_sdr_prod_pref_qty'
            });
            if(!preferredQty){
                customer.setCurrentSublistValue({
                    sublistId: 'recmachcustrecord_sdr_prod_pref_customer',
                    fieldId: 'custrecord_sdr_prod_pref_qty',
                    value: 1
                });
            }
        }
    }

    function validateLine(context){
        var customer = context.currentRecord;
        if(context.sublistId == 'recmachcustrecord_sdr_prod_pref_customer'){
            var preferredQty = customer.getCurrentSublistValue({
                sublistId: 'recmachcustrecord_sdr_prod_pref_customer',
                fieldId: 'custrecord_sdr_prod_pref_qty'
            });
            if(parseInt(preferredQty) > 10 ){
                alert('You have selected a preferred quantity that exceeds the limit of 10.');
                return false;
            }
        }
        return true; 
    }

    function fieldChanged(context){
    var customer = context.currentRecord;
        if(context.fieldId == 'custentity_sdr_apply_coupon') {
            var applyCoupon = customer.getValue('custentity_sdr_apply_coupon');
            var couponCode = customer.getField({fieldId: 'custentity_sdr_coupon_code'});
            if(applyCoupon){
                couponCode.isDisabled = false;
            } else{
                customer.setValue('custentity_sdr_coupon_code','');
                couponCode.isDisabled = true;
            }
        }
    }

    function validateField(context){
        var customer = context.currentRecord;
        if(context.fieldId == 'custentity_sdr_coupon_code'){
            var couponCode = customer.getValue('custentity_sdr_coupon_code');
            var applyCoupon = customer.getValue('custentity_sdr_apply_coupon');
            if(applyCoupon && couponCode.length != 5 ){
                alert('The coupon code length is not 5 characters. Please try again.');
                return false;
            }
        }
        return true;
    }

    function saveRecord(context){
        var customer = context.currentRecord;
        var applyCoupon = customer.getValue('custentity_sdr_apply_coupon');
        var couponCode = customer.getValue('custentity_sdr_coupon_code');
        if(applyCoupon && couponCode.length != 5 ){
            alert('The coupon code length is not 5 characters. Please try again.');
            return false;
        }

        var prodPrefCount = customer.getLineCount({
            sublistId: 'recmachcustrecord_sdr_prod_pref_customer'
        });

        var totPrefQty = 0;

        for(var i = 0; i < prodPrefCount; i++){
            var prefQty = customer.getSublistValue({
                sublistId: 'recmachcustrecord_sdr_prod_pref_customer',
                fieldId: 'custrecord_sdr_prod_pref_qty',
                line: i
            });
            totPrefQty += parseInt(prefQty);

            if(totPrefQty > 25 ){
                alert('The total preferred quantity across all product preferences has exceed the limit of 25.');
                return false;
            } 
        }
        return true;
    }

    return {
        pageInit:       pageInit,
        lineInit:       lineInit,
        validateLine:   validateLine,
        fieldChanged:   fieldChanged,
        validateField:  validateField,
        saveRecord:     saveRecord
    };
});