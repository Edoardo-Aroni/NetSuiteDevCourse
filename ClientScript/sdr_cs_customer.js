/**
 * @NScriptType ClientScript
 * @NApiVersion 2.0
 */

define([], function() {
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
    function saveRecord(context){
        var customer = context.currentRecord;
        var applyCoupon = customer.getValue('custentity_sdr_apply_coupon');
        var couponCode = customer.getValue('custentity_sdr_coupon_code');
        if(applyCoupon && couponCode.length != 5 ){
            alert('The coupon code length is not 5 characters. Please try again.');
            return false;
        }
        return true;
    }
    return {
        fieldChanged: fieldChanged,
        saveRecord:   saveRecord
    };
});