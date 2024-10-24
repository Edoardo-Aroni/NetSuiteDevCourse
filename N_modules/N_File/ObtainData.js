/*
  Create a customer list view and export it as CSV. Obtain the customer's full name by concatenating their First and Last name.

  Configuration:
  Create a custom Customer List View
  Filter results where Is Indiviual = Yes
  Add the following fields in the Results subtab: First Name, Last Name, Balance
  Click Save
  Export View as CSV
  Upload the file to the File Cabinet
*/


require(['N/file'], (file) => {
    let fileId = 2542; // the internal ID of the file in the File Cabinet
    let fileObj = file.load({id: fileId});
    let fullName;
 
    // Obtain an iterator to process each line in the file
    let iterator = fileObj.lines.iterator();
 
    // Skip the first line, which is the CSV header line
    iterator.each(() => {return false;});
 
    iterator.each((line) => {
        try {
          let lineValues = line.value.split(',');
          fullName = `${lineValues[1]} ${lineValues[2]}`;
 
          log.debug(fullName);
         } catch (error) {
             log.error({
                 title: error.name,
                 details: error.message
             })
         }
         return true;
    });
 });
 
 
