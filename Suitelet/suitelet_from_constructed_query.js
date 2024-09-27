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
            var department = request.parameters.custpage_department.id;

            var suiteQL = 

        }

    }
    return{
        onRequest:onRequest
    };
});