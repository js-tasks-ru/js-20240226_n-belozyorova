/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const directionFactor = param === 'asc' ? 1 : -1;
  return [...arr].sort((str1, str2) => directionFactor * str1.localeCompare(str2, ['ru', 'en'], {caseFirst: 'upper'}));
}
