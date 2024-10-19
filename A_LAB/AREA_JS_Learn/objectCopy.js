let car = {
    maker: "Fiat",
    country: "Italy",
    model: "127",
    isPetrol: true
};

//wrong way
let car2 = car;

car2.maker; // 'Fiat'

car2.maker = 'Renault';

car.maker; // Renault   The car object get updated too because it is the same object, 
           // the two objects are simply to different variable names pointing to the same
           // value in memory

// how to copy an object safely
// method 1

let car = {
    maker: "Fiat",
    country: "Italy",
    model: "127",
    isPetrol: true
};

car2 = Object.assign({}, car);

car.maker = "Lancia";
car2.maker = "Citroen";

car.maker; // 'Lancia'
car2.maker; // 'Citroen'

//method 2

let car = {
    maker: "Fiat",
    country: "Italy",
    model: "127",
    isPetrol: true
};

car2 = {...car};

car.maker = "Lancia";
car2.maker = "Citroen";

car.maker; // 'Lancia'
car2.maker; // 'Citroen'

// method 3
let car = {
    maker: "Fiat",
    country: "Italy",
    model: "127",
    isPetrol: true
};

car2 = JSON.parse(JSON.stringify(car));

car.maker = "Lancia";
car2.maker = "Citroen";

car.maker; // 'Lancia'
car2.maker; // 'Citroen'





