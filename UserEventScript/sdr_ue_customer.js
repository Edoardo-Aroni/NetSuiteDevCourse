/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define([], function(){
    function afterSubmit(context) {
        var customer            = context.newRecord;
        var customerId          = customer.getValue('entityid');
        var customerEmail       = customer.getValue('email');
        var customerSalesRep    = customer.getText('salesrep');
        var customerCouponCode  = customer.getValue('custentity_sdr_coupon_code');

        log.debug('Customer ID',customerId);
        log.debug('Customer email', customerEmail);
        log.debug('Customer SalesRep', customerSalesRep);
        log.debug('Customer Coupon Code', customerCouponCode);
    };
    return{
        afterSubmit: afterSubmit
    }
});