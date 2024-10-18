const students = [
    {name: 'John', grade: 75},
    {name: 'Jane', grade: 93},
    {name: 'Sam', grade: 90},
    {name: 'Mike', grade: 94},
];

students.sort((a,b)=>b.grade - a.grade);

console.log(students);

students.reverse();

console.log(students);

const firstStudentOver80 = students.find((student) => student.grade > 80 );

console.log(firstStudentOver80);

const bowlingScores = [154, 204, 300, 184, 286];

const includes300 = bowlingScores.includes(300);

console.log(includes300);

const someScores = bowlingScores.some((score) => score < 150);
console.log(someScores);

const everyScoresEven = bowlingScores.every((score) => score % 2 === 0);

console.log(everyScoresEven);


const drinks = ['coffee', 'tea', 'soda','water'];

drinks.push('wine');

console.log(drinks);

const seasons = ['spring', 'summer','fall', 'winter'];

seasons.pop();
console.log(seasons);


const ages = [18, 33, 71, 29, 65, 62];
ages.unshift(36);
console.log('ages', ages);

const countries = ['spain','france','germany','portugal','denmark'];
const shiftedCountry = countries.shift();
console.log('shiftedCountry', shiftedCountry);
console.log('countries',countries);


const foods = [
    {food: 'raspberries', type: 'fruit'},
    {food: 'orange', type: 'fruit'},
    {food: 'broccoli', type: 'vegetable'},
    {food: 'quinoa', type: 'grain'},
];

const blackBeans = {food: 'black beans', type: 'legume'};
const chiaSeeds  = {food: 'chia seeds', type: 'seed'};

//remove last item in the foods array
foods.pop();
//remove the first item in the food array
foods.shift();
// add the variable blackBeans to the beginning of the foods array
foods.unshift(blackBeans);
// add the variable chiaSeeds to the end of the foods array
foods.push(chiaSeeds);
console.log('updated foods array', foods);


//map()

const grades = [88, 75, 92, 95, 85];
//let bonusGrades = grades.map((grade) => {return grade + 5}); //explicit

let bonusGrades = grades.map((grade) => grade + 5);
console.log('bonus grades', bonusGrades);


const friends = [
    {firstname: 'Jane', lastname: 'Doe'},
    {firstname: 'John', lastname: 'Smith'},
    {firstname: 'Alex', lastname: 'Trebek'}
];
//const FullName = friends.map((friend) => friend.firstname + ' ' + friend.lastname);

const FullName = friends.map((friend) => `${friend.firstname} ${friend.lastname}`);


console.log('Full Name', FullName);

//filter()
const pets = [
    {name: 'fido', type: 'dog'},
    {name: 'sally', type: 'cat'},
    {name: 'alan', type: 'dog'},
    {name: 'miao', type: 'cat'}
];

const cats = pets.filter((pet) => pet.type ==='cat');

console.log('cats', cat);

// reduce()

const sales = [4, 2.5, 5.5, 1.5, 2, 2.5, 6];

const totalSales = sales.reduce((total, amount) => total + amount);
console.log(totalSales);


//flatMap()
const allowance = [[20],[15],[18]];

const doubleAllowance = allowance.flatMap((value) => [value*2]);

console.log('Double Allowance', doubleAllowance);




