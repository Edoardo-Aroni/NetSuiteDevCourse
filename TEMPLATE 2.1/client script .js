/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    () => {
        
   
        // Function to be executed after page is initialized.
        const pageInit = (context) => {
    
        }
    
        // Function to be executed when field is changed.
        const fieldChanged = (context) => {
    
        }
    
        // Function to be executed when field is slaved.
        const postSourcing = (context) => {
    
        }
    
        // Function to be executed after sublist is inserted, removed, or edited.
        const sublistChanged = (context) => {
    
        }
    
        // Function to be executed after line is selected.
        const lineInit = (context) => {
    
        }
    
        // Validation function to be executed when field is changed.
        const validateField = (context) => {
    
        }
    
        // Validation function to be executed when sublist line is committed.
        const validateLine = (context) => {
    
        }
    
        // Validation function to be executed when sublist line is inserted.
        const validateInsert = (context) => {
    
        }
    
        // Validation function to be executed when record is deleted.
        const validateDelete = (context) => {
    
        }
    
        // Validation function to be executed when record is saved.
        const saveRecord = (context) => {
    
        }
    
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord
        };
        
    });