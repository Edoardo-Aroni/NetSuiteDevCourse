/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
// JSDec tags: annotations

//example with entry function before the return statement

define([],   // define statement
    function() {   // call back function
        function myAfterSubmit(context){
            //do something 
        } 
        return {
            afterSubmit : myAfterSubmit  
        }; 
    }
);