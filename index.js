const buildIndex = function(index, strings, value=true, category=undefined) {
  for(let i=0; i<strings.length; i++) {
    addToIndex(index, strings[i], value, category);
  };
  return index;
};

const buildIndexFromArrays = function(index, strings, values, category) {
  for(let i=0; i<strings.length; i++) {
    addToIndex(index, strings[i], values[i], category);
  };
  return index;
};

const buildIndexFromField = function(index, objects, fieldName, category) {
  for(let i=0; i<objects.length; i++) {
    addToIndex(index, objects[i][fieldName], objects[i], category);
  };
  return index;
};

const addToIndex = function(index, str, value=true, category=undefined) {
  let loop = index;
  const prefixedCategory = typeof category !== 'undefined' ? '_'+category : category;  // Prefix all values except undefined with an underscore to prevent object-member collisions like "constructor"
  const prefixedStr = '_' + str;
  for(i=0; i<str.length; i++) {
    let char = str[i];
    if(!loop[char]) {
      loop[char] = {};
    }
    if(i === str.length-1) {
      if(!loop[char][null]) {
        loop[char][null] = {};
      }
      if(!loop[char][null][prefixedCategory]) {
        loop[char][null][prefixedCategory] = {};
      }
      if(!loop[char][null][prefixedCategory][prefixedStr]) {
        loop[char][null][prefixedCategory][prefixedStr] = new Set();
      }
      loop[char][null][prefixedCategory][prefixedStr].add(value);
    }
    loop = loop[char];
  }
  return index;
}

const removeFromIndex = function(index, str, value=true, category=undefined) {
  let loop = index;
  const prefixedCategory = typeof category !== 'undefined' ? '_'+category : category;  // Prefix all values except undefined with an underscore to prevent object-member collisions like "constructor"
  const prefixedStr = '_' + str;
  const searchStringNotInIndexError = new Error('Search string not in index');
  const searchCategoryNotInIndex = new Error('Search category not in index');
  const valueNotInIndexError = new Error('Value not in index');

  for(i=0; i<str.length; i++) {
    let char = str[i];
    if(!loop[char]) {
      throw searchStringNotInIndexError;
    }
    if(i === str.length-1) {
      if(!loop[char][null]) {
        throw searchStringNotInIndexError;
      }
      if(!loop[char][null][prefixedCategory]) {
        throw searchCategoryNotInIndex;
      }
      if(!loop[char][null][prefixedCategory][prefixedStr]) {
        throw searchStringNotInIndexError;
      }
      if(!loop[char][null][prefixedCategory][prefixedStr].has(value)) {
        throw valueNotInIndexError;
      }
      else {
        loop[char][null][prefixedCategory][prefixedStr].delete(value);  // Delete value if it exists
        if(loop[char][null][prefixedCategory][prefixedStr].size === 0) {  // Now check whether this is the only value for this search-string in this category
          delete(loop[char][null][prefixedCategory][prefixedStr]);          // And if so delete the search-string from the category
          if(Object.keys(loop[char][null][prefixedCategory]).length === 0) { // Now check if this is the only search-string in the category
            delete(loop[char][null][prefixedCategory]);                       // And if so delete the category
            if(Object.keys(loop[char][null]).length === 0) { // Now check if this is the only category for this completed search-string
              // And if so walk from the root back to this node again, until we find the highest node with no values under it, and then delete it
              let checkLoop = index;
              for(j=0; j<str.length; j++) {
                let checkChar = str[j];
                if(!hasValues(checkLoop[checkChar])) {
                  delete(checkLoop[checkChar]);
                  break;
                }
                else {
                  checkLoop = checkLoop[checkChar];
                }
              }
            }
          }
        }
      }
    }
    loop = loop[char];
  }
  return index;
}

// Walk a subtree quickly checking if there are any values underneath it, and dump out as soon as we find one.
// Used by removeFromIndex to determine how far back up its ancestry it should delete once it has removed the specific value, if removing that value leaves the word/category/etc empty.
const hasValues = function(index) {

  // Check to see if this is the end of any words that have at least one value associated with it
  if(index[null]) {
    const categories = Object.keys(index[null]);
    for(let i=0; i<categories.length; i++) {
      const category = categories[i];
      const words = Object.keys(index[null][category]);
      for(let j=0; j<words.length; j++) {
        const word = words[j];
        if(index[null][category][word] instanceof Set && index[null][category][word].size > 0) {  // The second we find even a single value we can dump out immediately
          return true;
        }
      }
    }
  }

  // Else recurse into it to find out if there are any completed words with values underneath it
  const keys = Object.keys(index);
  for(let i=0; i<keys.length; i++) {
    const key = keys[i];
    if(key !== "null" && hasValues(index[key])) {
      return true;
    }
  }
  return false;
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

    return lookupRecursiveMultiCharWildcard(index, searchStr.substr(1), exactMatch).concat( // Try everything at this level (* === "")...
      Object.keys(index).map(k => {
        if(k !== "null") {  // (Don't accidentally recurse past the end of words)
          return lookupRecursiveMultiCharWildcard(index[k], searchStr, exactMatch);  // ...then retry with the wildcard still applying to more characters (* === k...)
        }
        return [];
      }).reduce((acc, arr) => acc.concat(arr), [])
    );
  }
};


module.exports = {
  buildIndex,
  buildIndexFromArrays,
  buildIndexFromField,
  addToIndex,
  removeFromIndex,
  lookupIterative,
  lookupRecursive,
  lookupRecursiveSingleCharWildcard,
  lookupRecursiveMultiCharWildcard,
};