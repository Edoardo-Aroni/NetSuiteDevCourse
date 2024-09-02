/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */

define(['N/runtime'],
    /**
     * 
     * @param {runtime} runtime 
     * @returns 
     */
    function(runtime){
        return {
            saveRecord: function saveRecord(context){
               var script = runtime.getCurrentScript();
               var recordType = script.getParameter({
                name: 'custscript_sdr_save_record_type'
               });
               var displaySaveConfirmation = script.getParameter({
                name: 'custscript_sdr_save_confirmation'
               });

               if (displaySaveConfirmation) {
                    var confirmation = confirm('Click OK if are sure you would like to confirm your change' + '\n' +
                    'for this ' + recordType + '. Click Cancel to continue editing.');
                    if(confirmation) {
                        return true;
                    } else {
                        return false;
                    }
               } else {return true;}                                                                                                         
            }
        }    
    }
);