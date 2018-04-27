function deepEqual(object, target) {
  if (typeof object !== typeof target) {
    return false
  }
  if (typeof object !== 'object') {
    // string, function, symbol, undefind
    if (object !== target) {
      if (!NaNEqual(object, target)) {
        // NaN
        return false
      }
    }
  } else {
    if (object instanceof Object && object.constructor === Array) {
      //array
      if (!ArrayEqual(target, object)) {
        return false
      }
    }
    if (object === null || target === null) {
      //null
      if (target !== null || object != null) {
        return false
      }
    } else {
      for (let key in object) {
        //Object
        if (!deepEqual(target[key], object[key])) {
          return false
        }
      }
      for (let key in target) {
        //Object
        if (!deepEqual(target[key], object[key])) {
          return false
        }
      }
    }
  }
  return true
}

function isEmptyObject(object) {
  var flag = true
  if (typeof object !== 'object' || object === null || object.constructor === Array) {
    return false
  }
  for (var key in object) {
    flag = false
  }
  return flag
}

function NaNEqual(object, target) {
  if (typeof object === 'number' && typeof target === 'number') {
    //NaN!==NaN 但是 !NaN===!NaN
    if (object.toString() === 'NaN' && target.toString() === 'NaN') {
      return true
    }
  }
  return false
}
function isArray(arr) {
  return typeof arr === 'object' && arr.constructor === Array
}

function ArrayEqual(arr, target) {
  if (!isArray(arr) || !isArray(target)) {
    warning("arguments'type may is not Array'")
  }
  let len = arr.length
  for (let i = 0; i < len; ++i) {
    if (arr[i] !== target[i]) {
      return false
    }
  }
  return true
}

function warning(message) {
  if (console) {
    console.error(message)
  } else {
    throw new Error(message)
  }
}
var a = {
  a: {
    b: NaN,
    c: [1, 2],
    d: undefined,
    e: 's45d',
    f: null,
    g: 2
  },
  b: NaN,
  c: [1, 2],
  d: '',
  e: 's45d',
  f: null,
  g: {}
}
var b = {
  a: {
    b: NaN,
    c: [1, 2],
    d: undefined,
    e: 's45d',
    f: null,
    g: 2
  },
  b: NaN,
  c: [1, 2],
  d: '',
  e: 's45d',
  f: null,
  g: {}
}

module.exports = deepEqual
