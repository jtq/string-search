# Prototype String Search Engine

Create a simple trie-based search index from an array of strings, then use a variety of different functions with different features and optimisations to query it.

## Usage

```
const { buildIndex, lookupIterative } = require('string-search');
const words = [ 'a', 'aa', 'aaa', 'aah'... 'zwinglianist', 'zwitter', 'zwitterion', 'zwitterionic'];
const index = buildIndex({}, words);
console.log(lookupIterative(index, 'infinitesimal', true));
```

## Advanced index building

### Progressively add a value to an existing index

```
const index = buildIndex({}, [...]);
const newIndex = addToIndex(index, 'newterm');    // Mutates existing index object but also returns it for convenience
console.log(index === newIndex);
```

### Progressively add array of values to an existing index

```
const index = buildIndex({}, [...]);
const newIndex = buildIndex(index, [...]);    // Mutates existing index object but also returns it for convenience
console.log(index === newIndex);
```

### Partition matches into different categories

```
const index = buildIndex({}, ['a', 'at'], 'category');
addToIndex(index, 'at', 'othercat');
addToIndex(index, 'be', 'othercat');
console.log(index.a[null] === { _category: { _a:true } });
console.log(index.a.t[null] === { _category: { _at: true }, _othercat: { _at: true } });
console.log(index.b.e[null]._othercat === { _be: true });
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

## Tests

`npm test`

## Performance Testing

`npm run performance 1000000 supermarket`