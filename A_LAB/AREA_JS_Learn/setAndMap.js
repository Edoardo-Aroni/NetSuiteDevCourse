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

