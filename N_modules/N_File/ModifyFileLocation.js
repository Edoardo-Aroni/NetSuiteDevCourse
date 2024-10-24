//Modify the file location after save. This mimics the Cut + Paste in the File Cabinet
require(['N/file'], (file) => {

    let fileObj = file.load({
       id : 2544 // internal id of the folder in the File Cabinet
    });
    let fileId;
 
    try {
        //Change file location
        fileObj.folder = 193; // internal id of a new or existing folder in the File Cabinet
        fileId = fileObj.save();

        log.debug({
            title: 'File successfully saved!',
            details: fileId
        });
    } catch (error) {
        log.error({
            title: error.name,
            details: error.message
        });
    }
 });