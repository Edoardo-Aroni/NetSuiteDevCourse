// for loop
for (let i = 0; i < 10; i++) {
    console.log(i);
}

// while loop
let i = 0;
while (i < 10){
    console.log(i);
    i++;
}

var myList = [true, true, true, false, true, true];
var myItem = null;
// This really helps to deal with situations where you don't know the contents of a set of data,
// and you have a condition where you're sure
while (myItem !== false){
    console.log(
        'my list has ' +
        myList.length +
        " items now. This loop will keep going until we pop a false."
    )
    myItem = myList.pop();
}

// do while loop
// it makes sure that the conditions defined in the curly braces are executed at least 1 time

do {
    console.log(
        'my list has ' +
        myList.length +
        " items now. This loop will keep going until we pop a false."
    );
    myItem =myList.pop();    
} while (myItem !== false);