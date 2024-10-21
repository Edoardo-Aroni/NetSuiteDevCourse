/**
 * Business scope:
 * Validate if phone number is filled out when user submits the customer record.
 * If empty, show an error message and prevent the form submission.
 * Get message title and text from script parameters
 *
 * Date                 Author                      Comments
 * 18 Oct 2024          Edo Aroni                   N/A
 * 
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/ui/message', 'N/runtime'], function(message, runtime) {
    const saveRecord = (context) => {

        const customer  = context.currentRecord;
        const phoneNumb = customer.getValue({ fieldId: 'phone' }); 

        // Get script parameters for error message title and text
        const msgTitle  = runtime.getCurrentScript().getParameter({name: 'custscript_msg_title'});  
        const msgText   = runtime.getCurrentScript().getParameter({name: 'custscript_msg_txt'});
        
        if (!phoneNumb) {
            let errMsg = message.create({
                title: msgTitle || 'set custom title', // Fallback if msgTitle is null
                message: msgText || 'set custom message', // Fallback if msgText is null
                type: message.Type.ERROR
            });

            errMsg.show();  // Show error message
            return false;   // Prevent form submission
        }

        // If phone number exists, allow the form to submit
        return true;
       
    }
    return {
        saveRecord  // Return the correct function
    };
});


