# Prototype String Search Engine

Create a simple trie-based search index from an array of strings, then use a variety of different functions with different features and optimisations to query it.

## Usage

```
const { buildIndex, lookupIterative } = require('string-search');
const words = [ 'a', 'aa', 'aaa', 'aah'... 'zwinglianist', 'zwitter', 'zwitterion', 'zwitterionic'];
const index = buildIndex(words);
console.log(lookupIterative(index, 'infinitesimal', true));
```

### Implemented lookup functions

#### lookupIterative(index, query, exactMatch)

Attempt at a maximally-efficient lookup using iteration to avoid function-invocation or object-allocation overheads.  Does not support wildcards or any advanced functionality.

#### lookupRecursive(index, query, exactMatch)

Functionally identical to `lookupIterative()`, but uses recursion and object-allocation rather than iteration.  Fairly consistently around 1.75x slower than `lookupIterative()`, but a simper cleaner base on which to build more advanced lookup functions.  Does not support wildcards or any advanced functionality.

#### lookupRecursiveSingleCharWildcard(index, query, exactMatch)

An extension of `lookupRecursive()`, that supports single-character wildcards in queries with `?`.  Around 1.6x slower than `lookupRecursive()` and 2.8x slower than `lookupIterative()`.

#### lookupRecursiveMultiCharWildcard(index, query, exactMatch)

An initial, extremely naive extension of `lookupRecursiveSingleCharWildcard()` that supports multi-character wildcards in queries with `*`.  Varies between equivalent speed and hundreds of times slower than `lookupRecursiveSingleCharWildcard()`, depending on where the `*` wildcard appears in the query.

When run in non-exact mode returns every possible matching combination of wildcard and letters for every matching word in the index, which gets very big, and very slow, very fast.

## Tests

`npm test`

## Performance Testing

`npm run performance 1000000 supermarket`