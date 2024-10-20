var string1 = "This is the longest string ever.";
var string2 = "This is the shortest string ever."
var string3 = "Is this the thing called Mount Everest?";
var string4 = "This is the Sherman on the Mount.";


var regex = /this/; // check for the word 'this'

regex.test(string1); // return false
regex.test(string2); // return false
regex.test(string3); // return true
regex.test(string4); // return false


var regex = /this/i;   // the i after the slash made the search case insensitive

regex.test(string1); // return true
regex.test(string2); // return true
regex.test(string3); // return true
regex.test(string4); // return true


var regex = /^this/i; // match at the beginning of the string

regex.test(string1); // return true
regex.test(string2); // return true
regex.test(string3); // return false
regex.test(string4); // return true

var regex = /this$/i; // match at the end of the string

regex.test(string1); // return false
regex.test(string2); // return false
regex.test(string3); // return false
regex.test(string4); // return false

var regex = /ever.$/i;  // check if the word 'ever' appears at the end

regex.test(string1); // return true
regex.test(string2); // return true
regex.test(string3); // return false
regex.test(string4); // return false

var regex = /ever\.$/i; // to chech for the word 'ever.' with the dot 
                        // we need to escape the dot in order to include 
                        // it in the search.

                     
regex.test(string1); // return true
regex.test(string2); // return true
regex.test(string3); // return false
regex.test(string4); // return false
