/**
 *
 *
 * @param {Object} obj
 * @param {Object} target
 * @returns
 */
function merge(obj, target) {
  let copy = Object.assign({}, obj);
  if (!obj instanceof Object || !target instanceof Object) {
    throw new TypeError('参数必须为对象');
  }
  Object.keys(target).forEach(key => {
    if (copy[key] === undefined) {
      copy[key] = target[key];
    } else {
      if (typeof target[key] === 'function') {
        copy[key] = target[key];
      } else {
        if (target[key] instanceof Object) {
          if (!(copy[key] instanceof Object)) {
            copy[key] = {};
          }
          copy[key] = merge(copy[key], target[key]);
        } else {
          copy[key] = target[key];
        }
      }
    }
  });
  return copy;
}

module.exports = merge;
