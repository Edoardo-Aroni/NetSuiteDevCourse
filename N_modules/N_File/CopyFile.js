// Restrict a user from copying a file if the file already exists in the folder.

require(['N/file'], (file) => {
    const fileId = 2526; // CSV file
    const folder = 192
  
    try{
        let copyFileObj = file.copy({
            folder: folder,
            id: fileId,
            conflictResolution: file.NameConflictResolution.OVERWRITE
        });
        log.debug({
            title: 'File successfully copied!',
            details: copyFileObj,
        });
    }catch (error) {
        log.error({
            title: 'Error!',
            details: 'You cannot copy a file that already exists. Please use a conflict resolution...'
        });
    }
  });