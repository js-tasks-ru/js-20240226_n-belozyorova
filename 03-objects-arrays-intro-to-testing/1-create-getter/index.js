/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    const objKeys = path.split('.');
    let tmp = obj;

    for (let i = 0; i < objKeys.length; i++) {
      if (!tmp.hasOwnProperty(objKeys[i])) {
        return undefined;
      }

      tmp = tmp[objKeys[i]];
    }

    return tmp;
  };
}
