/**
 * Business scope:
 * Validate if phone number is filled out when user submits the customer record.
 * If empty, show an error message and prevent the form submission.
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/ui/message'], function(message) {
    const saveRecord = (context) => {
        const customer = context.currentRecord;
        const phoneNumb = customer.getValue({ fieldId: 'phone' });    
        
        if (!phoneNumb) {
            let errMsg = message.create({
                title: 'Missing phone number',
                message: 'Please enter the phone number before saving.',
                type: message.Type.ERROR
            });
            errMsg.show();  // Show error message
            return false;   // Prevent form submission
        }

        // If phone number exists, allow the form to submit
        return true;
    }

    return {
        saveRecord: saveRecord  // Return the correct function
    };
});


