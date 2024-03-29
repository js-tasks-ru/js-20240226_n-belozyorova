/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (size === 0) {
    return '';
  }

  let newStr = '';
  let group = '';

  for (let i = 0; i < string.length; i++) {
    if (i === 0 || string[i] === string[i - 1]) {
      if (group.length < size) {
        group += string[i];
      }

      continue;
    }

    newStr += group;
    group = string[i];
  }

  newStr += group;

  return newStr;
}

