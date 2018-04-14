var warning = require("./warning");
/**
 *
 *
 * @param {Object} obj
 * @param {Object} target
 * @returns
 */
function merge(obj, target) {
  let _this = Object.assign({}, obj);
  if (!obj instanceof Object || !target instanceof Object) {
    return warning("参数必须为对象");
  }
  Object.keys(target).forEach(key => {
    if (_this[key] === undefined) {
      _this[key] = target[key];
    } else {
      if (typeof target[key] === "function") {
        _this[key] = target[key];
      } else {
        if (target[key] instanceof Object) {
          if (!(_this[key] instanceof Object)) {
            _this[key] = {};
          }
          _this[key] = merge(_this[key], target[key]);
        } else {
          _this[key] = target[key];
        }
      }
    }
  });
  return _this;
}

module.exports = merge;
