/*
Set and Map

Set are like arrays, except:
- set store each value exactly and only once
- must be accessed and changed using special methods

Maps are like object, exceptions:
- map preserve the order of keys
  - for loops are predictable. They come back always in the same order
- must be accessed and changed using special methods
*/

// create using constructors
//to create new set
let mySet = new Set();
//to create new map
let myMap = new Map();

// to add  to the set
mySet.add('juno');
//does not include the same method used for array to check if the value exist
myset[0]== 'juno'  // will not work
//instead set has is own method
mySet.has('juno') === true;

// accessing Map uses special methods
myMap.thing1         // does not work
myMap.get('thing1');  // work

// this array has two copies of its first item
let myList = [1,1,2,3,5,8,13,'fibonacci'];

//the same thing using the Set API
let mySet = new Set();
mySet.add(1);
mySet.add(1); //this won't change mySet, since 1 is already in there
mySet.add(2);
mySet.add(3);
mySet.add(5);
mySet.add(8);
mySet.add(13);
mySet.add('fibonacci');

// how transform an array into a set and remove duplicates
// by passing an array to the set constructor
let mySet2 = new Set(myList);
//to check if an item is in the set
mySet2.has(5); // return true

//how to loop through the items in the set
for(let item of mySet2) {
  console.log('myset contains', item);
}

// comparing Map to Object

//this object is a bird
var bird = {
  genus: 'corvus',
  species: 'corvax',
  commonName:'raven',
}

//to create a Map
var birdMap = new Map();
birdMap.set('genus','corvus'); // the set method has the Key, Value pairs
birdMap.set('species','corvax');
birdMap.set('commonName','raven');

//to get a value by his key use the get method
birdMap.get('genus'); //corvus

//Map has also an has method to check if a key exists but it does now work for values
birdMap.has('species'); //true
birdMap.has('corvax'); // false (it works only for keys)

// for loop work on Maps,  with key and value returned
for(let value of birdMap) {
  console.log(value);
} // it returns a series of arrays with key and values

// using the entries method we get a similar output but with different format
birdMap.entries();

// how to convert an objet to a Map
Object.entries(bird); // return an array of arrays

//to create a new bird Map from an object
birdMap2 = new Map(Object.entries(bird));












