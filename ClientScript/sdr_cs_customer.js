/**
 * @NScriptType ClientScript
 * @NApiVersion 2.0
 */

define([], function() {
    function fieldChanged(context){
    var customer = context.currentRecord;
    if(context.fieldId == 'custentity_sdr_apply_coupon') {
        var applyCoupon = customer.getValue('custentity_sdr_apply_coupon');
        var couponCode = customer.getField('custentity_sdr_coupon_code');
        if(applyCoupon){
            couponCode.displyType = 'normal';
        } else{
            couponCode.displyType = 'disabled';
        }
    }
    }
    return {
        fieldChanged : fieldChanged
    };
});