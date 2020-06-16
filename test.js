const test = require('ava');

const {
    buildIndex,
    buildIndexFromArrays,
    buildIndexFromField,
    addToIndex,
    lookupIterative,
    lookupRecursive,
    lookupRecursiveSingleCharWildcard,
    lookupRecursiveMultiCharWildcard,
} = require('./index');

test.before('', (t) => {
  const strings = ['a', 'ant', 'ante', 'antediluvian', 'abet', 'abut', 'be', 'bet', 'boy', 'boil', 'but'];
  t.context.data = {
    strings: strings,
    index: buildIndex({}, strings),
    tinyIndex: buildIndex({}, ['a', 'ant', 'be', 'boy'])
  };
});


test('add field to index - no category', t => {
  t.deepEqual(addToIndex({}, 'at'), {
    a: {
      t: { null: { undefined: { _at:new Set([true]) } } }
    }
  });
});

test('add field to index - custom value', t => {
  t.deepEqual(addToIndex({}, 'at', 'wibble'), {
    a: {
      t: { null: {
        undefined: { _at:new Set(['wibble']) } }
      }
    }
  });
});

test('add field to index - category', t => {
  t.deepEqual(addToIndex({}, 'at', true, 'category1'), {
    a: {
      t: { null: {
        _category1: { _at:new Set([true]) } }
      }
    }
  });
});

test('add fields to index - same string with different values', t => {
  const index = {};
  addToIndex(index, 'at', 1);
  addToIndex(index, 'at', 2);
  t.deepEqual(index, {
    a: {
      t: { null: {
        undefined: { _at:new Set([1,2]) } }
      }
    }
  });
});

test('add field to index mutates existing index and returns it', t => {
  const index = {};
  const newIndex = addToIndex(index, 'at')
  t.assert(index === newIndex);
});

test('build index - no category', t => {
  t.deepEqual(buildIndex({}, ['a', 'at', 'be']), {
    a: {
      null: { undefined: { _a:new Set([true]) } },
      t: { null: { undefined: { _at:new Set([true]) } } }
    },
    b: {
      e: { null: { undefined: { _be:new Set([true]) } } }
    }
  });
});

test('build index - category', t => {
  t.deepEqual(buildIndex({}, ['a', 'at', 'be'], true, 'category1'), {
    a: {
      null: {
        _category1: { _a:new Set([true]) }
      },
      t: { null: {
        _category1: { _at:new Set([true]) } }
      }
    },
    b: {
      e: { null: {
        _category1: { _be:new Set([true]) } }
      }
    }
  });
});

test('build index - custom value', t => {
  t.deepEqual(buildIndex({}, ['at'], 2), {
    a: {
      t: {
        null: { undefined: { _at:new Set([2]) } }
      }
    },
  });
});

test('build index from arrays', t => {
  t.deepEqual(buildIndexFromArrays({}, ['at','a'], [2,1]), {
    a: {
      null: { undefined: { _a:new Set([1]) } },
      t: {
        null: { undefined: { _at:new Set([2]) } }
      }
    },
  });
});

test('build index from objects', t => {
  const objects = [
    { name: 'a' },
    { name: 'b' },
    { name: 'at' }
  ];

  t.deepEqual(buildIndexFromField({}, objects, 'name'), {
    a: {
      null: { undefined: { _a: new Set([{ name: 'a' }]) } },
      t: {
        null: { undefined: { _at: new Set([{ name: 'at' }]) } }
      }
    },
    b: {
      null: { undefined: { _b: new Set([{ name: 'b' }]) } }
    }
  });
});

test('build multiple indices from object fields', t => {
  const objects = [
    { name: 'a', subject: 'c' },
    { name: 'b', subject: 'b' },
    { name: 'at', subject: 'a' }
  ];

  const index = buildIndexFromField({}, objects, 'name', 'name');
  buildIndexFromField(index, objects, 'subject', 'subject');
  t.deepEqual(index, {
    a: {
      null: {
        _name: { _a: new Set([objects[0]]) },
        _subject: { _a: new Set([objects[2]]) }
      },
      t: {
        null: {
          _name: { _at: new Set([objects[2]]) }
        }
      }
    },
    b: {
      null: {
        _name: { _b: new Set([objects[1]]) },
        _subject: { _b: new Set([objects[1]]) }
      }
    },
    c: {
      null: {
        _subject: { _c: new Set([objects[0]]) }
      }
    }
  });
});

test('build index mutates existing index and returns it', t => {
  const index = buildIndex({}, ['a']);
  const newIndex = buildIndex(index, ['at']);
  t.assert(index === newIndex);
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
  t.deepEqual(lookupIterative(        index, 'abet', true), [ { undefined: { _abet:new Set([true]) } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', true), [ { undefined: { _abet:new Set([true]) } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abet', true), [ { undefined: { _abet:new Set([true]) } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abet', true), [ { undefined: { _abet:new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard');
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
  t.deepEqual(lookupIterative(        index, 'abe', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abe', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abe', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } } ], 'lookupRecursiveMultiCharWildcard');
});

test('loose match search string', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupIterative(        index, 'abet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupIterative');
  t.deepEqual(lookupRecursive(        index, 'abet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursive');
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard');
});




test('exact match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bet', true), [ { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bet', true), [ { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing exact match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bex', new Set([true])), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bex', new Set([true])), [], 'lookupRecursiveMultiCharWildcard');
});

