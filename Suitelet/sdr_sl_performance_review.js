/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope
 */

define(['N/query','N/redirect','N/ui/serverWidget'],
    function(query,redirect,serverWidget){

        function onRequest(context){
            var request = context.request;
            var response = context.response;

            if(request.method == 'GET'){
                var form = serverWidget.createForm({
                    title: 'Select an Employee'
                });
                form.addField({
                    id:'custpage_employee',
                    type:serverWidget.FieldType.SELECT,
                    label:'Employee',
                    source:'employee'
                });
                form.addSubmitButton('Continue');
                response.writePage(form);
            }

            else{
                var emp_id = request.parameters.custpage_employee;

                var resultSet = query.runSuiteQL({
                    query:`SELECT employee.entityid FROM employee WHERE employee.id = ?`,
                    params: [emp_id]
                });

                var results = resultSet.results;
                var emp_display = '';

                for(var i in results){
                    emp_display = results[i].value[0];
                }

                redirect.toSuitelet({
                    scriptId: 'customscript_suitelet_query',
                    deployementId: 'customdeploy_suitelet_query',
                    parameters: {
                        'custparam_employee': emp_id,
                        'custparam_employee_display':emp_display
                    }
                });
            }
        }

        return{
            onRequest:onRequest

        };
    
});