const test = require('ava');

const {
    buildIndex,
    lookupIterative,
    lookupRecursive,
    lookupRecursiveWildcard,
} = require('./index');

test.beforeEach('', (t) => {
  const strings = ['a', 'ant', 'ante', 'antediluvian', 'abet', 'abut', 'be', 'bet', 'boy', 'boil', 'but'];
  t.context.data = {
    strings: strings,
    index: buildIndex(strings),
  };
});

test('missing exact match at beginning of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'xyz', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'xyz', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'xyz', true), [], 'lookupRecursiveWildcard');
});

test('missing exact match in middle of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abxt', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abxt', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abxt', true), [], 'lookupRecursiveWildcard');
});

test('missing exact match at end of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abex', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abex', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abex', true), [], 'lookupRecursiveWildcard');
});

test('incomplete exact match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abe', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abe', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abe', true), [], 'lookupRecursiveWildcard');
});

test('exact match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abet', true), [ {'abet':true} ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', true), [ {'abet':true} ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abet', true), [ {'abet':true} ], 'lookupRecursiveWildcard');
});




test('missing loose match at beginning of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'xyz', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'xyz', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'xyz', false), [], 'lookupRecursiveWildcard');
});

test('missing loose match in middle of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abxt', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abxt', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abxt', false), [], 'lookupRecursiveWildcard');
});

test('missing loose match at end of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abex', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abex', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abex', false), [], 'lookupRecursiveWildcard');
});

test('incomplete loose match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupRecursiveWildcard');
});

test('loose match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abet', false), [ { null: { abet: true } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', false), [ { null: { abet: true } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveWildcard(index, 'abet', false), [ { null: { abet: true } } ], 'lookupRecursiveWildcard');
});




test('exact match wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, '?bet', true), [ { abet: true } ], 'lookupRecursiveWildcard');
});
test('missing exact match wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, '?bex', true), [], 'lookupRecursiveWildcard');
});

test('exact match wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'a?et', true), [ { abet: true } ], 'lookupRecursiveWildcard');
});
test('missing exact match wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'a?ex', true), [], 'lookupRecursiveWildcard');
});

test('exact match wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'abe?', true), [ { abet: true } ], 'lookupRecursiveWildcard');
});




test('loose match wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, '?bet', false), [ { null: { abet: true } } ], 'lookupRecursiveWildcard');
});
test('missing loose match wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, '?bex', false), [], 'lookupRecursiveWildcard');
});

test('loose match wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'a?et', false), [ { null: { abet: true } } ], 'lookupRecursiveWildcard');
});
test('missing loose match wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'a?ex', false), [], 'lookupRecursiveWildcard');
});

test('loose match wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveWildcard(index, 'abe?', false), [ { null: { abet: true } } ], 'lookupRecursiveWildcard');
});
