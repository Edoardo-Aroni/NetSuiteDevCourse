/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/*
business scope: query, generate a plaintext file that contains a list of tasks that are
not started.
*/


define(['N/query','N/file'],

    (query,file) => {
       

        const  getInputData = () => {
            //Create the SuiteQL query string
            const taskSuiteQLquery = `SELECT
                                        t.title,
                                        BUILTIN.DF(t.assigned) AS assigned_to,
                                        t.dueDate,
                                        t.status,
                                        BUILTIN.DF(e.supervisor) as supervisor
                                      FROM
                                        task as t
                                        JOIN employee AS e
                                        ON t.assigned = e.id
                                      WHERE
                                        t.status = 'NOTSTART'`
            //execute SuiteQL                            
            const resultSet = query.runSuiteQL(taskSuiteQLquery);
            //get the results
            const results = resultSet.results;
            //display the length of the results
            log.debug({
                title:'Query Length',
                details: results.length
            });
            //Pass the SuiteQL Query Reference on the Return Statement
            return{
                type:'suiteql',
                query:taskSuiteQLquery
            };
        };

        const map = (context) => {

            debug.log({
                title: 'JSON query results',
                details: context.value
            });
            //initialize an object and parse the value property
            //const queryResult = JSON.parse(context.value);

    
        }
    

        const reduce = (context) => {
    
        }
    

        const summarize = (summary) => {
    
        }
    
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
        
    });