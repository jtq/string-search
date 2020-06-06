const test = require('ava');
const util = require('util');

const {
    buildIndex,
    lookupIterative,
    lookupRecursive,
    lookupRecursiveSingleCharWildcard,
    lookupRecursiveMultiCharWildcard,
} = require('./index');

test.before('', (t) => {
  const strings = ['a', 'ant', 'ante', 'antediluvian', 'abet', 'abut', 'be', 'bet', 'boy', 'boil', 'but'];
  t.context.data = {
    strings: strings,
    index: buildIndex(strings),
    tinyIndex: buildIndex(['a', 'ant', 'be', 'boy'])
  };

  //console.log(util.inspect(t.context.data.index, false, null, true));
});

test('missing exact match at beginning of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'xyz', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'xyz', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'xyz', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'xyz', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('missing exact match in middle of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abxt', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abxt', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abxt', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abxt', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('missing exact match at end of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abex', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abex', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abex', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abex', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('incomplete exact match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abe', true), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abe', true), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abe', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('exact match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abet', true), [ {'abet':true} ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', true), [ {'abet':true} ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abet', true), [ {'abet':true} ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abet', true), [ {'abet':true} ], 'lookupRecursiveMultiCharWildcard');
});




test('missing loose match at beginning of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'xyz', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'xyz', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'xyz', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'xyz', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('missing loose match in middle of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abxt', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abxt', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abxt', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abxt', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('missing loose match at end of search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abex', false), [], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abex', false), [], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abex', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abex', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('incomplete loose match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe', false), [ { t: { null: { abet: true } } } ], 'lookupRecursiveMultiCharWildcard');
});

test('loose match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abet', false), [ { null: { abet: true } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', false), [ { null: { abet: true } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abet', false), [ { null: { abet: true } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abet', false), [ { null: { abet: true } } ], 'lookupRecursiveMultiCharWildcard');
});




test('exact match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bet', true), [ { abet: true } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bet', true), [ { abet: true } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing exact match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bex', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bex', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('exact match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?t', true), [ { abet: true }, { abut: true } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?t', true), [ { abet: true }, { abut: true } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing exact match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?x', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?x', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('exact match single-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abe?', true), [ { abet: true } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe?', true), [ { abet: true } ], 'lookupRecursiveMultiCharWildcard');
});

test('exact match only single-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(tinyIndex, '?', true), [
    { a: true }
  ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(tinyIndex, '?', true), [
    { a: true }
  ], 'lookupRecursiveMultiCharWildcard');
});



test('loose match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bet', false), [ { null: { abet: true } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bet', false), [ { null: { abet: true } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing loose match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bex', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bex', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('loose match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?t', false), [ { null: { abet: true } }, { null: { abut: true } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?t', false), [ { null: { abet: true } }, { null: { abut: true } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing loose match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'a?ex', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a?ex', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('loose match single-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?', false), [ { t: { null: { abet: true } } }, { t: { null: { abut: true } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?', false), [ { t: { null: { abet: true } } }, { t: { null: { abut: true } } } ], 'lookupRecursiveMultiCharWildcard');
});

test('loose match only single-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(tinyIndex, '?', false), [
    {
      null: { a: true },
      n: { t: { null: { ant: true } } }
    },
    {
      e: { null: { be: true } },
      o: { y: { null: { boy: true } } }
    }
  ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(tinyIndex, '?', false), [
    {
      null: { a: true },
      n: { t: { null: { ant: true } } }
    },
    {
      e: { null: { be: true } },
      o: { y: { null: { boy: true } } }
    }
  ], 'lookupRecursiveMultiCharWildcard');
});







test('exact match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bet', true), [ { abet: true } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*et', true), [ { abet: true }, { bet: true } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing exact match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bex', true), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*ex', true), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*t', true), [ { abet: true }, { abut: true } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*t', true), [ { ant: true }, { abet: true }, { abut: true } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing exact match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*x', true), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*x', true), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match multi-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe*', true), [ { abet: true } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*', true), [ { abet: true }, { abut: true } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match only multi-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;

  // Currently this will return every possible combination of letters and wildcard that match every word in the index, so it gets *huge* very quickly, even with very small indices
  t.deepEqual(
    lookupRecursiveMultiCharWildcard(tinyIndex, '*', true), [
      { a: true },
      { ant: true },
      { be: true },
      { boy: true }
    ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});




test('loose match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bet', false), [ { null: { abet: true } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*et', false), [ { null: { abet: true } }, { null: { bet: true } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing loose match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bex', false), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*ex', false), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('loose match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*t', false), [ { null: { abet: true } }, { null: { abut: true } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'b*l', false), [ { null: { boil: true } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing loose match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*x', false), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*x', false), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('loose match multi-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  //t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe*', false), [ { null: { abet: true } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*', false), [
    {
      e: { t: { null: { abet: true } } },
      u: { t: { null: { abut: true } } }
    },
  ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('loose match only multi-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;

  // Currently this will return every possible combination of letters and wildcard that match every word in the index, so it gets *huge* very quickly, even with very small indices
  t.deepEqual(
    lookupRecursiveMultiCharWildcard(tinyIndex, '*', false), [
      {
        a: {
          null: { a: true },
          n: { t: { null: { ant: true } } }
        },
        b: {
          e: { null: { be: true } },
          o: { y: { null: { boy: true } } }
        }
      }
    ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});