const { inspect } = require('util');
const { readFileSync } = require('fs');
const { basename } = require('path');
const { sizeof } = require('sizeof');

const {
    buildIndex,
    lookupIterative,
    lookupRecursive,
    lookupRecursiveSingleCharWildcard,
    lookupRecursiveMultiCharWildcard,
} = require('./index');

// Utility functions
function dump(obj) {
  return util.inspect(obj, false, null, true);
}

function time(title, func) {
  const start = Date.now();
  const result = func();
  const took = Date.now()-start;
  console.log(`${title}: ${took}ms`);
  return result;
}

// Process args & set up runs
const args = process.argv.slice(2);

const MAX_ITERATIONS = Number(args[0]);
const QUERY_TERM = args[1];

if(!MAX_ITERATIONS || !QUERY_TERM) {
  console.error(`  usage: node ${basename(process.argv[1])} ITERATIONS QUERY_TERM\n\nBuild an index from the words in assets/words_alpha.txt and then search it ITERATIONS times for the query string QUERY_TERM.\n`);
  process.exit(0);
}

// Load dictionary and build index
const words = readFileSync('./assets/words_alpha.txt', { encoding:'utf8' }).split('\n').map(w => w.trim());
const shortest = words.reduce((acc, word) => Math.min(acc, word.length), Infinity);
const longest = words.reduce((acc, word) => Math.max(acc, word.length), 0);

console.log(`Building index of ${words.length} words`)
const start = Date.now();
const index = buildIndex({}, words);
console.log(`  ... done: ${Date.now()-start}ms`);
console.log(`  shortest word   : ${shortest} chars`);
console.log(`  longest word    : ${longest} chars\n`);
//console.log(`  estimated memory: ${sizeof(index)} bytes\n`);  // Careful; can take a *long* time to walk huge structures like an entire dictionary index

time(`lookupIterative ${QUERY_TERM}`, () => {
  for(let i=0; i<MAX_ITERATIONS; i++) {
    lookupIterative(index, QUERY_TERM, true);
  }
});

time(`lookupRecursive ${QUERY_TERM}`, () => {
  for(let i=0; i<MAX_ITERATIONS; i++) {
    lookupRecursive(index, QUERY_TERM, true);
  }
});

time(`lookupRecursiveSingleCharWildcard ${QUERY_TERM}`, () => {
  for(let i=0; i<MAX_ITERATIONS; i++) {
    lookupRecursiveSingleCharWildcard(index, QUERY_TERM, true);
  }
});

time(`lookupRecursiveMultiCharWildcard ${QUERY_TERM}`, () => {
  for(let i=0; i<MAX_ITERATIONS; i++) {
    lookupRecursiveMultiCharWildcard(index, QUERY_TERM, true);
  }
});
