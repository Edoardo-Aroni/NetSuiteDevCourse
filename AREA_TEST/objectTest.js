const map =  new Map();
map.set('EMT-DES',['A','B','C']);

console.log(map.get('EMT-DES'));


const sweep = new Map();

// Corrected 'new map()' to 'new Map()'
sweep.set('EMT', new Map([
    ['EMT_A', ['A', 'B', 'C']],
    ['EMT_B', ['Z', 'Y', 'W']]
]));

// Accessing values in the nested map
console.log(sweep.get('EMT').get('EMT_A'));  // Output: ['A', 'B', 'C']

const emtA = ['A','B','C'];
const emtB= ['Z','Y','W'];

sweep.set('EMT', new Map([
    ['EMT_A', emtA],
    ['EMT_B', emtB]
]));

// Accessing values in the nested map
console.log(sweep.get('EMT'));
console.log(sweep.get('EMT').get('EMT_A')); 
