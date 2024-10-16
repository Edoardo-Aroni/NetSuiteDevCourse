/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/file', 'N/runtime','N/format'],

    function(search, file, runtime, format) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(scriptContext) {

            var scriptObj = runtime.getCurrentScript();
            var folderId = scriptObj.getParameter({
                name: 'custscript_export_folder_id'
            });
            var searchId = scriptObj.getParameter({
                name: 'custscript_export_search_id'
            });
            var fileDescription = scriptObj.getParameter({
                name: 'custscript_export_file_desc'
            });
            var fileName = scriptObj.getParameter({
                name: 'custscript_export_file_name'
            });
            var newDate = new Date();
            var formattedDate = format.format({
                type: format.Type.DATETIME,
                value: newDate
            });
            var stringDate = formattedDate.toString();
            fileName = fileName+' '+stringDate;

            var parameterAttributes = {
                searchId : searchId,
                fileName : fileName,
                fileDescription : fileDescription,
                folderId : folderId
            };

            log.debug({title:'parameterAttributes',details:parameterAttributes});


            try{
                createFile(parameterAttributes);
            }
            catch(e){
                log.error({title:'error',details:e});
            }




        }


        function createFile(parameterAttributes){

            var searchToExport = search.load({
                id: parameterAttributes.searchId
            });


            var columns = searchToExport.columns;

            //Creating arrays that will populate results
            var content = new Array();
            var cells = new Array();
            var headers = new Array();
            var temp = new Array();
            var x = 0;


            for(var i=0; i< columns.length; i++){
                headers[i] = columns[i].label;
            }


            var fileObj = file.create({
                name: parameterAttributes.fileName,
                fileType: file.Type.CSV,
                contents: headers.toString() + '\n',
                description: parameterAttributes.fileDescription,
                folder: parameterAttributes.folderId
            });


            // Run paged version of search with 1000 results per page
            var myPagedData = searchToExport.runPaged({
                "pageSize": 1000
            });


            // Iterate over each page
            myPagedData.pageRanges.forEach(function(pageRange){

                // Fetch the results on the current page
                var myPage = myPagedData.fetch({index: pageRange.index});

                // Iterate over the list of results on the current page
                myPage.data.forEach(function(result){


                    //looping through each columns
                    for(var y=0; y< columns.length; y++){

                        var searchResult;
                        var searchResultText = result.getText(columns[y]);
                        var searchResultValue = result.getValue(columns[y]);

                        if(searchResultText){
                            searchResult = searchResultText;
                        }
                        else{
                            searchResult = searchResultValue;
                        }

                        if(searchResult){
                            searchResult = searchResult.replace(/,/g,'')
                            searchResult = searchResult.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,'')
                        }

                        temp[y] = searchResult;


                    }

                    content[x] = '';
                    content[x] +=temp;
                    x++;
                });
            });



            log.debug({title:'content.length',details:content.length});

            for(var z =0; z<content.length;z++){

                fileObj.appendLine({
                    value: content[z].toString()
                });
            }


            fileObj.save();



        }

        function isEmpty(fldValue) {


            return fldValue == '' || fldValue == null || fldValue == undefined;


        }

        function nl2br(str, is_xhtml) {


            var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br/>' : '<br>';


            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');


        }

        return {
            execute: execute
        };

    });