function addingMachine(...terms) {
    // Initialize the total we'll be returning
    var total = 0;

    // Loop through all the arguments
    for (var i = 0; i < terms.length; i++) {
        var number = terms[i];
        // Check if the argument is a number
        if (typeof number === 'number') {
            total += number;
        }
    }

    // Return the total after the loop finishes
    return total;
}

addingMachine(5,6,1);

function bake(temp = 360, time = 35, ... flavors){
    console.log(`Let's bake this cake at ${temp} degrees`,);
    console.log(`for ${time} minutes\n`);

    if (flavors.length > 0) {
        console.log("And let's not forgets these flavors",  flavors);
    }
    console.log("Arguments contais everything", arguments)
}
