/**
 * @NScriptType ClientScript
 * @NApiVersion 2.0
 */

define(['N/email','N/ui/dialog'], 
/**
 * @param {email} email 
 * @param {dialog} dialog 
 */    
    
function(email, dialog){

    function pageInit(context){
        var order = context.currentRecord;
        var status = order.getText('orderstatus');
        if(context.mode == 'edit' && status == 'Billed') {
            dialog.alert({
               title: 'Edit Warning',
               message: 'This order has already been billed. Auditors will be notified.' 
            });
            email.send({
                author          : -5,  // the administrator Larry Nelson
                recipients      : -5,
                subject         : 'User has edited a billed order',
                body            : 'Order ' + order.getValue('tranid') + ' has been recently edited'
            });
        }

    }

    return{
        pageInit: pageInit
    };

    });