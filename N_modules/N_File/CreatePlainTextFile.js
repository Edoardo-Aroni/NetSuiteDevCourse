//Create a  Plaintext file with a simple Hello World

require(['N/file'], (file) => {
    // Create a Plaintext file
     let fileObj = file.create({
         name: 'HelloWorld.txt',
         fileType: 'PLAINTEXT',
         contents: `Hello World!`
     });
  
     //Specify the folder. 
     fileObj.folder = 191; // internal id of the folder in the File Cabinet
  
     // Save the file
     let fileId = fileObj.save();
     log.debug({
      title: 'File successfully saved!',
      details: fileId
     });
  });