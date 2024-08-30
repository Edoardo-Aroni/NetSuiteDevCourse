/**
 * @NApiVersion 2.9
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search'], 
    
    function(search){
        function execute(context){

            var caseSearch = search.create({
                type: search.Type.SUPPORT_CASE,
                filters: [
                    search.createFilter({
                        name: 'status',
                        operator: search.Operator.ANYOF,
                        values: 3 // Escalated, if more than one use array [3,4]
                    }),
                    search.createFilter({
                        name: 'title',
                        join: 'employee',
                        operator: search.Operator.HASKEYWORDS,  // more efficient of CONTAINS
                        values: 'Support'
                    })
                ],
                columns: [
                    search.createColumn({
                        name: 'title'
                    }),
                    search.createColumn({
                        name: 'startdate'
                    }),
                    search.createColumn({
                        name: 'assigned'
                    }),
                    search.createColumn({
                        name: 'status'
                    }),
                    search.createColumn({
                        name: 'department',
                        join: 'employee'
                    }),
                    search.createColumn({
                        name: 'title',
                        join: 'employee'
                    })
                ]
            });

        var searchResults = caseSearch.run().getRange({
            start: 0,
            end: 9
        });

        for (var i=0; i < searchResults.length; i++){
            var subject = searchResults[i].getValue('title');
            var assignedTo = searchResults[i].getText('assigned');
            var status = searchResults[i].getText('status');
            var department = searchResults[i].getText({
                name: 'department',
                join: 'employee'
            });
            var jobTitle = searchResults[i].getValue({
                name: 'title',
                join: 'employee'
            });

            log.debug('Case Info', 'Subject : ' + subject + '\n' +
                                   'Assigned To : ' + assignedTo + '\n' +
                                   'Status : ' + status + '\n' +
                                   'Department : ' + department + '\n' +
                                   'Job Title : ' + jobTitle
            );
            
        }

        }
        return{
            execute: execute
        };
    });