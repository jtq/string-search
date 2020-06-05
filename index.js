const util = require('util');

const buildIndex = function(strings) {
  let index = {};
  for(let i=0; i<strings.length; i++) {
    let str = strings[i];
    let loop = index;
    for(j=0; j<str.length; j++) {
      let char = str[j];
      if(!loop[char]) {
        loop[char] = {};
      }
      if(j === str.length-1) {
        if(!loop[char][null]) {
          loop[char][null] = {};
        }
        loop[char][null][str] = true;
      }
      loop = loop[char];
    }
  };
  return index;
};

const lookupIterative = function(index, str, exactMatch) {
  for(let i=0; i<str.length; i++) {
    index = index[str[i]];
    if(!index) {
      return [];
    }
  }

  if(exactMatch) {
    if(index[null]) {
      return [index[null]];
    }
    return [];
  }
  return [index];
};


// 0.83 times as fast than lookupIterative, but makes it easier to do things like fuzzy matching
const lookupRecursive = function(index, str, exactMatch) {
  if(!index) {
    return [];
  }
  if(str.length === 0) {
    if(exactMatch) {
      if(index[null]) {
        return [index[null]];
      }
      return [];
    }
    return [index];
  }
  else {
    return lookupRecursive(index[str[0]], str.substr(1), exactMatch);
  }
};

// about 0.08 times as fast as lookupRecursive
const lookupRecursiveWildcard = function(index, searchStr, exactMatch) {
  if(searchStr.length === 0) {
    if(exactMatch) {
      if(index[null]) {
        return [index[null]];
      }
      else {
        return [];
      }
    }
    return [index];
  }
  else if (searchStr[0] !== '?') {
    if(index[searchStr[0]]) {
      return lookupRecursiveWildcard(index[searchStr[0]], searchStr.substr(1), exactMatch);
    }
    else {
      return [];
    }
  }
  else {  // We are dealing with a wildcard
    return Object.keys(index).map(k => {
      return lookupRecursiveWildcard(index[k], searchStr.substr(1), exactMatch);
    }).reduce((acc, arr) => acc.concat(arr), []);
  }
};


module.exports = {
  buildIndex,
  lookupIterative,
  lookupRecursive,
  lookupRecursiveWildcard
};