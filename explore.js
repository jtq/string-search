const { inspect } = require('util');
const { readFileSync } = require('fs');
const { basename } = require('path');
const util = require('util');

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

const LOOKUP_FUNCTION = {
    'iterative':    lookupIterative,
    'recursive':    lookupRecursive,
    'single':       lookupRecursiveSingleCharWildcard,
    'multi':        lookupRecursiveMultiCharWildcard,
}[args[0]];
const QUERY_TERM = args[1];
const EXACT_MATCH = typeof args[2] === 'undefined' ? true : Boolean(args[2] !== 'false');
const DICTIONARY_FILE = args[3] || './assets/words_alpha.txt';

if(!LOOKUP_FUNCTION || !QUERY_TERM) {
  console.error(`  usage: node ${basename(process.argv[1])} LOOKUP_FUNCTION QUERY_TERM [EXACT_MATCH] [DICTIONARY_FILE]\n\nBuild an index from the words in DICTIONARY_FILE and then search it using LOOKUP_FUNCTION for ther query string QUERY_TERM.\n`);
  process.exit(0);
}

// Load dictionary and build index
const words = readFileSync(DICTIONARY_FILE, { encoding:'utf8' }).split('\n').map(w => w.trim());
const shortest = words.reduce((acc, word) => Math.min(acc, word.length), Infinity);
const longest = words.reduce((acc, word) => Math.max(acc, word.length), 0);

console.log(`Building index of ${words.length} words`)
const start = Date.now();
const index = buildIndex(words);
console.log(`  ... done: ${Date.now()-start}ms`);
console.log(`  shortest word   : ${shortest} chars`);
console.log(`  longest word    : ${longest} chars\n`);

const result = time(`${LOOKUP_FUNCTION.name} ${EXACT_MATCH ? 'exact' : 'loose'} match for "${QUERY_TERM}"`, () => {
    return LOOKUP_FUNCTION(index, QUERY_TERM, EXACT_MATCH);
});

console.log(dump(result));