/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define([], function () {
    
    // Define the GET method
    function doGet(requestParams) {
        // Logic for handling GET requests
        return 'GET request handled';
    }

    // Define the POST method
    function doPost(requestBody) {
        // Logic for handling POST requests
        return 'POST request handled';
    }

    // Define the PUT method
    function doPut(requestBody) {
        // Logic for handling PUT requests
        return 'PUT request handled';
    }

    // Define the DELETE method
    function doDelete(requestParams) {
        // Logic for handling DELETE requests
        return 'DELETE request handled';
    }

    // Return the entry points for the Restlet
    return {
        get: doGet,
        post: doPost,
        put: doPut,
        delete: doDelete
    };
});
