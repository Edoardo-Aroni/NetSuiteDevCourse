/*  Create and upload a CSV file that shows all customer balance using query.
    Hint: Use the N/query module to access the NetSuite data source.
*/

require(['N/file', 'N/query'], (file,query) => {

    let getQueryResults = () => {
      //Create a Customer query
      let myCreatedQuery= query.create({
           type: query.Type.CUSTOMER
      });
  
      //creating the conditions |  CURRENCY = US DOLLARS
      let fieldId = 'currency';
      let operator = query.Operator.ANY_OF;
      let values = [1]; // Internal ID of US Dollars 
  
      let firstCondition = myCreatedQuery.createCondition({fieldId, operator, values});
  
      //applying  the conditions
      myCreatedQuery.condition = firstCondition;
  
      //create the columns
      myCreatedQuery.columns = [
           myCreatedQuery.createColumn({
               fieldId: 'entityid'
           }),
           myCreatedQuery.createColumn({
               fieldId: 'balancesearch'
           }),
           myCreatedQuery.createColumn({
               fieldId: 'salesrep',
               context: query.FieldContext.DISPLAY,
           }),
       ];
  
        let resultSet  = myCreatedQuery.run();
  
        return resultSet; // returns the query result set.
    }
  
    try{
      // Create a CSV file
      let fileObj = file.create({
          name: 'CustomerBalance.csv',
          fileType: 'CSV', // can also use file.Type enum = file.Type.CSV
          contents: `Customer Balance  \n`,
          folder :  191 // internal id of the folder in the File Cabinet
      });
  
       let results = getQueryResults().results;
  
       for(let result of results){
             fileObj.appendLine({
               value: result.values
             });
  
             log.debug(result.values);
       }
  
       log.debug({
        title: 'Query Length',
        details: results.length
       });
  
        // Save the file
        let fileId = fileObj.save();
        log.debug({
         title: 'File successfully saved!',
         details: fileId
        });
    }
    catch(error){
      log.error({
          title: error.name,
          details: error.message
      })
    }
  });
  