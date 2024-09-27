/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/redirect', 'N/ui/serverWidget','N/query'],
    /**
     * 
     * @param {redirect} redirect 
     * @param {serverWidget} serverWidget 
     * @param {query} query 
     * @returns 
     */
    
    function(redirect, serverWidget, query){

        function onRequest(context){
            var request = context.request;
            var response = context.response;
            if(request.method=='GET'){
                var form = serverWidget.createForm({
                    title:'Select an employee'
                });

                form.addFields({
                    id:'custpage_employee',
                    type: serverWidget.FieldType.SELECT,
                    label:'Employee',
                    source:'employee'
                });

                form.addSubmitButton('Continue');
                context.response.writePage(form);
            } else {
                var emp = request.parameters.custpage_employee;

                var resultSet = query.runSuiteQL({
                    query: 'SELECT employee.entityid FROM employee.id = ? ',
                    params: [emp_id]
                });

                var emp_display = '';
                var result = resultSet.results;
                for (var i= results.length -1; i >= 0; i--){
                    emp_display = results[i].value[0]
                }
            }
        }
    return{
        onRequest: onRequest
    };
});