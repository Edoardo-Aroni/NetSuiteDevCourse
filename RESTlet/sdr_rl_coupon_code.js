/**
 * @NScriptType Restlet
 * @NApiVersion 2.0
 */

define([],function(){
    function doGet(requestParams){
        var couponCode = requestParams.custparam_couponcode;

        if (couponCode == 'ABC12') {
            return 'valid';
        } else {
            return 'invalid';
        }
    }
    return{
        get: doGet
    };
});