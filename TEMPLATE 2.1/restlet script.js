/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define([],

    () => {
       
        // Function called upon sending a GET request to the RESTlet.
        const doGet = (requestParams) => {
    
        }
    
        // Function called upon sending a PUT request to the RESTlet.
        const doPut = (requestBody) => {
    
        }
    
        // Function called upon sending a POST request to the RESTlet.
        const doPost = (requestBody) => {
    
        }
    
        // Function called upon sending a DELETE request to the RESTlet.
        const doDelete = (requestParams) => {
    
        }
    
        return {
            'get': doGet,
            put: doPut,
            post: doPost,
            'delete': doDelete
        };
        
    });