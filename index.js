const util = require('util');

const buildIndex = function(index, strings, category) {
  for(let i=0; i<strings.length; i++) {
    addToIndex(index, strings[i], category);
  };
  return index;
};

const addToIndex = function(index, str, category) {
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
      if(!loop[char][null][category]) {
        loop[char][null][category] = {};
      }
      loop[char][null][category][str] = true;
    }
    loop = loop[char];
  }
  return index;
}

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

const lookupRecursiveSingleCharWildcard = function(index, searchStr, exactMatch) {
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
      return lookupRecursiveSingleCharWildcard(index[searchStr[0]], searchStr.substr(1), exactMatch);
    }
    else {
      return [];
    }
  }
  else if (searchStr[0] === '?') {  // We are dealing with a single-char wildcard, so consume it and move on
    return Object.keys(index).map(k => {
      return lookupRecursiveSingleCharWildcard(index[k], searchStr.substr(1), exactMatch);
    }).reduce((acc, arr) => acc.concat(arr), []);
  }
};


// WARNING: This lookup function may be EXTREMELY slow depending on the size of the index, similarity of words in it and placement of the wildcard (closer to the front of the word = slower)
// In the limit case a searchStr of "*" will match every matching combination of wildcard and letters for every word in the index, so use it sensibly and carefully and probably not at all
const lookupRecursiveMultiCharWildcard = function(index, searchStr, exactMatch) {
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
  else if (searchStr[0] !== '?' && searchStr[0] !== '*') {
    if(index[searchStr[0]]) {
      return lookupRecursiveMultiCharWildcard(index[searchStr[0]], searchStr.substr(1), exactMatch);
    }
    else {
      return [];
    }
  }
  else if (searchStr[0] === '?') {  // We are dealing with a single-char wildcard, so consume it and move on
    return Object.keys(index).map(k => {
      return lookupRecursiveMultiCharWildcard(index[k], searchStr.substr(1), exactMatch);
    }).reduce((acc, arr) => acc.concat(arr), []);
  }
  else if (searchStr[0] === '*') {

      if(searchStr.length === 1 && !exactMatch) { // If we have a multi-character wildcard at the end of a search string, just return the entire subtree at that point
        return [index];
      }

      return Object.keys(index).map(k => {  // We are dealing with a multi-char wildcard, so try both the cases where the wildcard is used up here, and where it propagates down to the next level
      if(k !== "null") {  // Don't accidentally recurse past the end of words
        return lookupRecursiveMultiCharWildcard(index[k], searchStr.substr(1), exactMatch).concat(  // Try ending the wildcard here first...
          lookupRecursiveMultiCharWildcard(index[k], searchStr, exactMatch)                         // ...then retry with the wildcard still applying to more characters
        );
      }
      return [];
    }).reduce((acc, arr) => acc.concat(arr), []);
  }
};


module.exports = {
  buildIndex,
  addToIndex,
  lookupIterative,
  lookupRecursive,
  lookupRecursiveSingleCharWildcard,
  lookupRecursiveMultiCharWildcard,
};