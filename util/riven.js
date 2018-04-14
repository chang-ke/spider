const request = require('request');
const merge = require('../util/merge');
const warning = require('../util/warning');
/**
 * @param {object} options
 * @returns
 */
function Riven(options) {
  this.options = options || {
    headers: {
      //"Content-Type": "application/json",
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' +
          ' Chrome/65.0.3325.181 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  this.res = null;
  this.body = null;
  this.error = null;
}
Riven.prototype.setResponse = function (res) {
  this.res = res;
};
Riven.prototype.getResponse = function (params) {
  let data = null;
  if (params) {
    data = {};
    params.forEach(key => {
      data[key] = this.res[key];
    });
  }
  return data || this.res;
};
Riven.prototype.create = function (options) {
  const newOptions = typeof options === 'string'
    ? merge(this.options, {url: options})
    : merge(this.options, options);
  return new Promise((resolve, reject) => {
    request(newOptions, (err, res, body) => {
      if (err) {
        reject(warning(err));
      } else {
        this.setResponse(res);
        this.setDefaultOptions({
          headers: {
            Cookie: res.headers['set-cookie']
          }
        });
        let _body = body
        if (res.headers['content-type'].indexOf('application/json') > -1) {
          _body = JSON.parse(body)
        }
        resolve({
          ...res,
          body: _body
        });
      }
    });
  }).catch(err => console.log(err));
};
Riven.prototype.get = function (options) {
  const newOptions = typeof options === 'string'
    ? merge(this.options, {url: options})
    : merge(this.options, options);
  return new Promise((resolve, reject) => {
    request.get(newOptions, (err, res, body) => {
      if (err) {
        reject(warning(err));
      } else {
        let _body = body
        if (res.headers['content-type'].indexOf('application/json') > -1) {
          _body = JSON.parse(body)
        }
        resolve({
          ...res,
          body: _body
        });
      }
    });
  }).catch(err => console.log(err));
};

Riven.prototype.post = function (options) {
  if (typeof options !== 'object') {
    return warning('options必须为对象');
  }
  const newOptions = merge(this.options, options);
  return new Promise((resolve, reject) => {
    request.post(newOptions, (err, res, body) => {
      if (err) {
        reject(warning(err));
      } else {
        let _body = body
        if (res.headers['content-type'].indexOf('application/json') > -1) {
          _body = JSON.parse(body)
        }
        resolve({
          ...res,
          body: _body
        });
      }
    });
  }).catch(err => console.log(err));
};

Riven.prototype.setDefaultOptions = function (options) {
  this.options = merge(this.options, options);
  return this;
};

module.exports = Riven;
