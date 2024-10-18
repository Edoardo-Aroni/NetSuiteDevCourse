/**
 * Business scope:
 * Validate if phone number is filled out when user submits the customer record.
 * If empty, throw error and prevent the form submission.
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/error'], function(error) {
    const saveRecord = (context) => {
        const customer = context.currentRecord;
        const phoneNumb = customer.getValue({ fieldId: 'phone' });    
        if (!phoneNumb) {
            throw error.create({
                name:'Missing phone number',
                message: 'Please enter the phone number before saving'
            });
            
            return false;  // Prevent form submission
        }
        return true;  // Allow form submission
    }
    return {
        saveRecord: saveRecord  // Return the correct function
    };
});