test('exact match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?t', true), [ { undefined: { _abet: new Set([true]) } }, { undefined: { _abut: new Set([true]) } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?t', true), [ { undefined: { _abet: new Set([true]) } }, { undefined: { _abut: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing exact match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?x', true), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?x', true), [], 'lookupRecursiveMultiCharWildcard');
});

test('exact match single-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'abe?', true), [ { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe?', true), [ { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard');
});

test('exact match only single-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(tinyIndex, '?', true), [
    { undefined: { _a: new Set([true]) } }
  ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(tinyIndex, '?', true), [
    { undefined: { _a: new Set([true]) } }
  ], 'lookupRecursiveMultiCharWildcard');
});



test('loose match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bet', false), [ { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing loose match single-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, '?bex', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '?bex', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('loose match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?t', false), [ { null: { undefined: { _abet: new Set([true]) } } }, { null: { undefined: { _abut: new Set([true]) } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?t', false), [ { null: { undefined: { _abet: new Set([true]) } } }, { null: { undefined: { _abut: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard');
});
test('missing loose match single-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'a?ex', false), [], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a?ex', false), [], 'lookupRecursiveMultiCharWildcard');
});

test('loose match single-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(index, 'ab?', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } }, { t: { null: { undefined: { _abut: new Set([true]) } } } } ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab?', false), [ { t: { null: { undefined: { _abet: new Set([true]) } } } }, { t: { null: { undefined: { _abut: new Set([true]) } } } } ], 'lookupRecursiveMultiCharWildcard');
});

test('loose match only single-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;
  t.deepEqual(lookupRecursiveSingleCharWildcard(tinyIndex, '?', false), [
    {
      null: { undefined: { _a: new Set([true]) } },
      n: { t: { null: { undefined: { _ant: new Set([true]) } } } }
    },
    {
      e: { null: { undefined: { _be: new Set([true]) } } },
      o: { y: { null: { undefined: { _boy: new Set([true]) } } } }
    }
  ], 'lookupRecursiveSingleCharWildcard');
  t.deepEqual(lookupRecursiveMultiCharWildcard(tinyIndex, '?', false), [
    {
      null: { undefined: { _a: new Set([true]) } },
      n: { t: { null: { undefined: { _ant: new Set([true]) } } } }
    },
    {
      e: { null: { undefined: { _be: new Set([true]) } } },
      o: { y: { null: { undefined: { _boy: new Set([true]) } } } }
    }
  ], 'lookupRecursiveMultiCharWildcard');
});







test('exact match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bet', true), [ { undefined: { _bet: new Set([true]) } }, { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*et', true), [ { undefined: { _abet: new Set([true]) } }, { undefined: { _bet: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing exact match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bex', true), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*ex', true), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*t', true), [ { undefined: { _abet: new Set([true]) } }, { undefined: { _abut: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*t', true), [ { undefined: { _ant: new Set([true]) } }, { undefined: { _abet: new Set([true]) } }, { undefined: { _abut: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing exact match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*x', true), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*x', true), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match multi-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'abe*', true), [ { undefined: { _abet: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*', true), [ { undefined: { _abet: new Set([true]) } }, { undefined: { _abut: new Set([true]) } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('exact match only multi-char wildcard', t => {
  const {strings, tinyIndex} = t.context.data;

  // Currently this will return every possible combination of letters and wildcard that match every word in the index, so it gets *huge* very quickly, even with very small indices
  t.deepEqual(
    lookupRecursiveMultiCharWildcard(tinyIndex, '*', true), [
      { undefined: { _a: new Set([true]) } },
      { undefined: { _ant: new Set([true]) } },
      { undefined: { _be: new Set([true]) } },
      { undefined: { _boy: new Set([true]) } }
    ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});




test('loose match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bet', false), [ { null: { undefined: { _bet: new Set([true]) } } }, { null: { undefined: { _abet: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*et', false), [ { null: { undefined: { _abet: new Set([true]) } } }, { null: { undefined: { _bet: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing loose match multi-char wildcard at beginning', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*bex', false), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, '*ex', false), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('loose match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*t', false), [ { null: { undefined: { _abet: new Set([true]) } } }, { null: { undefined: { _abut: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'b*l', false), [ { null: { undefined: { _boil: new Set([true]) } } } ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});
test('missing loose match multi-char wildcard in middle', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*x', false), [], 'lookupRecursiveMultiCharWildcard match as single char');
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'a*x', false), [], 'lookupRecursiveMultiCharWildcard match as multi-char');
});

test('loose match multi-char wildcard at end', t => {
  const {strings, index} = t.context.data;
  t.deepEqual(lookupRecursiveMultiCharWildcard(index, 'ab*', false), [
    {
      e: { t: { null: { undefined: { _abet: new Set([true]) } } } },
      u: { t: { null: { undefined: { _abut: new Set([true]) } } } }
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
          null: { undefined: { _a: new Set([true]) } },
          n: { t: { null: { undefined: { _ant: new Set([true]) } } } }
        },
        b: {
          e: { null: { undefined: { _be: new Set([true]) } } },
          o: { y: { null: { undefined: { _boy: new Set([true]) } } } }
        }
      }
    ], 'lookupRecursiveMultiCharWildcard match as multi-char');
});