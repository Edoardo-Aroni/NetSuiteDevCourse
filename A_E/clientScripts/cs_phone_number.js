/**
 * Business scope:
 * Validate if phone number is filled out when user submits the customer record.
 * If empty, alert the user and prevent the form submission.
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount   // this is the default value and it is optional
 */
define([], function() {
    const saveRecord = (context) => {
        const customer = context.currentRecord;
        const phoneNumb = customer.getValue({ fieldId: 'phone' });    
        if (!phoneNumb) {
            alert('Please provide the phone number.');
            return false;  // Prevent form submission
        }
        return true;  // Allow form submission
    }
    return {
        saveRecord: saveRecord  // Return the correct function
    };
});


