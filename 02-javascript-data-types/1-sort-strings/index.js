/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort(param === 'asc' ? compareAsc : compareDesc);
}

function compareAsc(str1, str2) {
  return compareLinguistic(str1, str2);
}

function compareDesc(str1, str2) {
  return compareLinguistic(str2, str1);
}

function compareLinguistic(str1, str2) {
  if (str1[0] !== str2[0]
    && str1[0].toLowerCase() === str2[0].toLowerCase()) {
    return str1[0].toLowerCase() === str1[0] ? 1 : -1;
  }

  return str1.localeCompare(str2);
}
