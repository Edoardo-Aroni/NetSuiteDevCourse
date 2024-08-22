/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
// JSDoc tags: annotations

//example with entry function before the return statement

/*
the context object is an object passed from the server to our functions so we can get
additional information about that particular function.
It is called the context object because it will change depending on the context of 
where your function is executed.
*/

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