/**
 * @NApiVersion 2.0
 * @NScriptType Restlet
 */
define([],function(){
    function doGet(requestParams){
        var empCode = requestParams.sdr_emp_code;

        if(empCode == 'x') {
           return 'invalid';  
        } else {
           return 'valid'; 
        }
    }    
    
    return {
        get: doGet
    };
});