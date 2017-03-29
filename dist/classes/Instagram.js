'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Instagram = function () {
  /**
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} redirectURI
   */
  function Instagram(clientId, clientSecret, redirectURI) {
    _classCallCheck(this, Instagram);

    this.data = {
      clientId: clientId,
      clientSecret: clientSecret,
      redirectURI: redirectURI,
      accessToken: null
    };
  }

  /**
   * Generates an access token from instagram. Access tokens live forever.
   * BEST PRACTICE: log the access token and then store it in your env file.
   * Then you never have to call this method again.
   *
   * @param {string} code
   * @return {Promise}
   */


  _createClass(Instagram, [{
    key: 'initialize',
    value: function initialize(code) {
      var _this = this;

      // If someway, somehow this is already set (which it shouldn't be at this point)
      if (this.data.accessToken !== null) return Promise.resolve(this.data.accessToken);
      return new Promise(function (fulfill, reject) {
        _request2.default.post('https://api.instagram.com/oauth/access_token', {
          form: {
            client_id: _this.data.clientId,
            client_secret: _this.data.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: _this.data.redirectURI,
            code: code
          }
        }, function (err, response, body) {
          if (err || response.statusCode >= 400) {
            reject(err || body);
          } else {
            fulfill(body);
          }
        });
      });
    }

    /**
     * Calls instagram's api and gets user's latest posts
     *
     * @param {string} accessToken
     * @return {Promise}
     */

  }, {
    key: 'fetch',
    value: function fetch(accessToken) {
      return new Promise(function (fulfill, reject) {
        (0, _request2.default)('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken, function (err, response, body) {
          if (err || response.statusCode >= 400) {
            reject({
              source: 'instagram',
              error: err || body
            });
          } else {
            fulfill(JSON.parse(body).data);
          }
        });
      });
    }
  }]);

  return Instagram;
}();

exports.default = Instagram;