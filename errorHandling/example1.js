try{
    var supervisor = record.load({
        type: record.Type.EMPLOYEEx,  //error
        id: 99999999 //error
    });
} catch(e){
    var ex = JSON.parse(e);  //convert error message from json format to javascript object
    var errorMsg = 'Error: ' + ex.name + '\n' +   //standard JS Exceptions
                   'Message' + ex.message;
    if (ex.type == 'error.SuiteScriptError'){  //specific suitescript error
        errorMsg = errorMsg + '\n' +
                    'ID: '    + ex.id + '\n' +
                    'Cause: ' + ex.cause + '\n' +
                    'Stack Trace: ' + ex.stack;
    }
    if (ex.type == 'error.UserEventError'){  //specific suitscript error inside user event script
        errorMsg = errorMsg + '\n' +
                    'ID :'          + ex.id + '\n' +
                    'Event Type: '  + ex.eventType + '\n' +
                    'Record ID: '   + ex.recordID + '\n' +
                    'Stack Trace: ' + ex.stack;
    }
    log.debug(errorType, errorMsg);

    }
