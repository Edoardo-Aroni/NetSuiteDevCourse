/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/*
Business scope: Generate a plaintext file that contains a list of tasks that are
not started.
*/

define(['N/query', 'N/file'], (query, file) => {

    const getInputData = () => {
        // Create the SuiteQL query string
        const taskSuiteQLquery = `SELECT
                                    t.title,
                                    BUILTIN.DF(t.assigned) AS assigned_to,
                                    t.dueDate,
                                    t.status,
                                    BUILTIN.DF(e.supervisor) as supervisor
                                  FROM
                                    task as t
                                    JOIN employee AS e
                                    ON t.assigned = e.id
                                  WHERE
                                    t.status = 'NOTSTART'`;

        // Execute SuiteQL                            
        const resultSet = query.runSuiteQL(taskSuiteQLquery);
        // Get the results
        const results = resultSet.results;

        // Log the length of the results
        log.debug({
            title: 'Query Length',
            details: results.length
        });

        // Pass the SuiteQL query reference in the return statement
        return {
            type: 'suiteql',
            query: taskSuiteQLquery
        };
    };

    const map = (context) => {
        // Parse the JSON query result
        const queryResult = JSON.parse(context.value);

        // Write output to create key-value pairs
        context.write({
            key: queryResult.values[0], // This will be the task title (or any unique identifier)
            value: context.value
        });
    };

    const reduce = (context) => {
        // Write the first key-value pair to the output
        context.write({
            key: context.key,
            value: context.values[0] // Only taking the first value in case of multiple
        });
    };

    const summarize = (summary) => {
        // Initialize the file data with a CSV header
        let fileData = "Title, Assigned_To, Due Date, Status, Supervisor\n";

        // Iterate over the output from the reduce phase
        summary.output.iterator().each((key, value) => {
            try {
                // Parse the value into JSON format
                const taskData = JSON.parse(value);

                const title = taskData.values[0]; // Task title
                const assigned_to = taskData.values[1]; // Assigned to
                const duedate = taskData.values[2]; // Due date
                const status = taskData.values[3]; // Status
                const supervisor = taskData.values[4]; // Supervisor

                // Append the data to the CSV string
                fileData += `${title}, ${assigned_to}, ${duedate}, ${status}, ${supervisor}\n`;
            } catch (e) {
                log.error({
                    title: 'Error Processing Summarize Data',
                    details: `Error processing key ${key}: ${e}`
                });
            }
            return true; // Continue iterating
        });

        // Create a CSV file
        const fileObj = file.create({
            name: 'not_started_tasks.txt',
            fileType: file.Type.PLAINTEXT,
            contents: fileData,
            folder: 199
        });

        // Save the file and log the file ID
        const fileId = fileObj.save();
        log.audit('File created', `File ID: ${fileId}`);
    };

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
