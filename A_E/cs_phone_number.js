/**
 * Business scope:
 * Validate if phone number is filled out when user submit customer record,
 * if empty alert user and prevent the form submission
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],
    ()=>{
        const saveRecord = (context) => {
            const customer = context.currentRecord;
            const phoneNumb = customer.getValue('phone');
            if(!phone){
                alert('Provide the phone number.');
                return false;
            }
            return true;
        }
        return{
            savedRecord: savedRecord
        };
});
