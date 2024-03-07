/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const objKeys = path.split('.');

  return function (obj) {  
    let tmp = obj;

    for (const objKey of objKeys) {
      if (typeof tmp !== Object || !tmp.hasOwnProperty(objKey)) {
        return;
      }

      tmp = tmp[objKey];
    }

    return tmp;
  };
}
