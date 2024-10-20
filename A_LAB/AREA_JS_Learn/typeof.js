let thing = 12;
typeof thing; // return 'number'
let thing = 'twelve';
typeof thing; // return 'string'
let thing = {};
typeof thing; // return 'object'

// watch out for arrays and objects
let thing = [];
typeof thing; // return 'object'  Technically we know hat in JS is a object but
              // arrays have their own properties
// how to check if it is an array
typeof thing === 'object' && thing.hasOwnProperty('length'); // return true
let thing = {};
typeof thing === 'object' && thing.hasOwnProperty('length'); // return false

// watch out for nulls and objects
let thing = null;
typeof thing // return object

thing === null; // return true

// return undefined when a variable is never associatated with a value or doesn't
//  exist





                                                        
