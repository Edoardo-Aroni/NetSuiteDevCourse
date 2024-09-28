/**
 * @ApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/query', 'N/ui/serverWidget', 'N/url'], 
    function(query,serverWidget,url){
    function onRequest(context){
        var request = context.request;
        var response = context.response;
        var itemDeptId = request.parameters.custparam_dept_id;
        var itemDeptName = request.parameters.custparam_dept_name;
        

    }
    return{
        onRequest:onRequest
    };
});