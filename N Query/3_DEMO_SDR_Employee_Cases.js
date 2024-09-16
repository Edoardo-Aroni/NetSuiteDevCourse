require(['N/query'],
    function(query){

        /*
        To create the query definition, 
        initialize an object, and set the 
        object to the query.load method. 
        This method requires a parameter 
        ID that is either a workbook 
        or a dataset. In this example, 
        paste the workbook ID in the parameter.
        */
       var myLoadedQuery = query.load({
        id:'custworkbook_sdr_wb_employee_cases'
       });
       /*
       To execute the query, initialize an object, 
       and set it to the query.run method. 
       Then replace query with a query definition. 
       This will return the resultSet object which 
       includes metadata returned by the query.
       */
       var resultSet = myLoadedQuery.run();
       /*
       Next, initialize another object, and set it to 
       the resultSet.results property. 
       This returns the array of actual query results returned 
       by the query.run method. Note that you must replace 
       resultSet with the object used to execute the query.
       */
       var results =  resultSet.results;
       /*
       Now, display the query values. First, display the query length, 
       which should match the total rows of the workbook. 
       Create a log.debug statement, and populate the title parameter. 
       Also, populate the details parameter with the result.length property.
       */
       log.debug({
        title: 'Query Length',
        details:results.length
       });
       /*
       Next, create a looping statement to iterate on the query results' array. 
       Use a log.debug statement to display the query values. Note that the title 
       parameter displays the query values in the 2.1 Script Debugger. However, 
       logging messages that display in the execution log of a script deployment
       require a title and a details parameter. This is because the title 
       parameter has a maximum length of 99 characters, which may shorten the 
       results.
       Access the results query array followed by a dot notation then the 
       values property. The query values correspond to the workbook 
       or dataset columns. Further, if a workbook includes multiple 
       table views, use query.listtables to return the ID of 
       a specific table view.

       */
       for(var i=0; i < results.length; i++){
        log.debug({
            title:results[i].values
        });

       }
 
});