/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/query','N/redirect','N/ui/serverWidget'], 
    function(query,redirect,serverWidget){
    function onRequest(context){
        var request = context.request;
        var response = context.response;

        if(request.method==='GET'){
            var form = serverWidget.createForm({
                title:'Select Item Deparment'
            });

            form.addField({
                id:'custpage_department',
                type: serverWidget.FieldType.SELECT,
                label: 'Deparment',
                source: 'department'
            });

            form.addSubmitButton({label:'Continue'});

            response.writePage({pageObject:form});
        } else {
            var dept_id = request.parameters.custpage_department;

            var suiteQL = `SELECT BUILTIN.DF(id) FROM department WHERE id = ?`

            var queryResults = query.runSuiteQL({
                query: suiteQL,
                params: [dept_id]
            });

            var results = queryResults.results;
            var dept_name = '';

            for(var i in results){
                dept_name = results[i].values[0];
            }

            log.debug('Selected Department',`ID: ${dept_id} Name: ${dept_name}`);

            // Redirect to another Suitelet, passing paremeters
            redirect.toSuitelet({
                scriptId: 'customscript_sdr_sl_inv_item', // Replace with your second Suitelet script ID
                deploymentId: 'customdeploy_sdr_sl_inv_item', // Replace with your second Suitelet deployment ID
                parameters: {
                            'custparam_dept_id': dept_id,
                            'custparam_dept_name': dept_name
                            }
            });

        }

    }
    return{
        onRequest:onRequest
    };
});