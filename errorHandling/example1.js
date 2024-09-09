try{
    var supervisor = record.load({
        type: record.Type.EMPLOYEEx  //error
        id: 99999999 //error
    });
} catch(e){
    var ex = JSON.parse(e);
    var errorMsg = 'Error: ' + ex.name + '\n' +
                   'Message' + ex.message;
    if (ex.type == 'error.SuiteScriptError'){
        errorMsg = errorMsg + '\n' +
                    'ID: '    + ex.id + '\n' +
                    'Cause: ' + ex.cause + '\n' +
                    'Stack Trace: ' + ex.stack;
    }
    if (ex.type == 'error.UserEventError'){
        errorMsg = errorMsg + '\n' +
                    'ID :'          + ex.id + '\n' +
                    'Event Type: '  + ex.eventType + '\n' +
                    'Record ID: '   + ex.recordID + '\n' +
                    'Stack Trace: ' + ex.stack;
    }
    log.debug(errorType, errorMsg);

    }
